import { Context } from 'koishi'
import type { Config } from '../config'
import { generateHeightText } from '../gen/gen_text'
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
    async (result) => {
      return generateHeightText(result, config.outfitFeedbackNotice).slice(0, config.textMaxLength)
    },
  )
}
