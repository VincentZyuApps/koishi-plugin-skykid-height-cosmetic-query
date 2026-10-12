import { Schema } from 'koishi'
import { DEFAULT_LXGW_WENKAI_PATH } from './utils/fonts'

export const QQ_MARKDOWN_BUTTON_MODE = {
  STANDALONE: 'standalone',
  APPEND_TEXT: 'append-text',
  APPEND_API_IMAGE: 'append-api-image',
  APPEND_PPTR_IMAGE: 'append-pptr-image',
  APPEND_TAKUMI_IMAGE: 'append-takumi-image',
  APPEND_MD_TABLE: 'append-md-table',
  APPEND_MD_STYLE: 'append-md-style',
} as const

export type QQMarkdownButtonModeType = typeof QQ_MARKDOWN_BUTTON_MODE[keyof typeof QQ_MARKDOWN_BUTTON_MODE]

export const QQ_MARKDOWN_IMAGE_STORAGE_MODE = {
  ASSETS: 'assets',
  SERVER: 'server',
} as const

export type QQMarkdownImageStorageModeType = typeof QQ_MARKDOWN_IMAGE_STORAGE_MODE[keyof typeof QQ_MARKDOWN_IMAGE_STORAGE_MODE]

export interface Config {
  // ----- 🌐 后端接口设置 -----
  baseUrl: string
  powChallengePathSuffix: string
  queryHeightPathSuffix: string
  httpTimeout: number
  queryTimeout: number
  queryAction: string
  powMaxNonce: number
  sendRunningTip: boolean
  userAgent: string

  // ----- 📌 指令设置 -----
  commandPrefix: string
  commandPrefixAliases: string[]
  enableHelpCommand: boolean
  helpCommandSuffix: string
  enableTextCommand: boolean
  textCommandSuffix: string
  enableForwardCommand: boolean
  forwardCommandSuffix: string
  enablePptrCommand: boolean
  pptrCommandSuffix: string
  enableTakumiCommand: boolean
  takumiCommandSuffix: string
  enableApiCommand: boolean
  apiCommandSuffix: string
  enableQqMdTableCommand: boolean
  qqMdTableCommandSuffix: string
  enableQqMdStyleCommand: boolean
  qqMdStyleCommandSuffix: string

  // ----- 💬 通用输出设置 -----
  enableQuote: boolean
  textMaxLength: number
  hideFullUuid: boolean
  showFullUnknownOutfitId: boolean
  useCustomFont: boolean

  // ----- 🖼️ Puppeteer 图片设置 -----
  pptrWidth: number
  pptrDeviceScaleFactor: number
  pptrImageType: 'png' | 'jpeg' | 'webp'
  pptrCardColorMode: 'solid' | 'fixed' | 'random'
  pptrQuality: number
  pptrFontPath: string
  pptrShowRenderInfo: boolean

  // ----- ⚡ Takumi wasm 图片设置 -----
  takumiWidth: number
  takumiDarkMode: boolean
  takumiFontPath: string
  takumiShowRenderInfo: boolean

  // ----- 🌐 API 出图设置 -----
  imageApiBaseUrl: string
  imageApiPath: string
  imageApiTimeout: number
  imageApiWidth: number
  imageApiHeight: number
  imageApiShowOutfitName: boolean
  imageApiExtraQueryParams: string
  imageApiShowRenderInfo: boolean

  // ----- 💬 QQ 官方 Bot Markdown 适配设置 -----
  qqMarkdownButtonMode: QQMarkdownButtonModeType[]
  qqMarkdownKeyboardJson: string
  qqMarkdownImageStorageMode: QQMarkdownImageStorageModeType
  qqMarkdownImageSelfUrl: string
  qqMarkdownImageMaxFiles: number
  qqMarkdownEmbedApiImage: boolean
  qqMarkdownEmbedPptrImage: boolean
  qqMarkdownEmbedTakumiImage: boolean

  // ----- 🛠️ 调试设置 -----
  verboseSessionLog: boolean
  verboseConsoleLog: boolean
}

const DEFAULT_USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36 Edg/149.0.0.0'

export const Config: Schema<Config> = Schema.intersect([
  Schema.object({
    baseUrl: Schema.string().role('link').default('https://sky.cesgao.cn').description('🌐 sky.cesgao.cn 基础地址'),
    powChallengePathSuffix: Schema.string().default('/web/v1/pow/challenge').disabled().description('🧩 POW challenge 接口相对路径<i>（固定接口，暂不可修改）</i>'),
    queryHeightPathSuffix: Schema.string().default('/web/v1/query').disabled().description('📡 身高查询接口相对路径<i>（固定接口，暂不可修改）</i>'),
    httpTimeout: Schema.number().min(5).max(300).step(1).default(75).description('⏱️ HTTP 总超时时间（秒）'),
    queryTimeout: Schema.number().min(5).max(300).step(1).default(60).description('⌛ 提交给查询接口的 timeout 参数（秒）'),
    queryAction: Schema.string().default('delete').description('⚠️ 提交给查询接口的 action 参数。默认 delete，会消费一次性好友码'),
    powMaxNonce: Schema.number().min(1000).max(100000000).step(1000).default(20000000).description('🧮 POW 最大尝试 nonce'),
    sendRunningTip: Schema.boolean().default(true).description('💬 查询前是否发送“正在查询”提示'),
    userAgent: Schema.string().role('textarea', { rows: [2, 4] }).default(DEFAULT_USER_AGENT).description('🧭 请求 User-Agent'),
  }).description('🌐 后端设置'),

  Schema.object({
    commandPrefix: Schema.string().default('查询光崽身高装扮').description('📌 查询指令共同前缀。实际命令格式为：前缀 + 英文句号 + 后缀，例如 查询光崽身高装扮.pptr'),
    commandPrefixAliases: Schema.array(String).role('table').default(['查询光崽身高', '查询光崽装扮', '查询身高', '查询装扮', '测身高']).description('📌 查询指令前缀别名。每个别名都会和相同后缀组合成指令 alias，例如 查询光崽身高.pptr。'),
    enableHelpCommand: Schema.boolean().default(true).description('❔ 注册帮助指令'),
    helpCommandSuffix: Schema.string().default('帮助').description('❔ 帮助指令后缀'),
    enableTextCommand: Schema.boolean().default(true).description('📝 注册纯文本查询指令'),
    textCommandSuffix: Schema.string().default('text').description('📝 纯文本指令后缀'),
    enableForwardCommand: Schema.boolean().default(true).description('📨 注册 OneBot 合并转发查询指令'),
    forwardCommandSuffix: Schema.string().default('forward').description('📨 合并转发指令后缀'),
    enablePptrCommand: Schema.boolean().default(true).description('🖼️ 注册 Puppeteer 出图查询指令'),
    pptrCommandSuffix: Schema.string().default('pptr').description('🖼️ Puppeteer 指令后缀'),
    enableTakumiCommand: Schema.boolean().default(true).description('⚡ 注册 Takumi wasm 出图查询指令'),
    takumiCommandSuffix: Schema.string().default('takumi').description('⚡ Takumi 指令后缀'),
    enableApiCommand: Schema.boolean().default(false).description('🌐 注册外部 Fastapi Pillow画图后端出图查询指令'),
    apiCommandSuffix: Schema.string().default('api').description('🌐 外部 Fastapi Pillow画图后端出图指令后缀'),
    enableQqMdTableCommand: Schema.boolean().default(false).description('📊 注册 QQ Markdown 表格模式查询指令。仅 QQ 官方 Bot 平台支持，非 QQ 平台会按调试配置提示并跳过。'),
    qqMdTableCommandSuffix: Schema.string().default('md-table').description('📊 QQ Markdown 表格模式指令后缀'),
    enableQqMdStyleCommand: Schema.boolean().default(true).description('💫 注册 QQ Markdown 格式风格查询指令。仅 QQ 官方 Bot 平台支持，非 QQ 平台会按调试配置提示并跳过。'),
    qqMdStyleCommandSuffix: Schema.string().default('md-style').description('💫 QQ Markdown 格式风格指令后缀'),
  }).description('📌 指令设置'),

  Schema.object({
    enableQuote: Schema.boolean().default(true).description('💬 回复时引用触发消息'),
    textMaxLength: Schema.number().min(200).max(5000).step(100).default(1500).description('📏 纯文本最大长度'),
    hideFullUuid: Schema.boolean().default(true).description('🆔 是否不显示完整 UUID。开启后显示前 10 个字符并追加 ......，关闭后显示完整 UUID。'),
    showFullUnknownOutfitId: Schema.boolean().default(false).description('🏷️ 未知装扮是否显示完整 ID。关闭时将 未知装扮(123456) 显示为 未知装扮(123...)。'),
    useCustomFont: Schema.boolean().default(true).description('🔤 是否使用自定义字体路径。关闭后 Puppeteer / Takumi 图片使用系统默认字体，并跳过默认字体下载。'),
  }).description('💬 通用输出设置'),

  Schema.object({
    pptrWidth: Schema.number().min(480).max(1600).step(10).default(880).description('📐 Puppeteer 图片宽度'),
    pptrDeviceScaleFactor: Schema.number().min(0.5).max(5).step(0.1).default(2.5).description('🔍 Puppeteer 截图设备像素比，越高越清晰但图片体积越大'),
    pptrImageType: Schema.union([
      Schema.const('png').description('🖼️ png'),
      Schema.const('jpeg').description('🌄 jpeg'),
      Schema.const('webp').description('🌐 webp'),
    ]).role('radio').default('png').description('📤 Puppeteer 图片类型'),
    pptrCardColorMode: Schema.union([
      Schema.const('solid').description('⬜ 完全纯色'),
      Schema.const('fixed').description('🧭 固定的随便感'),
      Schema.const('random').description('🎲 完全随机'),
    ]).role('radio').default('random').description('🎨 Puppeteer 圆角矩形配色模式。完全纯色会统一卡片底色；固定的随便感会按结果内容稳定分配色块；完全随机每次出图都会随机分配。'),
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
    imageApiBaseUrl: Schema.string().role('link').default('http://127.0.0.1:60704').description('🌐 外部出图 API 基础地址。同机运行时通常填 http://127.0.0.1:60704；跨机器运行时填 API 所在机器地址。'),
    imageApiPath: Schema.string().default('/img/render').description('🖼️ 外部出图 API 图片路径，默认对接 Fastapi Pillow画图后端的 /img/render'),
    imageApiTimeout: Schema.number().min(1).max(300).step(1).default(60).description('⏱️ 外部出图 API 请求超时时间（秒）'),
    imageApiWidth: Schema.number().min(1).max(3840).step(1).default(1920).description('📐 传给外部出图 API 的 bg_x 输出宽度'),
    imageApiHeight: Schema.number().min(1).max(2160).step(1).default(1080).description('📐 传给外部出图 API 的 bg_y 输出高度'),
    imageApiShowOutfitName: Schema.boolean().default(true).description('🏷️ 装扮标签是否显示具体装扮名称，对应 body-txt_name / hair-txt_name 等参数'),
    imageApiExtraQueryParams: Schema.string().role('textarea', { rows: [2, 5] }).default('').description('🧩 追加给外部出图 API 的 URL 查询参数，例如 gm=20&title_txt=光崽档案。同名 query 会覆盖插件自动生成的 query。完整手册见 Fastapi Pillow画图后端的 /koishi-query-doc。'),
    imageApiShowRenderInfo: Schema.boolean().default(true).description('📊 API 出图回复中显示查询和出图总耗时'),
  }).description('🌐 API 出图设置'),

  Schema.object({
    qqMarkdownButtonMode: Schema.array(Schema.union([
      Schema.const(QQ_MARKDOWN_BUTTON_MODE.STANDALONE).description(`【 ${QQ_MARKDOWN_BUTTON_MODE.STANDALONE}】每次查询成功后额外发送一条 JSON 按钮消息`),
      Schema.const(QQ_MARKDOWN_BUTTON_MODE.APPEND_TEXT).description(`【 ${QQ_MARKDOWN_BUTTON_MODE.APPEND_TEXT}】挂在 text 的 QQ Markdown 文本后面`),
      Schema.const(QQ_MARKDOWN_BUTTON_MODE.APPEND_API_IMAGE).description(`【 ${QQ_MARKDOWN_BUTTON_MODE.APPEND_API_IMAGE}】挂在 API 出图 QQ Markdown 内联图片后面`),
      Schema.const(QQ_MARKDOWN_BUTTON_MODE.APPEND_PPTR_IMAGE).description(`【 ${QQ_MARKDOWN_BUTTON_MODE.APPEND_PPTR_IMAGE}】挂在 Puppeteer 出图 QQ Markdown 内联图片后面`),
      Schema.const(QQ_MARKDOWN_BUTTON_MODE.APPEND_TAKUMI_IMAGE).description(`【 ${QQ_MARKDOWN_BUTTON_MODE.APPEND_TAKUMI_IMAGE}】挂在 Takumi 出图 QQ Markdown 内联图片后面`),
      Schema.const(QQ_MARKDOWN_BUTTON_MODE.APPEND_MD_TABLE).description(`【 ${QQ_MARKDOWN_BUTTON_MODE.APPEND_MD_TABLE}】挂在 QQ Markdown 表格模式后面`),
      Schema.const(QQ_MARKDOWN_BUTTON_MODE.APPEND_MD_STYLE).description(`【 ${QQ_MARKDOWN_BUTTON_MODE.APPEND_MD_STYLE}】挂在 QQ Markdown 格式风格后面`),
    ]))
      .role('checkbox')
      .default([
        QQ_MARKDOWN_BUTTON_MODE.APPEND_TEXT,
        QQ_MARKDOWN_BUTTON_MODE.APPEND_API_IMAGE,
        QQ_MARKDOWN_BUTTON_MODE.APPEND_PPTR_IMAGE,
        QQ_MARKDOWN_BUTTON_MODE.APPEND_TAKUMI_IMAGE,
        QQ_MARKDOWN_BUTTON_MODE.APPEND_MD_TABLE,
        QQ_MARKDOWN_BUTTON_MODE.APPEND_MD_STYLE,
      ])
      .description([
        '🔘 QQ Markdown 按钮发送行为，可多选。',
        `【 ${QQ_MARKDOWN_BUTTON_MODE.STANDALONE}】每次查询成功后额外发送一条 JSON 按钮消息。`,
        `【 ${QQ_MARKDOWN_BUTTON_MODE.APPEND_TEXT}】挂在 text 的 QQ Markdown 文本后面。`,
        `【 ${QQ_MARKDOWN_BUTTON_MODE.APPEND_API_IMAGE}】挂在 API 出图 QQ Markdown 内联图片后面，需要 qqMarkdownEmbedApiImage 开启。`,
        `【 ${QQ_MARKDOWN_BUTTON_MODE.APPEND_PPTR_IMAGE}】挂在 Puppeteer 出图 QQ Markdown 内联图片后面，需要 qqMarkdownEmbedPptrImage 开启。`,
        `【 ${QQ_MARKDOWN_BUTTON_MODE.APPEND_TAKUMI_IMAGE}】挂在 Takumi 出图 QQ Markdown 内联图片后面，需要 qqMarkdownEmbedTakumiImage 开启。`,
        `【 ${QQ_MARKDOWN_BUTTON_MODE.APPEND_MD_TABLE}】挂在 QQ Markdown 表格模式后面。`,
        `【 ${QQ_MARKDOWN_BUTTON_MODE.APPEND_MD_STYLE}】挂在 QQ Markdown 格式风格后面。`,
        '⚠️ 不想发送 QQ 按钮时保持空选即可。条件不满足时默认静默跳过，除非开启调试日志。',
      ].join('<br/>')),
    qqMarkdownKeyboardJson: Schema.string().role('textarea', { rows: [4, 12] }).default('').description('⌨️ QQ Markdown 按钮 JSON。留空时默认一行两个按钮：获取帮助 -> 当前前缀.帮助，玩玩别的 -> help。JSON 解析失败时使用默认按钮。'),
    qqMarkdownImageStorageMode: Schema.union([
      Schema.const(QQ_MARKDOWN_IMAGE_STORAGE_MODE.ASSETS).description(`【 ${QQ_MARKDOWN_IMAGE_STORAGE_MODE.ASSETS}】使用 Koishi assets 服务发送 Markdown 内嵌图片`),
      Schema.const(QQ_MARKDOWN_IMAGE_STORAGE_MODE.SERVER).description(`【 ${QQ_MARKDOWN_IMAGE_STORAGE_MODE.SERVER}】使用 Koishi server 服务发送 Markdown 内嵌图片`),
    ])
      .role('radio')
      .default(QQ_MARKDOWN_IMAGE_STORAGE_MODE.SERVER)
      .description([
        '🖼️ Puppeteer / Takumi 本地出图转 QQ Markdown 内联图片时的公网 URL 生成模式。',
        '【 assets】生成公网图片 URL。只能新增，不能删除，文件名由 assets 服务决定，通常无法自定义。',
        '【 server】从 ctx.baseDir/cache/skykid-height-cosmetic-query 暴露临时图片，并按数量上限仅保留最新图片。',
        'standalone、append-text、append-md-table、append-md-style 不使用此配置。',
      ].join('<br/>')),
    qqMarkdownImageSelfUrl: Schema.string().role('textarea', { rows: [2, 5] }).default('').description([
      '🌐 server 模式的公网 URL 覆盖值。',
      '示例：<code>http://【公网地址】:【端口】</code>。',
      '仅图片 URL 生成模式为 server 时生效；留空则回退 ctx.server.config.selfUrl。',
    ].join('<br/>')),
    qqMarkdownImageMaxFiles: Schema.number().step(1).default(5).description([
      '🧹 server 模式缓存图片数量上限。',
      '缓存目录固定为 ctx.baseDir/cache/skykid-height-cosmetic-query；仅保留最新 N 张，填写 <= 0 表示不设置上限。',
    ].join('<br/>')),
    qqMarkdownEmbedApiImage: Schema.boolean().default(true).description('🌐 QQ 官方平台下，API 出图是否改为 QQ Markdown 内联图片。关闭后保持普通图片 + 耗时文本。'),
    qqMarkdownEmbedPptrImage: Schema.boolean().default(true).description('🖼️ QQ 官方平台下，Puppeteer 出图是否改为 QQ Markdown 内联图片。关闭后保持普通图片 + 耗时文本。'),
    qqMarkdownEmbedTakumiImage: Schema.boolean().default(true).description('⚡ QQ 官方平台下，Takumi 出图是否改为 QQ Markdown 内联图片。关闭后保持普通图片 + 耗时文本。'),
  }).description('💬 QQ 官方 Bot Markdown 适配设置'),

  Schema.object({
    verboseSessionLog: Schema.boolean().default(false).description('💬 是否在会话中输出详细调试信息。关闭时 QQ Markdown / 按钮跳过提醒默认不会发送到会话；开启后才会同步发送到会话。'),
    verboseConsoleLog: Schema.boolean().default(false).description('🛠️ 是否在控制台输出详细调试信息。关闭时 QQ Markdown / 按钮跳过提醒默认不会输出到控制台；开启后会输出请求 URL、payload 摘要、接口响应 JSON、渲染、发送、assets/server 图片 URL 生成和字体检查细节。'),
  }).description('🛠️ 调试设置'),
]) as unknown as Schema<Config>
