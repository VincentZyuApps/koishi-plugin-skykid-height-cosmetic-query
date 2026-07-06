import { Context, h } from 'koishi'
import type { Config } from '../config'
import { renderHeightPptr } from '../gen/gen_image_pptr'
import { resolveRuntimeFontPath } from '../utils/fonts'
import { registerHeightCommand, registerNaturalMatcher } from './common'

export function registerPptrCommand(ctx: Context, config: Config) {
  registerHeightCommand(
    ctx,
    config,
    config.pptrCommandName,
    '光遇身高查询（Puppeteer 出图）',
    [
      '测身高', '身高查询', 'aqh', 'awa-query-height', '查询饰品',
      '测身高-pptr', '身高查询-pptr', 'aqhp', 'awa-query-height-pptr', '查询饰品-pptr',
      '测身高-puppeteer', '身高查询-puppeteer', 'aqhp', 'awa-query-height-puppeteer', '查询饰品-puppeteer'
    ],
    '⏳ 正在查询并渲染 Puppeteer 图片，请稍等...',
    async (result, elapsed, commandOptions) => {
      const image = await renderHeightPptr(ctx, result, {
        width: config.pptrWidth,
        imageType: config.pptrImageType,
        quality: config.pptrQuality,
        fontPath: config.useCustomFont && config.pptrFontPath ? resolveRuntimeFontPath(ctx, config.pptrFontPath) : '',
        darkMode: commandOptions.enableDarkMode ?? false,
      })
      const message: (string | h)[] = [h.image(`data:image/${config.pptrImageType};base64,${image}`)]
      if (config.pptrShowRenderInfo) {
        message.push(`\n📊 Puppeteer 渲染耗时：${elapsed}ms | 类型：${config.pptrImageType}`)
      }
      return message
    },
  )

  registerNaturalMatcher(ctx, config, ['测身高', '身高查询', 'aqh', 'awa-query-height', '查询饰品'])
}
