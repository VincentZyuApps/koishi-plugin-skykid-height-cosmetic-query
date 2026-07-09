import { Context } from 'koishi'
import type { Config } from '../config'
import { buildCommandAliases, buildCommandName } from './common'

/**
 * ❔ 注册身高装扮查询帮助命令。
 */
export function registerHelpCommand(ctx: Context, config: Config) {
  const command = ctx.command(buildCommandName(config, config.helpCommandSuffix), '查看光崽身高装扮查询帮助')
  const aliases = buildCommandAliases(config, config.helpCommandSuffix)
  if (aliases.length) command.alias(...aliases)
  command
    .action(() => generateHelpText(config))
}

/**
 * 🧾 生成硬编码帮助文本。
 */
function generateHelpText(config: Config): string {
  const code = '【好友码】'
  const prefixAliases = Array.isArray(config.commandPrefixAliases)
    ? config.commandPrefixAliases.filter((item) => String(item || '').trim())
    : []
  const prefixLines = [
    '🌌 光崽身高装扮查询指令帮助',
    `📌 默认前缀：${config.commandPrefix}`,
    ...(prefixAliases.length ? [`📌 前缀别名：${prefixAliases.join(' / ')}`] : []),
    '每个前缀都可以和相同后缀组合使用。',
  ]
  const commandLines = [
    `❔ 帮助：${buildCommandName(config, config.helpCommandSuffix)}`,
    `🖼️ Puppeteer 出图：${buildCommandName(config, config.pptrCommandSuffix)} ${code}`,
    `📝 纯文本：${buildCommandName(config, config.textCommandSuffix)} ${code}`,
    `📨 OneBot 合并转发：${buildCommandName(config, config.forwardCommandSuffix)} ${code}`,
    `⚡ Takumi wasm 出图：${buildCommandName(config, config.takumiCommandSuffix)} ${code}`,
    `🌐 外部 Pillow 后端出图：${buildCommandName(config, config.apiCommandSuffix)} ${code}`,
    `💫 QQ Markdown 格式风格：${buildCommandName(config, config.qqMdStyleCommandSuffix)} ${code}`,
    `📊 QQ Markdown 表格：${buildCommandName(config, config.qqMdTableCommandSuffix)} ${code}`,
  ]
  const optionLines = [
    '🧪 测试模式：在任意查询命令后追加 --dry 或 --dryrun',
    '🌙 深色模式：Puppeteer / Takumi 支持 -d true 或 --dark dark',
    '🛠️ 调试参数：追加 -v 或 --verbose 输出本次命令详情',
    '⚠️ 默认 queryAction=delete，会消费一次性好友码。',
  ]
  return [
    prefixLines.join('\n'),
    ['🧭 可用指令：', ...commandLines].join('\n\n'),
    ['⚙️ 可选参数：', ...optionLines].join('\n\n'),
  ].join('\n\n')
}
