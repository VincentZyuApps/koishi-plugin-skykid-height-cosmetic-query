import { Context, h } from 'koishi'
import type { Config } from '../config'
import { buildHeightKeyboard } from '../qq/keyboard'
import { isQQOfficialSession, sendQQMarkdownWithGuard } from '../qq/sender'
import { resolveRepoImageUrl } from '../utils/cdn'
import { buildCommandAliases, buildCommandName, withQuote } from './common'

/**
 * ❔ 注册身高装扮查询帮助命令。
 */
export function registerHelpCommand(ctx: Context, config: Config) {
  const helpCommandName = buildCommandName(config, config.helpCommandSuffix)
  const command = ctx.command(helpCommandName, '查看光崽身高装扮查询帮助')
  const aliases = buildCommandAliases(config, config.helpCommandSuffix)
  if (aliases.length) command.alias(...aliases)
  command
    .action(async ({ session }) => {
      try {
        let guideImageUrl: string | undefined
        if (config.helpGuideImageShow && config.helpGuideImagePath) {
          guideImageUrl = await resolveRepoImageUrl(config, config.helpGuideImagePath)
        }

        if (session) {
          const isQQ = isQQOfficialSession(session, config)
          if (config.qqMarkdownHelpCommand && isQQ) {
            const markdown = generateHelpMarkdown(config, guideImageUrl)
            const keyboard = buildHeightKeyboard(config)
            await sendQQMarkdownWithGuard(ctx, session, config, markdown, keyboard, 'help-markdown')
            return
          }

          const rawMarkdown = generateHelpMarkdown(config)
          const quoted = withQuote(session, config, rawMarkdown)
          const contentElements: (string | h)[] = Array.isArray(quoted) ? [...quoted] : [quoted]
          if (guideImageUrl) {
            contentElements.push(h.image(guideImageUrl))
          }
          return contentElements
        }

        return generateHelpMarkdown(config, guideImageUrl)
      } catch (error) {
        ctx.logger('skykid-height-cosmetic-query').error('获取帮助指令执行异常:', error)
        return '❌ 获取帮助失败，请稍后重试。'
      }
    })

  const barePrefix = String(config.commandPrefix || '测身高').trim()
  if (barePrefix) {
    const bareCommand = ctx.command(barePrefix, '查看光崽身高装扮查询帮助（快捷指令）')
    const bareAliases = (Array.isArray(config.commandPrefixAliases) ? config.commandPrefixAliases : [])
      .map((item) => String(item || '').trim())
      .filter((item) => item && item !== barePrefix)
    if (bareAliases.length) bareCommand.alias(...bareAliases)

    bareCommand.action(async ({ session }) => {
      if (!session) return generateHelpMarkdown(config)
      return session.execute(helpCommandName)
    })
  }
}

/**
 * 🧾 生成统一的 Markdown 帮助文档（单一信源：在 QQ 平台为原生 Markdown 卡片，其他平台为原始 Markdown 文本）。
 */
function generateHelpMarkdown(config: Config, guideImageUrl?: string): string {
  const targetPlaceholder = '`[好友码 / 二维码 / 链接]`'
  const prefixAliases = Array.isArray(config.commandPrefixAliases)
    ? config.commandPrefixAliases.filter((item) => String(item || '').trim())
    : []

  const headerLines = [
    '# 🌌 光崽身高装扮查询指令帮助',
    '',
    `> 💡 **快捷触发**：直接发送 \`${config.commandPrefix}\` 即可唤出本帮助。`,
    '> 每一个前缀均可与以下指令后缀自由组合使用。',
  ]

  const prefixSection = [
    '### 📌 触发前缀',
    `> **默认前缀**：\`${config.commandPrefix}\``,
    ...(prefixAliases.length ? [`> **前缀别名**：${prefixAliases.map((a) => `\`${a}\``).join(' / ')}`] : []),
  ]

  const commandLines = [
    '### 🧭 可用指令',
    `- 🖼️ **Puppeteer 出图**：\`${buildCommandName(config, config.pptrCommandSuffix)}\` ${targetPlaceholder}`,
    `- ⚡ **Takumi wasm 出图**：\`${buildCommandName(config, config.takumiCommandSuffix)}\` ${targetPlaceholder}`,
    `- 🌐 **API 远程出图**：\`${buildCommandName(config, config.apiCommandSuffix)}\` ${targetPlaceholder}`,
    `- 💫 **QQ Markdown 卡片**：\`${buildCommandName(config, config.qqMdStyleCommandSuffix)}\` ${targetPlaceholder}`,
    `- 📊 **QQ Markdown 表格**：\`${buildCommandName(config, config.qqMdTableCommandSuffix)}\` ${targetPlaceholder}`,
    `- 📝 **纯文本输出**：\`${buildCommandName(config, config.textCommandSuffix)}\` ${targetPlaceholder}`,
    `- 📨 **OneBot 合并转发**：\`${buildCommandName(config, config.forwardCommandSuffix)}\` ${targetPlaceholder}`,
    `- ❔ **查看帮助**：\`${buildCommandName(config, config.helpCommandSuffix)}\``,
  ]

  const optionLines = [
    '### ⚙️ 可选参数',
    '> 🧪 **测试模式**：追加 `--dry` 或 `--dryrun`（跳过请求，不消耗好友码）',
    '> 🌙 **深色模式**：追加 `-d true` 或 `--dark dark`（Puppeteer / Takumi 支持）',
    '> 🛠️ **调试详情**：追加 `-v` 或 `--verbose` 输出调用详情',
    '> ⚠️ *默认 queryAction=delete，会消费一次性好友码。*',
  ]

  const sections = [
    headerLines.join('\n'),
    prefixSection.join('\n'),
    commandLines.join('\n'),
    optionLines.join('\n'),
  ]

  if (guideImageUrl) {
    const width = config.helpGuideImageWidth ? `#${config.helpGuideImageWidth}` : ''
    const height = config.helpGuideImageHeight ? `#${config.helpGuideImageHeight}` : ''
    const sizePart = [width, height].filter(Boolean).join(' ')
    const altText = sizePart ? ` ${sizePart}` : ''
    sections.push(`---\n\n### 📱 线下活动外观二维码获取指引\n\n![${altText}](${guideImageUrl})`)
  }

  if (config.outfitFeedbackNotice) {
    sections.push(`---\n\n> ${config.outfitFeedbackNotice}`)
  }

  return sections.join('\n\n')
}
