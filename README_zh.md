# CCDB 排放因子查询与匹配

Carbonstop 碳阻迹 · 产品碳足迹 / LCA

[English](README.md)

让 Agent 使用 CCDB 查询电力、燃料、材料和运输活动的碳排放因子，比较候选的单位、地区、年份、系统边界和来源，辅助产品碳足迹（PCF）、企业碳核算及生命周期评价（LCA）的因子选择。

回答基于实际查询结果，保留接口返回的 Carbon Agent 详情链接，便于点击核对。可用数据取决于账号权限与数据库覆盖；未查到或数值受限时明确说明，不编造数值，不承诺登录后解锁。本 Skill 不替代完整核算或合规审核，也不执行建模写入。

## 可以这样问

- “帮我找适用于中国生产场景的铝材排放因子，并说明还需要确认哪些工艺和边界条件。”
- “比较这两个 CCDB 电力因子的单位、年份和系统边界，判断能否用于同一核算场景。”
- “核对这个 CCDB 因子是否适合我的产品碳足迹，并给出详情链接和使用前提。”

这些是任务示例，不代表数据库必有对应结果；只有解释通用概念时，不必查询 CCDB。

## 1. 安装 Skill

使用 [skills CLI](https://skills.sh/docs/cli) 的宿主可执行（需要 Node.js / npm）：

```sh
npx skills add carbonstop/skills
```

按交互提示选择 `ccdb` 和目标 Agent。其他宿主可通过其 Skill 导入功能安装完整的 [skills/ccdb](skills/ccdb) 目录，目录内只有 `SKILL.md`。Skill 名和目录保持 `ccdb`，兼容已有安装。

这一步只安装查询与匹配说明，不会安装 CLI/MCP 程序、自动登录或授予数据库权限。

## 2. 选择查询入口

**已有 CCDB MCP：** 优先复用宿主提供的 `search_emission_factors` 和 `get_emission_factor_detail`，无需另装 CLI。远程连接器按宿主流程授权；本地 MCP 的配置与登录见 [MCP 使用说明](https://github.com/carbonstop/ccdb-mcp)。

**没有可用 MCP：** 在 Agent 能执行命令且你同意安装时，安装独立 CLI（npm 版需要 Node.js 22+）：

```sh
npm install -g ccdb-cli@latest
ccdb-cli auth login
```

登录默认使用设备码授权，由你在浏览器确认。默认环境为 production；使用测试环境时，为登录与查询统一添加 `--profile test`。不使用 Node.js 时，可下载 [独立二进制](https://github.com/carbonstop/ccdb-cli/releases/latest) 并核对发布的校验文件。

连接并授权后，向 Agent 提出上面的实际问题即可。完整认证、权限及排错说明见 [SKILL.md](skills/ccdb/SKILL.md)。不要在聊天中发送 Key 或 Token。

## 相关工具

- [CCDB CLI](https://github.com/carbonstop/ccdb-cli)：安装和命令使用；[最新二进制下载](https://github.com/carbonstop/ccdb-cli/releases/latest)。
- [CCDB MCP](https://github.com/carbonstop/ccdb-mcp)：为 Agent 接入 CCDB。

## 更新

Skill 与 CLI/MCP 分别更新。通过 skills CLI 安装的 Skill，按其更新说明操作；手动复制的目录需替换为最新副本。CLI/MCP 安装命令使用 npm 的 latest 标签，不写死发布版本；跨越不兼容变更前阅读发布和迁移说明，不回退到旧免授权接口。

本仓库只维护 Skill 说明，不包含 CLI/MCP 源码或可执行程序。市场展示和标签需按各平台规则配置；安装与文案优化不保证自动收录或排名。
