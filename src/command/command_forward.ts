import { Context, h } from 'koishi'
import type { Config } from '../config'
import { generateHeightForward } from '../gen/gen_forward'
import { buildCommandAliases, buildCommandName, registerHeightCommand } from './common'

/**
 * 📨 注册 OneBot 合并转发身高查询命令。
 */
export function registerForwardCommand(ctx: Context, config: Config) {
  registerHeightCommand(
    ctx,
    config,
    buildCommandName(config, config.forwardCommandSuffix),
    '光遇身高查询（OneBot 合并转发）',
    buildCommandAliases(config, config.forwardCommandSuffix),
    '⏳ 正在查询身高信息，请稍等...',
    async (result) => h.unescape(generateHeightForward(result)),
    {
      quote: false,
      guard: (session) => session.platform === 'onebot' ? undefined : '⚠️ 该命令仅支持 OneBot 平台',
    },
  )
}
