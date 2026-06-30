import fs from 'fs'
import type { Context } from 'koishi'
import {} from 'koishi-plugin-puppeteer'
import type { HeightResult } from '../types'
import { formatDate, generateHeightRows } from './gen_text'

export async function renderHeightPptr(
  ctx: Context,
  result: HeightResult,
  options: {
    width: number
    imageType: 'png' | 'jpeg' | 'webp'
    quality: number
    fontPath?: string
    darkMode?: boolean
  },
): Promise<string> {
  if (!ctx.puppeteer) throw new Error('Puppeteer 服务未启用')
  const page = await ctx.puppeteer.page()
  try {
    const html = generateHtml(result, options)
    await page.setViewport({ width: options.width, height: 800, deviceScaleFactor: 1 })
    await page.setContent(html)
    await page.waitForSelector('body', { timeout: 10000 })
    await page.evaluate(() => document.fonts?.ready).catch(() => undefined)
    const height = await page.evaluate(() => document.documentElement.scrollHeight)
    await page.setViewport({ width: options.width, height, deviceScaleFactor: 1 })
    await page.evaluate(() => document.fonts?.ready).catch(() => undefined)
    const screenshotOptions: any = { encoding: 'base64', type: options.imageType }
    if (options.imageType !== 'png') screenshotOptions.quality = options.quality
    return await page.screenshot(screenshotOptions)
  } finally {
    await page.close()
  }
}

function generateHtml(result: HeightResult, options: { width: number; fontPath?: string; darkMode?: boolean }): string {
  const rows = generateHeightRows(result)
  const t = theme(Boolean(options.darkMode))
  const get = (label: string) => rows.find(([key]) => key === label)?.[1] || '未知'
  const outfitRows = rows.filter(([label]) => !['好友码', 'UUID', '体型值', '身高值', '当前身高', '最高身高', '最矮身高'].includes(label))
  const fontFace = options.fontPath && fs.existsSync(options.fontPath)
    ? `@font-face{font-family:'CustomFont';src:url(data:font/truetype;charset=utf-8;base64,${fs.readFileSync(options.fontPath).toString('base64')}) format('truetype');}`
    : ''
  const outfitHtml = outfitRows.map(([label, value], index) => `
    <div class="outfit item-${index % 4}">
      <div class="label">${escapeHtml(label)}</div>
      <div class="outfit-value">${escapeHtml(value)}</div>
    </div>`).join('')

  return `<!doctype html>
<html>
<head>
<meta charset="utf-8">
<style>
${fontFace}
*{box-sizing:border-box}
body{margin:0;width:${options.width}px;padding:26px;background:${t.bg};color:${t.text};font-family:${fontFace ? "'CustomFont'," : ''}"Microsoft YaHei",Arial,sans-serif;line-height:1.2}
.wrap{background:${t.panel};backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);border:1px solid ${t.panelBorder};border-radius:20px;padding:24px;box-shadow:${t.panelShadow}}
.header{background:${t.glass};backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);border:1px solid ${t.panelBorder};border-radius:15px;padding:22px 24px 18px;margin-bottom:18px;box-shadow:${t.softShadow};display:flex;align-items:flex-end;justify-content:space-between;gap:18px}
.title{font-size:46px;font-weight:900;color:${t.primary};line-height:1.05;text-shadow:${t.titleShadow};filter:drop-shadow(0 2px 4px rgba(0,0,0,.18))}
.sub{font-size:15px;font-weight:700;color:${t.muted};white-space:nowrap;text-shadow:${t.textHalo}}
.section{margin-top:16px;background:${t.glass};backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);border:1px solid ${t.panelBorder};border-radius:15px;padding:16px;box-shadow:${t.softShadow}}
.section-title{font-size:20px;font-weight:900;color:${t.heading};margin:0 0 12px 2px;letter-spacing:0;text-shadow:${t.textHalo}}
.basic{display:grid;grid-template-columns:0.618fr 1fr;gap:12px}
.card{border:1px solid ${t.border};background:${t.card};backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);border-radius:10px;padding:14px 16px;box-shadow:0 3px 12px rgba(31,38,135,.10)}
.label{font-size:13px;font-weight:700;color:${t.muted};margin-bottom:7px}
.code{font-size:22px;font-weight:850;color:${t.textStrong};letter-spacing:.02em;text-shadow:${t.textHalo}}
.uuid{font-size:15px;font-weight:750;color:${t.textSoft};white-space:nowrap;overflow:hidden;text-overflow:ellipsis;letter-spacing:0}
.metrics{display:grid;grid-template-columns:1fr 1.22fr 1fr;gap:12px;align-items:stretch}
.metric{min-height:126px;display:flex;flex-direction:column;justify-content:center;text-align:center}
.metric.side{background:${t.card}}
.metric.main{background:${t.metricMain};border-color:${t.metricBorder};box-shadow:inset 0 0 0 1px ${t.metricShadow},0 5px 20px ${t.metricGlow}}
.metric .label{margin-bottom:10px}
.metric-value{font-weight:850;color:${t.textStrong};line-height:1.05;word-break:break-all}
.metric.side .metric-value{font-size:27px;font-style:italic;text-shadow:${t.textHalo}}
.metric.main .metric-value{font-size:40px;text-shadow:${t.titleShadow}}
.minor-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;margin-top:12px}
.minor-value{font-size:25px;font-weight:850;color:${t.textStrong};font-style:italic;text-shadow:${t.textHalo}}
.outfit-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}
.outfit{min-height:78px;display:flex;flex-direction:column;justify-content:center;position:relative;overflow:hidden}
.outfit:before{content:"";position:absolute;left:0;top:0;bottom:0;width:4px;background:${t.primary};opacity:.55}
.outfit-value{font-size:22px;font-weight:850;color:${t.textStrong};line-height:1.2;text-shadow:${t.textHalo}}
.outfit.item-1,.outfit.item-2{background:${t.cardAlt}}
.outfit.item-3{background:${t.cardCool}}
.dry-banner{margin-bottom:16px;padding:13px 16px;border:2px solid #df7b2d;background:#fff0df;color:#7a3511;border-radius:8px;font-size:19px;font-weight:900;text-align:center}
.note{margin-top:18px;padding:11px 14px;border-left:4px solid ${t.noteBorder};background:${t.noteBg};color:${t.accent};font-size:14px;line-height:1.55}
</style>
</head>
<body>
<div class="wrap">
  ${result.dryRun ? '<div class="dry-banner">🧪⚠️ 假数据测试模式 · 仅用于测试图片样式，不是真实查询结果</div>' : ''}
  <div class="header">
    <div class="title">光遇身高查询</div>
    <div class="sub">${escapeHtml(result.message)} · ${escapeHtml(formatDate(result.queriedAt))}</div>
  </div>

  <div class="section">
    <div class="section-title">基本信息</div>
    <div class="basic">
      <div class="card">
        <div class="label">好友码</div>
        <div class="code">${escapeHtml(get('好友码'))}</div>
      </div>
      <div class="card">
        <div class="label">UUID</div>
        <div class="uuid">${escapeHtml(get('UUID'))}</div>
      </div>
    </div>
  </div>

  <div class="section">
    <div class="section-title">身高信息</div>
    <div class="metrics">
      <div class="card metric side">
        <div class="label">最高身高</div>
        <div class="metric-value">${escapeHtml(get('最高身高'))}</div>
      </div>
      <div class="card metric main">
        <div class="label">当前身高</div>
        <div class="metric-value">${escapeHtml(get('当前身高'))}</div>
      </div>
      <div class="card metric side">
        <div class="label">最矮身高</div>
        <div class="metric-value">${escapeHtml(get('最矮身高'))}</div>
      </div>
    </div>
    <div class="minor-grid">
      <div class="card">
        <div class="label">体型值</div>
        <div class="minor-value">${escapeHtml(get('体型值'))}</div>
      </div>
      <div class="card">
        <div class="label">身高值</div>
        <div class="minor-value">${escapeHtml(get('身高值'))}</div>
      </div>
    </div>
  </div>

  ${outfitHtml ? `<div class="section"><div class="section-title">装扮信息</div><div class="outfit-grid">${outfitHtml}</div></div>` : ''}
  <div class="note">${result.dryRun ? '🧪 这是假数据，仅用于测试输出样式。' : 'action=delete 会消费一次性好友码；数据仅供参考。'}</div>
</div>
</body>
</html>`
}

function escapeHtml(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

function theme(dark: boolean) {
  if (dark) {
    return {
      bg: 'linear-gradient(135deg,#10202a 0%,#163244 52%,#1d2a4a 100%)',
      panel: 'rgba(20,43,58,.72)',
      glass: 'rgba(255,255,255,.08)',
      panelBorder: 'rgba(255,255,255,.16)',
      card: 'rgba(31,58,73,.72)',
      cardAlt: '#1d3e4f',
      cardCool: '#21394f',
      border: '#336a82',
      primary: '#5CD4F9',
      heading: '#B9F0FF',
      accent: '#f3c36b',
      text: '#e6f0f2',
      textStrong: '#EAFBFF',
      textSoft: '#B7E8F5',
      muted: '#A5C7D2',
      metricMain: 'linear-gradient(180deg,rgba(41,112,140,.58) 0%,rgba(31,58,73,.72) 100%)',
      metricBorder: '#5CD4F9',
      metricShadow: 'rgba(92,212,249,.22)',
      metricGlow: 'rgba(92,212,249,.28)',
      noteBg: '#342f21',
      noteBorder: '#d99a22',
      panelShadow: '0 8px 32px rgba(0,0,0,.35)',
      softShadow: '0 4px 16px rgba(0,0,0,.18)',
      titleShadow: '0 0 14px rgba(92,212,249,.58),0 3px 15px rgba(0,0,0,.35)',
      textHalo: '0 1px 8px rgba(0,0,0,.25)',
    }
  }
  return {
    bg: 'linear-gradient(135deg,#BEEBFA 0%,#EFFAFF 48%,#D9ECFF 100%)',
    panel: 'rgba(255,255,255,.67)',
    glass: 'rgba(255,255,255,.22)',
    panelBorder: 'rgba(255,255,255,.46)',
    card: 'rgba(255,255,255,.48)',
    cardAlt: 'rgba(255,252,242,.44)',
    cardCool: 'rgba(236,248,252,.44)',
    border: 'rgba(92,212,249,.38)',
    primary: '#159CC4',
    heading: '#137EA0',
    accent: '#72501b',
    text: '#1e3034',
    textStrong: '#0F4254',
    textSoft: '#356B7B',
    muted: '#5C7E8A',
    metricMain: 'linear-gradient(135deg,rgba(190,239,255,.76),rgba(255,255,255,.62))',
    metricBorder: 'rgba(92,212,249,.72)',
    metricShadow: 'rgba(92,212,249,.18)',
    metricGlow: 'rgba(92,212,249,.30)',
    noteBg: '#fff8e6',
    noteBorder: '#d99a22',
    panelShadow: '0 8px 32px rgba(31,38,135,.26)',
    softShadow: '0 4px 16px rgba(31,38,135,.13)',
    titleShadow: '-2px -2px 0 rgba(255,255,255,.96),2px -2px 0 rgba(255,255,255,.96),-2px 2px 0 rgba(255,255,255,.96),2px 2px 0 rgba(255,255,255,.96),0 0 16px rgba(255,255,255,.82),0 4px 22px rgba(92,212,249,.48)',
    textHalo: '0 0 8px rgba(255,255,255,.75)',
  }
}
