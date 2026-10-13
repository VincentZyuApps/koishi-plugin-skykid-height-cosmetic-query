import { Context } from 'koishi'
import type { Config } from '../config'
import { generateQqMdTable } from '../gen/gen_qq_md_table'
import { hasAppendMdTableButtonMode, normalizeQQButtonModes } from '../qq/button'
import { buildHeightKeyboard } from '../qq/keyboard'
import { ensureQQMarkdownPlatform, sendQQMarkdownWithGuard } from '../qq/sender'
import { buildCommandAliases, buildCommandName, registerHeightCommand } from './common'

/**
 * 📊 注册 QQ Markdown 表格模式查询命令。
 */
export function registerQqMdTableCommand(ctx: Context, config: Config) {
  const getActiveRules = () => (Array.isArray(config.qqMarkdownPlatforms) ? config.qqMarkdownPlatforms : []).filter(
    (item) => item && item.enabled && String(item.platform || '').trim(),
  )

  registerHeightCommand(
    ctx,
    config,
    buildCommandName(config, config.qqMdTableCommandSuffix),
    '光遇身高查询（QQ Markdown 表格模式）',
    buildCommandAliases(config, config.qqMdTableCommandSuffix),
    '⏳ 正在查询并渲染 QQ Markdown 表格，请稍等...',
    async (result, _elapsed, _commandOptions, session) => {
      if (!(await ensureQQMarkdownPlatform(ctx, session, config, 'QQ Markdown 表格模式'))) return
      const buttonModes = normalizeQQButtonModes(config)
      const keyboard = hasAppendMdTableButtonMode(buttonModes) ? buildHeightKeyboard(config) : null
      const content = await generateQqMdTable(ctx, config, result, config.outfitFeedbackNotice)
      await sendQQMarkdownWithGuard(ctx, session, config, content, keyboard, 'qq-md-table')
    },
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
          : '⚠️ 当前未启用支持 QQ Markdown 的平台'
      },
    },
  )
}
