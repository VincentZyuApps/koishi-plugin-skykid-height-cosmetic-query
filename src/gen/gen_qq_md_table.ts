import type { HeightResult } from '../types'
import { formatDate, generateHeightRows } from './gen_text'

const basicLabels = ['好友码', 'UUID', '体型值', '身高值', '当前身高', '最高身高', '最矮身高']

/**
 * 📊 生成 QQ Markdown 表格模式内容。
 */
export function generateQqMdTable(result: HeightResult): string {
  const rows = generateHeightRows(result)
  const basicRows = rows.filter(([label]) => basicLabels.includes(label))
  const outfitRows = rows.filter(([label]) => !basicLabels.includes(label))

  return [
    '# 🌌 光崽身高装扮查询',
    '',
    ...(result.dryRun ? ['> 🧪 假数据测试模式，仅用于测试输出样式，不是真实查询结果。', ''] : []),
    `> ✅ 状态：${escapeMarkdown(result.message)}`,
    `> 🕒 查询时间：${escapeMarkdown(formatDate(result.queriedAt))}`,
    '',
    '## 📏 身高信息',
    '',
    '| 项目 | 内容 |',
    '| --- | --- |',
    ...basicRows.map(([label, value]) => `| ${escapeTableCell(label)} | ${escapeTableCell(value)} |`),
    '',
    ...(outfitRows.length ? [
      '## 🧢 装扮信息',
      '',
      '| 部位 | 装扮 |',
      '| --- | --- |',
      ...outfitRows.map(([label, value]) => `| ${escapeTableCell(label)} | ${escapeTableCell(value)} |`),
      '',
    ] : []),
    result.dryRun
      ? '> 🧪 这是假数据，仅用于测试输出样式。'
      : '> ⚠️ 默认 action=delete，会消费一次性好友码；数据仅供参考。',
  ].join('\n')
}

/**
 * 🧼 转义普通 Markdown 文本。
 */
function escapeMarkdown(value: string) {
  return String(value).replace(/[\\`*_{}[\]()#+\-.!|>]/g, '\\$&')
}

/**
 * 🧼 转义 Markdown 表格单元格。
 */
function escapeTableCell(value: string) {
  return escapeMarkdown(value).replace(/\n/g, '<br/>')
}
