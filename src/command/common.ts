import { Context, h, Session } from 'koishi'
import type { Config } from '../config'
import { logInfo } from '../utils/logger'
import { createDryRunHeightResult } from '../mock'
import { queryHeight } from '../query'
import { sendStandaloneQQButton } from '../qq/sender'
import type { HeightResult } from '../types'

const UNKNOWN_OUTFIT_ID_PREVIEW_LENGTH = 3
const UNKNOWN_OUTFIT_ID_PATTERN = /(未知装扮)(\s*[（(]\s*)(\d+)(\s*[）)])/g

export interface HeightCommandOptions {
  dryRun: boolean
  enableDarkMode?: boolean
  verbose: boolean
}

/**
 * 🧩 拼接 Koishi 子指令名称，格式固定为 前缀.后缀。
 */
export function buildCommandName(config: Config, suffix: string): string {
  return joinCommandPrefixAndSuffix(config.commandPrefix || '查询光崽身高装扮', suffix)
}

/**
 * 🧩 拼接 Koishi 子指令别名，格式固定为 前缀别名.后缀。
 */
export function buildCommandAliases(config: Config, suffix: string): string[] {
  const mainCommandName = buildCommandName(config, suffix)
  const seen = new Set([mainCommandName])
  const aliases: string[] = []
  const prefixAliases = Array.isArray(config.commandPrefixAliases) ? config.commandPrefixAliases : []

  for (const prefix of prefixAliases) {
    const alias = joinCommandPrefixAndSuffix(prefix, suffix)
    if (seen.has(alias)) continue
    seen.add(alias)
    aliases.push(alias)
  }

  return aliases
}

/**
 * 🔗 拼接单个前缀和后缀。
 */
function joinCommandPrefixAndSuffix(prefix: string, suffix: string): string {
  const normalizedPrefix = String(prefix || '').trim().replace(/\.+$/, '') || '查询光崽身高装扮'
  const normalizedSuffix = String(suffix || '').trim().replace(/^\.+/, '')
  return normalizedSuffix ? `${normalizedPrefix}.${normalizedSuffix}` : normalizedPrefix
}

type CommandHandler = (result: HeightResult, elapsed: number, options: HeightCommandOptions, session: Session) => Promise<string | h | (string | h)[] | void>
type CommandGuard = (session: Session, options: HeightCommandOptions) => string | void | Promise<string | void>

interface RegisterHeightCommandOptions {
  quote?: boolean
  guard?: CommandGuard
}

/**
 * 🧭 注册一个通用身高查询命令，并封装查询、提示、错误处理和输出生成。
 */
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
  const command = ctx.command(`${commandName} <code:string>`, description)
  if (aliases.length) command.alias(...aliases)
  command
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
        const message = await handler(applyDisplayOptions(result, config), elapsed, commandOptions, session)
        logInfo(ctx, config, `🖼️ 身高查询输出生成完成：${commandName}`, `🖼️ 输出生成完成 command=${commandName}, code=${result.code}`, verbose)
        if (message !== undefined) await reply(message as string | h | (string | h)[])
        await sendStandaloneQQButton(ctx, session, config)
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

/**
 * ↩️ 根据配置决定是否给回复附带原消息引用。
 */
export function withQuote(session: Session, config: Config, message: string | h | (string | h)[]): string | h | (string | h)[] {
  if (!config.enableQuote || !session.messageId) return message
  const quote = h.quote(session.messageId)
  return Array.isArray(message) ? [quote, ...message] : [quote, message]
}

/**
 * ✅ 把命令行传入的多种布尔写法解析成 boolean。
 */
function parseBooleanOption(value: unknown): boolean | undefined {
  if (value === undefined || value === null) return undefined
  if (typeof value === 'boolean') return value
  const normalized = String(value).trim().toLowerCase()
  if (!normalized || ['1', 'true', 'yes', 'on', 'enable', 'enabled', 'dark', '深色', '开启', '启用'].includes(normalized)) return true
  if (['0', 'false', 'no', 'off', 'disable', 'disabled', 'light', '浅色', '关闭', '禁用'].includes(normalized)) return false
  return true
}

/**
 * 🎛️ 应用展示层配置，例如隐藏 UUID 和未知装扮完整 ID。
 */
function applyDisplayOptions(result: HeightResult, config: Config): HeightResult {
  let nextData = result.data
  let changed = false

  if (config.hideFullUuid) {
    const uuid = result.data.uuid
    if (uuid !== null && uuid !== undefined) {
      const text = String(uuid).trim()
      if (text && text.length > 10) {
        nextData = {
          ...nextData,
          uuid: `${text.slice(0, 10)}......`,
        }
        changed = true
      }
    }
  }

  if (!config.showFullUnknownOutfitId && result.data.outfit && typeof result.data.outfit === 'object') {
    const outfit = result.data.outfit
    const nextOutfit: Record<string, unknown> = {}
    let outfitChanged = false
    for (const [key, value] of Object.entries(outfit)) {
      const nextValue = shortenUnknownOutfitId(value)
      nextOutfit[key] = nextValue
      if (nextValue !== value) outfitChanged = true
    }
    if (outfitChanged) {
      nextData = {
        ...nextData,
        outfit: nextOutfit,
      }
      changed = true
    }
  }

  if (!changed) return result
  return {
    ...result,
    data: nextData,
  }
}

/**
 * 🔒 把 未知装扮(完整数字) 缩短成 未知装扮(前三位...)。
 */
function shortenUnknownOutfitId(value: unknown): unknown {
  if (typeof value !== 'string') return value
  return value.replace(UNKNOWN_OUTFIT_ID_PATTERN, (_match, label: string, open: string, id: string, close: string) => {
    return `${label}${open}${id.slice(0, UNKNOWN_OUTFIT_ID_PREVIEW_LENGTH)}...${close}`
  })
}
