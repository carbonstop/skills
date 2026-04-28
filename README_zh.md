# 🧠 Carbonstop AI Skills

**为 AI 编程助手赋予碳排放领域专业能力的 Skill 集合。**

本仓库是 [碳阻迹（Carbonstop）](https://www.carbonstop.com) 开源的 AI Skill 合集，兼容主流 AI 编程助手（Gemini CLI / Claude Code / Cursor / Codex / OpenCode / OpenClaw），让 AI 能够理解碳排放相关查询，并调用碳阻迹的数据服务完成专业任务。

---

## 📦 已有 Skills

| Skill | 说明 | 关键能力 |
|-------|------|----------|
| [ccdb](./skills/ccdb/) | CCDB 碳排放因子搜索 | 关键词搜索因子 · JSON 结构化输出 · 多因子对比 |

---

## 🚀 快速开始

### 安装

选择你使用的 AI 编程助手，按照对应方式安装：

<details>
<summary><strong>Gemini CLI</strong></summary>

```bash
# 全局安装
git clone https://github.com/carbonstop/skills.git ~/.gemini/carbonstop-skills

# 或在项目中使用（仅当前项目生效）
git clone https://github.com/carbonstop/skills.git .gemini/carbonstop-skills
```

重启 Gemini CLI 即可自动发现 Skills。

</details>

<details>
<summary><strong>Claude Code</strong></summary>

```bash
claude mcp add-skill https://github.com/carbonstop/skills
```

或手动安装：

```bash
git clone https://github.com/carbonstop/skills.git ~/.claude/carbonstop-skills
```

在 Claude Code 设置中将 skills 路径指向 `~/.claude/carbonstop-skills/`。

</details>

<details>
<summary><strong>Cursor</strong></summary>

```bash
git clone https://github.com/carbonstop/skills.git ~/.cursor/carbonstop-skills
```

在 Cursor 设置中，将 skills 路径指向 `~/.cursor/carbonstop-skills/`。

</details>

<details>
<summary><strong>Codex</strong></summary>

```bash
git clone https://github.com/carbonstop/skills.git ~/.codex/carbonstop-skills

mkdir -p ~/.agents/skills
ln -s ~/.codex/carbonstop-skills/ ~/.agents/skills/carbonstop-skills
```

重启 Codex 以发现 Skills。

</details>

<details>
<summary><strong>OpenCode</strong></summary>

```bash
git clone https://github.com/carbonstop/skills.git ~/.carbonstop-skills

mkdir -p ~/.config/opencode/skills
ln -s ~/.carbonstop-skills/* ~/.config/opencode/skills/
```

重启 OpenCode 以发现 Skills。

</details>

<details>
<summary><strong>OpenClaw</strong></summary>

在 OpenClaw 对话中直接发送本仓库链接，助手会自动完成安装：

```
https://github.com/carbonstop/skills
```

或通过 ClawHub CLI 安装：

```bash
npx clawhub install carbonstop-skills
```

</details>

### 开始使用

安装完成后，AI 编程助手会根据你的提问自动激活对应 Skill。例如：

> **你**：中国电网的碳排放因子是多少？
>
> **AI**：*（自动调用 CCDB Skill 搜索）* 根据生态环境部 2022 年数据，中国电网平均排放因子为 0.5703 tCO₂/MWh……

> **你**：我公司去年用了 50 万度电，碳排放多少？
>
> **AI**：*（搜索因子 → 计算）* 500,000 kWh × 0.5703 kgCO₂e/kWh ≈ 285,150 kgCO₂e ≈ 285.15 吨 CO₂e

---

## 📂 项目结构

```
skills/
├── README.md             # 本文件
├── cli/                  # 独立 CLI 二进制工具
│   ├── package.json      # npm 包配置（carbonstop-ccdb）
│   ├── src/              # CLI 源代码
│   ├── build.mjs         # 构建脚本（esbuild + Node.js SEA）
│   └── dist/             # 构建输出（二进制 + bundle）
└── skills/               # Skills 目录
    └── ccdb/             # CCDB 碳排放因子搜索 Skill
        └── SKILL.md      # Skill 定义与使用说明
```

---

## 📖 Skill 详情

### CCDB — 碳排放因子搜索

基于碳阻迹 [CCDB 碳排放因子数据库](https://ccdb.carbonstop.com)，提供碳排放因子的搜索、查询与对比能力。

**核心功能：**

- 🔍 **关键词搜索** — 按名称搜索碳排放因子，支持中英文
- 📊 **结构化输出** — 返回 JSON 格式数据，含因子值、单位、地区、年份、发布机构等
- ⚖️ **多因子对比** — 同时对比最多 5 种能源/材料的排放因子

**支持的调用方式：**

| 方式 | 说明 | 是否需要安装 |
|------|------|:---:|
| **`ccdb` CLI 二进制** | 独立二进制，无需 Node.js | 从 [Releases](https://github.com/carbonstop/skills/releases) 下载 |
| **`npx carbonstop-ccdb`** | 通过 npx 运行，自动下载 | 需要 Node.js ≥ 18 |
| ccdb-mcp-server（stdio） | 标准 MCP Server，通过 mcporter 调用 | 需要 `npm i -g ccdb-mcp-server` |
| ccdb-mcp-server（HTTP） | 标准 MCP Server，Streamable HTTP 模式 | 需要 `npm i -g ccdb-mcp-server` |

**快速体验 — CLI 二进制（推荐）：**

```bash
# 全局安装
npm install -g carbonstop-ccdb

# 搜索碳排放因子
ccdb search "电力"

# JSON 输出（适合程序处理）
ccdb search "电力" --json

# 多关键词对比
ccdb compare 电力 天然气 柴油
```

> 详细文档请查看 [skills/ccdb/SKILL.md](./skills/ccdb/SKILL.md)

---

## 🤝 贡献指南

欢迎提交新的 Skill！每个 Skill 应遵循以下结构：

```
skill-name/
├── SKILL.md              # 必须 — Skill 定义文件（含 YAML 前置元数据 + Markdown 说明）
├── scripts/              # 可选 — 辅助脚本
├── examples/             # 可选 — 示例用法
└── resources/            # 可选 — 额外资源文件
```

### SKILL.md 规范

```yaml
---
name: skill-name
description: |
  Skill 的简短描述。

  **当以下情况时使用此 Skill**：
  (1) 触发条件 1
  (2) 触发条件 2
---

# Skill 标题

详细使用说明……
```

### 提交步骤

1. Fork 本仓库
2. 创建 feature 分支：`git checkout -b feat/my-new-skill`
3. 按上述结构添加 Skill
4. 提交 Pull Request

---

## 📄 许可证

[MIT License](./LICENSE)

---

## 🔗 相关链接

- **碳阻迹官网**：[https://www.carbonstop.com](https://www.carbonstop.com)
- **CCDB 碳排放因子数据库**：[https://ccdb.carbonstop.com](https://ccdb.carbonstop.com)
- **ccdb-mcp-server（npm）**：[https://www.npmjs.com/package/ccdb-mcp-server](https://www.npmjs.com/package/ccdb-mcp-server)
- **Gemini CLI**：[https://github.com/google-gemini/gemini-cli](https://github.com/google-gemini/gemini-cli)
- **Claude Code**：[https://docs.anthropic.com/en/docs/claude-code](https://docs.anthropic.com/en/docs/claude-code)
- **Cursor**：[https://www.cursor.com](https://www.cursor.com)
- **Codex**：[https://github.com/openai/codex](https://github.com/openai/codex)
- **OpenCode**：[https://github.com/opencode-ai/opencode](https://github.com/opencode-ai/opencode)
- **OpenClaw**：[https://openclaw.ai](https://openclaw.ai)
