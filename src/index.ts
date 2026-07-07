import { Context } from 'koishi'
import {} from 'koishi-plugin-puppeteer'

import type { Config } from './config'
export { Config } from './config'
export { usage } from './usage'

import { registerForwardCommand } from './command/command_forward'
import { registerApiCommand } from './command/command_image_api'
import { registerPptrCommand } from './command/command_image_pptr'
import { registerTakumiCommand } from './command/command_image_takumi'
import { registerTextCommand } from './command/command_text'
import { ensureRuntimeFonts } from './utils/fonts'

export const name = 'skykid-height-cosmetic-query'

export const inject = {
  required: ['http'],
  optional: ['puppeteer'],
}

/**
 * 🚀 Koishi 插件入口，按配置注册各类查询命令。
 */
export function apply(ctx: Context, config: Config) {
  ctx.on('ready', async () => {
    if (config.useCustomFont) await ensureRuntimeFonts(ctx, config)
  })

  if (config.enableTextCommand) registerTextCommand(ctx, config)
  if (config.enableForwardCommand) registerForwardCommand(ctx, config)
  if (config.enablePptrCommand) registerPptrCommand(ctx, config)
  if (config.enableTakumiCommand) registerTakumiCommand(ctx, config)
  if (config.enableApiCommand) registerApiCommand(ctx, config)
}
