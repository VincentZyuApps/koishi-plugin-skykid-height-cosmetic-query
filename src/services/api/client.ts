import type { Context } from 'koishi'
import type { Config } from '../../config'
import { logInfo } from '../../utils/logger'
import type { HeightResult, PowChallenge } from '../../types'
import { buildPowToken } from './pow'

/**
 * 🧭 规范化光遇好友码为 4-4-4 格式。
 */
export function normalizeFriendCode(raw: string): string {
  const compact = String(raw || '')
    .trim()
    .replace(/[_—－]/g, '-')
    .replace(/\s+/g, '')
    .replace(/-/g, '')
    .toUpperCase()

  if (!/^[A-Z0-9]{12}$/.test(compact)) return ''
  return `${compact.slice(0, 4)}-${compact.slice(4, 8)}-${compact.slice(8, 12)}`
}

/**
 * 🔎 查询 sky.cesgao.cn，并返回统一的身高查询结果。
 */
export async function queryHeightByFriendCode(ctx: Context, config: Config, rawCode: string): Promise<HeightResult> {
  const code = normalizeFriendCode(rawCode)
  if (!code) throw new Error('好友码格式错误，请传入【好友码】，例如 ABCD-EFGH-IJKL')

  logInfo(ctx, config, `🔎 开始查询身高，好友码=${code}`)
  const challenge = await getPowChallenge(ctx, config)
  logInfo(ctx, config, `🧩 POW challenge 获取成功，difficulty=${challenge.difficulty}`, `🧩 POW challenge JSON: ${safeJson(challenge)}`)
  const powToken = buildPowToken(challenge, config.powMaxNonce)
  logInfo(ctx, config, `✅ POW 计算完成，difficulty=${challenge.difficulty}, tokenLength=${powToken.length}`)
  const payload = {
    query: code,
    action: config.queryAction.trim() || 'delete',
    pow_token: powToken,
    timeout: config.queryTimeout,
  }
  logInfo(ctx, config, `📡 准备请求身高查询接口，action=${payload.action}, timeout=${payload.timeout}`, `📦 查询 payload: ${safeJson({ ...payload, pow_token: `[hidden length=${powToken.length}]` })}`)

  const queryPath = (config as any).queryHeightPathSuffix || (config as any).queryUrl || '/web/v1/query'
  const response = await requestJson<any>(ctx, config, 'POST', queryPath, payload)
  logInfo(ctx, config, `📡 身高查询接口返回，success=${Boolean(response?.success)}`, `📦 查询响应 JSON: ${safeJson(response)}`)
  if (!response || typeof response !== 'object') throw new Error('查询接口返回格式异常')
  if (!response.success) throw new Error(String(response.message || response.msg || '未知错误'))
  if (!response.data || typeof response.data !== 'object') throw new Error('查询接口返回缺少 data 字段')

  return {
    code,
    message: String(response.message || '查询成功'),
    data: response.data,
    queriedAt: new Date(),
  }
}

/**
 * 🧩 请求并校验 POW challenge。
 */
async function getPowChallenge(ctx: Context, config: Config): Promise<PowChallenge> {
  const challengePath = (config as any).powChallengePathSuffix || (config as any).powChallengeUrl || '/web/v1/pow/challenge'
  logInfo(ctx, config, `🧩 请求 POW challenge: ${resolveUrl(config, challengePath)}`)
  const challenge = await requestJson<PowChallenge>(ctx, config, 'GET', challengePath)
  if (!challenge || typeof challenge !== 'object') throw new Error('POW challenge 返回格式异常')
  if (!challenge.success) throw new Error(String(challenge.message || '获取 POW challenge 失败'))
  for (const key of ['salt', 'difficulty', 'expires', 'signature'] as const) {
    if (!(key in challenge)) throw new Error(`POW challenge 缺少字段：${key}`)
  }
  return challenge
}

/**
 * 🌐 发送 JSON HTTP 请求，并附带查询接口需要的请求头。
 */
async function requestJson<T>(ctx: Context, config: Config, method: 'GET' | 'POST', pathSuffix: string, data?: unknown): Promise<T> {
  const baseUrl = (config.baseUrl || 'https://sky.cesgao.cn').replace(/\/+$/, '')
  const url = resolveUrl(config, pathSuffix)
  const headers: Record<string, string> = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    Referer: baseUrl + '/',
    'User-Agent': config.userAgent,
  }
  if (method === 'POST') headers.Origin = baseUrl

  const timeout = Math.max(1000, config.httpTimeout * 1000)
  logInfo(ctx, config, `🌐 ${method} ${url}`, `🧾 HTTP headers: ${safeJson({ ...headers, 'User-Agent': '[hidden]' })}`)
  if (method === 'GET') {
    const result = await ctx.http.get<T>(url, { headers, timeout })
    logInfo(ctx, config, `✅ ${method} ${url} 完成`, `📦 ${method} ${url} response: ${safeJson(result)}`)
    return result
  }
  const result = await ctx.http.post<T>(url, data, { headers, timeout })
  logInfo(ctx, config, `✅ ${method} ${url} 完成`, `📦 ${method} ${url} response: ${safeJson(result)}`)
  return result
}

function resolveUrl(config: Config, pathSuffix: string): string {
  const baseUrl = (config.baseUrl || 'https://sky.cesgao.cn').replace(/\/+$/, '')
  return `${baseUrl}${pathSuffix}`
}

function safeJson(value: unknown): string {
  try {
    return JSON.stringify(value)
  } catch {
    return String(value)
  }
}
