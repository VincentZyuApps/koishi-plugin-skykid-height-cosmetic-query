import { Schema } from 'koishi'
import { DEFAULT_LXGW_WENKAI_PATH } from './utils'

export interface Config {
  // ----- 🌐 后端接口设置 -----
  baseUrl: string
  powChallengeUrl: string
  queryUrl: string
  httpTimeout: number
  queryTimeout: number
  queryAction: string
  powMaxNonce: number
  sendRunningTip: boolean
  userAgent: string

  // ----- 📌 指令设置 -----
  enableTextCommand: boolean
  textCommandName: string
  enableForwardCommand: boolean
  forwardCommandName: string
  enablePptrCommand: boolean
  pptrCommandName: string
  enableTakumiCommand: boolean
  takumiCommandName: string

  // ----- 💬 通用输出设置 -----
  enableQuote: boolean
  textMaxLength: number
  useCustomFont: boolean

  // ----- 🖼️ Puppeteer 图片设置 -----
  pptrWidth: number
  pptrImageType: 'png' | 'jpeg' | 'webp'
  pptrQuality: number
  pptrFontPath: string
  pptrShowRenderInfo: boolean

  // ----- ⚡ Takumi wasm 图片设置 -----
  takumiWidth: number
  takumiDarkMode: boolean
  takumiFontPath: string
  takumiShowRenderInfo: boolean

  // ----- 🛠️ 调试设置 -----
  verboseConsoleLog: boolean
}

const DEFAULT_USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36 Edg/149.0.0.0'

export const Config: Schema<Config> = Schema.intersect([
  Schema.object({
    baseUrl: Schema.string().role('link').default('https://sky.cesgao.cn').description('🌐 sky.cesgao.cn 基础地址'),
    powChallengeUrl: Schema.string().role('link').default('https://sky.cesgao.cn/web/v1/pow/challenge').description('🧩 POW challenge 接口地址'),
    queryUrl: Schema.string().role('link').default('https://sky.cesgao.cn/web/v1/query').description('📡 身高查询接口地址'),
    httpTimeout: Schema.number().min(5).max(300).step(1).default(75).description('⏱️ HTTP 总超时时间（秒）'),
    queryTimeout: Schema.number().min(5).max(300).step(1).default(60).description('⌛ 提交给查询接口的 timeout 参数（秒）'),
    queryAction: Schema.string().default('delete').description('⚠️ 提交给查询接口的 action 参数。默认 delete，会消费一次性好友码'),
    powMaxNonce: Schema.number().min(1000).max(100000000).step(1000).default(20000000).description('🧮 POW 最大尝试 nonce'),
    sendRunningTip: Schema.boolean().default(true).description('💬 查询前是否发送“正在查询”提示'),
    userAgent: Schema.string().role('textarea', { rows: [2, 4] }).default(DEFAULT_USER_AGENT).description('🧭 请求 User-Agent'),
  }).description('🌐 后端设置'),

  Schema.object({
    enableTextCommand: Schema.boolean().default(true).description('📝 注册纯文本查询指令'),
    textCommandName: Schema.string().default('查询身高-text').description('📝 纯文本指令名称'),
    enableForwardCommand: Schema.boolean().default(true).description('📨 注册 OneBot 合并转发查询指令'),
    forwardCommandName: Schema.string().default('查询身高-forward').description('📨 合并转发指令名称'),
    enablePptrCommand: Schema.boolean().default(true).description('🖼️ 注册 Puppeteer 出图查询指令'),
    pptrCommandName: Schema.string().default('查询身高').description('🖼️ Puppeteer 指令名称'),
    enableTakumiCommand: Schema.boolean().default(true).description('⚡ 注册 Takumi wasm 出图查询指令'),
    takumiCommandName: Schema.string().default('查询身高-takumi').description('⚡ Takumi 指令名称'),
  }).description('📌 指令设置'),

  Schema.object({
    enableQuote: Schema.boolean().default(true).description('💬 回复时引用触发消息'),
    textMaxLength: Schema.number().min(200).max(5000).step(100).default(1500).description('📏 纯文本最大长度'),
    useCustomFont: Schema.boolean().default(true).description('🔤 是否使用自定义字体路径。关闭后 Puppeteer / Takumi 图片使用系统默认字体，并跳过默认字体下载。'),
  }).description('💬 通用输出设置'),

  Schema.object({
    pptrWidth: Schema.number().min(480).max(1600).step(10).default(880).description('📐 Puppeteer 图片宽度'),
    pptrImageType: Schema.union([
      Schema.const('png').description('🖼️ png'),
      Schema.const('jpeg').description('🌄 jpeg'),
      Schema.const('webp').description('🌐 webp'),
    ]).role('radio').default('png').description('📤 Puppeteer 图片类型'),
    pptrQuality: Schema.number().min(1).max(100).step(1).default(90).description('📏 Puppeteer 图片质量，png 无效'),
    pptrFontPath: Schema.string().role('textarea', { rows: [2, 4] }).default(DEFAULT_LXGW_WENKAI_PATH).description('🔤 Puppeteer 字体路径。默认展示 process.cwd()/data/fonts/LXGWWenKaiMono-Regular.ttf；运行时自动映射到 ctx.baseDir/data/fonts/LXGWWenKaiMono-Regular.ttf。留空则使用系统默认字体。'),
    pptrShowRenderInfo: Schema.boolean().default(true).description('📊 Puppeteer 回复中显示渲染耗时'),
  }).description('🖼️ Puppeteer 出图设置'),

  Schema.object({
    takumiWidth: Schema.number().min(480).max(1600).step(10).default(880).description('📐 Takumi 图片宽度'),
    takumiDarkMode: Schema.boolean().default(false).description('🌙 Takumi 深色模式'),
    takumiFontPath: Schema.string().role('textarea', { rows: [2, 4] }).default(DEFAULT_LXGW_WENKAI_PATH).description('🔤 Takumi 字体路径。默认展示 process.cwd()/data/fonts/LXGWWenKaiMono-Regular.ttf；运行时自动映射到 ctx.baseDir/data/fonts/LXGWWenKaiMono-Regular.ttf。'),
    takumiShowRenderInfo: Schema.boolean().default(true).description('📊 Takumi 回复中显示渲染耗时'),
  }).description('⚡ Takumi wasm 出图设置'),

  Schema.object({
    verboseConsoleLog: Schema.boolean().default(false).description('🛠️ 输出详细调试日志。开启后会打印请求 URL、payload 摘要、接口响应 JSON 等信息。'),
  }).description('🛠️ 调试设置'),
]) as unknown as Schema<Config>
