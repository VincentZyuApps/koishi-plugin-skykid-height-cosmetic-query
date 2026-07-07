import type { Config } from '../config'

export interface KeyboardButton {
  render_data: { label: string; style: number }
  action: { type: number; permission: { type: number }; data: string; enter: boolean }
}

export interface KeyboardRows {
  rows: { buttons: KeyboardButton[] }[]
}

export const DEFAULT_QQ_MARKDOWN_KEYBOARD: KeyboardRows = {
  rows: [
    {
      buttons: [
        {
          render_data: { label: '玩玩别的', style: 0 },
          action: { type: 2, permission: { type: 2 }, data: 'help', enter: true },
        },
      ],
    },
  ],
}

export const QQ_MARKDOWN_BUTTON_ONLY_CONTENT = '# 光遇身高查询操作按钮'

/**
 * ⌨️ 根据配置构造 QQ 官方 Bot keyboard。
 */
export function buildHeightKeyboard(config: Config): KeyboardRows {
  const raw = String(config.qqMarkdownKeyboardJson || stringifyCompact(DEFAULT_QQ_MARKDOWN_KEYBOARD))

  try {
    const parsed = JSON.parse(raw)
    if (parsed?.rows?.[0]?.buttons?.length) return parsed
  } catch {}

  return DEFAULT_QQ_MARKDOWN_KEYBOARD
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
