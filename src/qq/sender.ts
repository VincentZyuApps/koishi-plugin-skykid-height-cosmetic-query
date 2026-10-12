import type { Context, Session } from 'koishi'
import { QQ_MARKDOWN_IMAGE_STORAGE_MODE, type Config } from '../config'
import { logInfo } from '../utils/logger'
import { uploadQQMarkdownImageViaAssets } from './assets'
import { hasStandaloneQQButtonMode, normalizeQQButtonModes } from './button'
import { buildHeightKeyboard, QQ_MARKDOWN_BUTTON_ONLY_CONTENT } from './keyboard'
import { sendQQMarkdown } from './markdown'
import { notifyQQButtonSkip, notifyQQMarkdownSkip } from './notify'
import { storeQQMarkdownImage } from './server'

export type QQMarkdownImageType = 'png' | 'jpeg' | 'jpg' | 'webp'

/**
 * 🧭 判断当前会话是否来自支持 QQ Markdown 的官方平台（结合 config.qqMarkdownPlatforms 判定）。
 */
export function isQQOfficialSession(session: Session, config?: Config) {
  if (config && Array.isArray(config.qqMarkdownPlatforms)) {
    const currentPlatform = String(session.platform || '').trim().toLowerCase()
    return config.qqMarkdownPlatforms.some(
      (item) => item && item.enabled && String(item.platform || '').trim().toLowerCase() === currentPlatform,
    )
  }
  return session.platform === 'qq'
}

/**
 * 🔘 查询成功后按配置额外发送 standalone QQ 按钮消息。
 */
export async function sendStandaloneQQButton(ctx: Context, session: Session, config: Config) {
  const buttonModes = normalizeQQButtonModes(config)
  if (!hasStandaloneQQButtonMode(buttonModes)) return

  if (!isQQOfficialSession(session, config)) {
    await notifyQQButtonSkip(ctx, session, config, 'standalone 按钮仅支持 QQ 官方平台。')
    return
  }

  await sendQQMarkdownWithGuard(ctx, session, config, QQ_MARKDOWN_BUTTON_ONLY_CONTENT, buildHeightKeyboard(config), 'standalone-button')
}

/**
 * 💬 发送 QQ Markdown，并把失败写入调试日志。
 */
export async function sendQQMarkdownWithGuard(
  ctx: Context,
  session: Session,
  config: Config,
  markdown: string,
  keyboard: object | null,
  mode: string,
) {
  try {
    await sendQQMarkdown(session, markdown, keyboard, true)
  } catch (error) {
    logInfo(ctx, config, `发送 QQ Markdown 失败 ${mode}: ${error instanceof Error ? error.message : String(error)}`)
  }
}

/**
 * 🔒 非 QQ 官方平台时按调试配置提示并返回 false。
 */
export async function ensureQQMarkdownPlatform(ctx: Context, session: Session, config: Config, feature: string) {
  if (isQQOfficialSession(session, config)) return true
  const activeRules = (Array.isArray(config.qqMarkdownPlatforms) ? config.qqMarkdownPlatforms : []).filter(
    (item) => item && item.enabled && String(item.platform || '').trim(),
  )
  const allowedNames = activeRules.map((item) => String(item.platform || '').trim()).filter(Boolean)
  const allowedDesc = allowedNames.length > 0 ? allowedNames.join('、') : 'qq'
  await notifyQQMarkdownSkip(ctx, session, config, `${feature}仅支持 ${allowedDesc} 平台。`)
  return false
}

/**
 * 🖼️ 把本地图片转换成 QQ Markdown 可访问的公网图片 URL。
 */
export async function resolveQQMarkdownImageUrl(
  ctx: Context,
  config: Config,
  image: Buffer | string,
  imageType: QQMarkdownImageType,
) {
  if (config.qqMarkdownImageStorageMode === QQ_MARKDOWN_IMAGE_STORAGE_MODE.ASSETS) {
    return uploadQQMarkdownImageViaAssets(ctx, config, image, imageType)
  }
  return storeQQMarkdownImage(ctx, config, image, imageType)
}
