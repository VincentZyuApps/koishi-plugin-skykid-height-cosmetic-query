import { Context } from 'koishi'
import type { Config } from '../config'
import { generateHeightText } from '../gen/gen_text'
import { hasAppendTextButtonMode, normalizeQQButtonModes } from '../qq/button'
import { buildHeightKeyboard } from '../qq/keyboard'
import { notifyQQButtonSkip } from '../qq/notify'
import { isQQOfficialSession, sendQQMarkdownWithGuard } from '../qq/sender'
import { buildCommandAliases, buildCommandName, registerHeightCommand } from './common'

/**
 * 📝 注册纯文本身高查询命令。
 */
export function registerTextCommand(ctx: Context, config: Config) {
  registerHeightCommand(
    ctx,
    config,
    buildCommandName(config, config.textCommandSuffix),
    '光遇身高查询（纯文本）',
    buildCommandAliases(config, config.textCommandSuffix),
    '⏳ 正在查询身高信息，请稍等...',
    async (result, _elapsed, _commandOptions, session) => {
      const text = generateHeightText(result, config.outfitFeedbackNotice).slice(0, config.textMaxLength)
      const buttonModes = normalizeQQButtonModes(config)
      if (!hasAppendTextButtonMode(buttonModes)) return text

      if (!isQQOfficialSession(session)) {
        await notifyQQButtonSkip(ctx, session, config, 'append-text 仅支持 QQ 官方平台的 QQ Markdown 文本。')
        return text
      }

      await sendQQMarkdownWithGuard(ctx, session, config, formatTextAsQQMarkdown(text), buildHeightKeyboard(config), 'text')
    },
  )
}

/**
 * 📝 把 text 模式结果包成 QQ Markdown 内容，方便挂载按钮。
 */
function formatTextAsQQMarkdown(text: string): string {
  return [
    '# 🌌 光崽身高查询',
    '',
    ...text.split(/\r?\n/).map((line) => escapeMarkdown(line)),
  ].join('\n')
}

/**
 * 🧼 转义普通 Markdown 文本。
 */
function escapeMarkdown(value: string) {
  return String(value).replace(/[\\`*_{}[\]()#+\-.!|>]/g, '\\$&')
}
