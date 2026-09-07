# 接入与错误排查

## 安装独立 CLI 或接入 MCP

本 Skill 不包含程序。优先复用宿主中已配置的新版 MCP；不需要同时安装 CLI。
需要 CLI 时，在用户同意安装后使用 [ccdb-cli](https://github.com/carbonstop/ccdb-cli) 的源码或维护者提供的可信 tgz。仓库尚未公开时需组织权限。

在 CLI 仓库内构建并安装开发版本（Node.js 22+）：

```sh
npm ci
npm run verify
npm install -g ./dist/releases/carbonstop-ccdb-cli-0.1.0.tgz
ccdb-connect --version
```

只有确认官方已发布目标版本后，才使用 `npm install -g @carbonstop/ccdb-cli@<已发布版本>`。不要把占位版本照抄执行。该迁移本身不发布 npm；旧包 `carbonstop-ccdb` 不等价于新版。

没有安装权限、可用发布物或执行能力时，停止并说明缺失条件，不自动下载其他软件或伪造结果。MCP 的独立安装与宿主配置见 [ccdb-mcp](https://github.com/carbonstop/ccdb-mcp)。

## 环境和授权

独立 CLI使用 `CCDB_PROFILE`（local / pre / production，默认 production）、`CCDB_API_BASE`、`CCDB_AGENT_WEB`、`CCDB_OAUTH_ISSUER`、`CCDB_RESOURCE`、`CCDB_CLIENT_ID` 配置环境。不要因本地无法连接而自动切到生产。

用户可在宿主 Secret/环境中配置完整 `CCDB_API_KEY`，或在终端明确执行：

```sh
ccdb-connect auth login --method device --no-browser
ccdb-connect auth login --method pkce
ccdb-connect auth login --method api-key
```

设备码登录输出授权 URL 和可见 user_code，用户自行打开 Carbon Agent 登录并允许访问。不要在工具里模拟用户同意。后台须登记该环境的 `ccdb-connect-local` 客户端；其他客户端由管理员登记后显式设置 `CCDB_CLIENT_ID`。

CLI不接收明文 Key 命令行参数。api-key 登录采用不回显输入或 stdin。环境 Key 优先于已保存 OAuth，不因 Key 失败切回 OAuth。

诊断：

```sh
ccdb-connect doctor --json
ccdb-connect auth status --json
```

doctor 检查发现端点，不查询因子、不消耗因子查询额度；status 只反映本地凭证，不代表远程权限仍有效。

搜索参数：`--language zh|en`、`--accounting-type product|enterprise`、`--country 中国`、`--year 2025`、`--source-level 国家排放因子`、`--limit 5`。country/year/source-level 可重复；limit 1～10。详情参数：字符串 ID 和 language。

错误退出码：2 参数、3 登录、4 权限、5 限流、6 网络/上游、7 因子不存在。JSON 错误中保留 requestId、HTTP status 和 Retry-After（若服务返回），可提供 requestId 排查，不提供凭证。

刷新中断时可能已在服务端轮换，重新登录而不是重放旧 Refresh Token。无桌面密钥服务的机器由用户选择环境 Key，或显式 `CCDB_AUTH_STORE=file`；file 模式不是加密，需限制本机文件访问权限。

`auth logout` 只退出当前本地配置；`auth logout --revoke` 撤销整条应用授权，会影响共用授权的其他工具。两者都不删除宿主配置的环境 Key，也不在服务端停用 API Key。
