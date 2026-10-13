import { createReadStream, existsSync } from 'fs'
import { mkdir, readdir, stat, unlink, writeFile } from 'fs/promises'
import path from 'path'
import type { Context } from 'koishi'
import type { Config } from '../config'
import { logInfo } from '../utils/logger'

const IMAGE_CACHE_DIR_NAME = 'skykid-height-cosmetic-query'
const IMAGE_CACHE_ROUTE = '/skykid-height-cosmetic-query/cache'
export const ICON_CACHE_ROUTE = '/skykid-height-cosmetic-query/icon'
const IMAGE_EXTENSIONS = new Set(['.png', '.jpeg', '.jpg', '.webp'])

/**
 * 🌐 注册 QQ Markdown 内联图片缓存 HTTP 路由。
 */
export function applyQQServices(ctx: Context, config?: Config) {
  ctx.inject(['server'], (ctx) => {
    registerQQMarkdownImageServerRoute(ctx, config)
  })
}

/**
 * 🛣️ 暴露本地缓存图片，供 QQ Markdown 通过公网 URL 访问。
 */
export function registerQQMarkdownImageServerRoute(ctx: Context, config?: Config) {
  const server = (ctx as any).server
  if (!server) return
  server.get(`${IMAGE_CACHE_ROUTE}/:name`, async (koaCtx: any) => {
    const filename = path.basename(String(koaCtx.params.name || ''))
    if (!filename) {
      koaCtx.status = 404
      return
    }

    const filePath = path.join(getQQMarkdownImageCacheDir(ctx.baseDir), filename)
    if (!existsSync(filePath)) {
      koaCtx.status = 404
      return
    }

    koaCtx.type = getMimeType(path.extname(filename))
    koaCtx.body = createReadStream(filePath)
  })

  server.get(`${ICON_CACHE_ROUTE}/:item/:id`, async (koaCtx: any) => {
    const item = String(koaCtx.params.item || '').trim()
    const id = String(koaCtx.params.id || '').trim()
    const size = String(koaCtx.query.size || 'minimal').trim()
    if (!item || !id) {
      koaCtx.status = 404
      return
    }

    const iconsDir = path.join(getQQMarkdownImageCacheDir(ctx.baseDir), 'icons')
    const fileName = `${item}_${id}_${size}.png`
    const filePath = path.join(iconsDir, fileName)

    koaCtx.set('Cache-Control', 'public, max-age=604800, immutable')
    koaCtx.type = 'image/png'

    if (existsSync(filePath)) {
      koaCtx.body = createReadStream(filePath)
      return
    }

    try {
      await mkdir(iconsDir, { recursive: true })
      const baseUrl = String(config?.imageApiBaseUrl || 'http://127.0.0.1:60704').replace(/\/+$/, '')
      const response = await ctx.http.get<ArrayBuffer>(
        `${baseUrl}/img/cosmetic/${encodeURIComponent(item)}/${encodeURIComponent(id)}?size=${encodeURIComponent(size)}`,
        { responseType: 'arraybuffer', timeout: 10000 },
      )
      const buffer = Buffer.from(response)
      await writeFile(filePath, buffer)
      koaCtx.body = buffer
    } catch {
      koaCtx.status = 502
    }
  })
}

/**
 * 💾 使用 Koishi server 服务写入临时图片并返回公网 URL。
 */
export async function storeQQMarkdownImage(
  ctx: Context,
  config: Config,
  image: Buffer | string,
  imageType: 'png' | 'jpeg' | 'jpg' | 'webp',
) {
  const server = (ctx as any).server
  if (!server) {
    throw new Error('当前未启用 Koishi server 服务。')
  }

  const publicBaseUrl = resolveQQMarkdownImagePublicBaseUrl(ctx, config)
  if (!publicBaseUrl) {
    throw new Error('未配置可公网访问的 selfUrl。请填写 QQ Markdown 图片公网 URL，或配置 Koishi server 的 selfUrl。')
  }

  const cacheDir = getQQMarkdownImageCacheDir(ctx.baseDir)
  await mkdir(cacheDir, { recursive: true })

  const filename = await createTimestampedImageFilename(cacheDir, imageType)
  const filePath = path.join(cacheDir, filename)
  const buffer = Buffer.isBuffer(image) ? image : Buffer.from(image, 'base64')
  await writeFile(filePath, buffer)
  logInfo(ctx, config, '', `server 模式已写入 QQ Markdown 图片缓存: ${filePath}`)

  await pruneQQMarkdownImageCache(ctx, cacheDir, config.qqMarkdownImageMaxFiles, config)

  return `${publicBaseUrl}${IMAGE_CACHE_ROUTE}/${encodeURIComponent(filename)}`
}

/**
 * 📁 计算 QQ Markdown 图片缓存目录。
 */
export function getQQMarkdownImageCacheDir(baseDir: string) {
  return path.join(baseDir, 'cache', IMAGE_CACHE_DIR_NAME)
}

/**
 * 🔗 解析 server 模式对外公网 URL。
 */
export function resolveQQMarkdownImagePublicBaseUrl(ctx: Context, config: Config) {
  const server = (ctx as any).server
  const raw = String(config.qqMarkdownImageSelfUrl || server?.config?.selfUrl || '').trim()
  return raw.replace(/\/+$/, '')
}

/**
 * 🧾 生成按上海时区命名的缓存图片文件名。
 */
async function createTimestampedImageFilename(cacheDir: string, imageType: 'png' | 'jpeg' | 'jpg' | 'webp') {
  const extension = imageType === 'jpg' ? 'jpg' : imageType
  const timestamp = formatShanghaiTimestamp(new Date())

  for (let index = 0; index < 1000; index++) {
    const suffix = index === 0 ? '' : `-${String(index).padStart(2, '0')}`
    const filename = `${timestamp}${suffix}.${extension}`
    if (!existsSync(path.join(cacheDir, filename))) {
      return filename
    }
  }

  throw new Error('无法生成唯一的缓存图片文件名。')
}

/**
 * 🕒 格式化上海时区时间戳。
 */
function formatShanghaiTimestamp(date: Date) {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Shanghai',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).formatToParts(date)

  const lookup = Object.fromEntries(parts.map((part) => [part.type, part.value]))
  return `${lookup.year}${lookup.month}${lookup.day}-${lookup.hour}${lookup.minute}${lookup.second}`
}

/**
 * 🧹 按数量上限清理旧缓存图片。
 */
async function pruneQQMarkdownImageCache(
  ctx: Context,
  cacheDir: string,
  maxFiles: number,
  config: Config,
) {
  const limit = Math.floor(Number(maxFiles) || 0)
  if (limit <= 0) return

  const files = await readdir(cacheDir)
  const images = await Promise.all(files
    .filter((file) => IMAGE_EXTENSIONS.has(path.extname(file).toLowerCase()))
    .map(async (file) => {
      const filePath = path.join(cacheDir, file)
      const fileStat = await stat(filePath)
      return { filePath, mtimeMs: fileStat.mtimeMs }
    }))

  if (images.length <= limit) return

  images.sort((a, b) => a.mtimeMs - b.mtimeMs)
  for (const { filePath } of images.slice(0, images.length - limit)) {
    await removeCachedImage(ctx, filePath, config, '数量上限清理')
  }
}

/**
 * 🗑️ 删除一张缓存图片。
 */
async function removeCachedImage(
  ctx: Context,
  filePath: string,
  config: Config,
  reason: string,
) {
  try {
    await unlink(filePath)
    logInfo(ctx, config, '', `server 模式已删除 QQ Markdown 图片缓存 (${reason}): ${filePath}`)
  } catch (error) {
    if ((error as NodeJS.ErrnoException)?.code !== 'ENOENT') {
      logInfo(ctx, config, `删除 QQ Markdown 图片缓存失败 (${reason}): ${filePath} - ${error instanceof Error ? error.message : String(error)}`)
    }
  }
}

/**
 * 🧾 根据扩展名返回图片 MIME 类型。
 */
function getMimeType(extension: string) {
  switch (extension.toLowerCase()) {
    case '.png':
      return 'image/png'
    case '.jpeg':
    case '.jpg':
      return 'image/jpeg'
    case '.webp':
      return 'image/webp'
    default:
      return 'application/octet-stream'
  }
}
