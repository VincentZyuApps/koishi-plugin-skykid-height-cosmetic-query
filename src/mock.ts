import type { HeightResult } from './types'

/**
 * 🧪 构造 dry-run 假数据，方便测试文字和图片输出。
 */
export function createDryRunHeightResult(code = 'AAAA-BBBB-CCCC'): HeightResult {
  return {
    code,
    message: '假数据测试模式',
    dryRun: true,
    queriedAt: new Date('2099-09-09T09:09:09+08:00'),
    data: {
      uuid: 'dry-run-uuid-0000-1111-2222-not-real',
      body_size: '0.123456789',
      height_value: '9.876543210',
      current_height: '1.23456789',
      max_height: '0.11111111',
      min_height: '9.99999999',
      outfit: {
        body: '测试裤子',
        hair: '测试发型',
        mask: '测试面具',
        wing: '测试斗篷',
        neck: '测试项链',
        feet: '测试鞋子',
        hat: '测试头饰',
        face: '测试脸饰',
        prop: '测试背饰',
        horn: '测试角饰',
      },
    },
  }
}
