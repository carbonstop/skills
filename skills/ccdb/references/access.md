# 接入与错误排查

## 安装独立 CLI 或接入 MCP

CLI 的命令和 npm 包名均为 `ccdb-cli`。npm 版需要 Node.js 22+；也可从 [最新 Release](https://github.com/carbonstop/ccdb-cli/releases/latest) 下载对应系统/架构的独立二进制 `ccdb-cli`（Windows 为 `ccdb-cli.exe`），直接执行无需 Node.js。核对发布页的校验文件；macOS/Linux 解压后如缺执行权限，运行 `chmod +x ccdb-cli`。只使用官方发布物，不绕过系统安全检查。

MCP 包名为 `ccdb-mcp-server`，命令为 `ccdb-mcp`。所连接的 MCP 应提供 `search_emission_factors` 和 `get_emission_factor_detail`；不兼容的旧工具不能作为替代。

本 Skill 不包含程序。优先复用宿主中已配置的新版 MCP；不需要同时安装 CLI。
需要 CLI 时，在用户同意安装后从 npm 安装，不需要克隆源码或先构建：

```sh
npm install -g ccdb-cli@latest
ccdb-cli --version
```

再次执行安装命令可升级到 npm latest。仅需本地 MCP 时使用 `npm install -g ccdb-mcp-server@latest`，无需同时安装 CLI。镜像未同步时追加 `--registry=https://registry.npmjs.org/`。跨越不兼容变更前阅读对应工具的发布说明；旧包 `carbonstop-ccdb` 不等价于 `ccdb-cli`。

没有安装权限、可用发布物或执行能力时，停止并说明缺失条件，不自动下载其他软件或伪造结果。MCP 的独立安装与宿主配置见 [ccdb-mcp](https://github.com/carbonstop/ccdb-mcp)。

## 环境和授权

CLI 默认使用 production 环境；测试环境使用 `--profile test`，也可通过 `CCDB_PROFILE` 选择环境。标准环境使用工具自带配置，自定义环境按管理员提供的配置使用。具体地址和客户端配置以 [CLI 配置说明](https://github.com/carbonstop/ccdb-cli/blob/main/docs/CONFIGURATION.md) 或 [MCP 配置说明](https://github.com/carbonstop/ccdb-mcp/blob/main/docs/CONFIGURATION.md) 为准。不要因本地无法连接而自动切到生产。

### 默认：device OAuth（CLI / 本地 stdio MCP）

默认推荐 device OAuth。用户明确同意登录后，在终端执行以下命令；不带 method 也默认 device：

```sh
ccdb-cli auth login
```

设备码登录输出授权 URL 和可见 user_code，用户自行打开 Carbon Agent 登录并允许访问。不要在工具里模拟用户同意。若返回 `invalid_client`，请管理员确认该工具在所选环境的客户端登记与启用状态；只有管理员提供了其他客户端 ID 时才显式设置 `CCDB_CLIENT_ID`，不要自行生成或猜测。

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

刷新中断时可能已在服务端轮换，重新登录而不是重放旧 Refresh Token。系统凭证存储不可用时，用户可主动选择环境 Key，或按所安装工具的凭证存储说明显式设置 `CCDB_AUTH_STORE=file`。CLI 使用加密文件并记住该身份的文件存储选择，但主密钥也保存在本机，保护强度不等同于系统密钥服务。旧工具的文件格式可能不同，不要假定所有已安装 MCP/CLI 都具备相同存储能力；需限制本机文件访问权限，不打印凭证文件。

`auth logout` 只退出当前本地配置；`auth logout --revoke` 撤销整条应用授权，会影响共用授权的其他工具。两者都不删除宿主配置的环境 Key，也不在服务端停用 API Key。
