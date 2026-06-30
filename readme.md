# koishi-plugin-sky-shengao-query

[![npm](https://img.shields.io/npm/v/koishi-plugin-sky-shengao-query?style=flat-square)](https://www.npmjs.com/package/koishi-plugin-sky-shengao-query)
[![npm-download](https://img.shields.io/npm/dm/koishi-plugin-sky-shengao-query?style=flat-square)](https://www.npmjs.com/package/koishi-plugin-sky-shengao-query)

[![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/VincentZyuApps/koishi-plugin-sky-shengao-query)
[![Gitee](https://img.shields.io/badge/Gitee-C71D23?style=for-the-badge&logo=gitee&logoColor=white)](https://gitee.com/vincent-zyu/koishi-plugin-sky-shengao-query)

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
查询 XXXX-XXXX-XXXX
```

默认 `查询身高` 使用 Puppeteer 出图。其他输出：

```text
查询身高-text XXXX-XXXX-XXXX
查询身高-forward XXXX-XXXX-XXXX
查询身高-takumi XXXX-XXXX-XXXX
```

## 🧪 测试模式

所有查询命令都支持 `--dry` / `--dryrun`。测试模式不会请求后端，只使用假数据测试文字或图片样式。

```text
查询身高 --dryrun
查询身高-text --dry
查询身高-forward --dryrun
查询身高-takumi --dryrun
```

## 🌙 深色模式

Puppeteer 和 Takumi 出图命令支持 `-d` / `--dark` / `--darkmode`。可选值：`true` / `false` / `on` / `off` / `dark` / `light` / `深色` / `浅色`。

```text
查询身高 XXXX-XXXX-XXXX -d
查询身高-text XXXX-XXXX-XXXX --dark
查询身高-forward XXXX-XXXX-XXXX --dark false
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

## ⚙️ 过滤器设置

如果你的 Koishi 环境启用了过滤器，请确认该插件允许接收目标频道 / 群聊 / 平台消息。否则插件可能已经加载，但命令不会触发。

## 🔧 接口配置

接口地址都在配置项里，方便后续调整：

```text
baseUrl
powChallengeUrl
queryUrl
```

默认接口：

```text
GET  https://sky.cesgao.cn/web/v1/pow/challenge
POST https://sky.cesgao.cn/web/v1/query
```

## 🔤 字体缓存

图片渲染默认使用 `LXGWWenKaiMono-Regular.ttf`。插件加载时会检查：

```text
ctx.baseDir/data/fonts/LXGWWenKaiMono-Regular.ttf
```

字体存在且 hash 校验通过时会跳过下载；缺失或校验失败时会尝试从 Gitee / GitHub 下载。

## ⚠️ 注意

默认 `queryAction=delete`，会消费一次性好友码。请只提交准备使用的好友码。
