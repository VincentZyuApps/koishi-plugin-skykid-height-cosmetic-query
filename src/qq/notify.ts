import { h, type Context, type Session } from 'koishi'
import type { Config } from '../config'
import { logInfo } from '../utils/logger'

/**
 * 📣 按调试配置提示 QQ Markdown 或按钮跳过原因。
 */
export async function notifyQQMarkdownSkip(
  ctx: Context,
  session: Session,
  config: Config,
  reason: string,
) {
  const message = `QQ Markdown 未发送：${reason}`
  if (config.verboseConsoleLog) {
    logInfo(ctx, config, message)
  }
  if (config.verboseSessionLog) {
    await sendSessionMessage(session, config, message)
  }
}

/**
 * 🔘 按调试配置提示 QQ Markdown 按钮跳过原因。
 */
export async function notifyQQButtonSkip(
  ctx: Context,
  session: Session,
  config: Config,
  reason: string,
) {
  const message = `QQ Markdown 按钮未发送：${reason}`
  if (config.verboseConsoleLog) {
    logInfo(ctx, config, message)
  }
  if (config.verboseSessionLog) {
    await sendSessionMessage(session, config, message)
  }
}

/**
 * 💬 发送带引用前缀的调试提示到当前会话。
 */
function sendSessionMessage(session: Session, config: Config, content: unknown) {
  const quote = getQuotePrefix(session, config)
  return session.send(quote ? [quote, String(content)] : String(content))
}

/**
 * ↩️ 根据配置生成引用前缀。
 */
function getQuotePrefix(session: Session, config: Config) {
  return config.enableQuote && session.messageId ? h.quote(session.messageId) : null
}
