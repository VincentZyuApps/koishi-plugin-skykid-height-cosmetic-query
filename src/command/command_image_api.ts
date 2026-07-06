import { Context, h } from 'koishi'
import type { Config } from '../config'
import { renderHeightApi } from '../gen/gen_image_api'
import { registerHeightCommand } from './common'

export function registerApiCommand(ctx: Context, config: Config) {
  registerHeightCommand(
    ctx,
    config,
    config.apiCommandName,
    '光遇身高查询（外部 FastAPI 出图）',
    ['测身高-api', '身高查询-api', '光遇身高查询-api', 'aqha'],
    '正在查询并调用外部 API 出图，请稍等...',
    async (result, elapsed) => {
      const image = await renderHeightApi(ctx, config, result, {
        baseUrl: config.imageApiBaseUrl,
        path: config.imageApiPath,
        timeout: config.imageApiTimeout,
        width: config.imageApiWidth,
        height: config.imageApiHeight,
        showOutfitName: config.imageApiShowOutfitName,
        extraParams: config.imageApiExtraParams,
      })
      const message: (string | h)[] = [h.image(image, 'image/jpeg')]
      if (config.imageApiShowRenderInfo) {
        message.push(`\n(API 出图总耗时：${elapsed}ms)`)
      }
      return message
    },
  )
}
