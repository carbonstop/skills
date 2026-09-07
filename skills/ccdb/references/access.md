# 接入与错误排查

## 安装独立 CLI 或接入 MCP

CLI 的命令统一为 `ccdb-cli`，npm 包名为 `ccdb-cli`。除了需要 Node.js 的 npm 包，也可安装官方提供的对应系统/架构二进制 `ccdb-cli`（Windows 为 `ccdb-cli.exe`），直接执行无需 Node.js。macOS/Linux 解压 CI 下载包后如缺执行权限，运行 `chmod +x ccdb-cli`。只使用可信来源的构建产物，不绕过系统安全检查。详见 [CLI 分发说明](https://github.com/carbonstop/ccdb-cli/blob/main/docs/DISTRIBUTION.md)。

MCP 包名保持 `ccdb-mcp-server`，命令 `ccdb-mcp`；新版契约从 2.0.0 开始，不要把旧 1.x 当作新版工具。安装前确认目标版本已发布。

本 Skill 不包含程序。优先复用宿主中已配置的新版 MCP；不需要同时安装 CLI。
需要 CLI 时，在用户同意安装后从 npm 安装，不需要克隆源码或先构建：

```sh
npm install -g ccdb-cli
ccdb-cli --version
```

固定版本可用 `ccdb-cli@0.1.0`；MCP 可单独安装 `ccdb-mcp-server@2.0.0`。镜像未同步时可追加 `--registry=https://registry.npmjs.org/`。

仅开发人员在 [CLI 仓库](https://github.com/carbonstop/ccdb-cli) 内构建并安装开发版本（Node.js 22+；私有仓库需要组织权限）：

```sh
npm ci
npm run verify
npm install -g ./dist/releases/ccdb-cli-0.1.0.tgz
ccdb-cli --version
```

上面的 tgz 是源码构建产物，不是普通用户安装的前置条件。旧包 `carbonstop-ccdb` 不等价于新版。

没有安装权限、可用发布物或执行能力时，停止并说明缺失条件，不自动下载其他软件或伪造结果。MCP 的独立安装与宿主配置见 [ccdb-mcp](https://github.com/carbonstop/ccdb-mcp)。

## 环境和授权

独立 CLI使用 `CCDB_PROFILE`（local / pre / production，默认 production）、`CCDB_API_BASE`、`CCDB_AGENT_WEB`、`CCDB_OAUTH_ISSUER`、`CCDB_RESOURCE`、`CCDB_CLIENT_ID` 配置环境。不要因本地无法连接而自动切到生产。

### 默认：device OAuth（CLI / 本地 stdio MCP）

默认推荐 device OAuth。用户明确同意登录后，在终端执行以下命令；不带 method 也默认 device：

```sh
ccdb-cli auth login
```

设备码登录输出授权 URL 和可见 user_code，用户自行打开 Carbon Agent 登录并允许访问。不要在工具里模拟用户同意。后台须登记该环境的 `ccdb-connect-local` 客户端；其他客户端由管理员登记后显式设置 `CCDB_CLIENT_ID`。

无浏览器终端加 `--no-browser`，在另一台设备打开链接。本地 stdio MCP 可独立使用 `ccdb-mcp login`（同样默认 device），无需安装 CLI；必须使用与宿主相同的环境、用户和凭证存储。device 是本地登录辅助流程，不是 stdio 协议自动发起 OAuth。PKCE 仅在用户需要时通过 `--method pkce` 显式选择。

### 备选：用户主动选择 API Key

用户不便使用 device OAuth 或明确选择 Key 时，可通过宿主 Secret 配置 `CCDB_API_KEY`，或执行 `ccdb-cli auth login --method api-key`（本地 MCP 对应 `ccdb-mcp login --method api-key`）。采用不回显输入或受控 stdin，不接收明文 Key 命令行参数，不要求在聊天中提供 Key。

显式环境 Key 仍优先于已保存凭证；默认推荐 device 不等于忽略用户已配置的 Key。若用户要恢复 OAuth，说明需从实际执行环境移除该变量并登录，不自动改动。OAuth 失效且无法刷新时提示重新登录，不自动切换 Key；Key 失败也不切换 OAuth。

### 远程 HTTP MCP

复用已连接的 MCP，无需 CLI 或本地登录。首次接入优先使用宿主 OAuth 授权流程（通常为授权码 + PKCE）；宿主支持认证请求头时，API Key 可作为用户手动选择的备选。不要要求 WorkBuddy 用户或服务部署人员执行 device 登录来建立共享身份。公共地址、鉴权和内部转发由服务部署方配置。

诊断：

```sh
ccdb-cli doctor --json
ccdb-cli auth status --json
```

doctor 检查发现端点，不查询因子、不消耗因子查询额度；status 只反映本地凭证，不代表远程权限仍有效。

搜索参数：`--language zh|en`、`--accounting-type product|enterprise`、`--country 中国`、`--year 2025`、`--source-level 国家排放因子`、`--limit 5`。country/year/source-level 可重复；limit 1～10。详情参数：字符串 ID 和 language。

错误退出码：2 参数、3 登录、4 权限、5 限流、6 网络/上游、7 因子不存在。JSON 错误中保留 requestId、HTTP status 和 Retry-After（若服务返回），可提供 requestId 排查，不提供凭证。

刷新中断时可能已在服务端轮换，重新登录而不是重放旧 Refresh Token。无桌面密钥服务的机器由用户选择环境 Key，或显式 `CCDB_AUTH_STORE=file`；file 模式不是加密，需限制本机文件访问权限。

`auth logout` 只退出当前本地配置；`auth logout --revoke` 撤销整条应用授权，会影响共用授权的其他工具。两者都不删除宿主配置的环境 Key，也不在服务端停用 API Key。
