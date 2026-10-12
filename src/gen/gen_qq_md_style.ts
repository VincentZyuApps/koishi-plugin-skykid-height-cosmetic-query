import type { HeightResult } from '../types'
import { formatDate, generateHeightRows } from './gen_text'

const heightLabels = ['体型值', '身高值', '当前身高', '最高身高', '最矮身高']
const excludedOutfitLabels = ['好友码', 'UUID', ...heightLabels]

/**
 * 💫 生成 QQ Markdown 格式风格内容。
 */
export function generateQqMdStyle(result: HeightResult, feedbackNotice?: string): string {
  const rows = generateHeightRows(result)
  const get = (label: string) => rows.find(([key]) => key === label)?.[1] || '未知'
  const outfitRows = rows.filter(([label]) => !excludedOutfitLabels.includes(label))

  return [
    '# 🌌 光崽身高装扮查询',
    '',
    ...(result.dryRun ? ['> 🧪 假数据测试模式，仅用于测试输出样式，不是真实查询结果。', ''] : []),
    `> ✅ ${escapeMarkdown(result.message)}`,
    `> 🕒 ${escapeMarkdown(formatDate(result.queriedAt))}`,
    '',
    '## 🧾 身份信息',
    '',
    `- **好友码**：${escapeMarkdown(get('好友码'))}`,
    `- **UUID**：${escapeMarkdown(get('UUID'))}`,
    '',
    '## 📏 身高信息',
    '',
    `#### 当前身高`,
    `**${escapeMarkdown(get('当前身高'))}**`,
    '',
    ...heightLabels
      .filter((label) => label !== '当前身高')
      .flatMap((label) => [
        `- **${escapeMarkdown(label)}**：\`${escapeInlineCode(get(label))}\``,
      ]),
    '',
    ...(outfitRows.length ? [
      '## 🧢 装扮信息',
      '',
      ...outfitRows.map(([label, value]) => `- **${escapeMarkdown(label)}**：${escapeMarkdown(value)}`),
      '',
    ] : []),
    result.dryRun
      ? '> 🧪 这是假数据，仅用于测试输出样式。'
      : '> ⚠️ 默认 action=delete，会消费一次性好友码；数据仅供参考。',
    ...(feedbackNotice ? ['', `> ${escapeMarkdown(feedbackNotice)}`] : []),
  ].join('\n')
}

/**
 * 🧼 转义普通 Markdown 文本。
 */
function escapeMarkdown(value: string) {
  return String(value).replace(/[\\`*_{}[\]()#+\-.!|>]/g, '\\$&')
}

/**
 * 🧼 转义 inline code 文本。
 */
function escapeInlineCode(value: string) {
  return String(value).replace(/`/g, '\\`')
}
