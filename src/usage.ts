const pkg = require('../package.json')

export const usage = `
<h2>🌌 skykid-height-cosmetic-query v${pkg.version}</h2>

<p>
  <a href="https://www.npmjs.com/package/koishi-plugin-skykid-height-cosmetic-query" target="_blank">
    <img src="https://img.shields.io/npm/v/koishi-plugin-skykid-height-cosmetic-query?style=flat-square" alt="npm version">
  </a>
  <a href="https://www.npmjs.com/package/koishi-plugin-skykid-height-cosmetic-query" target="_blank">
    <img src="https://img.shields.io/npm/dm/koishi-plugin-skykid-height-cosmetic-query?style=flat-square" alt="npm downloads">
  </a>
  <br>
  <a href="https://github.com/VincentZyuApps/koishi-plugin-skykid-height-cosmetic-query" target="_blank">
    <img src="https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white" alt="GitHub">
  </a>
  <a href="https://gitee.com/vincent-zyu/koishi-plugin-skykid-height-cosmetic-query" target="_blank">
    <img src="https://img.shields.io/badge/Gitee-C71D23?style=for-the-badge&logo=gitee&logoColor=white" alt="Gitee">
  </a>
  <br>
  <a href="https://forum.koishi.xyz/t/topic/xxxxx" target="_blank">
    <img src="https://img.shields.io/badge/Koishi%20Forum-xxxxx-5546A3?style=for-the-badge&logo=https%3A%2F%2Fupload.wikimedia.org%2Fwikipedia%2Fcommons%2Ff%2Ff3%2FKoishi.js_Logo.png&logoColor=white" alt="Koishi Forum">
  </a>
  <a href="https://qm.qq.com/q/xxxxx" target="_blank">
    <img src="https://img.shields.io/badge/QQ群-xxxxx-12B7F5?style=flat-square&logo=qq&logoColor=white" alt="QQ群">
  </a>
</p>

<h2>💬 交流反馈</h2>
<p>🐛 Bug 反馈 / 💡 建议 / 👨‍💻 插件开发交流，欢迎加群：</p>
<p><del>💬 插件使用问题 / 🐛 Bug反馈 / 👨‍💻 插件开发交流，欢迎加入QQ群：<b>259248174</b>   🎉（这个群G了）</del></p>
<p>💬 插件使用问题 / 🐛 Bug反馈 / 👨‍💻 插件开发交流，欢迎加入QQ群：<b>1085190201</b> 🎉</p>
<p>💡 在群里直接艾特我，回复的更快哦~ ✨</p>

<p>基于 <code>sky.cesgao.cn</code> 的光遇好友码身高查询插件。</p>
<p><code>XXXX-XXXX-XXXX</code> 表示光遇一次性好友码，例如 <code>ABCD-EFGH-IJKL</code>。也支持不带横杠的 12 位好友码。</p>

<h3>📌 指令</h3>

<p>默认前缀是 <code>查询光崽身高装扮</code>。默认前缀别名是 <code>查询光崽身高</code>、<code>查询光崽装扮</code>、<code>查询身高</code>、<code>查询装扮</code>、<code>测身高</code>，每个前缀都会和相同后缀组合成可用指令。</p>

<ul>
  <li>❔ <b>查询光崽身高装扮.帮助</b> - 查看帮助</li>
  <li>🖼️ <b>查询光崽身高装扮.pptr</b> - Puppeteer 出图</li>
  <li>📝 <b>查询光崽身高装扮.text</b> - 纯文本</li>
  <li>📨 <b>查询光崽身高装扮.forward</b> - OneBot 合并转发</li>
  <li>⚡ <b>查询光崽身高装扮.takumi</b> - @takumi-rs/wasm 出图</li>
  <li>🌐 <b>查询光崽身高装扮.api</b> - 外部 Fastapi Pillow画图后端出图</li>
  <li>💫 <b>查询光崽身高装扮.md-style</b> - QQ Markdown 格式风格，仅 QQ 官方平台支持</li>
  <li>📊 <b>查询光崽身高装扮.md-table</b> - QQ Markdown 表格，仅 QQ 官方平台支持</li>
</ul>

<h3>🧪 测试模式</h3>

<p>所有查询命令都支持 <code>--dry</code> / <code>--dryrun</code>。测试模式不会请求后端，只使用假数据测试文字或图片样式。</p>

<pre>
<code>查询光崽身高装扮.pptr --dryrun</code>
<br>
<code>查询光崽身高装扮.text --dry</code>
<br>
<code>查询光崽身高装扮.forward --dryrun</code>
<br>
<code>查询光崽身高装扮.takumi --dryrun</code>
<br>
<code>查询光崽身高装扮.api --dryrun</code>
<br>
<code>查询光崽身高装扮.md-style --dryrun</code>
<br>
<code>查询光崽身高装扮.md-table --dryrun</code>
</pre>

<h3>🌙 深色模式</h3>

<p>Puppeteer 和 Takumi 出图命令支持 <code>-d</code> / <code>--dark</code> / <code>--darkmode</code>。可选值：<code>true</code> / <code>false</code> / <code>on</code> / <code>off</code> / <code>dark</code> / <code>light</code> / <code>深色</code> / <code>浅色</code>。</p>

<pre>
<code>查询光崽身高装扮.pptr XXXX-XXXX-XXXX -d true</code>
<br>
<code>查询光崽身高装扮.pptr XXXX-XXXX-XXXX --dark on</code>
<br>
<code>查询光崽身高装扮.takumi XXXX-XXXX-XXXX --dark dark</code>
<br>
<code>查询光崽身高装扮.takumi XXXX-XXXX-XXXX --darkmode 深色</code>
</pre>

<h3>🛠️ 调试参数</h3>

<p>所有查询命令支持 <code>-v</code> / <code>--verbose</code>，会在 session 和 console 打印本次命令解析到的详细参数。</p>

<pre>
<code>查询光崽身高装扮.pptr --dryrun -v</code>
</pre>

<h3>💬 QQ 官方 Bot Markdown</h3>

<p>QQ Markdown 相关输出仅支持 Koishi 的 QQ 官方 Bot 平台，非 QQ 平台不会 fallback 成其他格式。默认注册 <code>查询光崽身高装扮.md-style</code>，<code>查询光崽身高装扮.md-table</code> 默认关闭。</p>
<p><code>qqMarkdownButtonMode</code> 控制按钮 append / standalone 行为。<code>append-api-image</code> / <code>append-pptr-image</code> / <code>append-takumi-image</code> 需要对应的内联图片开关为 <code>true</code>；否则默认静默跳过，开启 <code>verboseSessionLog</code> / <code>verboseConsoleLog</code> 后才会提示。</p>
<p>Puppeteer / Takumi 本地图片嵌入 Markdown 时，需要通过 <code>server</code> 或 <code>assets</code> 生成公网 URL。server 模式缓存目录为 <code>ctx.baseDir/cache/skykid-height-cosmetic-query</code>，暴露路由为 <code>/skykid-height-cosmetic-query/cache/:name</code>。</p>

<details>
<summary><h3>⚙️ 配置项（点击展开）</h3></summary>

<h4>🌐 后端设置</h4>

<table>
  <thead>
    <tr>
      <th>配置名</th>
      <th>类型</th>
      <th>默认值</th>
      <th>备注</th>
    </tr>
  </thead>
  <tbody>
    <tr><td><code>baseUrl</code></td><td><code>string</code></td><td><code>https://sky.cesgao.cn</code></td><td><code>sky.cesgao.cn</code> 基础地址。</td></tr>
    <tr><td><code>powChallengeUrl</code></td><td><code>string</code></td><td><code>https://sky.cesgao.cn/web/v1/pow/challenge</code></td><td>POW challenge 接口地址。</td></tr>
    <tr><td><code>queryUrl</code></td><td><code>string</code></td><td><code>https://sky.cesgao.cn/web/v1/query</code></td><td>身高查询接口地址。</td></tr>
    <tr><td><code>httpTimeout</code></td><td><code>number</code></td><td><code>75</code></td><td>HTTP 总超时时间，单位秒。</td></tr>
    <tr><td><code>queryTimeout</code></td><td><code>number</code></td><td><code>60</code></td><td>提交给查询接口的 <code>timeout</code> 参数，单位秒。</td></tr>
    <tr><td><code>queryAction</code></td><td><code>string</code></td><td><code>delete</code></td><td>提交给查询接口的 <code>action</code> 参数；默认会消费一次性好友码。</td></tr>
    <tr><td><code>powMaxNonce</code></td><td><code>number</code></td><td><code>20000000</code></td><td>POW 最大尝试 nonce。</td></tr>
    <tr><td><code>sendRunningTip</code></td><td><code>boolean</code></td><td><code>true</code></td><td>查询前是否发送“⏳ 正在查询”提示。</td></tr>
    <tr><td><code>userAgent</code></td><td><code>string</code></td><td><code>Edge/Chrome UA</code></td><td>请求查询接口时使用的 User-Agent。</td></tr>
  </tbody>
</table>

<h4>📌 指令设置</h4>

<table>
  <thead>
    <tr>
      <th>配置名</th>
      <th>类型</th>
      <th>默认值</th>
      <th>备注</th>
    </tr>
  </thead>
  <tbody>
    <tr><td><code>commandPrefix</code></td><td><code>string</code></td><td><code>查询光崽身高装扮</code></td><td>查询指令共同前缀；实际命令格式为 <code>前缀.后缀</code>。</td></tr>
    <tr><td><code>commandPrefixAliases</code></td><td><code>string[]</code></td><td><code>查询光崽身高</code>, <code>查询光崽装扮</code>, <code>查询身高</code>, <code>查询装扮</code>, <code>测身高</code></td><td>查询指令前缀别名；每个别名都会和相同后缀组合成指令 alias，例如 <code>查询光崽身高.pptr</code>。</td></tr>
    <tr><td><code>enableHelpCommand</code></td><td><code>boolean</code></td><td><code>true</code></td><td>注册帮助指令。</td></tr>
    <tr><td><code>helpCommandSuffix</code></td><td><code>string</code></td><td><code>帮助</code></td><td>帮助指令后缀。</td></tr>
    <tr><td><code>enableTextCommand</code></td><td><code>boolean</code></td><td><code>true</code></td><td>注册纯文本查询指令。</td></tr>
    <tr><td><code>textCommandSuffix</code></td><td><code>string</code></td><td><code>text</code></td><td>纯文本指令后缀。</td></tr>
    <tr><td><code>enableForwardCommand</code></td><td><code>boolean</code></td><td><code>true</code></td><td>注册 OneBot 合并转发查询指令。</td></tr>
    <tr><td><code>forwardCommandSuffix</code></td><td><code>string</code></td><td><code>forward</code></td><td>OneBot 合并转发指令后缀。</td></tr>
    <tr><td><code>enablePptrCommand</code></td><td><code>boolean</code></td><td><code>true</code></td><td>注册 Puppeteer 出图查询指令。</td></tr>
    <tr><td><code>pptrCommandSuffix</code></td><td><code>string</code></td><td><code>pptr</code></td><td>Puppeteer 出图指令后缀。</td></tr>
    <tr><td><code>enableTakumiCommand</code></td><td><code>boolean</code></td><td><code>true</code></td><td>注册 Takumi wasm 出图查询指令。</td></tr>
    <tr><td><code>takumiCommandSuffix</code></td><td><code>string</code></td><td><code>takumi</code></td><td>Takumi wasm 出图指令后缀。</td></tr>
    <tr><td><code>enableApiCommand</code></td><td><code>boolean</code></td><td><code>false</code></td><td>注册外部 Fastapi Pillow画图后端出图查询指令。</td></tr>
    <tr><td><code>apiCommandSuffix</code></td><td><code>string</code></td><td><code>api</code></td><td>外部 Fastapi Pillow画图后端出图指令后缀。</td></tr>
    <tr><td><code>enableQqMdTableCommand</code></td><td><code>boolean</code></td><td><code>false</code></td><td>注册 QQ Markdown 表格模式查询指令；仅 QQ 官方 Bot 平台支持。</td></tr>
    <tr><td><code>qqMdTableCommandSuffix</code></td><td><code>string</code></td><td><code>md-table</code></td><td>QQ Markdown 表格模式指令后缀。</td></tr>
    <tr><td><code>enableQqMdStyleCommand</code></td><td><code>boolean</code></td><td><code>true</code></td><td>注册 QQ Markdown 格式风格查询指令；仅 QQ 官方 Bot 平台支持。</td></tr>
    <tr><td><code>qqMdStyleCommandSuffix</code></td><td><code>string</code></td><td><code>md-style</code></td><td>QQ Markdown 格式风格指令后缀。</td></tr>
  </tbody>
</table>

<h4>💬 通用输出设置</h4>

<table>
  <thead>
    <tr>
      <th>配置名</th>
      <th>类型</th>
      <th>默认值</th>
      <th>备注</th>
    </tr>
  </thead>
  <tbody>
    <tr><td><code>enableQuote</code></td><td><code>boolean</code></td><td><code>true</code></td><td>回复时是否引用触发消息。</td></tr>
    <tr><td><code>textMaxLength</code></td><td><code>number</code></td><td><code>1500</code></td><td>纯文本输出最大长度。</td></tr>
    <tr><td><code>hideFullUuid</code></td><td><code>boolean</code></td><td><code>true</code></td><td>是否不显示完整 UUID；开启后显示前 10 个字符并追加 <code>......</code>，关闭后显示完整 UUID。</td></tr>
    <tr><td><code>showFullUnknownOutfitId</code></td><td><code>boolean</code></td><td><code>false</code></td><td>未知装扮是否显示完整 ID；默认隐藏，<code>未知装扮(123456)</code> 会显示为 <code>未知装扮(123...)</code>。</td></tr>
    <tr><td><code>useCustomFont</code></td><td><code>boolean</code></td><td><code>true</code></td><td>是否使用自定义字体路径；开启后会检查 <code>ctx.baseDir/data/fonts/LXGWWenKaiMono-Regular.ttf</code>，缺失或 hash 校验失败时尝试从 Gitee / GitHub 下载；关闭后 Puppeteer / Takumi 使用系统默认字体，并跳过字体下载。</td></tr>
  </tbody>
</table>

<h4>🖼️ Puppeteer 出图设置</h4>

<table>
  <thead>
    <tr>
      <th>配置名</th>
      <th>类型</th>
      <th>默认值</th>
      <th>备注</th>
    </tr>
  </thead>
  <tbody>
    <tr><td><code>pptrWidth</code></td><td><code>number</code></td><td><code>880</code></td><td>Puppeteer 图片宽度。</td></tr>
    <tr><td><code>pptrDeviceScaleFactor</code></td><td><code>number</code></td><td><code>2.5</code></td><td>Puppeteer 截图设备像素比，越高越清晰但图片体积越大。</td></tr>
    <tr><td><code>pptrImageType</code></td><td><code>"png" | "jpeg" | "webp"</code></td><td><code>png</code></td><td>Puppeteer 图片类型。</td></tr>
    <tr><td><code>pptrCardColorMode</code></td><td><code>"solid" | "fixed" | "random"</code></td><td><code>random</code></td><td>Puppeteer 圆角矩形配色模式；<code>solid</code> 完全纯色，<code>fixed</code> 固定的随便感，<code>random</code> 完全随机。</td></tr>
    <tr><td><code>pptrQuality</code></td><td><code>number</code></td><td><code>90</code></td><td>Puppeteer 图片质量；<code>png</code> 无效。</td></tr>
    <tr><td><code>pptrFontPath</code></td><td><code>string</code></td><td><code>process.cwd()/data/fonts/LXGWWenKaiMono-Regular.ttf</code></td><td>Puppeteer 字体路径；运行时会映射到 <code>ctx.baseDir/data/fonts/LXGWWenKaiMono-Regular.ttf</code>，留空则使用系统默认字体。</td></tr>
    <tr><td><code>pptrShowRenderInfo</code></td><td><code>boolean</code></td><td><code>true</code></td><td>Puppeteer 回复中是否显示渲染耗时。</td></tr>
  </tbody>
</table>

<h4>⚡ Takumi wasm 出图设置</h4>

<table>
  <thead>
    <tr>
      <th>配置名</th>
      <th>类型</th>
      <th>默认值</th>
      <th>备注</th>
    </tr>
  </thead>
  <tbody>
    <tr><td><code>takumiWidth</code></td><td><code>number</code></td><td><code>880</code></td><td>Takumi 图片宽度。</td></tr>
    <tr><td><code>takumiDarkMode</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Takumi 默认是否使用深色模式。</td></tr>
    <tr><td><code>takumiFontPath</code></td><td><code>string</code></td><td><code>process.cwd()/data/fonts/LXGWWenKaiMono-Regular.ttf</code></td><td>Takumi 字体路径；运行时会映射到 <code>ctx.baseDir/data/fonts/LXGWWenKaiMono-Regular.ttf</code>。</td></tr>
    <tr><td><code>takumiShowRenderInfo</code></td><td><code>boolean</code></td><td><code>true</code></td><td>Takumi 回复中是否显示渲染耗时。</td></tr>
  </tbody>
</table>

<h4>🌐 API 出图设置</h4>

<p>说明：按照上游作者要求，Fastapi Pillow画图后端闭源，请直接调用已部署的 API；当前默认地址仍保留为本机 <code>http://127.0.0.1:60704</code>，可按实际部署修改 <code>imageApiBaseUrl</code>。</p>

<table>
  <thead>
    <tr>
      <th>配置名</th>
      <th>类型</th>
      <th>默认值</th>
      <th>备注</th>
    </tr>
  </thead>
  <tbody>
    <tr><td><code>imageApiBaseUrl</code></td><td><code>string</code></td><td><code>http://127.0.0.1:60704</code></td><td>外部出图 API 基础地址；默认与 <code>imageApiPath</code> 组合为 <code>GET http://127.0.0.1:60704/img/render</code>，跨机器运行时填写 API 所在机器地址。</td></tr>
    <tr><td><code>imageApiPath</code></td><td><code>string</code></td><td><code>/img/render</code></td><td>外部出图 API 图片路径；默认对接 Fastapi Pillow画图后端的 <code>/img/render</code>。背景、logo、字体和版式建议在 Fastapi Pillow画图后端的 <code>config/config.yaml</code> 调整。</td></tr>
    <tr><td><code>imageApiTimeout</code></td><td><code>number</code></td><td><code>60</code></td><td>外部出图 API 请求超时时间，单位秒。</td></tr>
    <tr><td><code>imageApiWidth</code></td><td><code>number</code></td><td><code>1920</code></td><td>传给外部出图 API 的 <code>bg_x</code> 输出宽度。</td></tr>
    <tr><td><code>imageApiHeight</code></td><td><code>number</code></td><td><code>1080</code></td><td>传给外部出图 API 的 <code>bg_y</code> 输出高度。</td></tr>
    <tr><td><code>imageApiShowOutfitName</code></td><td><code>boolean</code></td><td><code>true</code></td><td>是否显示具体装扮名称，对应 <code>body-txt_name</code> / <code>hair-txt_name</code> 等参数。</td></tr>
    <tr><td><code>imageApiExtraQueryParams</code></td><td><code>string</code></td><td>空字符串</td><td>追加给外部出图 API 的 URL 查询参数，例如 <code>gm=20&amp;title_txt=光崽档案</code>；同名 query 会覆盖插件自动生成的 query。完整填写手册见 Fastapi Pillow画图后端的 <code>/koishi-query-doc</code>。</td></tr>
    <tr><td><code>imageApiShowRenderInfo</code></td><td><code>boolean</code></td><td><code>true</code></td><td>API 出图回复中是否显示查询和出图总耗时。</td></tr>
  </tbody>
</table>

<h4>💬 QQ 官方 Bot Markdown 适配设置</h4>

<table>
  <thead>
    <tr>
      <th>配置名</th>
      <th>类型</th>
      <th>默认值</th>
      <th>备注</th>
    </tr>
  </thead>
  <tbody>
    <tr><td><code>qqMarkdownButtonMode</code></td><td><code>string[]</code></td><td>append 除 standalone 外全部勾选</td><td>QQ Markdown 按钮发送行为；包含 <code>append-text</code> / <code>append-api-image</code> / <code>append-pptr-image</code> / <code>append-takumi-image</code> / <code>append-md-table</code> / <code>append-md-style</code> / <code>standalone</code>。</td></tr>
    <tr><td><code>qqMarkdownKeyboardJson</code></td><td><code>string</code></td><td>空字符串</td><td>QQ Markdown 按钮 JSON；留空时默认一行两个按钮：获取帮助 -> 当前前缀.帮助，玩玩别的 -> help。</td></tr>
    <tr><td><code>qqMarkdownImageStorageMode</code></td><td><code>"assets" | "server"</code></td><td><code>server</code></td><td>Puppeteer / Takumi 本地图片转公网 URL 的方式。</td></tr>
    <tr><td><code>qqMarkdownImageSelfUrl</code></td><td><code>string</code></td><td>空字符串</td><td>server 模式公网 URL 覆盖值；留空则回退 <code>ctx.server.config.selfUrl</code>。</td></tr>
    <tr><td><code>qqMarkdownImageMaxFiles</code></td><td><code>number</code></td><td><code>5</code></td><td>server 模式缓存图片数量上限；<code>&lt;= 0</code> 表示不限制。</td></tr>
    <tr><td><code>qqMarkdownEmbedApiImage</code></td><td><code>boolean</code></td><td><code>true</code></td><td>QQ 官方平台下，API 出图是否改为 QQ Markdown 内联图片。</td></tr>
    <tr><td><code>qqMarkdownEmbedPptrImage</code></td><td><code>boolean</code></td><td><code>true</code></td><td>QQ 官方平台下，Puppeteer 出图是否改为 QQ Markdown 内联图片。</td></tr>
    <tr><td><code>qqMarkdownEmbedTakumiImage</code></td><td><code>boolean</code></td><td><code>true</code></td><td>QQ 官方平台下，Takumi 出图是否改为 QQ Markdown 内联图片。</td></tr>
  </tbody>
</table>

<h4>🛠️ 调试设置</h4>

<table>
  <thead>
    <tr>
      <th>配置名</th>
      <th>类型</th>
      <th>默认值</th>
      <th>备注</th>
    </tr>
  </thead>
  <tbody>
    <tr><td><code>verboseSessionLog</code></td><td><code>boolean</code></td><td><code>false</code></td><td>是否在会话中输出详细调试信息；QQ Markdown / 按钮跳过提醒默认不会发送到会话。</td></tr>
    <tr><td><code>verboseConsoleLog</code></td><td><code>boolean</code></td><td><code>false</code></td><td>是否在控制台输出详细调试信息；QQ Markdown / 按钮跳过提醒默认不会输出到控制台。</td></tr>
  </tbody>
</table>

</details>

<h3>⚠️ 注意</h3>

<p>默认请求参数 <code>action=delete</code>，会消费一次性好友码。请只提交准备使用的好友码。</p>
`
