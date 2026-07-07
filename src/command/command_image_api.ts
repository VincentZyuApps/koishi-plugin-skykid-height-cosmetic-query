import { Context, h } from 'koishi'
import type { Config } from '../config'
import { buildHeightApiRenderUrl, renderHeightApi, type RenderHeightApiOptions } from '../gen/gen_image_api'
import { hasAppendApiImageButtonMode, normalizeQQButtonModes } from '../qq/button'
import { fitImageDimensionsByWidth, formatHeightImageMarkdown } from '../qq/image'
import { buildHeightKeyboard } from '../qq/keyboard'
import { notifyQQButtonSkip } from '../qq/notify'
import { isQQOfficialSession, sendQQMarkdownWithGuard } from '../qq/sender'
import { buildCommandAliases, buildCommandName, registerHeightCommand } from './common'

/**
 * 🌐 注册外部 Fastapi Pillow 后端出图命令。
 */
export function registerApiCommand(ctx: Context, config: Config) {
  registerHeightCommand(
    ctx,
    config,
    buildCommandName(config, config.apiCommandSuffix),
    '光遇身高查询（外部 Fastapi Pillow画图后端出图）',
    buildCommandAliases(config, config.apiCommandSuffix),
    '⏳ 正在查询并调用外部 API 出图，请稍等...',
    async (result, elapsed, _commandOptions, session) => {
      const renderOptions: RenderHeightApiOptions = {
        baseUrl: config.imageApiBaseUrl,
        path: config.imageApiPath,
        timeout: config.imageApiTimeout,
        width: config.imageApiWidth,
        height: config.imageApiHeight,
        showOutfitName: config.imageApiShowOutfitName,
        extraQueryParams: config.imageApiExtraQueryParams,
      }
      const buttonModes = normalizeQQButtonModes(config)
      const shouldAppendButton = hasAppendApiImageButtonMode(buttonModes)

      if (isQQOfficialSession(session)) {
        if (config.qqMarkdownEmbedApiImage) {
          const url = buildHeightApiRenderUrl(result, renderOptions)
          const dimensions = fitImageDimensionsByWidth(
            { width: config.imageApiWidth, height: config.imageApiHeight },
            { maxWidth: 900, fallback: { width: 900, height: 506 } },
          )
          const footer = config.imageApiShowRenderInfo ? `📊 API 出图总耗时：${elapsed}ms` : undefined
          await sendQQMarkdownWithGuard(
            ctx,
            session,
            config,
            formatHeightImageMarkdown('🌌 光崽身高装扮查询', url.toString(), dimensions.width, dimensions.height, footer),
            shouldAppendButton ? buildHeightKeyboard(config) : null,
            'api-image',
          )
          return
        }

        if (shouldAppendButton) {
          await notifyQQButtonSkip(ctx, session, config, 'append-api-image 需要 qqMarkdownEmbedApiImage 开启。')
        }
      }

      const image = await renderHeightApi(ctx, config, result, renderOptions)
      const message: (string | h)[] = [h.image(image, 'image/jpeg')]
      if (config.imageApiShowRenderInfo) {
        message.push(`\n📊 API 出图总耗时：${elapsed}ms`)
      }
      return message
    },
  )
}
