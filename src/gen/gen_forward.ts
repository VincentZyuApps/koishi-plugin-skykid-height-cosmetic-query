import type { HeightResult } from '../types'
import { formatDate, generateHeightRows } from './gen_text'

/**
 * 📨 生成 OneBot 合并转发 XML 消息。
 */
export function generateHeightForward(result: HeightResult): string {
  const rows = generateHeightRows(result)

  /**
   * 🧱 拼接单条合并转发节点。
   */
  const addMessage = (authorName: string, content: string) => `
    <message>
      <author name="${escapeAttr(authorName)}"/>
      ${escapeText(content)}
    </message>`

  const basic = [
    ...(result.dryRun ? ['🧪⚠️ 假数据测试模式：仅用于测试合并转发格式，不是真实查询结果。'] : []),
    `✅ 状态：${result.message}`,
    `🧾 好友码：${result.code}`,
    `🆔 UUID：${rows.find(([label]) => label === 'UUID')?.[1] || '未知'}`,
    `🕒 查询时间：${formatDate(result.queriedAt)}`,
  ].join('\n')

  const heightRows = rows
    .filter(([label]) => ['体型值', '身高值', '当前身高', '最高身高', '最矮身高'].includes(label))
    .map(([label, value]) => `📏 ${label}：${value}`)
    .join('\n')

  const outfitRows = rows
    .filter(([label]) => !['好友码', 'UUID', '体型值', '身高值', '当前身高', '最高身高', '最矮身高'].includes(label))
    .map(([label, value]) => `🏷️ ${label}：${value}`)
    .join('\n')

  const messages = [
    addMessage('🌌 光遇身高查询', basic),
    addMessage('📏 身高信息', heightRows),
    outfitRows ? addMessage('🎒 装扮信息', outfitRows) : '',
    addMessage('⚠️ 说明', result.dryRun ? '🧪 这是假数据，仅用于测试输出样式。' : '⚠️ 该接口默认 action=delete，会消费一次性好友码。\n📌 数据仅供参考，请以游戏内实际情况为准。'),
  ].filter(Boolean).join('\n')

  return `<message forward>\n${messages}\n</message>`
}

/**
 * 🧼 转义 XML 文本内容。
 */
function escapeText(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

/**
 * 🔐 转义 XML 属性内容。
 */
function escapeAttr(value: string): string {
  return escapeText(value).replace(/"/g, '&quot;')
}
