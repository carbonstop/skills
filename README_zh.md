# CCDB 排放因子查询与匹配

Carbonstop 碳阻迹 · 产品碳足迹 / LCA

[English](README.md)

让 Agent 通过 `ccdb-cli` 查询 CCDB 中电力、燃料、材料和运输活动的碳排放因子，比较候选的单位、地区、年份、系统边界和来源，辅助产品碳足迹（PCF）、企业碳核算及生命周期评价（LCA）的因子选择。

回答基于实际查询结果，保留返回的详情链接，便于进入 [Carbon Agent](https://agent.carbonstop.com) 查看对应因子及适用信息。可用数据取决于账号权限与数据库覆盖。本 Skill 不替代完整核算或合规审核，也不执行建模写入。

## 可以这样问

- “帮我找适用于中国生产场景的铝材排放因子，并说明还需要确认哪些工艺和边界条件。”
- “比较这两个 CCDB 电力因子的单位、年份和系统边界，判断能否用于同一核算场景。”
- “核对这个 CCDB 因子是否适合我的产品碳足迹，并给出详情链接和使用前提。”

这些是任务示例，不代表数据库必有对应结果。

## 1. 安装 Skill

使用 [skills CLI](https://skills.sh/docs/cli) 的宿主可执行（需要 Node.js / npm）：

```sh
npx skills add carbonstop/skills
```

按交互提示选择 `ccdb` 和目标 Agent。其他宿主可通过其 Skill 导入功能安装包含 `SKILL.md` 的 [skills/ccdb](skills/ccdb) 目录。

使用需要 Agent 具备本地命令执行能力、网络访问、CCDB CLI 和有效授权。安装 Skill 只添加任务说明，不会安装 CLI 或自动登录。

## 2. 安装 CLI 并授权

先用 `ccdb-cli --version` 检查并复用已有安装。命令不存在且你同意安装时执行（npm 版需要 Node.js 22+）：

```sh
npm install -g ccdb-cli@latest
ccdb-cli --version
```

不使用 Node.js 时，可下载 [独立二进制](https://github.com/carbonstop/ccdb-cli/releases/latest)，核对校验文件并按 [CLI 安装说明](https://github.com/carbonstop/ccdb-cli) 配置。首次使用时执行：

```sh
ccdb-cli auth login
```

默认使用设备码授权，由你在浏览器确认；已有有效凭证时复用，不必每次登录。API Key 是主动选择的备选，不是 OAuth 失败后的自动降级方式。不要在聊天中发送 Key 或 Token。

默认环境为 production。使用测试环境时，为登录与查询统一添加 `--profile test`，详见 [环境配置](https://github.com/carbonstop/ccdb-cli/blob/main/docs/CONFIGURATION.md)。

## 3. 向 Agent 提问

可以直接提出上面的示例问题，并补充需要的材料或活动、单位、地区与核算边界。Agent 会通过 CLI 搜索并查询详情，说明候选因子的适用条件，同时保留 Carbon Agent 详情链接。

未查到结果或数值受限时，Agent 应说明限制，不编造数据，也不承诺登录后解锁。具体查询、匹配与安全规则见 [SKILL.md](skills/ccdb/SKILL.md)。

安装或访问失败时可查看 [CLI 常见问题](https://github.com/carbonstop/ccdb-cli)，排错只提供错误码和 requestId，不公开凭证。不支持本地命令执行的宿主，不能仅通过导入 Skill 完成查询。

## 相关工具

- [CCDB CLI](https://github.com/carbonstop/ccdb-cli)：安装和命令使用；[最新二进制下载](https://github.com/carbonstop/ccdb-cli/releases/latest)。
- [CCDB MCP](https://github.com/carbonstop/ccdb-mcp)：供 MCP 宿主使用的独立连接器。

## 更新

通过安装工具或宿主更新 Skill；手动导入时，用仓库最新副本替换 Skill 目录。CCDB CLI 按其安装说明单独更新，跨越不兼容版本前先阅读迁移说明。
