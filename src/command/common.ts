import { Context, h, Session } from 'koishi'
import type { Config } from '../config'
import { logInfo } from '../utils/logger'
import { createDryRunHeightResult } from '../mock'
import { friendCodePattern, queryHeight } from '../query'
import type { HeightResult } from '../types'

export interface HeightCommandOptions {
  dryRun: boolean
  enableDarkMode?: boolean
  verbose: boolean
}

type CommandHandler = (result: HeightResult, elapsed: number, options: HeightCommandOptions) => Promise<string | h | (string | h)[]>
type CommandGuard = (session: Session, options: HeightCommandOptions) => string | void | Promise<string | void>

interface RegisterHeightCommandOptions {
  quote?: boolean
  guard?: CommandGuard
}

export function registerHeightCommand(
  ctx: Context,
  config: Config,
  commandName: string,
  description: string,
  aliases: string[],
  waitText: string,
  handler: CommandHandler,
  registerOptions: RegisterHeightCommandOptions = {},
) {
  ctx.command(`${commandName} <code:string>`, description)
    .alias(...aliases)
    .option('dryRun', '--dry, --dryrun 跳过后端请求，使用假数据测试输出样式')
    .option('enableDarkMode', '-d, --dark, --darkmode [enableDarkMode:string] 启用深色模式，可选值：true/false/on/off/dark/light/深色/浅色')
    .option('verbose', '-v, --verbose 在 session 和 console 打印详细参数信息')
    .action(async ({ session, options }, code) => {
      if (!session) return
      const dryRun = Boolean(options?.dryRun)
      const verbose = Boolean(options?.verbose)
      const enableDarkMode = parseBooleanOption(options?.enableDarkMode)
      const commandOptions: HeightCommandOptions = { dryRun, enableDarkMode, verbose }
      const detailMessage = `🧾 命令详情 command=${commandName}, platform=${session.platform}, channel=${session.channelId}, user=${session.userId}, rawCode=${code || ''}, dryRun=${dryRun}, enableDarkMode=${enableDarkMode ?? 'default'}, verbose=${verbose}`
      const reply = (message: string | h | (string | h)[]) => session.send(registerOptions.quote === false ? message : withQuote(session, config, message))
      logInfo(ctx, config, `📨 身高查询命令触发：${commandName}`, detailMessage, verbose)
      const guardMessage = await registerOptions.guard?.(session, commandOptions)
      if (guardMessage) {
        await reply(guardMessage)
        return
      }
      if (!code && !dryRun) {
        await reply(`🧭 请提供好友码，用法：${commandName} XXXX-XXXX-XXXX`)
        return
      }
      if (verbose) {
        await reply(`🛠️ 详细参数：\n${detailMessage}`)
      }

      const start = Date.now()
      let waitIds: string[] = []
      if (config.sendRunningTip) {
        waitIds = await reply(waitText)
      }

      try {
        const result = dryRun ? createDryRunHeightResult() : await queryHeight(ctx, config, code)
        const elapsed = Date.now() - start
        logInfo(ctx, config, `✅ 身高查询完成：${result.code}，耗时 ${elapsed}ms`, `✅ 查询完成 command=${commandName}, code=${result.code}, elapsed=${elapsed}ms, 开始生成输出`, verbose)
        const message = await handler(result, elapsed, commandOptions)
        logInfo(ctx, config, `🖼️ 身高查询输出生成完成：${commandName}`, `🖼️ 输出生成完成 command=${commandName}, code=${result.code}`, verbose)
        await reply(message)
      } catch (error) {
        ctx.logger.warn(`❌ 查询失败：${error instanceof Error ? error.message : String(error)}`)
        await reply(`❌ 查询失败：${error instanceof Error ? error.message : String(error)}`)
      } finally {
        if (waitIds[0]) {
          await session.bot.deleteMessage(session.channelId, waitIds[0]).catch(() => undefined)
        }
      }
    })
}

export function registerNaturalMatcher(
  ctx: Context,
  config: Config,
  commandNames: string[],
) {
  const escaped = commandNames.map(escapeRegExp).join('|')
  const pattern = new RegExp(`^\\s*[/!！。.]?\\s*(?:${escaped})\\s*[:：]?\\s*(${friendCodePattern})\\s*$`, 'i')

  ctx.middleware(async (session, next) => {
    const content = session.content || ''
    const match = pattern.exec(content)
    if (!match) return next()

    const commandName = config.pptrCommandName
    logInfo(ctx, config, `🧭 身高查询自然语言匹配成功`, `🧭 自然语言匹配成功 content=${JSON.stringify(content)}, execute=${commandName} ${match[1]}`)
    await session.execute(`${commandName} ${match[1]}`)
  }, true)
}

export function withQuote(session: Session, config: Config, message: string | h | (string | h)[]): string | h | (string | h)[] {
  if (!config.enableQuote || !session.messageId) return message
  const quote = h.quote(session.messageId)
  return Array.isArray(message) ? [quote, ...message] : [quote, message]
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function parseBooleanOption(value: unknown): boolean | undefined {
  if (value === undefined || value === null) return undefined
  if (typeof value === 'boolean') return value
  const normalized = String(value).trim().toLowerCase()
  if (!normalized || ['1', 'true', 'yes', 'on', 'enable', 'enabled', 'dark', '深色', '开启', '启用'].includes(normalized)) return true
  if (['0', 'false', 'no', 'off', 'disable', 'disabled', 'light', '浅色', '关闭', '禁用'].includes(normalized)) return false
  return true
}
