import { existsSync, readFileSync } from 'fs'
import { Renderer } from '@takumi-rs/wasm/node'
import { container, text } from '@takumi-rs/helpers'
import type { HeightResult, RenderTheme } from '../types'
import { formatDate, generateHeightRows } from './gen_text'

const rendererCache = new Map<string, Renderer>()

/**
 * 🧠 按字体路径缓存 Takumi Renderer，避免重复初始化。
 */
function getRenderer(fontPath?: string): Renderer {
  const key = fontPath && existsSync(fontPath) ? fontPath : '__default__'
  const cached = rendererCache.get(key)
  if (cached) return cached
  const renderer = new Renderer({ fonts: key === '__default__' ? [] : [readFileSync(key)] })
  rendererCache.set(key, renderer)
  return renderer
}

/**
 * ⚡ 使用 Takumi wasm 把查询结果渲染成 PNG 图片。
 */
export async function renderHeightTakumi(
  result: HeightResult,
  options: { width: number; darkMode: boolean; fontPath?: string },
): Promise<Buffer> {
  const rows = generateHeightRows(result)
  const get = (label: string) => rows.find(([key]) => key === label)?.[1] || '未知'
  const currentHeight = compactNumber(get('当前身高'), 5)
  const bodySize = compactNumber(get('体型值'), 6)
  const heightValue = compactNumber(get('身高值'), 5)
  const maxHeight = compactNumber(get('最高身高'), 5)
  const minHeight = compactNumber(get('最矮身高'), 5)
  const outfitRows = rows.filter(([label]) => !['好友码', 'UUID', '体型值', '身高值', '当前身高', '最高身高', '最矮身高'].includes(label))
  const width = Math.max(480, Math.round(options.width * 0.96))
  const rootPadding = 20
  const rootGap = 12
  const cardGap = 10
  const legacyRootPadding = 24
  const legacyRootGap = 14
  const dryBannerHeight = result.dryRun ? 54 : 0
  const headerHeight = 118
  const identityHeight = 86
  const heightSectionHeight = 24 + 10 + 128 + 10 + 78
  const outfitRowCount = Math.ceil(outfitRows.length / 2)
  const outfitHeight = outfitRows.length ? 24 + 10 + outfitRowCount * 76 + Math.max(0, outfitRowCount - 1) * 12 : 0
  const noteHeight = 24
  const childCount = 4 + (result.dryRun ? 1 : 0) + (outfitRows.length ? 1 : 0)
  const height = legacyRootPadding * 2
    + dryBannerHeight
    + headerHeight
    + identityHeight
    + heightSectionHeight
    + outfitHeight
    + noteHeight
    + legacyRootGap * (childCount - 1)
  const t = theme(options.darkMode)

  const root = container({
    style: {
      width,
      minHeight: height,
      display: 'flex',
      flexDirection: 'column',
      gap: rootGap,
      padding: rootPadding,
      backgroundColor: t.bg,
    },
    children: [
      ...(result.dryRun ? [container({
        style: {
          backgroundColor: options.darkMode ? '#4b2d1e' : '#fff0df',
          borderColor: '#df7b2d',
          borderWidth: 2,
          borderRadius: 8,
          padding: 10,
        },
        children: [
          text('假数据测试模式 · 仅用于测试图片样式，不是真实查询结果', {
            fontSize: 20,
            fontWeight: 360,
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
          padding: 20,
          display: 'flex',
          flexDirection: 'column',
          gap: 7,
        },
        children: [
          text('光崽身高装扮查询', { fontSize: 40, fontWeight: 340, color: t.primary }),
          text(`${stripEmoji(result.message)} · ${formatDate(result.queriedAt)}`, { fontSize: 16, fontWeight: 360, color: t.muted }),
        ],
      }),
      container({
        style: {
          display: 'flex',
          flexDirection: 'row',
          gap: cardGap,
        },
        children: [
          infoCard('好友码', get('好友码'), t, (width - rootPadding * 2 - cardGap) * 0.382, 80, 21),
          infoCard('UUID', get('UUID'), t, (width - rootPadding * 2 - cardGap) * 0.618, 80, 19),
        ],
      }),
      container({
        style: {
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
        },
        children: [
          text('身高信息', { fontSize: 21, fontWeight: 380, color: t.primary }),
          container({
            style: {
              display: 'flex',
              flexDirection: 'row',
              gap: cardGap,
            },
            children: [
              metricCard('最高身高', maxHeight, t, (width - rootPadding * 2 - cardGap * 2) * 0.29, false),
              metricCard('当前身高', currentHeight, t, (width - rootPadding * 2 - cardGap * 2) * 0.42, true),
              metricCard('最矮身高', minHeight, t, (width - rootPadding * 2 - cardGap * 2) * 0.29, false),
            ],
          }),
          container({
            style: {
              display: 'flex',
              flexDirection: 'row',
              gap: cardGap,
            },
            children: [
              infoCard('体型值', bodySize, t, (width - rootPadding * 2 - cardGap) / 2, 74, 26, true),
              infoCard('身高值', heightValue, t, (width - rootPadding * 2 - cardGap) / 2, 74, 26, true),
            ],
          }),
        ],
      }),
      ...(outfitRows.length ? [container({
        style: {
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
        },
        children: [
          text('装扮信息', { fontSize: 21, fontWeight: 380, color: t.primary }),
          container({
            style: {
              display: 'flex',
              flexDirection: 'row',
              flexWrap: 'wrap',
              gap: cardGap,
            },
            children: outfitRows.map(([label, value]) => container({
              style: {
                width: (width - rootPadding * 2 - cardGap) / 2,
                minHeight: 72,
                backgroundColor: t.card,
                borderColor: t.border,
                borderWidth: 1,
                borderRadius: 10,
                padding: 11,
                display: 'flex',
                flexDirection: 'column',
                gap: 5,
              },
              children: [
                text(label, { fontSize: 14, fontWeight: 360, color: t.muted }),
                text(stripEmoji(value), { fontSize: 22, fontWeight: 380, color: t.text }),
              ],
            })),
          }),
        ],
      })] : []),
      text(result.dryRun ? '这是假数据，仅用于测试输出样式。' : '说明：该接口默认 action=delete，会消费一次性好友码。数据仅供参考。', {
        fontSize: 16,
        color: t.accent,
        marginTop: 2,
      }),
    ],
  })

  return Buffer.from(getRenderer(options.fontPath).render(root, { width, height, format: 'png' }))
}

/**
 * 🧾 构建 Takumi 信息卡片组件。
 */
function infoCard(label: string, value: string, t: RenderTheme, width: number, minHeight: number, valueSize: number, italic = false) {
  return container({
          style: {
            width,
            minHeight,
            backgroundColor: t.card,
            borderColor: t.border,
            borderWidth: 1,
            borderRadius: 10,
            padding: 12,
            display: 'flex',
            flexDirection: 'column',
            gap: 6,
          },
          children: [
            text(label, { fontSize: 14, fontWeight: 360, color: t.muted }),
            text(value, { fontSize: valueSize, fontWeight: 380, fontStyle: italic ? 'italic' : 'normal', color: t.text }),
          ],
        })
}

/**
 * 📏 构建 Takumi 身高数值卡片组件。
 */
function metricCard(label: string, value: string, t: RenderTheme, width: number, main: boolean) {
  return container({
    style: {
      width,
      minHeight: main ? 122 : 112,
      backgroundColor: main ? t.panel : t.card,
      borderColor: main ? t.primary : t.border,
      borderWidth: main ? 2 : 1,
      borderRadius: 12,
      padding: 12,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      gap: 8,
    },
    children: [
      text(label, { fontSize: 15, fontWeight: 360, color: t.muted, textAlign: 'center' }),
      text(value, { fontSize: main ? 40 : 28, fontWeight: main ? 340 : 380, fontStyle: main ? 'normal' : 'italic', color: t.text, textAlign: 'center' }),
    ],
  })
}

/**
 * 🧹 移除 emoji，避免 wasm 字体渲染缺字。
 */
function stripEmoji(value: string): string {
  return value
    .replace(/\p{Extended_Pictographic}/gu, '')
    .replace(/[\uFE0E\uFE0F\u200D]/g, '')
    .trim()
}

/**
 * 🔢 压缩小数显示，去掉无意义的尾随 0。
 */
function compactNumber(value: string, decimals: number): string {
  const raw = value.trim()
  const number = Number(raw)
  if (!Number.isFinite(number)) return value
  if (!raw.includes('.') && !/[eE]/.test(raw)) return raw
  return number
    .toFixed(decimals)
    .replace(/(\.\d*?[1-9])0+$/, '$1')
    .replace(/\.0+$/, '')
}

/**
 * 🌗 生成 Takumi 浅色或深色主题变量。
 */
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
