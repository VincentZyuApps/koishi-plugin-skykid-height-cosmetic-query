import { Context } from 'koishi'
import type { Config, QQMarkdownCosmeticIconSizeType } from '../config'
import { QQ_MARKDOWN_IMAGE_STORAGE_MODE } from '../config'
import { uploadQQMarkdownImageViaAssets } from './assets'
import { ICON_CACHE_ROUTE, resolveQQMarkdownImagePublicBaseUrl } from './server'

export const COSMETIC_ICON_PIXEL_MAP: Record<QQMarkdownCosmeticIconSizeType, number> = {
  minimal: 10,
  small: 36,
  medium: 48,
  large: 96,
  xlarge: 192,
  original: 64,
}

/**
 * 🎨 获取或生成装扮单品的 QQ Markdown 内联图标 URL。
 */
export async function resolveCosmeticIconUrl(
  ctx: Context,
  config: Config,
  item: string,
  outfitId: string | undefined,
  size: QQMarkdownCosmeticIconSizeType = 'minimal',
): Promise<string> {
  const safeItem = String(item || '').trim()
  const safeId = String(outfitId || 'none').trim()
  const safeSize = size || 'minimal'

  if (config.qqMarkdownImageStorageMode === QQ_MARKDOWN_IMAGE_STORAGE_MODE.ASSETS) {
    const baseUrl = String(config.imageApiBaseUrl || 'http://127.0.0.1:60704').replace(/\/+$/, '')
    const targetUrl = `${baseUrl}/img/cosmetic/${encodeURIComponent(safeItem)}/${encodeURIComponent(safeId)}?size=${encodeURIComponent(safeSize)}`
    try {
      const buffer = await ctx.http.get<ArrayBuffer>(targetUrl, { responseType: 'arraybuffer', timeout: 10000 })
      return await uploadQQMarkdownImageViaAssets(ctx, config, Buffer.from(buffer), 'png')
    } catch {
      return ''
    }
  }

  // Server 模式：由 Koishi Server 暴露并代理路由
  const publicBase = resolveQQMarkdownImagePublicBaseUrl(ctx, config)
  if (!publicBase) return ''
  return `${publicBase}${ICON_CACHE_ROUTE}/${encodeURIComponent(safeItem)}/${encodeURIComponent(safeId)}?size=${encodeURIComponent(safeSize)}`
}

/**
 * 🖼️ 组装单个装扮的 QQ Markdown 图标前缀。
 */
export function formatCosmeticIconMarkdown(label: string, iconUrl: string, sizeName: QQMarkdownCosmeticIconSizeType = 'minimal'): string {
  if (!iconUrl) return ''
  const px = COSMETIC_ICON_PIXEL_MAP[sizeName] || 10
  return `![${label} #${px}px #${px}px](${iconUrl}) `
}
