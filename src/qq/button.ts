import { QQ_MARKDOWN_BUTTON_MODE, type Config, type QQMarkdownButtonModeType } from '../config'

export type QQMarkdownButtonMode = QQMarkdownButtonModeType

/**
 * 🧩 把配置里的 QQ Markdown 按钮模式规范化并去重。
 */
export function normalizeQQButtonModes(config: Pick<Config, 'qqMarkdownButtonMode'>): QQMarkdownButtonMode[] {
  const rawModes = Array.isArray(config.qqMarkdownButtonMode)
    ? config.qqMarkdownButtonMode
    : [config.qqMarkdownButtonMode].filter(Boolean)

  const seen = new Set<string>()
  const modes: QQMarkdownButtonMode[] = []
  for (const mode of rawModes) {
    const normalized = String(mode || '').trim() as QQMarkdownButtonMode
    if (!normalized || seen.has(normalized)) continue
    seen.add(normalized)
    modes.push(normalized)
  }
  return modes
}

/**
 * 🔘 判断是否需要单独发送一条 QQ JSON 按钮消息。
 */
export function hasStandaloneQQButtonMode(buttonModes: readonly QQMarkdownButtonMode[]) {
  return buttonModes.includes(QQ_MARKDOWN_BUTTON_MODE.STANDALONE)
}

/**
 * 🌐 判断按钮是否挂在 API 出图 Markdown 消息后面。
 */
export function hasAppendApiImageButtonMode(buttonModes: readonly QQMarkdownButtonMode[]) {
  return buttonModes.includes(QQ_MARKDOWN_BUTTON_MODE.APPEND_API_IMAGE)
}

/**
 * 💫 判断按钮是否挂在 Markdown 格式风格消息后面。
 */
export function hasAppendMdStyleButtonMode(buttonModes: readonly QQMarkdownButtonMode[]) {
  return buttonModes.includes(QQ_MARKDOWN_BUTTON_MODE.APPEND_MD_STYLE)
}

/**
 * 📊 判断按钮是否挂在 Markdown 表格消息后面。
 */
export function hasAppendMdTableButtonMode(buttonModes: readonly QQMarkdownButtonMode[]) {
  return buttonModes.includes(QQ_MARKDOWN_BUTTON_MODE.APPEND_MD_TABLE)
}

/**
 * 🖼️ 判断按钮是否挂在 Puppeteer 出图 Markdown 消息后面。
 */
export function hasAppendPptrImageButtonMode(buttonModes: readonly QQMarkdownButtonMode[]) {
  return buttonModes.includes(QQ_MARKDOWN_BUTTON_MODE.APPEND_PPTR_IMAGE)
}

/**
 * ⚡ 判断按钮是否挂在 Takumi 出图 Markdown 消息后面。
 */
export function hasAppendTakumiImageButtonMode(buttonModes: readonly QQMarkdownButtonMode[]) {
  return buttonModes.includes(QQ_MARKDOWN_BUTTON_MODE.APPEND_TAKUMI_IMAGE)
}
