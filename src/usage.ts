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

<ul>
  <li>🖼️ <b>查询身高</b> / <b>测身高</b> / <b>身高查询</b> / <b>aqh</b> / <b>awa-query-height</b> / <b>查询饰品</b> - Puppeteer 出图</li>
  <li>📝 <b>查询身高-text</b> / <b>测身高-text</b> / <b>身高查询-text</b> / <b>aqht</b> / <b>awa-query-height-text</b> / <b>查询饰品-text</b> - 纯文本</li>
  <li>📨 <b>查询身高-forward</b> / <b>测身高-forward</b> / <b>身高查询-forward</b> / <b>aqhf</b> / <b>awa-query-height-forward</b> / <b>查询饰品-forward</b> - OneBot 合并转发</li>
  <li>⚡ <b>查询身高-takumi</b> / <b>测身高-takumi</b> / <b>身高查询-takumi</b> / <b>aqhk</b> / <b>awa-query-height-takumi</b> / <b>查询饰品-takumi</b> - @takumi-rs/wasm 出图</li>
  <li>🌐 <b>查询身高-api</b> / <b>测身高-api</b> / <b>身高查询-api</b> / <b>aqha</b> / <b>awa-query-height-api</b> / <b>查询饰品-api</b> - 外部 Fastapi Pillow画图后端出图</li>
</ul>

<h3>🧪 测试模式</h3>

<p>所有查询命令都支持 <code>--dry</code> / <code>--dryrun</code>。测试模式不会请求后端，只使用假数据测试文字或图片样式。</p>

<pre>
<code>查询身高 --dryrun</code>
<br>
<code>查询身高-text --dry</code>
<br>
<code>查询身高-forward --dryrun</code>
<br>
<code>查询身高-takumi --dryrun</code>
<br>
<code>查询身高-api --dryrun</code>
</pre>

<h3>🌙 深色模式</h3>

<p>Puppeteer 和 Takumi 出图命令支持 <code>-d</code> / <code>--dark</code> / <code>--darkmode</code>。可选值：<code>true</code> / <code>false</code> / <code>on</code> / <code>off</code> / <code>dark</code> / <code>light</code> / <code>深色</code> / <code>浅色</code>。</p>

<pre>
<code>查询身高-pptr XXXX-XXXX-XXXX -d true</code>
<br>
<code>查询身高-pptr XXXX-XXXX-XXXX --dark on</code>
<br>
<code>查询身高-takumi XXXX-XXXX-XXXX --dark dark</code>
<br>
<code>查询身高-takumi XXXX-XXXX-XXXX --darkmode 深色</code>
</pre>

<h3>🛠️ 调试参数</h3>

<p>所有查询命令支持 <code>-v</code> / <code>--verbose</code>，会在 session 和 console 打印本次命令解析到的详细参数。</p>

<pre>
<code>查询身高 --dryrun -v</code>
</pre>

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
    <tr><td><code>enableTextCommand</code></td><td><code>boolean</code></td><td><code>true</code></td><td>注册纯文本查询指令。</td></tr>
    <tr><td><code>textCommandName</code></td><td><code>string</code></td><td><code>查询身高-text</code></td><td>纯文本主指令名称。</td></tr>
    <tr><td><code>enableForwardCommand</code></td><td><code>boolean</code></td><td><code>true</code></td><td>注册 OneBot 合并转发查询指令。</td></tr>
    <tr><td><code>forwardCommandName</code></td><td><code>string</code></td><td><code>查询身高-forward</code></td><td>OneBot 合并转发主指令名称。</td></tr>
    <tr><td><code>enablePptrCommand</code></td><td><code>boolean</code></td><td><code>true</code></td><td>注册 Puppeteer 出图查询指令。</td></tr>
    <tr><td><code>pptrCommandName</code></td><td><code>string</code></td><td><code>查询身高</code></td><td>Puppeteer 出图主指令名称。</td></tr>
    <tr><td><code>enableTakumiCommand</code></td><td><code>boolean</code></td><td><code>true</code></td><td>注册 Takumi wasm 出图查询指令。</td></tr>
    <tr><td><code>takumiCommandName</code></td><td><code>string</code></td><td><code>查询身高-takumi</code></td><td>Takumi wasm 出图主指令名称。</td></tr>
    <tr><td><code>enableApiCommand</code></td><td><code>boolean</code></td><td><code>false</code></td><td>注册外部 Fastapi Pillow画图后端出图查询指令；启用后可使用 <code>查询身高-api</code> / <code>测身高-api</code> / <code>身高查询-api</code> / <code>aqha</code> / <code>awa-query-height-api</code> / <code>查询饰品-api</code>。</td></tr>
    <tr><td><code>apiCommandName</code></td><td><code>string</code></td><td><code>查询身高-api</code></td><td>外部 Fastapi Pillow画图后端出图主指令名称。</td></tr>
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
    <tr><td><code>pptrImageType</code></td><td><code>"png" | "jpeg" | "webp"</code></td><td><code>png</code></td><td>Puppeteer 图片类型。</td></tr>
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
    <tr><td><code>verboseConsoleLog</code></td><td><code>boolean</code></td><td><code>false</code></td><td>输出详细调试日志，包括请求 URL、payload 摘要和接口响应 JSON 等。</td></tr>
  </tbody>
</table>

</details>

<h3>⚠️ 注意</h3>

<p>默认请求参数 <code>action=delete</code>，会消费一次性好友码。请只提交准备使用的好友码。</p>
`
