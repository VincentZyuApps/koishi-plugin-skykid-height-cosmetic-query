import type { Context } from 'koishi'
import type { Config } from '../config'

export function logInfo(ctx: Context, config: Config, msg1: string, msg2?: string, verbose = false) {
  ctx.logger.info(msg1)
  if (msg2 && (config.verboseConsoleLog || verbose)) ctx.logger.info(msg2)
}
