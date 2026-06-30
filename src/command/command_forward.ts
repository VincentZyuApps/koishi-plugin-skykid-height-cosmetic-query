import { Context, h } from 'koishi'
import type { Config } from '../config'
import { generateHeightForward } from '../gen/gen_forward'
import { registerHeightCommand } from './common'

export function registerForwardCommand(ctx: Context, config: Config) {
  registerHeightCommand(
    ctx,
    config,
    config.forwardCommandName,
    '光遇身高查询（OneBot 合并转发）',
    ['测身高-forward', '身高查询-forward', 'aqhf'],
    '正在查询身高信息，请稍等...',
    async (result) => h.unescape(generateHeightForward(result)),
    {
      quote: false,
      guard: (session) => session.platform === 'onebot' ? undefined : '该命令仅支持 OneBot 平台',
    },
  )
}
