import type { Context } from 'koishi'
import type { Config } from '../../config'
import type { HeightResult } from '../../types'
import { decompressLz4Block } from './lz4'
import { resolveOutfitNames } from './resolver'

export const SKY_O_LINK_STRICT_PREFIX = 'https://sky.thatg.co/o='

const COMPACT_OUTFIT_KEYS: Record<string, string> = {
  b: 'body',
  w: 'wing',
  ms: 'mask',
  n: 'neck',
  f: 'feet',
  hn: 'horn',
  fc: 'face',
  p: 'prop',
  ht: 'hat',
}

const COMPACT_SCALAR_KEYS: Record<string, string> = {
  s: 'scale',
  v: 'voice',
  a: 'attitude',
  e: 'seed',
  r: 'refreshversion',
}

/**
 * 🔍 严格判断是否为 `https://sky.thatg.co/o=` 扫码格式。
 */
export function isSkyOfflineUrl(input: string): boolean {
  const trimmed = String(input || '').trim()
  return trimmed.startsWith(SKY_O_LINK_STRICT_PREFIX) && trimmed.length > SKY_O_LINK_STRICT_PREFIX.length
}

/**
 * 📦 提取 o= 后的 payload 字符串。
 */
export function extractSkyOfflinePayload(input: string): string {
  const trimmed = String(input || '').trim()
  if (!trimmed.startsWith(SKY_O_LINK_STRICT_PREFIX)) return ''
  const payload = trimmed.slice(SKY_O_LINK_STRICT_PREFIX.length)
  // 截断常见末尾可能带有的空格或括号
  return payload.split(/[\s<>\]\)）】。；;，,]+/)[0].replace(/=+$/, '')
}

/**
 * 🧮 身高编号公式计算：base - scale_coefficient * scale - height_coefficient * height_value
 * 默认数值：base=7.6, scale_coefficient=8.3, height_coefficient=3.0
 */
export function calculateHeightIndex(heightValue: number, scale: number): number {
  return 7.6 - 8.3 * scale - 3.0 * heightValue
}

/**
 * 🌌 解码并解析光遇离线扫码链接为统一的 HeightResult 对象。
 */
export async function decodeSkyOfflineUrl(ctx: Context, config: Config, rawUrl: string): Promise<HeightResult> {
  const payload = extractSkyOfflinePayload(rawUrl)
  if (!payload) throw new Error('无效的光遇扫码链接')

  let compressed: Buffer
  try {
    compressed = Buffer.from(payload, 'base64url')
  } catch (err) {
    throw new Error('Base64 解码失败，请确认链接是否完整')
  }
  if (!compressed.length) throw new Error('Base64 解码结果为空')

  let rawBytes: Uint8Array
  try {
    rawBytes = decompressLz4Block(new Uint8Array(compressed))
  } catch (err) {
    throw new Error(`LZ4 解压失败，请确认链接是否完整: ${err instanceof Error ? err.message : String(err)}`)
  }

  let jsonText: string
  try {
    jsonText = Buffer.from(rawBytes).toString('utf-8')
  } catch (err) {
    throw new Error('解压后不是合法的 UTF-8 文本')
  }

  let parsed: unknown
  try {
    parsed = JSON.parse(jsonText)
  } catch (err) {
    throw new Error('解压后不是合法的 JSON 数据')
  }

  const normalized = normalizeDecodedPayload(parsed)

  const heightVal = Number(normalized.height)
  const scaleVal = Number(normalized.scale)
  if (!Number.isFinite(heightVal)) throw new Error('扫码数据中缺少 height 身高值')
  if (!Number.isFinite(scaleVal)) throw new Error('扫码数据中缺少 scale 体型值')

  const currentHeight = calculateHeightIndex(heightVal, scaleVal)
  const maxHeight = calculateHeightIndex(2.0, scaleVal)
  const minHeight = calculateHeightIndex(-2.0, scaleVal)

  // 提取装扮
  const rawOutfits: Record<string, { id?: string | number } | string | number | undefined> = {}
  const outfitKeys = ['body', 'wing', 'hair', 'mask', 'neck', 'feet', 'horn', 'face', 'prop', 'hat']
  for (const k of outfitKeys) {
    if (normalized[k] !== undefined) {
      rawOutfits[k] = normalized[k]
    }
  }

  const outfitMap = await resolveOutfitNames(ctx, config, rawOutfits)

  const codeDisplay = `o=${payload.slice(0, 8)}...`

  return {
    code: codeDisplay,
    message: '离线扫码解析成功',
    data: {
      uuid: '无 (离线数据)',
      body_size: Number(scaleVal.toFixed(5)),
      height_value: Number(heightVal.toFixed(5)),
      current_height: Number(currentHeight.toFixed(5)),
      max_height: Number(maxHeight.toFixed(5)),
      min_height: Number(minHeight.toFixed(5)),
      outfit: outfitMap,
    },
    queriedAt: new Date(),
  }
}

/**
 * 🔄 归一化 JSON 字典字段（兼容紧凑短键名与数组形式）。
 */
function normalizeDecodedPayload(payload: any): Record<string, any> {
  if (!payload || typeof payload !== 'object') {
    throw new Error('JSON 根节点不是有效对象')
  }

  const result: Record<string, any> = {}

  for (const [key, value] of Object.entries(payload)) {
    if (key === 'h') {
      if (Array.isArray(value) && value.length > 0) {
        result['hair'] = outfitArrayToDict(value)
      } else {
        result['height'] = value
      }
      continue
    }

    if (key in COMPACT_OUTFIT_KEYS && Array.isArray(value) && value.length > 0) {
      result[COMPACT_OUTFIT_KEYS[key]] = outfitArrayToDict(value)
      continue
    }

    if (key in COMPACT_SCALAR_KEYS) {
      result[COMPACT_SCALAR_KEYS[key]] = value
      continue
    }

    result[key] = value
  }

  return result
}

function outfitArrayToDict(arr: any[]): Record<string, any> {
  const keys = ['id', 'tex', 'pat', 'mask', 'dye']
  const res: Record<string, any> = {}
  keys.forEach((k, idx) => {
    if (idx < arr.length) res[k] = arr[idx]
  })
  return res
}
