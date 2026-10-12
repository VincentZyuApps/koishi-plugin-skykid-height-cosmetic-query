import type { HeightResult } from '../types'

const outfitLabels: [string, string][] = [
  ['body', '裤子'],
  ['hair', '发型'],
  ['mask', '面具'],
  ['wing', '斗篷'],
  ['neck', '项链'],
  ['feet', '鞋子'],
  ['hat', '头饰'],
  ['face', '脸饰'],
  ['prop', '背饰'],
  ['horn', '角饰'],
]

/**
 * 🧾 把任意值转成展示文本，空值使用兜底文案。
 */
export function valueText(value: unknown, fallback = '未知'): string {
  if (value === null || value === undefined || String(value).trim() === '') return fallback
  return String(value)
}

/**
 * 🔢 把身高数值字段转成展示文本。
 */
export function numberText(value: unknown): string {
  if (value === null || value === undefined || String(value).trim() === '') return '未知'
  return String(value)
}

/**
 * 📝 生成纯文本身高查询结果。
 */
export function generateHeightText(result: HeightResult): string {
  const data = result.data
  const lines = [
    ...(result.dryRun ? ['🧪⚠️ 假数据测试模式：仅用于测试文字格式/图片样式，不是真实查询结果。', '=================='] : []),
    `✅ 状态：${result.message}`,
    '==================',
    `🧾 好友码 / url中o参数：${result.code}`,
    `🆔 UUID：${valueText(data.uuid)}`,
    `🕒 查询时间：${formatDate(result.queriedAt)}`,
    '==================',
    '📏 身高信息',
    `📐 体型值：${numberText(data.body_size)}`,
    `📊 身高值：${numberText(data.height_value)}`,
    `🧍 当前身高：${numberText(data.current_height)}`,
    `⬆️ 最高身高：${numberText(data.max_height)}`,
    `⬇️ 最矮身高：${numberText(data.min_height)}`,
  ]

  if (data.outfit && typeof data.outfit === 'object' && Object.keys(data.outfit).length) {
    lines.push('==================', '🎒 装扮信息')
    for (const [key, label] of outfitLabels) {
      lines.push(`🏷️ ${label}：${valueText(data.outfit[key])}`)
    }
  }

  if (result.dryRun) {
    lines.push('==================', '🧪 这是假数据，仅用于测试输出样式。')
  } else {
    lines.push('==================', '⚠️ 说明：该接口默认 action=delete，会消费一次性好友码。', '📌 数据仅供参考，请以游戏内实际情况为准。')
  }
  return lines.join('\n')
}

/**
 * 📋 生成图片和转发输出共用的行数据。
 */
export function generateHeightRows(result: HeightResult): [string, string][] {
  const data = result.data
  const rows: [string, string][] = [
    ['好友码 / url中o参数', result.code],
    ['UUID', valueText(data.uuid)],
    ['体型值', numberText(data.body_size)],
    ['身高值', numberText(data.height_value)],
    ['当前身高', numberText(data.current_height)],
    ['最高身高', numberText(data.max_height)],
    ['最矮身高', numberText(data.min_height)],
  ]

  if (data.outfit && typeof data.outfit === 'object' && Object.keys(data.outfit).length) {
    for (const [key, label] of outfitLabels) rows.push([label, valueText(data.outfit[key])])
  }

  return rows
}

/**
 * 🕒 按中文环境格式化查询时间。
 */
export function formatDate(date: Date): string {
  return date.toLocaleString('zh-CN', { hour12: false })
}
