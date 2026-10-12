import { Context, h } from 'koishi'
import type { Config } from '../config'
import { renderHeightTakumi } from '../gen/gen_image_takumi'
import { hasAppendTakumiImageButtonMode, normalizeQQButtonModes } from '../qq/button'
import { fitImageDimensionsByWidth, formatHeightImageMarkdown, getImageDimensions } from '../qq/image'
import { buildHeightKeyboard } from '../qq/keyboard'
import { notifyQQButtonSkip } from '../qq/notify'
import { isQQOfficialSession, resolveQQMarkdownImageUrl, sendQQMarkdownWithGuard } from '../qq/sender'
import { resolveRuntimeFontPath } from '../utils/fonts'
import { buildCommandAliases, buildCommandName, registerHeightCommand } from './common'

/**
 * ⚡ 注册 Takumi wasm 出图命令。
 */
export function registerTakumiCommand(ctx: Context, config: Config) {
  registerHeightCommand(
    ctx,
    config,
    buildCommandName(config, config.takumiCommandSuffix),
    '光遇身高查询（Takumi wasm 出图）',
    buildCommandAliases(config, config.takumiCommandSuffix),
    '⏳ 正在查询并渲染 Takumi 图片，请稍等...',
    async (result, elapsed, commandOptions, session) => {
      const image = await renderHeightTakumi(result, {
        width: config.takumiWidth,
        darkMode: commandOptions.enableDarkMode ?? config.takumiDarkMode,
        fontPath: config.useCustomFont ? resolveRuntimeFontPath(ctx, config.takumiFontPath) : '',
      })
      const buttonModes = normalizeQQButtonModes(config)
      const shouldAppendButton = hasAppendTakumiImageButtonMode(buttonModes)

      if (isQQOfficialSession(session)) {
        if (config.qqMarkdownEmbedTakumiImage) {
          const imageUrl = await resolveQQMarkdownImageUrl(ctx, config, image, 'png')
          const dimensions = fitImageDimensionsByWidth(
            getImageDimensions(image),
            { maxWidth: 900, fallback: { width: Math.min(config.takumiWidth, 900), height: 1200 } },
          )
          const footers = [
            config.takumiShowRenderInfo ? `📊 Takumi 渲染耗时：${elapsed}ms` : undefined,
            config.outfitFeedbackNotice || undefined,
          ]
          await sendQQMarkdownWithGuard(
            ctx,
            session,
            config,
            formatHeightImageMarkdown('🌌 光崽身高装扮查询', imageUrl, dimensions.width, dimensions.height, footers),
            shouldAppendButton ? buildHeightKeyboard(config) : null,
            'takumi-image',
          )
          return
        }

        if (shouldAppendButton) {
          await notifyQQButtonSkip(ctx, session, config, 'append-takumi-image 需要 qqMarkdownEmbedTakumiImage 开启。')
        }
      }

      const message: (string | h)[] = [h.image(image, 'image/png')]
      if (config.takumiShowRenderInfo) {
        message.push(`\n📊 Takumi 渲染耗时：${elapsed}ms`)
      }
      if (config.outfitFeedbackNotice) {
        message.push(`\n${config.outfitFeedbackNotice}`)
      }
      return message
    },
  )
}
