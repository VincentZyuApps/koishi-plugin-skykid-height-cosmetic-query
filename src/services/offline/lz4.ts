/**
 * 📦 手写无外部依赖的 LZ4 Block 快速解压算法（纯 TypeScript 实现，与 Python 逻辑严格等价）。
 */
export function decompressLz4Block(src: Uint8Array): Uint8Array {
  let i = 0
  const n = src.length
  const out: number[] = []

  while (i < n) {
    const token = src[i++]
    let literalLen = token >> 4

    if (literalLen === 15) {
      while (true) {
        if (i >= n) throw new Error('LZ4 解压错误: literal length truncated')
        const b = src[i++]
        literalLen += b
        if (b !== 255) break
      }
    }

    if (i + literalLen > n) {
      throw new Error('LZ4 解压错误: literal data truncated')
    }
    for (let l = 0; l < literalLen; l++) {
      out.push(src[i + l])
    }
    i += literalLen

    if (i >= n) break

    if (i + 2 > n) {
      throw new Error('LZ4 解压错误: offset truncated')
    }
    const offset = src[i] | (src[i + 1] << 8)
    i += 2
    if (offset <= 0 || offset > out.length) {
      throw new Error('LZ4 解压错误: invalid match offset')
    }

    let matchLen = token & 0x0f
    if (matchLen === 15) {
      while (true) {
        if (i >= n) throw new Error('LZ4 解压错误: match length truncated')
        const b = src[i++]
        matchLen += b
        if (b !== 255) break
      }
    }
    matchLen += 4

    const start = out.length - offset
    for (let j = 0; j < matchLen; j++) {
      out.push(out[start + j])
    }
  }

  return new Uint8Array(out)
}
