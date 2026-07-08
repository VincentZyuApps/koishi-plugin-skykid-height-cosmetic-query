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
 * ⌨️ 根据配置构造 QQ 官方 Bot keyboard。
 */
export function buildHeightKeyboard(config: Config): KeyboardRows {
  const fallbackKeyboard = buildDefaultHeightKeyboard(config)
  const raw = String(config.qqMarkdownKeyboardJson || stringifyCompact(fallbackKeyboard))

  try {
    const parsed = JSON.parse(raw)
    if (parsed?.rows?.[0]?.buttons?.length) return parsed
  } catch {}

  return fallbackKeyboard
}

/**
 * ⌨️ 构造默认 QQ 官方 Bot keyboard。
 */
export function buildDefaultHeightKeyboard(config: Config): KeyboardRows {
  return {
    rows: [
      {
        buttons: [
          {
            render_data: { label: '❔ 获取帮助', style: 1 },
            action: { type: 2, permission: { type: 2 }, data: buildHelpCommandName(config), enter: true },
          },
          {
            render_data: { label: '🧭 玩玩别的', style: 0 },
            action: { type: 2, permission: { type: 2 }, data: 'help', enter: true },
          },
        ],
      },
    ],
  }
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
 * ❔ 拼出帮助指令，避免 qq 模块反向依赖 command 模块。
 */
function buildHelpCommandName(config: Config): string {
  const prefix = String(config.commandPrefix || '查询光崽身高装扮').trim().replace(/\.+$/, '') || '查询光崽身高装扮'
  const suffix = String(config.helpCommandSuffix || '帮助').trim().replace(/^\.+/, '') || '帮助'
  return `${prefix}.${suffix}`
}
