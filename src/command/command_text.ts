import { Context } from 'koishi'
import type { Config } from '../config'
import { generateHeightText } from '../gen/gen_text'
import { registerHeightCommand } from './common'

export function registerTextCommand(ctx: Context, config: Config) {
  registerHeightCommand(
    ctx,
    config,
    config.textCommandName,
    '光遇身高查询（纯文本）',
    ['测身高-text', '身高查询-text', 'aqht', 'awa-query-height-text', '查询饰品-text'],
    '⏳ 正在查询身高信息，请稍等...',
    async (result) => generateHeightText(result).slice(0, config.textMaxLength),
  )
}
