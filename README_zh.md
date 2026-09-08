# Carbonstop AI Skills

本仓库只维护 Skill 说明，不再包含 CLI 源码、二进制或 npm 发布流程。

## 安装和使用

将完整的 [skills/ccdb](skills/ccdb) 目录按宿主的 Skill 安装方式导入，目录内只需 SKILL.md。Skill 名和目录仍为 `ccdb`，已有副本需自行更新。

执行工具二选一：已配置的新版 CCDB MCP，或单独安装的 `ccdb-cli` CLI（npm 版需要 Node.js 22+，独立二进制无需 Node.js）。安装 Skill 不等于安装 CLI，不会自动登录或授予数据权限。详见 [接入与排查](skills/ccdb/SKILL.md)。

## 相关工具

- [CCDB CLI](https://github.com/carbonstop/ccdb-cli)：安装和命令使用；[最新二进制下载](https://github.com/carbonstop/ccdb-cli/releases/latest)。
- [CCDB MCP](https://github.com/carbonstop/ccdb-mcp)：为 Agent 接入 CCDB。

安装命令使用 npm 的 latest 标签，不写死发布版本。跨越不兼容变更前，请阅读对应工具的发布和迁移说明。Skill 与已安装的 CLI/MCP 分别更新；遇到工具不兼容时提示升级或说明问题，不回退到旧免授权接口。不要在聊天中发送 Key 或 Token。
