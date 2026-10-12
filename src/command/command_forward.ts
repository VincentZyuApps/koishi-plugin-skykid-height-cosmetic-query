import { Context, h } from 'koishi'
import type { Config } from '../config'
import { generateHeightForward } from '../gen/gen_forward'
import { buildCommandAliases, buildCommandName, registerHeightCommand } from './common'

/**
 * 📨 注册合并转发身高查询命令（支持按平台配置开启与引用控制）。
 */
export function registerForwardCommand(ctx: Context, config: Config) {
  const getActiveRules = () => (Array.isArray(config.forwardPlatforms) ? config.forwardPlatforms : []).filter(
    (item) => item && item.enabled && String(item.platform || '').trim(),
  )

  registerHeightCommand(
    ctx,
    config,
    buildCommandName(config, config.forwardCommandSuffix),
    '光遇身高查询（合并转发）',
    buildCommandAliases(config, config.forwardCommandSuffix),
    '⏳ 正在查询身高信息，请稍等...',
    async (result) => h.unescape(generateHeightForward(result, config.outfitFeedbackNotice)),
    {
      quote: (session) => {
        if (!config.enableQuote) return false
        const currentPlatform = String(session.platform || '').trim().toLowerCase()
        const matched = getActiveRules().find(
          (rule) => String(rule.platform || '').trim().toLowerCase() === currentPlatform,
        )
        return Boolean(matched?.enableQuote)
      },
      guard: (session) => {
        const currentPlatform = String(session.platform || '').trim().toLowerCase()
        const activeRules = getActiveRules()
        const isAllowed = activeRules.some(
          (rule) => String(rule.platform || '').trim().toLowerCase() === currentPlatform,
        )
        if (isAllowed) return undefined

        const allowedPlatformNames = activeRules
          .map((rule) => String(rule.platform || '').trim())
          .filter(Boolean)

        return allowedPlatformNames.length > 0
          ? `⚠️ 该命令仅支持 ${allowedPlatformNames.join('、')} 平台`
          : '⚠️ 当前未启用任何支持合并转发的平台'
      },
    },
  )
}
