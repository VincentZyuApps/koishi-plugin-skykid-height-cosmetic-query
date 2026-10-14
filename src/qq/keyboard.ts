import type { Config } from '../config'

export interface KeyboardButton {
  render_data: { label: string; style: number }
  action: { type: number; permission: { type: number }; data: string; enter: boolean }
}

export interface KeyboardRows {
  rows: { buttons: KeyboardButton[] }[]
}

export const QQ_MARKDOWN_BUTTON_ONLY_CONTENT = '# 光遇身高查询操作按钮'

/**
 * ⌨️ 默认四行八按钮布局定义，支持动态占位符 ${commandPrefix}
 */
export const DEFAULT_QQ_MARKDOWN_KEYBOARD: KeyboardRows = {
  rows: [
    {
      buttons: [
        {
          render_data: { label: '❔ 获取帮助', style: 1 },
          action: { type: 1, permission: { type: 2 }, data: '${commandPrefix}.帮助', enter: false },
        },
        {
          render_data: { label: '🧭 玩玩别的', style: 0 },
          action: { type: 1, permission: { type: 2 }, data: 'help', enter: false },
        },
      ],
    },
    {
      buttons: [
        {
          render_data: { label: '🖼️ Puppeteer出图', style: 0 },
          action: { type: 2, permission: { type: 2 }, data: '${commandPrefix}.pptr', enter: false },
        },
        {
          render_data: { label: '⚡ Takumi出图', style: 0 },
          action: { type: 2, permission: { type: 2 }, data: '${commandPrefix}.takumi', enter: false },
        },
      ],
    },
    {
      buttons: [
        {
          render_data: { label: '💫 Markdown卡片', style: 0 },
          action: { type: 2, permission: { type: 2 }, data: '${commandPrefix}.md-style', enter: false },
        },
        {
          render_data: { label: '📊 Markdown表格', style: 0 },
          action: { type: 2, permission: { type: 2 }, data: '${commandPrefix}.md-table', enter: false },
        },
      ],
    },
    {
      buttons: [
        {
          render_data: { label: '🌐 API远程出图', style: 0 },
          action: { type: 2, permission: { type: 2 }, data: '${commandPrefix}.api', enter: false },
        },
        {
          render_data: { label: '📝 纯文本输出', style: 0 },
          action: { type: 2, permission: { type: 2 }, data: '${commandPrefix}.text', enter: false },
        },
      ],
    },
  ],
}

/**
 * ⌨️ 根据配置构造 QQ 官方 Bot keyboard，自动替换 ${commandPrefix} 占位符。
 */
export function buildHeightKeyboard(config: Config): KeyboardRows {
  const prefix = getCleanCommandPrefix(config)
  let raw = String(config.qqMarkdownKeyboardJson || stringifyCompact(DEFAULT_QQ_MARKDOWN_KEYBOARD))
  raw = raw.replace(/\$\{commandPrefix\}/g, prefix)

  try {
    const parsed = JSON.parse(raw)
    if (parsed?.rows?.[0]?.buttons?.length) return parsed
  } catch {}

  return resolveKeyboardTemplate(DEFAULT_QQ_MARKDOWN_KEYBOARD, prefix)
}

/**
 * 📦 把默认 keyboard JSON 格式化成配置面板可读文本。
 */
export function stringifyCompact(obj: object): string {
  return JSON.stringify(obj, null, 2)
    .split('\n')
    .map((line) => line.trimEnd())
    .join('\n')
}

/**
 * 🧩 获取纯净的前缀字符串。
 */
function getCleanCommandPrefix(config: Config): string {
  return String(config.commandPrefix || '测身高').trim().replace(/\.+$/, '') || '测身高'
}

/**
 * 🔄 将 keyboard 模板中的占位符替换为具体前缀。
 */
function resolveKeyboardTemplate(keyboard: KeyboardRows, prefix: string): KeyboardRows {
  return JSON.parse(JSON.stringify(keyboard).replace(/\$\{commandPrefix\}/g, prefix))
}
