import type { Context } from 'koishi'
import type { Config } from '../config'
import type { HeightResult } from '../types'
import { formatCosmeticIconMarkdown, resolveCosmeticIconUrl } from '../qq/cosmetic_icon'
import { formatDate, generateHeightRows, outfitLabels } from './gen_text'

const basicLabels = ['好友码', 'UUID', '体型值', '身高值', '当前身高', '最高身高', '最矮身高']

/**
 * 📊 生成 QQ Markdown 表格模式内容。
 */
export async function generateQqMdTable(
  ctx: Context,
  config: Config,
  result: HeightResult,
  feedbackNotice?: string,
): Promise<string> {
  const rows = generateHeightRows(result)
  const basicRows = rows.filter(([label]) => basicLabels.includes(label))
  const outfitData = (result.data.outfit || {}) as Record<string, string | undefined>

  const outfitTableRows: string[] = []
  if (typeof outfitData === 'object' && Object.keys(outfitData).length) {
    for (const [key, label] of outfitLabels) {
      const rawVal = outfitData[key]
      const displayVal = rows.find(([itemLabel]) => itemLabel === label)?.[1] || '未知'
      let iconPrefix = ''
      if (config.qqMdTableShowCosmeticIcon) {
        const iconUrl = await resolveCosmeticIconUrl(ctx, config, key, rawVal, config.qqMdCosmeticIconSize)
        iconPrefix = formatCosmeticIconMarkdown(label, iconUrl, config.qqMdCosmeticIconSize)
      }
      outfitTableRows.push(`| ${escapeTableCell(label)} | ${iconPrefix}${escapeTableCell(displayVal)} |`)
    }
  }

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
    ...(outfitTableRows.length ? [
      '## 🧢 装扮信息',
      '',
      '| 部位 | 装扮 |',
      '| --- | --- |',
      ...outfitTableRows,
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
 * 🧼 转义 Markdown 表格单元格。
 */
function escapeTableCell(value: string) {
  return escapeMarkdown(value).replace(/\n/g, '<br/>')
}
