const pkg = require('../package.json')

export const usage = `
<h2>🌌 sky-shengao-query v${pkg.version}</h2>

<p>
  <a href="https://www.npmjs.com/package/koishi-plugin-sky-shengao-query" target="_blank">
    <img src="https://img.shields.io/npm/v/koishi-plugin-sky-shengao-query?style=flat-square" alt="npm version">
  </a>
  <a href="https://www.npmjs.com/package/koishi-plugin-sky-shengao-query" target="_blank">
    <img src="https://img.shields.io/npm/dm/koishi-plugin-sky-shengao-query?style=flat-square" alt="npm downloads">
  </a>
  <br>
  <a href="https://github.com/VincentZyuApps/koishi-plugin-sky-shengao-query" target="_blank">
    <img src="https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white" alt="GitHub">
  </a>
  <a href="https://gitee.com/vincent-zyu/koishi-plugin-sky-shengao-query" target="_blank">
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
  <li>🖼️ <b>查询身高 XXXX-XXXX-XXXX</b> / <b>测身高 XXXX-XXXX-XXXX</b> - Puppeteer 出图</li>
  <li>📝 <b>查询身高-text XXXX-XXXX-XXXX</b> - 纯文本</li>
  <li>📨 <b>查询身高-forward XXXX-XXXX-XXXX</b> - OneBot 合并转发</li>
  <li>⚡ <b>查询身高-takumi XXXX-XXXX-XXXX</b> - @takumi-rs/wasm 出图</li>
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
</pre>

<h3>🌙 深色模式</h3>

<p>Puppeteer 和 Takumi 出图命令支持 <code>-d</code> / <code>--dark</code> / <code>--darkmode</code>。可选值：<code>true</code> / <code>false</code> / <code>on</code> / <code>off</code> / <code>dark</code> / <code>light</code> / <code>深色</code> / <code>浅色</code>。</p>

<pre>
<code>查询身高 XXXX-XXXX-XXXX -d</code>
<br>
<code>查询身高-text XXXX-XXXX-XXXX --dark</code>
<br>
<code>查询身高-forward XXXX-XXXX-XXXX --dark false</code>
<br>
<code>查询身高-takumi XXXX-XXXX-XXXX --darkmode 深色</code>
</pre>

<h3>🛠️ 调试参数</h3>

<p>所有查询命令支持 <code>-v</code> / <code>--verbose</code>，会在 session 和 console 打印本次命令解析到的详细参数。</p>

<pre>
<code>查询身高 --dryrun -v</code>
</pre>

<h3>⚙️ 过滤器设置</h3>

<p>如果你的 Koishi 环境启用了过滤器，请确认该插件允许接收目标频道 / 群聊 / 平台消息。否则插件可能已经加载，但命令不会触发。</p>

<h3>⚠️ 注意</h3>

<p>默认请求参数 <code>action=delete</code>，会消费一次性好友码。请只提交准备使用的好友码。</p>

<h3>🔧 接口配置</h3>

<p><code>baseUrl</code>、<code>powChallengeUrl</code> 和 <code>queryUrl</code> 都是配置项，后续接口地址变化时可以直接在 Koishi WebUI 调整。</p>

<h3>🔤 字体缓存</h3>

<p>图片渲染默认使用 <code>LXGWWenKaiMono-Regular.ttf</code>。插件加载时会检查 <code>ctx.baseDir/data/fonts</code>，字体存在且 hash 校验通过时会跳过下载。</p>
`
