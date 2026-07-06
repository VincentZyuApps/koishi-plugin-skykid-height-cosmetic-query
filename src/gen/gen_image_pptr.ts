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
    <div class="gear gear-${index % 5}">
      <div class="gear-mark">${escapeHtml(firstChar(label))}</div>
      <div class="gear-copy">
        <div class="gear-label">${escapeHtml(label)}</div>
        <div class="gear-value">${escapeHtml(value)}</div>
      </div>
    </div>`).join('')

  return `<!doctype html>
<html>
<head>
<meta charset="utf-8">
<style>
${fontFace}
*{box-sizing:border-box}
html{margin:0;background:${t.pageBg}}
body{margin:0;width:${options.width}px;min-height:520px;padding:24px;background:${t.pageBg};color:${t.text};font-family:${fontFace ? "'CustomFont'," : ''}"Microsoft YaHei",Arial,sans-serif;line-height:1.2}
.scene{position:relative;min-height:520px;overflow:hidden;border-radius:22px;background:${t.sceneBg};box-shadow:${t.sceneShadow}}
.scene:before{content:"";position:absolute;inset:-90px;background:${t.sceneGlow};filter:blur(18px);opacity:.95}
.scene:after{content:"";position:absolute;inset:0;background:${t.sceneTexture};opacity:.88}
.panel{position:relative;z-index:1;margin:28px;padding:22px;border:1px solid ${t.panelBorder};border-radius:20px;background:${t.panel};backdrop-filter:blur(24px);-webkit-backdrop-filter:blur(24px);box-shadow:${t.panelShadow}}
.dry-banner{margin-bottom:14px;padding:10px 14px;border:1px solid #df7b2d;background:${t.dryBg};color:${t.dryText};border-radius:8px;font-size:16px;font-weight:900;text-align:center}
.header{display:flex;align-items:center;justify-content:space-between;gap:18px;margin-bottom:18px}
.brand{display:flex;align-items:center;gap:13px;min-width:0}
.brand-badge{width:58px;height:58px;border-radius:50%;display:flex;align-items:center;justify-content:center;flex:0 0 auto;background:${t.badgeBg};border:1px solid ${t.badgeBorder};box-shadow:${t.badgeShadow};color:${t.badgeText};font-size:16px;font-weight:950}
.brand-copy{min-width:0}
.title{font-size:38px;font-weight:950;color:${t.title};line-height:1.05;text-shadow:${t.titleShadow};letter-spacing:0}
.subtitle{margin-top:6px;font-size:14px;font-weight:750;color:${t.muted};white-space:nowrap;overflow:hidden;text-overflow:ellipsis;text-shadow:${t.textHalo}}
.stamp{flex:0 0 auto;text-align:right;font-size:13px;font-weight:800;color:${t.stampText};background:${t.stampBg};border:1px solid ${t.panelBorder};border-radius:999px;padding:9px 13px;box-shadow:${t.softShadow}}
.hero{display:grid;grid-template-columns:minmax(0,.9fr) minmax(0,1.1fr);gap:16px;align-items:stretch}
.height-stage{position:relative;min-height:264px;padding:24px;border:1px solid ${t.heroBorder};border-radius:18px;background:${t.heroBg};overflow:hidden;box-shadow:${t.softShadow}}
.height-stage:before{content:"";position:absolute;right:-52px;top:-52px;width:168px;height:168px;border-radius:50%;background:${t.heroOrb};filter:blur(1px)}
.height-stage:after{content:"";position:absolute;left:24px;right:24px;bottom:18px;height:1px;background:${t.rule}}
.eyebrow{position:relative;font-size:15px;font-weight:900;color:${t.accent};text-shadow:${t.textHalo}}
.height-value{position:relative;margin-top:12px;font-size:68px;font-weight:950;line-height:.95;color:${t.heightText};text-shadow:${t.heightShadow};word-break:break-all}
.height-caption{position:relative;margin-top:14px;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:9px}
.mini{min-width:0;padding:10px 12px;border-radius:10px;background:${t.miniBg};border:1px solid ${t.miniBorder}}
.mini-label{font-size:12px;font-weight:750;color:${t.muted};margin-bottom:5px}
.mini-value{font-size:19px;font-weight:900;color:${t.textStrong};line-height:1.05;overflow-wrap:anywhere;text-shadow:${t.textHalo}}
.identity{position:relative;margin-top:16px;display:grid;gap:8px}
.identity-row{display:grid;grid-template-columns:58px minmax(0,1fr);gap:8px;align-items:center;font-size:13px}
.identity-key{font-weight:850;color:${t.muted}}
.identity-value{min-width:0;color:${t.textSoft};font-weight:800;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.metric-board{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}
.metric{min-height:126px;padding:17px 16px;border:1px solid ${t.cardBorder};border-radius:14px;background:${t.card};box-shadow:${t.softShadow};display:flex;flex-direction:column;justify-content:center}
.metric.primary{grid-column:span 2;min-height:104px;background:${t.metricWide};border-color:${t.metricBorder}}
.metric-label{font-size:13px;font-weight:850;color:${t.muted};margin-bottom:9px}
.metric-value{font-size:30px;font-weight:950;color:${t.textStrong};line-height:1.05;overflow-wrap:anywhere;text-shadow:${t.textHalo}}
.metric.primary .metric-value{font-size:34px;color:${t.heightText}}
.bar{height:7px;border-radius:999px;margin-top:13px;background:${t.barTrack};overflow:hidden}
.bar:before{content:"";display:block;width:68%;height:100%;border-radius:inherit;background:${t.barFill};box-shadow:${t.barGlow}}
.section{margin-top:16px;border:1px solid ${t.panelBorder};border-radius:16px;background:${t.sectionBg};padding:16px;box-shadow:${t.softShadow}}
.section-head{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:12px}
.section-title{font-size:19px;font-weight:950;color:${t.heading};text-shadow:${t.textHalo}}
.section-count{font-size:12px;font-weight:850;color:${t.muted};background:${t.countBg};border:1px solid ${t.panelBorder};border-radius:999px;padding:5px 9px}
.gear-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px}
.gear{min-width:0;min-height:72px;display:flex;align-items:center;gap:10px;padding:10px;border:1px solid ${t.cardBorder};border-radius:12px;background:${t.gearBg};overflow:hidden}
.gear-mark{width:38px;height:38px;border-radius:11px;display:flex;align-items:center;justify-content:center;flex:0 0 auto;font-size:18px;font-weight:950;color:${t.gearMarkText};background:${t.gearMarkBg};box-shadow:inset 0 0 0 1px ${t.gearMarkBorder}}
.gear-copy{min-width:0}
.gear-label{font-size:12px;font-weight:800;color:${t.muted};margin-bottom:5px}
.gear-value{font-size:17px;font-weight:900;color:${t.textStrong};line-height:1.18;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;text-shadow:${t.textHalo}}
.gear-1{background:${t.gearAlt}}
.gear-2{background:${t.gearCool}}
.gear-3{background:${t.gearWarm}}
.gear-4{background:${t.gearSoft}}
.footer{margin-top:14px;display:flex;align-items:center;justify-content:space-between;gap:14px;color:${t.footerText};font-size:13px;font-weight:750}
.slogan{min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.rule-mark{height:22px;width:86px;flex:0 0 auto;border-radius:999px;background:${t.footerMark};box-shadow:${t.footerGlow}}
@media (max-width: 760px){
  body{padding:18px}
  .panel{margin:18px;padding:18px}
  .header{align-items:flex-start;flex-direction:column}
  .stamp{text-align:left}
  .hero{grid-template-columns:1fr}
  .gear-grid{grid-template-columns:repeat(2,minmax(0,1fr))}
  .title{font-size:33px}
  .height-value{font-size:56px}
}
</style>
</head>
<body>
<div class="scene">
  <main class="panel">
    ${result.dryRun ? '<div class="dry-banner">DRY RUN · 假数据测试模式，仅用于测试图片样式，不是真实查询结果</div>' : ''}
    <div class="header">
      <div class="brand">
        <div class="brand-badge">SKY</div>
        <div class="brand-copy">
          <div class="title">光崽档案</div>
          <div class="subtitle">${escapeHtml(result.message)}</div>
        </div>
      </div>
      <div class="stamp">${escapeHtml(formatDate(result.queriedAt))}</div>
    </div>

    <section class="hero">
      <div class="height-stage">
        <div class="eyebrow">当前身高</div>
        <div class="height-value">${escapeHtml(get('当前身高'))}</div>
        <div class="height-caption">
          <div class="mini">
            <div class="mini-label">体型值</div>
            <div class="mini-value">${escapeHtml(get('体型值'))}</div>
          </div>
          <div class="mini">
            <div class="mini-label">身高值</div>
            <div class="mini-value">${escapeHtml(get('身高值'))}</div>
          </div>
        </div>
        <div class="identity">
          <div class="identity-row">
            <div class="identity-key">好友码</div>
            <div class="identity-value">${escapeHtml(get('好友码'))}</div>
          </div>
          <div class="identity-row">
            <div class="identity-key">UUID</div>
            <div class="identity-value">${escapeHtml(get('UUID'))}</div>
          </div>
        </div>
      </div>

      <div class="metric-board">
        <div class="metric primary">
          <div class="metric-label">身高状态</div>
          <div class="metric-value">${escapeHtml(get('当前身高'))}</div>
          <div class="bar"></div>
        </div>
        <div class="metric">
          <div class="metric-label">最高身高</div>
          <div class="metric-value">${escapeHtml(get('最高身高'))}</div>
        </div>
        <div class="metric">
          <div class="metric-label">最矮身高</div>
          <div class="metric-value">${escapeHtml(get('最矮身高'))}</div>
        </div>
      </div>
    </section>

    ${outfitHtml ? `<section class="section">
      <div class="section-head">
        <div class="section-title">装扮信息</div>
        <div class="section-count">${outfitRows.length} 项</div>
      </div>
      <div class="gear-grid">${outfitHtml}</div>
    </section>` : ''}

    <div class="footer">
      <div class="slogan">${result.dryRun ? '这是假数据，仅用于测试输出样式。' : 'action=delete 会消费一次性好友码 · 数据仅供参考，请以游戏内实际情况为准。'}</div>
      <div class="rule-mark"></div>
    </div>
  </main>
</div>
</body>
</html>`
}

function escapeHtml(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

function firstChar(value: string): string {
  return Array.from(value)[0] || '?'
}

function theme(dark: boolean) {
  if (dark) {
    return {
      pageBg: '#08151b',
      sceneBg: 'linear-gradient(135deg,#10202a 0%,#163244 52%,#1d2a4a 100%)',
      sceneGlow: 'radial-gradient(circle at 18% 18%,rgba(92,212,249,.36),transparent 28%),radial-gradient(circle at 78% 8%,rgba(112,156,255,.22),transparent 30%),radial-gradient(circle at 88% 82%,rgba(143,185,255,.24),transparent 32%)',
      sceneTexture: 'linear-gradient(90deg,rgba(255,255,255,.035) 1px,transparent 1px),linear-gradient(0deg,rgba(255,255,255,.025) 1px,transparent 1px)',
      sceneShadow: '0 12px 36px rgba(0,0,0,.34)',
      panel: 'rgba(15,34,46,.72)',
      panelBorder: 'rgba(255,255,255,.16)',
      panelShadow: '0 20px 46px rgba(0,0,0,.36)',
      heroBg: 'linear-gradient(145deg,rgba(25,65,82,.72),rgba(13,31,42,.74))',
      heroBorder: 'rgba(92,212,249,.36)',
      heroOrb: 'radial-gradient(circle,rgba(92,212,249,.22),transparent 68%)',
      title: '#EAFBFF',
      heading: '#B9F0FF',
      heightText: '#D6F4FF',
      accent: '#5CD4F9',
      text: '#e6f0f2',
      textStrong: '#EAFBFF',
      textSoft: '#B7E8F5',
      muted: '#A5C7D2',
      card: 'rgba(25,57,73,.72)',
      cardBorder: 'rgba(92,212,249,.24)',
      metricWide: 'linear-gradient(135deg,rgba(47,113,139,.58),rgba(28,56,76,.74))',
      metricBorder: 'rgba(92,212,249,.46)',
      sectionBg: 'rgba(255,255,255,.07)',
      miniBg: 'rgba(255,255,255,.08)',
      miniBorder: 'rgba(255,255,255,.12)',
      badgeBg: 'linear-gradient(135deg,rgba(92,212,249,.30),rgba(112,156,255,.22))',
      badgeBorder: 'rgba(234,251,255,.34)',
      badgeText: '#EAFBFF',
      badgeShadow: '0 0 22px rgba(92,212,249,.20)',
      stampBg: 'rgba(255,255,255,.08)',
      stampText: '#D9F5FF',
      countBg: 'rgba(255,255,255,.08)',
      gearBg: 'rgba(26,56,72,.70)',
      gearAlt: 'rgba(34,63,75,.70)',
      gearCool: 'rgba(29,59,86,.70)',
      gearWarm: 'rgba(30,62,88,.52)',
      gearSoft: 'rgba(37,67,69,.70)',
      gearMarkBg: 'rgba(92,212,249,.13)',
      gearMarkBorder: 'rgba(92,212,249,.22)',
      gearMarkText: '#CFF5FF',
      dryBg: '#342f21',
      dryText: '#ffd7b8',
      barTrack: 'rgba(255,255,255,.12)',
      barFill: 'linear-gradient(90deg,#5CD4F9,#709CFF)',
      barGlow: '0 0 16px rgba(92,212,249,.28)',
      rule: 'linear-gradient(90deg,rgba(92,212,249,.55),transparent)',
      footerText: '#A5C7D2',
      footerMark: 'linear-gradient(90deg,rgba(92,212,249,.64),rgba(112,156,255,.50))',
      footerGlow: '0 0 18px rgba(92,212,249,.18)',
      softShadow: '0 4px 16px rgba(0,0,0,.18)',
      titleShadow: '0 0 14px rgba(92,212,249,.34),0 3px 15px rgba(0,0,0,.35)',
      heightShadow: '0 0 18px rgba(92,212,249,.28),0 4px 18px rgba(0,0,0,.36)',
      textHalo: '0 1px 8px rgba(0,0,0,.25)',
    }
  }
  return {
    pageBg: '#D7EEF8',
    sceneBg: 'linear-gradient(135deg,#BEEBFA 0%,#F7FCFF 46%,#D9ECFF 100%)',
    sceneGlow: 'radial-gradient(circle at 14% 18%,rgba(92,212,249,.58),transparent 28%),radial-gradient(circle at 78% 10%,rgba(143,185,255,.48),transparent 28%),radial-gradient(circle at 86% 82%,rgba(112,156,255,.42),transparent 34%)',
    sceneTexture: 'linear-gradient(90deg,rgba(255,255,255,.32) 1px,transparent 1px),linear-gradient(0deg,rgba(255,255,255,.28) 1px,transparent 1px)',
    sceneShadow: '0 12px 34px rgba(68,120,151,.24)',
    panel: 'rgba(255,255,255,.62)',
    panelBorder: 'rgba(255,255,255,.46)',
    panelShadow: '0 18px 42px rgba(31,38,135,.22)',
    heroBg: 'linear-gradient(145deg,rgba(255,255,255,.62),rgba(225,248,255,.66))',
    heroBorder: 'rgba(92,212,249,.42)',
    heroOrb: 'radial-gradient(circle,rgba(92,212,249,.22),transparent 68%)',
    title: '#0F4254',
    heading: '#137EA0',
    heightText: '#0F4254',
    accent: '#137EA0',
    text: '#1e3034',
    textStrong: '#0F4254',
    textSoft: '#356B7B',
    muted: '#5C7E8A',
    card: 'rgba(255,255,255,.54)',
    cardBorder: 'rgba(92,212,249,.30)',
    metricWide: 'linear-gradient(135deg,rgba(190,239,255,.74),rgba(255,255,255,.64))',
    metricBorder: 'rgba(92,212,249,.64)',
    sectionBg: 'rgba(255,255,255,.34)',
    miniBg: 'rgba(255,255,255,.54)',
    miniBorder: 'rgba(92,212,249,.24)',
    badgeBg: 'linear-gradient(135deg,rgba(92,212,249,.32),rgba(143,185,255,.34))',
    badgeBorder: 'rgba(255,255,255,.72)',
    badgeText: '#0F4254',
    badgeShadow: '0 0 22px rgba(92,212,249,.18)',
    stampBg: 'rgba(255,255,255,.46)',
    stampText: '#356B7B',
    countBg: 'rgba(255,255,255,.50)',
    gearBg: 'rgba(255,255,255,.50)',
    gearAlt: 'rgba(235,248,255,.52)',
    gearCool: 'rgba(236,248,252,.54)',
    gearWarm: 'rgba(220,240,255,.56)',
    gearSoft: 'rgba(235,255,246,.52)',
    gearMarkBg: 'rgba(92,212,249,.16)',
    gearMarkBorder: 'rgba(92,212,249,.20)',
    gearMarkText: '#137EA0',
    dryBg: '#fff0df',
    dryText: '#7a3511',
    barTrack: 'rgba(92,212,249,.18)',
    barFill: 'linear-gradient(90deg,#159CC4,#5CD4F9)',
    barGlow: '0 0 16px rgba(92,212,249,.24)',
    rule: 'linear-gradient(90deg,rgba(92,212,249,.58),transparent)',
    footerText: '#5C7E8A',
    footerMark: 'linear-gradient(90deg,rgba(92,212,249,.70),rgba(143,185,255,.60))',
    footerGlow: '0 0 18px rgba(92,212,249,.16)',
    softShadow: '0 4px 16px rgba(31,38,135,.13)',
    titleShadow: '0 0 14px rgba(255,255,255,.86),0 4px 18px rgba(92,212,249,.26)',
    heightShadow: '-2px -2px 0 rgba(255,255,255,.90),2px -2px 0 rgba(255,255,255,.90),-2px 2px 0 rgba(255,255,255,.90),2px 2px 0 rgba(255,255,255,.90),0 7px 22px rgba(92,212,249,.28)',
    textHalo: '0 0 8px rgba(255,255,255,.75)',
  }
}
