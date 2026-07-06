import { createHash } from 'crypto'
import { existsSync } from 'fs'
import { mkdir, readFile, writeFile } from 'fs/promises'
import path from 'path'
import type { Context } from 'koishi'
import type { Config } from '../config'
import { logInfo } from './logger'

export const LXGW_WENKAI_FILE_NAME = 'LXGWWenKaiMono-Regular.ttf'

const GITEE_RELEASE_BASE = 'https://gitee.com/vincent-zyu/koishi-plugin-awa-quote-image/releases/download/fonts'
const GITHUB_RELEASE_BASE = 'https://github.com/VincentZyuApps/koishi-plugin-awa-quote-image/releases/download/fonts'

const LXGW_WENKAI_SOURCES = [
  { source: 'Gitee', url: `${GITEE_RELEASE_BASE}/${LXGW_WENKAI_FILE_NAME}` },
  { source: 'GitHub', url: `${GITHUB_RELEASE_BASE}/${LXGW_WENKAI_FILE_NAME}` },
]

interface FontIntegrity {
  size: number
  md5: string
  sha1: string
  sha256: string
  sha512: string
}

const LXGW_WENKAI_INTEGRITY: FontIntegrity = {
  size: 24755236,
  md5: '90e75a25cca0e8868977b880352c6a53',
  sha1: '7f018ad4a181e4d2df4f972f357e612885d6c24a',
  sha256: 'ee9faa6479c5b2434f9bceca8e2e7b643f699f4f3d067aac9609261e07c6be61',
  sha512: '793dc4357d311dba539c50b0ae38ff247af066f141ffea54ff0cc51e274453671e736989cee4998fd89211035ecfe52ad38aa828ba7f1739bcf107b94a023be5',
}

export function getFontDirByBaseDir(baseDir: string) {
  return path.join(baseDir, 'data', 'fonts')
}

export function getLxgwWenKaiPathByBaseDir(baseDir: string) {
  return path.join(getFontDirByBaseDir(baseDir), LXGW_WENKAI_FILE_NAME)
}

// Schema 默认值无法拿到 ctx.baseDir，只能用 cwd 作为展示 fallback。
// 运行时必须优先使用 ctx.baseDir，见 resolveRuntimeFontPath()。
export const DEFAULT_LXGW_WENKAI_PATH = getLxgwWenKaiPathByBaseDir(process.cwd())

export function resolveRuntimeFontPath(ctx: Context, filePath: string) {
  const runtimeDefault = getLxgwWenKaiPathByBaseDir(ctx.baseDir)
  const normalized = path.normalize(String(filePath || '').trim())
  if (!normalized) return runtimeDefault
  if (normalized === path.normalize(DEFAULT_LXGW_WENKAI_PATH) || normalized === path.normalize(runtimeDefault)) {
    return runtimeDefault
  }
  return filePath
}

export async function ensureRuntimeFonts(ctx: Context, config: Config) {
  const fontPath = getLxgwWenKaiPathByBaseDir(ctx.baseDir)
  const ready = await verifyFontIntegrity(fontPath, LXGW_WENKAI_INTEGRITY)
  if (ready) {
    logInfo(ctx, config, `字体文件已存在且 hash 校验通过，跳过下载`, `字体路径：${fontPath}`)
    return
  }

  if (existsSync(fontPath)) ctx.logger.warn(`${LXGW_WENKAI_FILE_NAME} hash 校验失败，将重新下载`)

  await mkdir(path.dirname(fontPath), { recursive: true })
  logInfo(ctx, config, `准备下载字体：${LXGW_WENKAI_FILE_NAME}`, `目标路径：${fontPath}`)

  let lastError: unknown
  for (const item of LXGW_WENKAI_SOURCES) {
    try {
      logInfo(ctx, config, `从 ${item.source} 下载字体`, item.url)
      const data = await ctx.http.get<ArrayBuffer>(item.url, {
        responseType: 'arraybuffer',
        timeout: 120000,
      })
      const buffer = Buffer.from(data)
      if (!verifyFontBuffer(buffer, LXGW_WENKAI_INTEGRITY)) {
        throw new Error(`字体 hash 校验失败：${LXGW_WENKAI_FILE_NAME}`)
      }
      await writeFile(fontPath, buffer)
      if (!(await verifyFontIntegrity(fontPath, LXGW_WENKAI_INTEGRITY))) {
        throw new Error(`字体写入后 hash 校验失败：${LXGW_WENKAI_FILE_NAME}`)
      }
      logInfo(ctx, config, `字体下载完成，hash 校验通过：${fontPath}`, `字体大小：${buffer.length} bytes`)
      return
    } catch (error) {
      lastError = error
      ctx.logger.warn(`${item.source} 字体下载失败：${error instanceof Error ? error.message : String(error)}`)
    }
  }

  ctx.logger.warn(`字体自动下载失败，将使用系统默认字体：${lastError instanceof Error ? lastError.message : String(lastError)}`)
}

function calculateFontHashes(buffer: Buffer) {
  return {
    md5: createHash('md5').update(buffer).digest('hex'),
    sha1: createHash('sha1').update(buffer).digest('hex'),
    sha256: createHash('sha256').update(buffer).digest('hex'),
    sha512: createHash('sha512').update(buffer).digest('hex'),
  }
}

async function verifyFontIntegrity(filePath: string, expected: FontIntegrity): Promise<boolean> {
  try {
    if (!existsSync(filePath)) return false
    const buffer = await readFile(filePath)
    return verifyFontBuffer(buffer, expected)
  } catch {
    return false
  }
}

function verifyFontBuffer(buffer: Buffer, expected: FontIntegrity): boolean {
  if (buffer.length !== expected.size) return false
  const hashes = calculateFontHashes(buffer)
  return hashes.md5 === expected.md5
    && hashes.sha1 === expected.sha1
    && hashes.sha256 === expected.sha256
    && hashes.sha512 === expected.sha512
}
