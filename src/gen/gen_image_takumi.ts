import { existsSync, readFileSync } from 'fs'
import { Renderer } from '@takumi-rs/wasm/node'
import { container, text } from '@takumi-rs/helpers'
import type { HeightResult, RenderTheme } from '../types'
import { formatDate, generateHeightRows } from './gen_text'

const rendererCache = new Map<string, Renderer>()

function getRenderer(fontPath?: string): Renderer {
  const key = fontPath && existsSync(fontPath) ? fontPath : '__default__'
  const cached = rendererCache.get(key)
  if (cached) return cached
  const renderer = new Renderer({ fonts: key === '__default__' ? [] : [readFileSync(key)] })
  rendererCache.set(key, renderer)
  return renderer
}

export async function renderHeightTakumi(
  result: HeightResult,
  options: { width: number; darkMode: boolean; fontPath?: string },
): Promise<Buffer> {
  const rows = generateHeightRows(result)
  const get = (label: string) => rows.find(([key]) => key === label)?.[1] || '未知'
  const outfitRows = rows.filter(([label]) => !['好友码', 'UUID', '体型值', '身高值', '当前身高', '最高身高', '最矮身高'].includes(label))
  const width = options.width
  const dryBannerHeight = result.dryRun ? 60 : 0
  const outfitHeight = outfitRows.length ? 38 + Math.ceil(outfitRows.length / 2) * 88 : 0
  const height = 24 * 2 + dryBannerHeight + 132 + 86 + 38 + 128 + 88 + outfitHeight + 86 + 14 * 7
  const t = theme(options.darkMode)

  const root = container({
    style: {
      width,
      minHeight: height,
      display: 'flex',
      flexDirection: 'column',
      gap: 14,
      padding: 24,
      backgroundColor: t.bg,
    },
    children: [
      ...(result.dryRun ? [container({
        style: {
          backgroundColor: options.darkMode ? '#4b2d1e' : '#fff0df',
          borderColor: '#df7b2d',
          borderWidth: 2,
          borderRadius: 8,
          padding: 12,
        },
        children: [
          text('🧪⚠️ 假数据测试模式 · 仅用于测试图片样式，不是真实查询结果', {
            fontSize: 19,
            fontWeight: 900,
            color: options.darkMode ? '#ffd7b8' : '#7a3511',
            textAlign: 'center',
          }),
        ],
      })] : []),
      container({
        style: {
          backgroundColor: t.panel,
          borderColor: t.border,
          borderWidth: 1,
          borderRadius: 14,
          padding: 22,
          display: 'flex',
          flexDirection: 'column',
          gap: 9,
        },
        children: [
          text('光遇身高查询', { fontSize: 40, fontWeight: 900, color: t.primary }),
          text(`${result.message} · ${formatDate(result.queriedAt)}`, { fontSize: 15, fontWeight: 700, color: t.muted }),
        ],
      }),
      container({
        style: {
          display: 'flex',
          flexDirection: 'row',
          gap: 12,
        },
        children: [
          infoCard('好友码', get('好友码'), t, (width - 60) * 0.382, 86, 20),
          infoCard('UUID', get('UUID'), t, (width - 60) * 0.618, 86, 18),
        ],
      }),
      container({
        style: {
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
        },
        children: [
          text('身高信息', { fontSize: 19, fontWeight: 900, color: t.primary }),
          container({
            style: {
              display: 'flex',
              flexDirection: 'row',
              gap: 12,
            },
            children: [
              metricCard('最高身高', get('最高身高'), t, (width - 72) * 0.29, false),
              metricCard('当前身高', get('当前身高'), t, (width - 72) * 0.42, true),
              metricCard('最矮身高', get('最矮身高'), t, (width - 72) * 0.29, false),
            ],
          }),
          container({
            style: {
              display: 'flex',
              flexDirection: 'row',
              gap: 12,
            },
            children: [
              infoCard('体型值', get('体型值'), t, (width - 60) / 2, 78, 24, true),
              infoCard('身高值', get('身高值'), t, (width - 60) / 2, 78, 24, true),
            ],
          }),
        ],
      }),
      ...(outfitRows.length ? [container({
        style: {
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
        },
        children: [
          text('装扮信息', { fontSize: 19, fontWeight: 900, color: t.primary }),
          container({
            style: {
              display: 'flex',
              flexDirection: 'row',
              flexWrap: 'wrap',
              gap: 12,
            },
            children: outfitRows.map(([label, value]) => container({
              style: {
                width: (width - 24 * 2 - 12) / 2,
                minHeight: 76,
                backgroundColor: t.card,
                borderColor: t.border,
                borderWidth: 1,
                borderRadius: 10,
                padding: 13,
                display: 'flex',
                flexDirection: 'column',
                gap: 7,
              },
              children: [
                text(label, { fontSize: 13, fontWeight: 700, color: t.muted }),
                text(value, { fontSize: 21, fontWeight: 850, color: t.text }),
              ],
            })),
          }),
        ],
      })] : []),
      text(result.dryRun ? '🧪 这是假数据，仅用于测试输出样式。' : '说明：该接口默认 action=delete，会消费一次性好友码。数据仅供参考。', {
        fontSize: 15,
        color: t.accent,
        marginTop: 4,
      }),
    ],
  })

  return Buffer.from(getRenderer(options.fontPath).render(root, { width, height, format: 'png' }))
}

function infoCard(label: string, value: string, t: RenderTheme, width: number, minHeight: number, valueSize: number, italic = false) {
  return container({
          style: {
            width,
            minHeight,
            backgroundColor: t.card,
            borderColor: t.border,
            borderWidth: 1,
            borderRadius: 10,
            padding: 14,
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
          },
          children: [
            text(label, { fontSize: 14, color: t.muted }),
            text(value, { fontSize: valueSize, fontWeight: 800, fontStyle: italic ? 'italic' : 'normal', color: t.text }),
          ],
        })
}

function metricCard(label: string, value: string, t: RenderTheme, width: number, main: boolean) {
  return container({
    style: {
      width,
      minHeight: main ? 128 : 116,
      backgroundColor: main ? t.panel : t.card,
      borderColor: main ? t.primary : t.border,
      borderWidth: main ? 2 : 1,
      borderRadius: 12,
      padding: 14,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      gap: 10,
    },
    children: [
      text(label, { fontSize: 14, fontWeight: 700, color: t.muted, textAlign: 'center' }),
      text(value, { fontSize: main ? 38 : 26, fontWeight: 900, fontStyle: main ? 'normal' : 'italic', color: t.text, textAlign: 'center' }),
    ],
  })
}

function theme(dark: boolean): RenderTheme {
  if (dark) {
    return {
      bg: '#10202a',
      panel: '#142b3a',
      card: '#1f3a49',
      border: '#336a82',
      primary: '#5CD4F9',
      accent: '#f3c36b',
      text: '#eafbff',
      muted: '#a5c7d2',
    }
  }
  return {
    bg: '#eefaff',
    panel: '#ffffff',
    card: '#f7fcff',
    border: '#b9eaf8',
    primary: '#159cc4',
    accent: '#72501b',
    text: '#0f4254',
    muted: '#5c7e8a',
  }
}
