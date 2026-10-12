import type { Context } from 'koishi'
import type { Config } from './config'
import type { HeightResult } from './types'
import { isSkyOfflineUrl, decodeSkyOfflineUrl } from './services/offline/decoder'
import { queryHeightByFriendCode, normalizeFriendCode } from './services/api/client'

export { normalizeFriendCode }
export const friendCodePattern = '[A-Za-z0-9]{4}(?:\\s*[-_—－]?\\s*[A-Za-z0-9]{4}){2}'

/**
 * 🔎 统一查询入口：自动识别是否为 `https://sky.thatg.co/o=` 离线扫码链接，否则走传统好友码模式。
 */
export async function queryHeight(ctx: Context, config: Config, rawInput: string): Promise<HeightResult> {
  const input = String(rawInput || '').trim()

  if (isSkyOfflineUrl(input)) {
    return await decodeSkyOfflineUrl(ctx, config, input)
  }

  return await queryHeightByFriendCode(ctx, config, input)
}
