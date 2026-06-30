import type { HeightResult } from './types'

export function createDryRunHeightResult(code = 'AAAA-BBBB-CCCC'): HeightResult {
  return {
    code,
    message: '🧪 假数据测试模式',
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
        body: '🧪测试裤子-非真实',
        hair: '🧪测试发型-非真实',
        mask: '🧪测试面具-非真实',
        wing: '🧪测试斗篷-非真实',
        neck: '🧪测试项链-非真实',
        feet: '🧪测试鞋子-非真实',
        hat: '🧪测试头饰-非真实',
        face: '🧪测试脸饰-非真实',
        prop: '🧪测试背饰-非真实',
        horn: '🧪测试角饰-非真实',
      },
    },
  }
}
