import type { Context } from 'koishi'
import type { Config } from '../../config'
import { logInfo } from '../../utils/logger'

export interface OutfitMap {
  [slot: string]: string | number | undefined
}

/**
 * 🏷️ 尝试向 Python 绘图后端解析装扮 ID，失败时平滑降级为 `ID ${id}`。
 */
export async function resolveOutfitNames(
  ctx: Context,
  config: Config,
  rawOutfits: Record<string, { id?: string | number } | string | number | undefined>,
): Promise<Record<string, string>> {
  const result: Record<string, string> = {}
  const toResolve: Record<string, string> = {}

  for (const [slot, item] of Object.entries(rawOutfits)) {
    if (!item) continue
    const id = typeof item === 'object' && item !== null && 'id' in item ? item.id : item
    if (id === undefined || id === null || String(id).trim() === '') continue
    const strId = String(id).trim()
    result[slot] = `ID ${strId}`
    toResolve[slot] = strId
  }

  if (Object.keys(toResolve).length === 0) {
    return result
  }

  // 尝试向 Python 后端请求翻译
  try {
    const baseUrl = String(config.imageApiBaseUrl || 'http://127.0.0.1:60704').replace(/\/+$/, '')
    const url = `${baseUrl}/api/v1/resolve-outfits`
    logInfo(ctx, config, `🌐 正在尝试向 Python 后端请求装扮中文名解析: ${url}`)

    // 默认短超时，不阻塞离线流程
    const resp = await ctx.http.post<{ code: number; message: string; data?: Record<string, string | null> }>(
      url,
      { items: toResolve },
      { timeout: 3000 },
    )

    if (resp && resp.code === 200 && resp.data && typeof resp.data === 'object') {
      for (const [slot, cnName] of Object.entries(resp.data)) {
        if (cnName && String(cnName).trim()) {
          result[slot] = String(cnName).trim()
        }
      }
      logInfo(ctx, config, `✅ 装扮中文名解析成功`)
    }
  } catch (err) {
    logInfo(ctx, config, `⚠️ Python 后端装扮解析不可用或失败，已自动降级为纯 ID 显示: ${err instanceof Error ? err.message : String(err)}`)
  }

  return result
}
