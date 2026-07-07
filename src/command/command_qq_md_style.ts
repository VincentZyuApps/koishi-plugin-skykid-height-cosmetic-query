import { Context } from 'koishi'
import type { Config } from '../config'
import { generateQqMdStyle } from '../gen/gen_qq_md_style'
import { hasAppendMdStyleButtonMode, normalizeQQButtonModes } from '../qq/button'
import { buildHeightKeyboard } from '../qq/keyboard'
import { ensureQQMarkdownPlatform, sendQQMarkdownWithGuard } from '../qq/sender'
import { buildCommandAliases, buildCommandName, registerHeightCommand } from './common'

/**
 * 💫 注册 QQ Markdown 格式风格查询命令。
 */
export function registerQqMdStyleCommand(ctx: Context, config: Config) {
  registerHeightCommand(
    ctx,
    config,
    buildCommandName(config, config.qqMdStyleCommandSuffix),
    '光遇身高查询（QQ Markdown 格式风格）',
    buildCommandAliases(config, config.qqMdStyleCommandSuffix),
    '⏳ 正在查询并渲染 QQ Markdown 格式风格，请稍等...',
    async (result, _elapsed, _commandOptions, session) => {
      if (!(await ensureQQMarkdownPlatform(ctx, session, config, 'QQ Markdown 格式风格'))) return
      const buttonModes = normalizeQQButtonModes(config)
      const keyboard = hasAppendMdStyleButtonMode(buttonModes) ? buildHeightKeyboard(config) : null
      await sendQQMarkdownWithGuard(ctx, session, config, generateQqMdStyle(result), keyboard, 'qq-md-style')
    },
    { quote: false },
  )
}
