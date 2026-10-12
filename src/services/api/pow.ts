import { createHash } from 'crypto'
import type { PowChallenge } from '../../types'

/**
 * 🧮 计算满足 difficulty 前导零要求的 POW token。
 */
export function buildPowToken(challenge: PowChallenge, maxNonce: number): string {
  const algorithm = String(challenge.algorithm || 'SHA-256').replace('_', '-').toUpperCase()
  if (algorithm !== 'SHA-256' && algorithm !== 'SHA256') {
    throw new Error(`不支持的 POW 算法：${algorithm}`)
  }

  const difficulty = Number(challenge.difficulty)
  if (!Number.isInteger(difficulty) || difficulty < 0 || difficulty > 8) {
    throw new Error(`异常的 POW difficulty：${challenge.difficulty}`)
  }

  const salt = String(challenge.salt)
  const prefix = '0'.repeat(difficulty)
  for (let nonce = 0; nonce <= maxNonce; nonce++) {
    const digest = createHash('sha256').update(`${salt}:${nonce}`, 'utf8').digest('hex')
    if (digest.startsWith(prefix)) {
      return Buffer.from(JSON.stringify({
        salt,
        difficulty,
        expires: challenge.expires,
        signature: String(challenge.signature),
        nonce,
      })).toString('base64')
    }
  }

  throw new Error(`POW 计算失败，已尝试 ${maxNonce} 个 nonce`)
}
