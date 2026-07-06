import type { Context } from 'koishi'
import type { Config } from '../config'
import { logInfo } from '../utils/logger'
import type { HeightResult } from '../types'
import { numberText } from './gen_text'

interface RenderHeightApiOptions {
  baseUrl: string
  path: string
  timeout: number
  width: number
  height: number
  showOutfitName: boolean
  extraQueryParams?: string
}

const outfitParams: [string, string][] = [
  ['body', 'body_name'],
  ['hair', 'hair_name'],
  ['mask', 'mask_name'],
  ['wing', 'wing_name'],
  ['neck', 'neck_name'],
  ['feet', 'feet_name'],
  ['hat', 'hat_name'],
  ['face', 'face_name'],
  ['prop', 'prop_name'],
  ['horn', 'horn_name'],
]

export async function renderHeightApi(
  ctx: Context,
  config: Config,
  result: HeightResult,
  options: RenderHeightApiOptions,
): Promise<Buffer> {
  const url = buildImageApiUrl(options.baseUrl, options.path)
  const params = url.searchParams
  const data = result.data

  params.set('bg_x', String(clampInteger(options.width, 1920, 1, 3840)))
  params.set('bg_y', String(clampInteger(options.height, 1080, 1, 2160)))
  params.set('currentHeight_txt', numberText(data.current_height))
  params.set('scale_txt', numberText(data.body_size))
  params.set('height_txt', numberText(data.height_value))
  params.set('minHeight_txt', numberText(data.min_height))
  params.set('maxHeight_txt', numberText(data.max_height))

  if (data.outfit && typeof data.outfit === 'object') {
    for (const [sourceKey, paramKey] of outfitParams) {
      const value = data.outfit[sourceKey]
      if (!hasText(value)) continue
      params.set(paramKey, stripEmoji(String(value)))
      if (options.showOutfitName) params.set(`${sourceKey}-txt_name`, 'true')
    }
  }

  applyExtraQueryParams(params, options.extraQueryParams)

  const timeout = Math.max(1000, clampInteger(options.timeout, 60, 1, 300) * 1000)
  logInfo(ctx, config, `🌐 请求外部身高出图 API：${url.origin}${url.pathname}`, `🔗 API 出图 URL: ${url.toString()}`)
  const image = await ctx.http.get<ArrayBuffer>(url.toString(), {
    responseType: 'arraybuffer',
    timeout,
    headers: {
      Accept: 'image/jpeg,image/*;q=0.9,*/*;q=0.8',
    },
  })
  const buffer = Buffer.from(image)
  if (!buffer.length) throw new Error('外部出图 API 返回空图片')
  return buffer
}

function buildImageApiUrl(baseUrl: string, path: string): URL {
  const normalizedBaseUrl = String(baseUrl || 'http://127.0.0.1:60704').replace(/\/+$/, '')
  const normalizedPath = String(path || '/img/render').trim()
  if (/^https?:\/\//i.test(normalizedPath)) return new URL(normalizedPath)
  return new URL(normalizedPath.startsWith('/') ? normalizedPath : `/${normalizedPath}`, `${normalizedBaseUrl}/`)
}

function applyExtraQueryParams(params: URLSearchParams, extraQueryParams?: string): void {
  const extra = String(extraQueryParams || '').trim().replace(/^\?/, '')
  if (!extra) return
  for (const [key, value] of new URLSearchParams(extra)) {
    if (key) params.set(key, value)
  }
}

function clampInteger(value: unknown, fallback: number, min: number, max: number): number {
  const number = Number(value)
  if (!Number.isFinite(number)) return fallback
  return Math.max(min, Math.min(max, Math.trunc(number)))
}

function hasText(value: unknown): boolean {
  return value !== null && value !== undefined && String(value).trim() !== ''
}

function stripEmoji(value: string): string {
  return value
    .replace(/\p{Extended_Pictographic}/gu, '')
    .replace(/[\uFE0E\uFE0F\u200D]/g, '')
    .trim()
}
