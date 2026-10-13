import type { Config } from '../config'

const PROBE_TIMEOUT_MS = 5000
const CACHE_TTL_MS = 3600 * 1000 // 缓存 1 小时

interface CachedUrl {
  url: string
  timestamp: number
}

// 内存探测结果缓存，避免每次触发指令都发起多轮 HTTP HEAD/GET 探测
const urlProbeCache = new Map<string, CachedUrl>()

/**
 * 🔗 规范拼接 Base URL 和相对路径
 */
export function joinRepoImageUrl(baseUrl: string, relativePath: string): string {
  const cleanBase = String(baseUrl || '').trim().replace(/\/+$/, '')
  const cleanPath = String(relativePath || '').trim().replace(/^\/+/, '')
  if (!cleanBase) return cleanPath
  if (!cleanPath) return cleanBase
  return `${cleanBase}/${cleanPath}`
}

/**
 * 🧪 校验单个图片 URL：要求 200 直出、无重定向且 content-type 为 image/*
 */
async function checkImageUrl(url: string): Promise<boolean> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), PROBE_TIMEOUT_MS)
  try {
    const response = await fetch(url, { redirect: 'follow', signal: controller.signal })
    const contentType = (response.headers.get('content-type') || '').toLowerCase()
    return response.status === 200 && !response.redirected && contentType.startsWith('image/')
  } catch {
    return false
  } finally {
    clearTimeout(timer)
  }
}

/**
 * 🖼️ 根据配置的 repoImageBaseUrls 和相对路径，选取首个可用的静态资源图片 URL
 */
export async function resolveRepoImageUrl(config: Config, relativePath: string): Promise<string | undefined> {
  const path = String(relativePath || '').trim()
  if (!path) return undefined

  const baseUrls = (Array.isArray(config.repoImageBaseUrls) ? config.repoImageBaseUrls : [])
    .map((item) => String(item || '').trim())
    .filter(Boolean)

  if (!baseUrls.length) return undefined

  const candidates = baseUrls.map((base) => joinRepoImageUrl(base, path))

  // 若关闭探测，直接返回第一个候选
  if (!config.repoImageProbeEnable) {
    return candidates[0]
  }

  // 检查内存缓存
  const cacheKey = `${baseUrls.join('|')}::${path}`
  const cached = urlProbeCache.get(cacheKey)
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.url
  }

  // 逐个轻量探测
  for (const candidate of candidates) {
    if (await checkImageUrl(candidate)) {
      urlProbeCache.set(cacheKey, { url: candidate, timestamp: Date.now() })
      return candidate
    }
  }

  // 全部探测失败时，回退到第一个候选并记录短暂缓存
  const fallback = candidates[0]
  urlProbeCache.set(cacheKey, { url: fallback, timestamp: Date.now() })
  return fallback
}
