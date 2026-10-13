import type { Context } from 'koishi'
import { Jimp } from 'jimp'
import jsQR from 'jsqr'

/**
 * 从图片 Buffer 中解析二维码数据
 * @param buffer 图片文件二进制数据
 * @param ctx 可选的 Koishi 上下文，用于调试日志
 * @returns 二维码包含的字符串内容，若未识别到则返回 null
 */
export async function decodeQrFromImageBuffer(buffer: Buffer, ctx?: Context): Promise<string | null> {
  try {
    const image = await Jimp.read(buffer)
    // 超过 1600px 时进行等比例预缩放，优化大图内存与提升识别性能
    if (image.bitmap.width > 1600 || image.bitmap.height > 1600) {
      const maxDim = Math.max(image.bitmap.width, image.bitmap.height)
      const scale = 1200 / maxDim
      const targetW = Math.round(image.bitmap.width * scale)
      image.resize({ w: targetW })
    }

    const { data, width, height } = image.bitmap
    const clamped = new Uint8ClampedArray(data)
    const qrResult = jsQR(clamped, width, height)

    if (qrResult && qrResult.data) {
      ctx?.logger.debug(`[qrcode] 成功从图片解析到二维码数据: ${qrResult.data}`)
      return qrResult.data.trim()
    }

    return null
  } catch (err) {
    ctx?.logger.warn(`[qrcode] 解析图片二维码失败: ${err instanceof Error ? err.message : String(err)}`)
    return null
  }
}

/**
 * 从网络或本地 URL 下载图片并提取二维码数据
 * @param ctx Koishi 上下文（用于网络请求与日志）
 * @param url 图片 URL
 * @returns 二维码内容，若无法下载或解析失败返回 null
 */
export async function fetchAndDecodeQrCode(ctx: Context, url: string): Promise<string | null> {
  try {
    ctx.logger.debug(`[qrcode] 正在下载图片以解析二维码: ${url}`)
    const arrayBuffer = await ctx.http.get<ArrayBuffer>(url, {
      responseType: 'arraybuffer',
      timeout: 15000,
    })
    const buffer = Buffer.from(arrayBuffer)
    return await decodeQrFromImageBuffer(buffer, ctx)
  } catch (err) {
    ctx.logger.warn(`[qrcode] 下载图片失败 (${url}): ${err instanceof Error ? err.message : String(err)}`)
    return null
  }
}
