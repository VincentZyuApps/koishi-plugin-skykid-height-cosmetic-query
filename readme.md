# koishi-plugin-skykid-height-cosmetic-query

[![npm](https://img.shields.io/npm/v/koishi-plugin-skykid-height-cosmetic-query?style=flat-square)](https://www.npmjs.com/package/koishi-plugin-skykid-height-cosmetic-query)
[![npm-download](https://img.shields.io/npm/dm/koishi-plugin-skykid-height-cosmetic-query?style=flat-square)](https://www.npmjs.com/package/koishi-plugin-skykid-height-cosmetic-query)

[![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/VincentZyuApps/koishi-plugin-skykid-height-cosmetic-query)
[![Gitee](https://img.shields.io/badge/Gitee-C71D23?style=for-the-badge&logo=gitee&logoColor=white)](https://gitee.com/vincent-zyu/koishi-plugin-skykid-height-cosmetic-query)

[![Koishi Forum](https://img.shields.io/badge/Koishi%20Forum-xxxxx-5546A3?style=for-the-badge&logo=https%3A%2F%2Fupload.wikimedia.org%2Fwikipedia%2Fcommons%2Ff%2Ff3%2FKoishi.js_Logo.png&logoColor=white)](https://forum.koishi.xyz/t/topic/xxxxx)
[![QQ群](https://img.shields.io/badge/QQ群-1085190201-12B7F5?style=flat-square&logo=qq&logoColor=white)](https://qm.qq.com/q/ZN7fxZ3qCq)

<h2>💬 交流反馈</h2>
<p>🐛 Bug 反馈 / 💡 建议 / 👨‍💻 插件开发交流，欢迎加群：</p>
<p><del>💬 插件使用问题 / 🐛 Bug反馈 / 👨‍💻 插件开发交流，欢迎加入QQ群：<b>259248174</b>   🎉（这个群G了）</del></p> 
<p>💬 插件使用问题 / 🐛 Bug反馈 / 👨‍💻 插件开发交流，欢迎加入QQ群：<b>1085190201</b> 🎉</p>
<p>💡 在群里直接艾特我，回复的更快哦~ ✨</p>

🌌 查询国服光遇的玩家身高信息捏。基于 `sky.cesgao.cn` 的光遇好友码身高查询插件。

`XXXX-XXXX-XXXX` 表示光遇一次性好友码，例如 `ABCD-EFGH-IJKL`。也支持不带横杠的 12 位好友码。

## 📌 指令

```text
查询身高 XXXX-XXXX-XXXX
测身高 XXXX-XXXX-XXXX
身高查询 XXXX-XXXX-XXXX
aqh XXXX-XXXX-XXXX
awa-query-height XXXX-XXXX-XXXX
查询饰品 XXXX-XXXX-XXXX
```

默认 `查询身高` 使用 Puppeteer 出图。其他输出：

```text
查询身高-text XXXX-XXXX-XXXX
测身高-text XXXX-XXXX-XXXX
身高查询-text XXXX-XXXX-XXXX
aqht XXXX-XXXX-XXXX
awa-query-height-text XXXX-XXXX-XXXX
查询饰品-text XXXX-XXXX-XXXX

查询身高-forward XXXX-XXXX-XXXX
测身高-forward XXXX-XXXX-XXXX
身高查询-forward XXXX-XXXX-XXXX
aqhf XXXX-XXXX-XXXX
awa-query-height-forward XXXX-XXXX-XXXX
查询饰品-forward XXXX-XXXX-XXXX

查询身高-takumi XXXX-XXXX-XXXX
测身高-takumi XXXX-XXXX-XXXX
身高查询-takumi XXXX-XXXX-XXXX
aqhk XXXX-XXXX-XXXX
awa-query-height-takumi XXXX-XXXX-XXXX
查询饰品-takumi XXXX-XXXX-XXXX

查询身高-api XXXX-XXXX-XXXX
测身高-api XXXX-XXXX-XXXX
身高查询-api XXXX-XXXX-XXXX
aqha XXXX-XXXX-XXXX
awa-query-height-api XXXX-XXXX-XXXX
查询饰品-api XXXX-XXXX-XXXX
```

## 🧪 测试模式

所有查询命令都支持 `--dry` / `--dryrun`。测试模式不会请求后端，只使用假数据测试文字或图片样式。

```text
查询身高 --dryrun
查询身高-text --dry
查询身高-forward --dryrun
查询身高-takumi --dryrun
查询身高-api --dryrun
```

## 🌙 深色模式

Puppeteer 和 Takumi 出图命令支持 `-d` / `--dark` / `--darkmode`。可选值：`true` / `false` / `on` / `off` / `dark` / `light` / `深色` / `浅色`。

```text
查询身高-pptr XXXX-XXXX-XXXX -d true
查询身高-pptr XXXX-XXXX-XXXX --dark on
查询身高-takumi XXXX-XXXX-XXXX --dark dark
查询身高-takumi XXXX-XXXX-XXXX --darkmode 深色
```

## 🛠️ 调试参数

所有查询命令支持 `-v` / `--verbose`，会在 session 和 console 打印本次命令解析到的详细参数。

```text
查询身高 --dryrun -v
```

## 🖼️ 输出方式

- 📝 `text`：纯文本
- 📨 `forward`：OneBot 合并转发
- 🖼️ `pptr`：Puppeteer 出图
- ⚡ `takumi`：`@takumi-rs/wasm` 出图
- 🌐 `api`：调用外部 Fastapi Pillow画图后端出图

## ⚙️ 配置项

### 🌐 后端设置

| 配置名 | 类型 | 默认值 | 备注 |
| --- | --- | --- | --- |
| `baseUrl` | `string` | `https://sky.cesgao.cn` | `sky.cesgao.cn` 基础地址。 |
| `powChallengeUrl` | `string` | `https://sky.cesgao.cn/web/v1/pow/challenge` | POW challenge 接口地址。 |
| `queryUrl` | `string` | `https://sky.cesgao.cn/web/v1/query` | 身高查询接口地址。 |
| `httpTimeout` | `number` | `75` | HTTP 总超时时间，单位秒。 |
| `queryTimeout` | `number` | `60` | 提交给查询接口的 `timeout` 参数，单位秒。 |
| `queryAction` | `string` | `delete` | 提交给查询接口的 `action` 参数；默认会消费一次性好友码。 |
| `powMaxNonce` | `number` | `20000000` | POW 最大尝试 nonce。 |
| `sendRunningTip` | `boolean` | `true` | 查询前是否发送“⏳ 正在查询”提示。 |
| `userAgent` | `string` | `Edge/Chrome UA` | 请求查询接口时使用的 User-Agent。 |

### 📌 指令设置

| 配置名 | 类型 | 默认值 | 备注 |
| --- | --- | --- | --- |
| `enableTextCommand` | `boolean` | `true` | 注册纯文本查询指令。 |
| `textCommandName` | `string` | `查询身高-text` | 纯文本主指令名称。 |
| `enableForwardCommand` | `boolean` | `true` | 注册 OneBot 合并转发查询指令。 |
| `forwardCommandName` | `string` | `查询身高-forward` | OneBot 合并转发主指令名称。 |
| `enablePptrCommand` | `boolean` | `true` | 注册 Puppeteer 出图查询指令。 |
| `pptrCommandName` | `string` | `查询身高` | Puppeteer 出图主指令名称。 |
| `enableTakumiCommand` | `boolean` | `true` | 注册 Takumi wasm 出图查询指令。 |
| `takumiCommandName` | `string` | `查询身高-takumi` | Takumi wasm 出图主指令名称。 |
| `enableApiCommand` | `boolean` | `false` | 注册外部 Fastapi Pillow画图后端出图查询指令；启用后可使用 `查询身高-api` / `测身高-api` / `身高查询-api` / `aqha` / `awa-query-height-api` / `查询饰品-api`。 |
| `apiCommandName` | `string` | `查询身高-api` | 外部 Fastapi Pillow画图后端出图主指令名称。 |

### 💬 通用输出设置

| 配置名 | 类型 | 默认值 | 备注 |
| --- | --- | --- | --- |
| `enableQuote` | `boolean` | `true` | 回复时是否引用触发消息。 |
| `textMaxLength` | `number` | `1500` | 纯文本输出最大长度。 |
| `useCustomFont` | `boolean` | `true` | 是否使用自定义字体路径；开启后会检查 `ctx.baseDir/data/fonts/LXGWWenKaiMono-Regular.ttf`，缺失或 hash 校验失败时尝试从 Gitee / GitHub 下载；关闭后 Puppeteer / Takumi 使用系统默认字体，并跳过字体下载。 |

### 🖼️ Puppeteer 出图设置

| 配置名 | 类型 | 默认值 | 备注 |
| --- | --- | --- | --- |
| `pptrWidth` | `number` | `880` | Puppeteer 图片宽度。 |
| `pptrImageType` | `"png" \| "jpeg" \| "webp"` | `png` | Puppeteer 图片类型。 |
| `pptrQuality` | `number` | `90` | Puppeteer 图片质量；`png` 无效。 |
| `pptrFontPath` | `string` | `process.cwd()/data/fonts/LXGWWenKaiMono-Regular.ttf` | Puppeteer 字体路径；运行时会映射到 `ctx.baseDir/data/fonts/LXGWWenKaiMono-Regular.ttf`，留空则使用系统默认字体。 |
| `pptrShowRenderInfo` | `boolean` | `true` | Puppeteer 回复中是否显示渲染耗时。 |

### ⚡ Takumi wasm 出图设置

| 配置名 | 类型 | 默认值 | 备注 |
| --- | --- | --- | --- |
| `takumiWidth` | `number` | `880` | Takumi 图片宽度。 |
| `takumiDarkMode` | `boolean` | `false` | Takumi 默认是否使用深色模式。 |
| `takumiFontPath` | `string` | `process.cwd()/data/fonts/LXGWWenKaiMono-Regular.ttf` | Takumi 字体路径；运行时会映射到 `ctx.baseDir/data/fonts/LXGWWenKaiMono-Regular.ttf`。 |
| `takumiShowRenderInfo` | `boolean` | `true` | Takumi 回复中是否显示渲染耗时。 |

### 🌐 API 出图设置

说明：按照上游作者要求，Fastapi Pillow画图后端闭源，请直接调用已部署的 API；当前默认地址仍保留为本机 `http://127.0.0.1:60704`，可按实际部署修改 `imageApiBaseUrl`。

| 配置名 | 类型 | 默认值 | 备注 |
| --- | --- | --- | --- |
| `imageApiBaseUrl` | `string` | `http://127.0.0.1:60704` | 外部出图 API 基础地址；默认与 `imageApiPath` 组合为 `GET http://127.0.0.1:60704/img/render`，跨机器运行时填写 API 所在机器地址。 |
| `imageApiPath` | `string` | `/img/render` | 外部出图 API 图片路径；默认对接 Fastapi Pillow画图后端的 `/img/render`。背景、logo、字体和版式建议在 Fastapi Pillow画图后端的 `config/config.yaml` 调整。 |
| `imageApiTimeout` | `number` | `60` | 外部出图 API 请求超时时间，单位秒。 |
| `imageApiWidth` | `number` | `1920` | 传给外部出图 API 的 `bg_x` 输出宽度。 |
| `imageApiHeight` | `number` | `1080` | 传给外部出图 API 的 `bg_y` 输出高度。 |
| `imageApiShowOutfitName` | `boolean` | `true` | 是否显示具体装扮名称，对应 `body-txt_name` / `hair-txt_name` 等参数。 |
| `imageApiExtraQueryParams` | `string` | 空字符串 | 追加给外部出图 API 的 URL 查询参数，例如 `gm=20&title_txt=光崽档案`；同名 query 会覆盖插件自动生成的 query。完整填写手册见 Fastapi Pillow画图后端的 `/koishi-query-doc`。 |
| `imageApiShowRenderInfo` | `boolean` | `true` | API 出图回复中是否显示查询和出图总耗时。 |

### 🛠️ 调试设置

| 配置名 | 类型 | 默认值 | 备注 |
| --- | --- | --- | --- |
| `verboseConsoleLog` | `boolean` | `false` | 输出详细调试日志，包括请求 URL、payload 摘要和接口响应 JSON 等。 |

## ⚠️ 注意

默认 `queryAction=delete`，会消费一次性好友码。请只提交准备使用的好友码。
