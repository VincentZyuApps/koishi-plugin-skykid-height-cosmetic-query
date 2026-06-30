import { Context } from 'koishi'
import {} from 'koishi-plugin-puppeteer'

import type { Config } from './config'
export { Config } from './config'
export { usage } from './usage'

import { registerForwardCommand } from './command/command_forward'
import { registerPptrCommand } from './command/command_image_pptr'
import { registerTakumiCommand } from './command/command_image_takumi'
import { registerTextCommand } from './command/command_text'
import { ensureRuntimeFonts } from './utils'

export const name = 'sky-shengao-query'

export const inject = {
  required: ['http'],
  optional: ['puppeteer'],
}

export function apply(ctx: Context, config: Config) {
  ctx.on('ready', async () => {
    await ensureRuntimeFonts(ctx, config)
  })

  if (config.enableTextCommand) registerTextCommand(ctx, config)
  if (config.enableForwardCommand) registerForwardCommand(ctx, config)
  if (config.enablePptrCommand) registerPptrCommand(ctx, config)
  if (config.enableTakumiCommand) registerTakumiCommand(ctx, config)
}
