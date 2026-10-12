import { Context, h } from 'koishi'
import type { Config } from '../config'
import { renderHeightPptr } from '../gen/gen_image_pptr'
import { hasAppendPptrImageButtonMode, normalizeQQButtonModes } from '../qq/button'
import { fitImageDimensionsByWidth, formatHeightImageMarkdown, getImageDimensions } from '../qq/image'
import { buildHeightKeyboard } from '../qq/keyboard'
import { notifyQQButtonSkip } from '../qq/notify'
import { isQQOfficialSession, resolveQQMarkdownImageUrl, sendQQMarkdownWithGuard } from '../qq/sender'
import { resolveRuntimeFontPath } from '../utils/fonts'
import { buildCommandAliases, buildCommandName, registerHeightCommand } from './common'

/**
 * 🖼️ 注册 Puppeteer 截图出图命令。
 */
export function registerPptrCommand(ctx: Context, config: Config) {
  registerHeightCommand(
    ctx,
    config,
    buildCommandName(config, config.pptrCommandSuffix),
    '光遇身高查询（Puppeteer 出图）',
    buildCommandAliases(config, config.pptrCommandSuffix),
    '⏳ 正在查询并渲染 Puppeteer 图片，请稍等...',
    async (result, elapsed, commandOptions, session) => {
      const image = await renderHeightPptr(ctx, result, {
        width: config.pptrWidth,
        deviceScaleFactor: config.pptrDeviceScaleFactor,
        imageType: config.pptrImageType,
        cardColorMode: config.pptrCardColorMode,
        quality: config.pptrQuality,
        fontPath: config.useCustomFont && config.pptrFontPath ? resolveRuntimeFontPath(ctx, config.pptrFontPath) : '',
        darkMode: commandOptions.enableDarkMode ?? false,
      })
      const buttonModes = normalizeQQButtonModes(config)
      const shouldAppendButton = hasAppendPptrImageButtonMode(buttonModes)
      const imageBuffer = Buffer.from(image, 'base64')

      if (isQQOfficialSession(session)) {
        if (config.qqMarkdownEmbedPptrImage) {
          const imageUrl = await resolveQQMarkdownImageUrl(ctx, config, imageBuffer, config.pptrImageType)
          const dimensions = fitImageDimensionsByWidth(
            getImageDimensions(imageBuffer),
            { maxWidth: 900, fallback: { width: Math.min(config.pptrWidth, 900), height: 1200 } },
          )
          const footers = [
            config.pptrShowRenderInfo ? `📊 Puppeteer 渲染耗时：${elapsed}ms | 类型：${config.pptrImageType}` : undefined,
            config.outfitFeedbackNotice || undefined,
          ]
          await sendQQMarkdownWithGuard(
            ctx,
            session,
            config,
            formatHeightImageMarkdown('🌌 光崽身高装扮查询', imageUrl, dimensions.width, dimensions.height, footers),
            shouldAppendButton ? buildHeightKeyboard(config) : null,
            'pptr-image',
          )
          return
        }

        if (shouldAppendButton) {
          await notifyQQButtonSkip(ctx, session, config, 'append-pptr-image 需要 qqMarkdownEmbedPptrImage 开启。')
        }
      }

      const message: (string | h)[] = [h.image(`data:image/${config.pptrImageType};base64,${image}`)]
      if (config.pptrShowRenderInfo) {
        message.push(`\n📊 Puppeteer 渲染耗时：${elapsed}ms | 类型：${config.pptrImageType}`)
      }
      if (config.outfitFeedbackNotice) {
        message.push(`\n${config.outfitFeedbackNotice}`)
      }
      return message
    },
  )
}
