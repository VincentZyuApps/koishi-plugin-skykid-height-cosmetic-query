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
      await sendQQMarkdownWithGuard(ctx, session, config, generateQqMdTable(result), keyboard, 'qq-md-table')
    },
    { quote: false },
  )
}
