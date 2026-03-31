# 🧠 Carbonstop AI Skills

**A collection of Skills that empower AI coding assistants with professional capabilities in the carbon emission domain.**

This repository is an open-source AI Skill collection by [Carbonstop](https://www.carbonstop.com), compatible with mainstream AI coding assistants (Gemini CLI / Claude Code / Cursor / Codex / OpenCode / OpenClaw). It enables AI to understand carbon emission-related queries and invoke Carbonstop's data services to accomplish professional tasks.

---

## 📦 Available Skills

| Skill | Description | Key Capabilities |
|-------|-------------|------------------|
| [ccdb](./skills/ccdb/) | CCDB Carbon Emission Factor Search | Keyword factor search · Structured JSON output · Multi-factor comparison |

---

## 🚀 Quick Start

### Installation

Choose your AI coding assistant and install accordingly:

<details>
<summary><strong>Gemini CLI</strong></summary>

```bash
# Global installation
git clone https://github.com/carbonstop/skills.git ~/.gemini/carbonstop-skills

# Or use within a specific project (only effective in the current project)
git clone https://github.com/carbonstop/skills.git .gemini/carbonstop-skills
```

Restart Gemini CLI to automatically discover the Skills.

</details>

<details>
<summary><strong>Claude Code</strong></summary>

```bash
claude mcp add-skill https://github.com/carbonstop/skills
```

Or install manually:

```bash
git clone https://github.com/carbonstop/skills.git ~/.claude/carbonstop-skills
```

In your Claude Code settings, point the skills path to `~/.claude/carbonstop-skills/`.

</details>

<details>
<summary><strong>Cursor</strong></summary>

```bash
git clone https://github.com/carbonstop/skills.git ~/.cursor/carbonstop-skills
```

In your Cursor settings, point the skills path to `~/.cursor/carbonstop-skills/`.

</details>

<details>
<summary><strong>Codex</strong></summary>

```bash
git clone https://github.com/carbonstop/skills.git ~/.codex/carbonstop-skills

mkdir -p ~/.agents/skills
ln -s ~/.codex/carbonstop-skills/ ~/.agents/skills/carbonstop-skills
```

Restart Codex to discover the Skills.

</details>

<details>
<summary><strong>OpenCode</strong></summary>

```bash
git clone https://github.com/carbonstop/skills.git ~/.carbonstop-skills

mkdir -p ~/.config/opencode/skills
ln -s ~/.carbonstop-skills/* ~/.config/opencode/skills/
```

Restart OpenCode to discover the Skills.

</details>

<details>
<summary><strong>OpenClaw</strong></summary>

Simply paste the link to this repository in an OpenClaw conversation, and the assistant will install it automatically:

```
https://github.com/carbonstop/skills
```

Or install via ClawHub CLI:

```bash
npx clawhub install carbonstop-skills
```

</details>

### Usage

Once installed, your AI coding assistant will automatically activate the corresponding Skill based on your prompts. For example:

> **You**: What is the carbon emission factor for the Chinese power grid?
>
> **AI**: *(Automatically invokes the CCDB Skill search)* According to the 2022 data from the Ministry of Ecology and Environment, the average emission factor for the China Power Grid is 0.5703 tCO₂/MWh...

> **You**: My company used 500,000 kWh of electricity last year. What is the carbon footprint?
>
> **AI**: *(Searches factor → Calculates)* 500,000 kWh × 0.5703 kgCO₂e/kWh ≈ 285,150 kgCO₂e ≈ 285.15 tonnes CO₂e.

---

## 📂 Project Structure

```
skills/
├── README.md             # This file
├── README_zh.md          # Chinese documentation
└── skills/               # Skills directory
    └── ccdb/             # CCDB Carbon Emission Factor Search Skill
        ├── SKILL.md      # Skill definition and usage instructions
        └── scripts/
            └── ccdb-search.mjs  # Lightweight CLI search script (no installation needed)
```

---

## 📖 Skill Details

### CCDB — Carbon Emission Factor Search

Based on Carbonstop's [CCDB Carbon Emission Factor Database](https://ccdb.carbonstop.com), this provides the capability to search, query, and compare carbon emission factors.

**Core Features:**

- 🔍 **Keyword Search** — Search for carbon emission factors by name; supports English and Chinese.
- 📊 **Structured Output** — Returns JSON-formatted data containing the factor value, unit, region, year, publishing institution, etc.
- ⚖️ **Multi-factor Comparison** — Compare the emission factors of up to 5 energy sources/materials simultaneously.

**Supported Invocation Methods:**

| Method | Description | Installation Required |
|--------|-------------|:---:|
| Direct script `ccdb-search.mjs` | Lightweight CLI script, directly calls HTTP APIs | ❌ |
| ccdb-mcp-server (stdio) | Standard MCP Server, invoked via `mcporter` | Needs `npm i -g ccdb-mcp-server` |
| ccdb-mcp-server (HTTP) | Standard MCP Server, Streamable HTTP mode | Needs `npm i -g ccdb-mcp-server` |

**Quick Experience (No dependencies required):**

```bash
# Search for a carbon emission factor
node skills/ccdb/scripts/ccdb-search.mjs "electricity"

# Search in English
node skills/ccdb/scripts/ccdb-search.mjs "cement" en

# JSON output (ideal for programmatic handling)
node skills/ccdb/scripts/ccdb-search.mjs "electricity" en --json

# Compare multiple keywords
node skills/ccdb/scripts/ccdb-search.mjs --compare electricity "natural gas" diesel
```

> For detailed documentation, please refer to [skills/ccdb/SKILL.md](./skills/ccdb/SKILL.md)

---

## 🤝 Contribution Guidelines

We welcome submissions of new Skills! Each Skill should adhere to the following structure:

```
skill-name/
├── SKILL.md              # Required — Skill definition file (includes YAML frontmatter + Markdown content)
├── scripts/              # Optional — Helper scripts
├── examples/             # Optional — Example usage
└── resources/            # Optional — Additional resource files
```

### SKILL.md Specification

```yaml
---
name: skill-name
description: |
  A brief description of the Skill.

  **Use this Skill when**:
  (1) Trigger condition 1
  (2) Trigger condition 2
---

# Skill Title

Detailed usage instructions...
```

### Steps to Submit

1. Fork this repository
2. Create a feature branch: `git checkout -b feat/my-new-skill`
3. Add your Skill following the structure above
4. Submit a Pull Request

---

## 📄 License

[MIT License](./LICENSE)

---

## 🔗 Related Links

- **Carbonstop Official Website**: [https://www.carbonstop.com](https://www.carbonstop.com)
- **CCDB Carbon Emission Factor Database**: [https://ccdb.carbonstop.com](https://ccdb.carbonstop.com)
- **ccdb-mcp-server (npm)**: [https://www.npmjs.com/package/ccdb-mcp-server](https://www.npmjs.com/package/ccdb-mcp-server)
- **Gemini CLI**: [https://github.com/google-gemini/gemini-cli](https://github.com/google-gemini/gemini-cli)
- **Claude Code**: [https://docs.anthropic.com/en/docs/claude-code](https://docs.anthropic.com/en/docs/claude-code)
- **Cursor**: [https://www.cursor.com](https://www.cursor.com)
- **Codex**: [https://github.com/openai/codex](https://github.com/openai/codex)
- **OpenCode**: [https://github.com/opencode-ai/opencode](https://github.com/opencode-ai/opencode)
- **OpenClaw**: [https://openclaw.ai](https://openclaw.ai)
