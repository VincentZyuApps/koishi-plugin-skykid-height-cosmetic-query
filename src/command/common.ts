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
  return joinCommandPrefixAndSuffix(config.commandPrefix || '测身高', suffix)
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
  quote?: boolean | ((session: Session) => boolean)
  guard?: CommandGuard
}

import { fetchAndDecodeQrCode } from '../utils/qrcode'

/**
 * 📷 从消息元素字符串中提取所有图片 URL
 */
export function extractImageUrls(content: string): string[] {
  if (!content) return []
  const imgUrls = h.select(content, 'img').map(el => el.attrs.src).filter(Boolean)
  const imageTagUrls = h.select(content, 'image').map(el => el.attrs.url || el.attrs.src).filter(Boolean)
  const mfaceUrls = h.select(content, 'mface').map(el => el.attrs.url).filter(Boolean)
  return Array.from(new Set([...imgUrls, ...imageTagUrls, ...mfaceUrls]))
}

/**
 * 📝 过滤消息中的元素标签，提取纯净文本内容
 */
export function extractCleanText(content: string): string {
  if (!content) return ''
  const textElements = h.select(content, 'text').map(el => el.attrs.content).filter(Boolean)
  if (textElements.length > 0) {
    return textElements.join('').trim()
  }
  return content.replace(/<[^>]+>/g, '').trim()
}

/**
 * 🚪 判断用户回复是否命中退出交互关键词
 */
export function isExitPromptWord(input: string, exitWords?: string[]): boolean {
  const words = Array.isArray(exitWords) && exitWords.length
    ? exitWords
    : ['取消', 'exit', 'quit', '0', '-1']
  const trimmed = input.trim().toLowerCase()
  return words.some(w => w.trim().toLowerCase() === trimmed)
}

/**
 * 🔍 判断字符串是否为疑似光遇离线链接或好友码
 */
function isLikelySkyCodeOrUrl(data: string): boolean {
  if (!data) return false
  const trimmed = data.trim()
  if (trimmed.includes('sky.thatg.co') || trimmed.includes('sky.cesgao.cn')) {
    return true
  }
  if (/^[A-Za-z0-9]{3,4}-[A-Za-z0-9]{3,4}$/.test(trimmed)) {
    return true
  }
  if (/^[A-Za-z0-9]{6,8}$/.test(trimmed)) {
    return true
  }
  return false
}

export interface ResolveTargetResult {
  code: string | null
  cancelled?: boolean
  error?: string
}

/**
 * 🎯 统一解析查询目标（优先直接参数/当前图片 -> 其次引用消息 quote -> 最后多轮 session.prompt）
 */
export async function resolveQueryTargetCode(
  ctx: Context,
  session: Session,
  config: Config,
  rawCode: string | undefined,
  commandName: string,
): Promise<ResolveTargetResult> {
  let imageUrls: string[] = []
  let textInput = (rawCode || '').trim()

  // 1. 如果当前消息本身携带图片元素，优先提取图片
  if (session.content) {
    const directImages = extractImageUrls(session.content)
    if (directImages.length > 0) {
      imageUrls = directImages
    }
  }

  // 2. 如果没有直接参数且没有直接图片，检查是否有引用消息 session.quote
  if (!textInput && imageUrls.length === 0 && session.quote?.content) {
    const quoteImages = extractImageUrls(session.quote.content)
    if (quoteImages.length > 0) {
      imageUrls = quoteImages
    } else {
      textInput = extractCleanText(session.quote.content)
    }
  }

  // 3. 如果依然没有任何有效输入，且开启了 session.prompt 交互
  if (!textInput && imageUrls.length === 0) {
    if (!config.enablePromptInput) {
      return { code: null, error: `🧭 请提供好友码、扫码链接或扫码图片，用法：${commandName} 【好友码 / 扫码链接 / 图片】` }
    }

    const timeoutSec = config.promptTimeout || 30
    await session.send(
      withQuote(
        session,
        config,
        `🔍 请在 ${timeoutSec} 秒内发送：好友码（如 123-456）、离线扫码链接（https://sky.thatg.co/o=...）或游戏内扫码图片。\n发送 取消 / 0 可退出查询。`
      )
    )

    const reply = await session.prompt(timeoutSec * 1000)
    if (reply === undefined) {
      return { code: null, cancelled: true, error: '⌛ 等待输入超时，已取消本次查询。' }
    }

    if (isExitPromptWord(reply, config.promptExitWords)) {
      return { code: null, cancelled: true, error: '🚪 已取消本次查询。' }
    }

    const replyImages = extractImageUrls(reply)
    if (replyImages.length > 0) {
      imageUrls = replyImages
    } else {
      textInput = extractCleanText(reply)
    }
  }

  // 4. 处理图片二维码识别
  if (imageUrls.length > 0) {
    for (const imgUrl of imageUrls) {
      const qrData = await fetchAndDecodeQrCode(ctx, imgUrl)
      if (qrData) {
        if (isLikelySkyCodeOrUrl(qrData)) {
          return { code: qrData }
        } else {
          return {
            code: null,
            error: `⚠️ 识别到二维码，但不是支持的光遇好友/装扮离线链接。\n识别内容：${qrData}`,
          }
        }
      }
    }
    return {
      code: null,
      error: '❌ 未能在图片中识别到有效二维码，请确认发送的是清晰的光遇名片图片。',
    }
  }

  // 5. 处理纯文本
  if (textInput) {
    return { code: textInput }
  }

  return { code: null, error: `🧭 请提供好友码或扫码链接，用法：${commandName} 【好友码 / 扫码链接】` }
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
  const command = ctx.command(`${commandName} [code:string]`, description)
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
      const replyPrompt = (message: string | h | (string | h)[]) => session.send(withQuote(session, config, message))
      const shouldQuoteResult = typeof registerOptions.quote === 'function'
        ? registerOptions.quote(session)
        : registerOptions.quote !== false
      const replyResult = (message: string | h | (string | h)[]) => session.send(shouldQuoteResult ? withQuote(session, config, message) : message)

      const guardMessage = await registerOptions.guard?.(session, commandOptions)
      if (guardMessage) {
        await replyPrompt(guardMessage)
        return
      }

      // 如果非测试模式，统一解析目标参数（支持图片二维码、引用消息、交互式 prompt 等）
      if (!dryRun) {
        const target = await resolveQueryTargetCode(ctx, session, config, code, commandName)
        if (!target.code) {
          if (target.error) {
            await replyPrompt(target.error)
          }
          return
        }
        code = target.code
      }

      const detailMessage = `🧾 命令详情 command=${commandName}, platform=${session.platform}, channel=${session.channelId}, user=${session.userId}, code=${code || ''}, dryRun=${dryRun}, enableDarkMode=${enableDarkMode ?? 'default'}, verbose=${verbose}`
      logInfo(ctx, config, `📨 身高查询命令触发：${commandName}`, detailMessage, verbose)

      if (verbose) {
        await replyPrompt(`🛠️ 详细参数：\n${detailMessage}`)
      }

      const start = Date.now()
      let waitIds: string[] = []
      if (config.sendRunningTip) {
        waitIds = await replyPrompt(waitText)
      }

      try {
        const result = dryRun ? createDryRunHeightResult() : await queryHeight(ctx, config, code)
        const elapsed = Date.now() - start
        logInfo(ctx, config, `✅ 身高查询完成：${result.code}，耗时 ${elapsed}ms`, `✅ 查询完成 command=${commandName}, code=${result.code}, elapsed=${elapsed}ms, 开始生成输出`, verbose)
        const message = await handler(applyDisplayOptions(result, config), elapsed, commandOptions, session)
        logInfo(ctx, config, `🖼️ 身高查询输出生成完成：${commandName}`, `🖼️ 输出生成完成 command=${commandName}, code=${result.code}`, verbose)
        if (message !== undefined) await replyResult(message as string | h | (string | h)[])
        await sendStandaloneQQButton(ctx, session, config)
      } catch (error) {
        ctx.logger.warn(`❌ 查询失败：${error instanceof Error ? error.message : String(error)}`)
        await replyPrompt(`❌ 查询失败：${error instanceof Error ? error.message : String(error)}`)
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
