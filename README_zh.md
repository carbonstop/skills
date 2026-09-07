# Carbonstop AI Skills

本仓库只维护 Skill 说明，不再包含 CLI 源码、二进制或 npm 发布流程。

## 安装和使用

将完整的 [skills/ccdb](skills/ccdb) 目录按宿主的 Skill 安装方式导入，保留 references 和 agents。Skill 名和目录仍为 `ccdb`，已有副本需自行更新。

执行工具二选一：已配置的新版 CCDB MCP，或单独安装的 `ccdb-connect` CLI（Node.js 22+）。安装 Skill 不等于安装 CLI，不会自动登录或授予数据权限。详见 [接入与排查](skills/ccdb/references/access.md)。

## 三仓维护

- [ccdb-cli](https://github.com/carbonstop/ccdb-cli)：CLI、测试和 npm 打包；公开前可能需要组织访问权限。
- [ccdb-mcp](https://github.com/carbonstop/ccdb-mcp)：MCP 服务和认证集成。
- 本仓库：因子匹配规则、调用规范、安装说明。

迁移来源为 `ccdb-integrations` 的 `b69f46b5b6f44c70067032a01edaafd13aa790d4`。当前适配该提交的 Connect 0.1.x 命令和工具契约；后续 CLI/MCP 的破坏性变更需要联动更新说明。

本 PR 移除旧 `cli/` 和 CLI 发布工作流，但保留 Git 历史、已存在的标签和发布物。旧 `carbonstop-ccdb` / `ccdb` 不是新 `ccdb-connect` 的兼容入口；Skill 不会回退到旧免授权 API。

迁移不执行 npm 发布。新包正式发布前，从源码构建或安装维护者提供的 tgz；不要把尚未发布的包描述为可直接从 npm 安装。Skill 与 CLI/MCP 分开升级，但仍有接口契约依赖。不要在聊天中发送 Key 或 Token。
