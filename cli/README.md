# 🌍 ccdb — Carbon Emission Factor CLI

A standalone command-line tool to query carbon emission factors from the [Carbonstop CCDB database](https://ccdb.carbonstop.com).

## Installation

### Via npm (requires Node.js ≥ 18)

```bash
# Global install
npm install -g carbonstop-ccdb

# Or use without installing
npx carbonstop-ccdb search "电力"
```

### Download Binary (no Node.js required)

Download the standalone binary from [GitHub Releases](https://github.com/carbonstop/skills/releases):

```bash
# macOS (Apple Silicon)
curl -L -o ccdb https://github.com/carbonstop/skills/releases/latest/download/ccdb-darwin-arm64
chmod +x ccdb
sudo mv ccdb /usr/local/bin/

# macOS (Intel)
curl -L -o ccdb https://github.com/carbonstop/skills/releases/latest/download/ccdb-darwin-x64
chmod +x ccdb
sudo mv ccdb /usr/local/bin/

# Linux (x64)
curl -L -o ccdb https://github.com/carbonstop/skills/releases/latest/download/ccdb-linux-x64
chmod +x ccdb
sudo mv ccdb /usr/local/bin/
```

## Usage

```bash
# Search carbon emission factors
ccdb search "电力"
ccdb search "cement" --lang en

# JSON output (for scripting)
ccdb search "electricity" --lang en --json

# Compare multiple factors
ccdb compare electricity "natural gas" diesel --lang en

# Pipe to jq
ccdb search "steel" --json | jq '.rows[0].factor'
```

### Commands

| Command | Description |
|---------|-------------|
| `search <keyword>` | Search emission factors by keyword |
| `compare <kw1> <kw2> ...` | Compare up to 5 keywords side-by-side |

### Options

| Option | Description |
|--------|-------------|
| `--lang <code>` | Language: `zh` (default) or `en` |
| `--json` | Output raw JSON for scripting |
| `-h, --help` | Show help |
| `-v, --version` | Show version |

### Shortcuts

| Short | Full |
|-------|------|
| `s` | `search` |
| `c`, `cmp` | `compare` |

### Legacy Mode

For backward compatibility, you can omit the `search` subcommand:

```bash
ccdb "电力"          # Same as: ccdb search "电力"
ccdb "cement" --lang en --json
```

## Build from Source

```bash
cd cli

# Bundle only (ESM, requires Node.js to run)
npm run build

# Bundle + standalone binary (no Node.js required)
npm run build:binary
```

Build outputs:

| File | Description | Size |
|------|-------------|------|
| `dist/ccdb.js` | ESM bundle (npm) | ~12 KB |
| `dist/ccdb` | Standalone binary | ~103 MB |

## How It Works

The CLI queries the public [CCDB HTTP API](https://gateway.carbonstop.com) using built-in `fetch` and `crypto` modules. No API key required.

```
User → ccdb CLI → CCDB Public API → Carbonstop CCDB Database
```

## License

[MIT](../LICENSE)
