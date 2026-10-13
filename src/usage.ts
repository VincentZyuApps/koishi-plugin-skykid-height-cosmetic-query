const pkg = require('../package.json')

const containerStyle = [
  'margin: 12px 0;',
  'padding: 16px 20px;',
  'border: 1px solid var(--k-color-border, rgba(127, 127, 127, 0.25));',
  'border-radius: 13px;',
  'background: var(--k-card-bg, rgba(127, 127, 127, 0.04));',
  'box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);',
  'color: var(--k-text-dark, inherit);',
  'line-height: 1.6;',
].join('')

const detailsStyle = [
  'margin: 12px 0;',
  'border: 1px solid var(--k-color-border, rgba(127, 127, 127, 0.3));',
  'border-radius: 10px;',
  'background: var(--k-card-bg, rgba(127, 127, 127, 0.03));',
  'overflow: hidden;',
  'box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);',
  'transition: border-color .2s ease, background-color .2s ease;',
].join('')

const summaryStyle = [
  'padding: 10px 14px;',
  'background: var(--k-hover-bg, rgba(127, 127, 127, 0.09));',
  'color: var(--k-text-dark, inherit);',
  'cursor: pointer;',
  'user-select: none;',
  'font-size: 14.5px;',
].join('')

const detailsBodyStyle = [
  'padding: 12px 16px 14px;',
  'border-top: 1px solid var(--k-color-divider, rgba(127, 127, 127, 0.2));',
  'background: var(--k-card-bg, transparent);',
  'color: var(--k-text-dark, inherit);',
  'line-height: 1.65;',
].join('')

const KOISHI_LOGO_BASE64 = 'data%3Aimage%2Fpng%3Bbase64%2CiVBORw0KGgoAAAANSUhEUgAAABIAAAASCAYAAABWzo5XAAABU0lEQVR42p2UQSsFYRSGnxnqLuytKWKpKFkQNsS%2FsOHPWPADLCmxU5S7UzYWNrJR7lYiRF2FeWzOMKZ7mXHqNNP5vvP2nu%2B850CY2lP4X1K31ZbaDm%2BpO%2Bpyp5wfAXVEPfRvO1JHf4AVQGbUh7j4EZ4VkrNCXPVRnf3CUBN1SH2KC28VGOV3ntRhNclZHdcAKYM11QR1oVBOXctzFlNgBTC8qmXxPQEegbVeYApIgJT6tg%2F0AdMp0B%2FBpCabK2AAmAAa%2F2GRBft1oBFPkqTAba7LCiAfQC9wClwAY1HJHepuiO29Yrsf1Dn1uiDU3RTYCtTkl1Leg8k9MB4NGgReI28rV3azgyCz0og01Xl1Uz1QX8uCTELm3UbkTF1VJ9Wr0tn3iBSGdjYG0XivE3VN3VD31PM4a3cc2tIGGI0VkTO7rLxGuiy25ejmjfqsvkSXui62TxaK03td4FXTAAAAAElFTkSuQmCC'

export const usage = `
<div style="${containerStyle}">

  <h1 style="margin: 0 0 8px 0; color: #0284c7; font-size: 22px; display: flex; align-items: center; gap: 8px;">
    <span>🌌</span> Koishi 插件：光遇国服身高与装扮查询
  </h1>
  <div style="font-size: 13.5px; opacity: 0.85; margin-bottom: 12px;">
    🎯 <b>插件版本：</b><code>v${pkg.version}</code>
  </div>

  <p style="margin: 10px 0;">
    <a href="https://www.npmjs.com/package/koishi-plugin-skykid-height-cosmetic-query" target="_blank">
      <img src="https://img.shields.io/npm/v/koishi-plugin-skykid-height-cosmetic-query?style=flat-square&logo=npm" alt="npm version">
    </a>
    <a href="https://npm-stat.com/charts.html?package=koishi-plugin-skykid-height-cosmetic-query" target="_blank">
      <img src="https://img.shields.io/npm/dm/koishi-plugin-skykid-height-cosmetic-query?style=flat-square&logo=npm" alt="npm downloads">
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
      <img src="https://img.shields.io/badge/Koishi%20Forum-xxxxx-5546A3?style=for-the-badge&logo=${KOISHI_LOGO_BASE64}&logoColor=white" alt="Koishi Forum">
    </a>
    <a href="https://qm.qq.com/q/rvrRosfKMw" target="_blank">
      <img src="https://img.shields.io/badge/awa群_zyu建的qq群-1085190201-12B7F5?style=flat-square&logo=qq&logoColor=white" alt="awa群-zyu建的qq群">
    </a>
  </p>

  <h2 style="margin: 18px 0 8px 0; font-size: 16px; border-bottom: 1px solid var(--k-color-divider, rgba(127, 127, 127, 0.2)); padding-bottom: 6px;">
    💬 交流反馈
  </h2>
  <p style="margin: 4px 0;">🐛 Bug 反馈 / 💡 建议 / 👨‍💻 插件开发交流，欢迎加群：</p>
  <p style="margin: 4px 0;"><del>💬 插件使用问题 / 🐛 Bug反馈 / 👨‍💻 插件开发交流，欢迎加入QQ群：<b>259248174</b>   🎉（这个群G了）</del></p>
  <p style="margin: 4px 0;">💬 插件使用问题 / 🐛 Bug反馈 / 👨‍💻 插件开发交流，欢迎加入 awa群-zyu建的qq群：<b style="color: #12B7F5;">1085190201</b> 🎉</p>
  <p style="margin: 4px 0;">💡 在群里直接艾特我，回复的更快哦~ ✨</p>

  <blockquote style="margin: 14px 0; padding: 10px 14px; border-left: 5px solid #0284c7; border-radius: 6px; background: rgba(2, 132, 199, 0.08); line-height: 1.6;">
    <b style="color: #0284c7;">💡 双模式查询能力：</b><br>
    • 支持光遇<b>好友码联网查询</b>（基于 <code>sky.cesgao.cn</code>，会消耗一次性好友码）<br>
    • 支持<b>离线扫码链接解析</b>（严格匹配 <code>https://sky.thatg.co/o=...</code>，完全本地零外部依赖秒级解码，不消耗好友码）
  </blockquote>

  <!-- 折叠区域 1 -->
  <details style="${detailsStyle}">
    <summary style="${summaryStyle}"><b style="color: #0284c7;">🔍 两种查询输入模式说明（好友码 vs 离线扫码链接）</b></summary>
    <div style="${detailsBodyStyle}">
      <p style="margin: 4px 0;"><b>1️⃣ 传统好友码模式（联网查询）：</b></p>
      <ul style="margin: 4px 0; padding-left: 20px;">
        <li>输入格式：光遇一次性好友码，如 <code>ABCD-EFGH-IJKL</code> 或 12 位无横杠码 <code>ABCDEFGHIJKL</code>。</li>
        <li>行为机制：通过 POW 运算向 <code>sky.cesgao.cn</code> 发起查询，<b>默认 <code>action=delete</code> 会消费一次性好友码</b>。</li>
      </ul>
      <p style="margin: 8px 0 4px 0;"><b>2️⃣ 离线扫码链接模式（零依赖本地解码）：</b></p>
      <ul style="margin: 4px 0; padding-left: 20px;">
        <li>输入格式：严格以 <code>https://sky.thatg.co/o=</code> 开头的扫码 URL，例如 <code>https://sky.thatg.co/o=8RZ7...</code>。</li>
        <li>行为机制：纯本地 Base64URL 解码 ➔ 手写 LZ4 Block 算法解压 ➔ 提取体型值与身高值 ➔ 按身高公式自动换算。<b>完全离线，不消耗好友码，秒回。</b></li>
        <li>装扮名称解析：若开启了 Python 绘图后端（默认 60704 端口），会自动调用接口解析装扮中文名；若未开启后端，则优雅降级为 <code>ID 123456</code> 显示，绝不报错。</li>
      </ul>
    </div>
  </details>

  <!-- 折叠区域 2 -->
  <details style="${detailsStyle}">
    <summary style="${summaryStyle}"><b style="color: #b45309;">📌 指令列表与输出形态（纯文本 / 转发 / 多引擎出图 / QQ Markdown）</b></summary>
    <div style="${detailsBodyStyle}">
      <p style="margin: 4px 0;">默认配置的主指令前缀是 <code>测身高</code>。默认配置的前缀别名包含 <code>查询光崽身高装扮</code>、<code>查询光崽身高</code>、<code>查询光崽装扮</code>、<code>查询身高</code>、<code>查询装扮</code>，每个前缀均可与以下子指令后缀自由搭配：</p>
      <ul style="margin: 4px 0; padding-left: 20px;">
        <li>📝 <b>查询光崽身高装扮.text</b> - 纯文本输出（带装扮与详细身高编号）</li>
        <li>🖼️ <b>查询光崽身高装扮.pptr</b> - Puppeteer 浏览器渲染卡片图</li>
        <li>⚡ <b>查询光崽身高装扮.takumi</b> - 极速轻量的 <code>@takumi-rs/wasm</code> 本地出图</li>
        <li>🌐 <b>查询光崽身高装扮.api</b> - 外部 Fastapi Pillow 绘图后端出图</li>
        <li>📨 <b>查询光崽身高装扮.forward</b> - OneBot 合并转发消息格式</li>
        <li>💫 <b>查询光崽身高装扮.md-style</b> - QQ 官方 Bot 专属 Markdown 格式风格</li>
        <li>📊 <b>查询光崽身高装扮.md-table</b> - QQ 官方 Bot 专属 Markdown 表格模式</li>
        <li>❔ <b>查询光崽身高装扮.帮助</b> - 快速查看命令使用帮助</li>
      </ul>
      <p style="margin: 8px 0 2px 0;"><b>用法示例：</b><br>
        <code>查询光崽身高装扮.text ABCD-EFGH-IJKL</code>（查好友码）<br>
        <code>查询光崽身高装扮.pptr https://sky.thatg.co/o=8RZ7...</code>（查离线扫码）
      </p>
    </div>
  </details>

  <!-- 折叠区域 3 -->
  <details style="${detailsStyle}">
    <summary style="${summaryStyle}"><b style="color: #059669;">🧪 常用命令修饰选项（测试 / 深色 / 调试）</b></summary>
    <div style="${detailsBodyStyle}">
      <p style="margin: 4px 0;"><b>🧪 样式测试模式（--dry / --dryrun）：</b></p>
      <p style="margin: 2px 0;">跳过外部请求与数据解码，使用假数据测试各渲染器的排版与图片样式：</p>
      <pre style="margin: 4px 0; padding: 8px 12px; border-radius: 6px; background: var(--k-card-bg, rgba(0, 0, 0, 0.05)); border: 1px solid var(--k-color-divider, rgba(127, 127, 127, 0.2)); font-family: ui-monospace, Consolas, monospace; font-size: 13px;"><code>查询光崽身高装扮.pptr --dryrun
查询光崽身高装扮.takumi --dry
查询光崽身高装扮.api --dryrun</code></pre>
      <p style="margin: 8px 0 2px 0;"><b>🌙 深色模式（-d / --dark / --darkmode）：</b></p>
      <p style="margin: 2px 0;">支持 <code>pptr</code> 和 <code>takumi</code> 出图。可选值：<code>true</code> / <code>false</code> / <code>on</code> / <code>off</code> / <code>dark</code> / <code>light</code> / <code>深色</code> / <code>浅色</code>：</p>
      <pre style="margin: 4px 0; padding: 8px 12px; border-radius: 6px; background: var(--k-card-bg, rgba(0, 0, 0, 0.05)); border: 1px solid var(--k-color-divider, rgba(127, 127, 127, 0.2)); font-family: ui-monospace, Consolas, monospace; font-size: 13px;"><code>查询光崽身高装扮.pptr 【好友码或链接】 -d true
查询光崽身高装扮.takumi 【好友码或链接】 --dark 深色</code></pre>
      <p style="margin: 8px 0 2px 0;"><b>🛠️ 调试日志（-v / --verbose）：</b></p>
      <p style="margin: 2px 0;">在会话和控制台输出本次解析到的详尽参数：</p>
      <pre style="margin: 4px 0; padding: 8px 12px; border-radius: 6px; background: var(--k-card-bg, rgba(0, 0, 0, 0.05)); border: 1px solid var(--k-color-divider, rgba(127, 127, 127, 0.2)); font-family: ui-monospace, Consolas, monospace; font-size: 13px;"><code>查询光崽身高装扮.text 【好友码或链接】 -v</code></pre>
    </div>
  </details>

  <!-- 折叠区域 4 -->
  <details style="${detailsStyle}">
    <summary style="${summaryStyle}"><b style="color: #7c3aed;">💬 QQ 官方 Bot Markdown 适配设置提醒</b></summary>
    <div style="${detailsBodyStyle}">
      <p style="margin: 4px 0;"><b>🤖 平台要求：</b>QQ Markdown 仅对 QQ 官方 Bot 平台生效，其他平台不会强行调用。</p>
      <p style="margin: 4px 0;"><b>🔘 按钮模式：</b>由 <code>qqMarkdownButtonMode</code> 控制。内联图片挂按钮（如 <code>append-api-image</code>）需要对应的内联图片开关打开；否则静默跳过。</p>
      <p style="margin: 4px 0;"><b>🖼️ 图片中转（server / assets）：</b>本地生成的 Puppeteer / Takumi 图片嵌入 Markdown 时，需要配置为 <code>server</code>（自建临时静态服务）或 <code>assets</code> 服务生成公网访问地址。server 模式缓存目录为 <code>ctx.baseDir/cache/skykid-height-cosmetic-query</code>。</p>
    </div>
  </details>

  <blockquote style="margin: 16px 0 6px 0; padding: 12px 16px; border-left: 5px solid #eab308; border-radius: 6px; background: rgba(234, 179, 8, 0.1); color: var(--k-text-dark, inherit); line-height: 1.6;">
    <b>⚠️ 友情提示：</b><br>
    • 好友码模式默认参数 <code>action=delete</code> 会消费一次性好友码；<br>
    • 若想反复查看同一身高的装扮或避免好友码被销毁，推荐使用 <code>https://sky.thatg.co/o=...</code> 离线扫码链接进行查询；<br>
    • 若发现装扮物品的中文标注或图标图片显示有误或缺失 🎒，欢迎加入<a href="https://qm.qq.com/q/rvrRosfKMw" target="_blank" style="color: #0284c7; font-weight: bold; text-decoration: underline;">交流 Q 群</a>（<b style="color: #12B7F5;">1085190201</b>）或联系作者 <a href="https://vincentzyu-vitepress.pages.dev/" target="_blank" style="color: #0284c7; font-weight: bold; text-decoration: underline;">@VincentZyu</a>（QQ：<b>1830540513</b>）反馈更正 🛠️ 感谢光崽们的支持与陪伴 ✨🕯️；<br>
    • 完整且详细的配置项说明文档请移步至本插件的 <a href="https://github.com/VincentZyuApps/koishi-plugin-skykid-height-cosmetic-query#readme" target="_blank" style="color: #0284c7; font-weight: bold; text-decoration: underline;">GitHub README.md</a> 在线查看。
  </blockquote>

</div>
`
