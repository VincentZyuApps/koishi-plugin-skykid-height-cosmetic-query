import type { Context } from 'koishi'
import type { Config } from '../config'

/**
 * 🧾 输出普通日志，并按配置决定是否输出详细日志。
 */
export function logInfo(ctx: Context, config: Config, msg1: string, msg2?: string, verbose = false) {
  ctx.logger.info(msg1)
  if (msg2 && (config.verboseConsoleLog || verbose)) ctx.logger.info(msg2)
}
