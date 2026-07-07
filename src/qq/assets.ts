import type { Context } from 'koishi'
import type { Config } from '../config'
import { logInfo } from '../utils/logger'

/**
 * 📤 通过 Koishi assets 服务上传 QQ Markdown 内联图片。
 */
export async function uploadQQMarkdownImageViaAssets(
  ctx: Context,
  config: Config,
  image: Buffer | string,
  imageType: 'png' | 'jpeg' | 'jpg' | 'webp',
) {
  const assets = (ctx as any).assets
  if (!assets) {
    throw new Error('当前未启用 Koishi assets 服务。')
  }

  const base64 = Buffer.isBuffer(image) ? image.toString('base64') : image
  const normalizedType = imageType === 'jpg' ? 'jpeg' : imageType
  const dataUrl = `data:image/${normalizedType};base64,${base64}`
  const filename = `skykid-height-cosmetic-query.${normalizedType}`
  logInfo(ctx, config, '', `QQ Markdown 图片使用 assets 模式上传: ${filename}`)
  const imageUrl = await assets.upload(dataUrl, filename)
  logInfo(ctx, config, '', `assets 模式上传完成: ${imageUrl}`)

  if (!/^https?:\/\//i.test(imageUrl)) {
    throw new Error(`assets 返回的图片地址不是公网 HTTP(S) URL：${imageUrl}`)
  }

  return imageUrl
}
