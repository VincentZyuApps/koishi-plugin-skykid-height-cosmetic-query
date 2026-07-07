import { Context, h } from 'koishi'
import type { Config } from '../config'
import { renderHeightTakumi } from '../gen/gen_image_takumi'
import { resolveRuntimeFontPath } from '../utils/fonts'
import { registerHeightCommand } from './common'

/**
 * ⚡ 注册 Takumi wasm 出图命令。
 */
export function registerTakumiCommand(ctx: Context, config: Config) {
  registerHeightCommand(
    ctx,
    config,
    config.takumiCommandName,
    '光遇身高查询（Takumi wasm 出图）',
    ['测身高-takumi', '身高查询-takumi', 'aqhk', 'awa-query-height-takumi', '查询饰品-takumi'],
    '⏳ 正在查询并渲染 Takumi 图片，请稍等...',
    async (result, elapsed, commandOptions) => {
      const image = await renderHeightTakumi(result, {
        width: config.takumiWidth,
        darkMode: commandOptions.enableDarkMode ?? config.takumiDarkMode,
        fontPath: config.useCustomFont ? resolveRuntimeFontPath(ctx, config.takumiFontPath) : '',
      })
      const message: (string | h)[] = [h.image(image, 'image/png')]
      if (config.takumiShowRenderInfo) {
        message.push(`\n📊 Takumi 渲染耗时：${elapsed}ms`)
      }
      return message
    },
  )
}
