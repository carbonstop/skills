---
name: ccdb
description: |
  CCDB Carbon Emission Factor Search Tool. Based on the Carbonstop CCDB database, it queries carbon emission factor data via ccdb-mcp-server.
  Supports keyword search for carbon emission factors, retrieving structured JSON data, and multi-keyword comparisons.

  **Use this Skill when**:
  (1) The user queries carbon emission factors (e.g., "electricity emission factor", "cement carbon emission", "natural gas emission coefficient", etc.)
  (2) The user needs to perform carbon emission calculations (needs to query the factor first, then multiply by activity data)
  (3) The user needs to compare the carbon emission factors of different energy sources/materials
  (4) The user mentions "CCDB", "carbon emission factor", "emission coefficient", "carbon footprint", "LCA", or "emission factor"
  (5) The user needs to query carbon emission factor data for a specific country/region or a specific year
---

# CCDB Carbon Emission Factor Search

Queries the Carbonstop CCDB emission factor database using [ccdb-mcp-server](https://www.npmjs.com/package/ccdb-mcp-server).

## Prerequisites

Global installation of `ccdb-mcp-server` is required if using MCP:

```bash
npm install -g ccdb-mcp-server
```

No API Key is needed; it utilizes a public API.

## Available Tools

The `ccdb-mcp` CLI can be called via `mcporter` in stdio mode, exposing 3 MCP tools:

### 1. `search_factors` — Search Emission Factors (Formatted Output)

**Purpose**: Search for carbon emission factors by keyword and return humane-readable formatted text.

```bash
mcporter call ccdb-mcp --stdio -- search_factors '{"name":"electricity","lang":"en"}'
```

Parameters:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `name` | string | ✅ | Search keyword, e.g., "electricity", "cement", "steel", "natural gas" |
| `lang` | `"zh"` \| `"en"` | ❌ | Target language for the search. Defaults to `zh` |

Returns: Formatted text containing the factor value, unit, applicable region, year, publishing institution, etc.

### 2. `search_factors_json` — Search Emission Factors (JSON Output)

**Purpose**: Operates the same as `search_factors`, but returns structured JSON data. Highly recommended for programmatic handling and carbon emission calculations.

```bash
mcporter call ccdb-mcp --stdio -- search_factors_json '{"name":"electricity","lang":"en"}'
```

Parameters are identical to `search_factors`.

JSON Return Fields:
| Field | Description |
|-------|-------------|
| `name` | Factor Name |
| `factor` | Emission Factor Value |
| `unit` | Unit (e.g., kgCO₂e/kWh) |
| `countries` | Applicable Countries/Regions |
| `year` | Publication Year |
| `institution` | Publishing Institution |
| `specification` | Specification details |
| `description` | Additional description |
| `sourceLevel` | Factor source level |
| `business` | Industry sector |
| `documentType` | Document/Source type |

### 3. `compare_factors` — Compare Multiple Emission Factors

**Purpose**: Compare the carbon emission factors of up to 5 keywords simultaneously. Useful for horizontal comparison of different energy sources or materials.

```bash
mcporter call ccdb-mcp --stdio -- compare_factors '{"keywords":["electricity","natural gas","coal"],"lang":"en"}'
```

Parameters:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `keywords` | string[] | ✅ | List of search keywords, 1-5 items maximum |
| `lang` | `"zh"` \| `"en"` | ❌ | Target language for the search. Defaults to `zh` |

## Call Methods

This skill bridges the `ccdb-mcp-server` via the `mcporter` CLI in stdio mode:

```bash
# General Format
mcporter call ccdb-mcp --stdio -- <tool_name> '<json_arguments>'
```

If `mcporter` hasn't configured `ccdb-mcp` yet, register it first:

```bash
mcporter add ccdb-mcp --command "ccdb-mcp" --args "--stdio"
```

**Alternative Method** (using npx directly, no mcporter required):

```bash
echo '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2025-03-26","capabilities":{},"clientInfo":{"name":"agent","version":"1.0.0"}}}' | npx -y ccdb-mcp-server --stdio 2>/dev/null
```

Or you can use the **Direct HTTP Call script** below (Recommended, as it's the most lightweight).

## Direct Execution Script (Recommended · No MCP Server Needed)

This skill comes with a lightweight CLI script `scripts/ccdb-search.mjs` that directly calls the CCDB public HTTP API, requiring ZERO dependencies.

### Search Factors (Formatted Output)

```bash
node /workspace/skills/skills/ccdb/scripts/ccdb-search.mjs "电力"
node /workspace/skills/skills/ccdb/scripts/ccdb-search.mjs "cement" en
```

### Search Factors (JSON Output, best for calculation)

```bash
node /workspace/skills/skills/ccdb/scripts/ccdb-search.mjs "electricity" en --json
```

### Compare Multiple Keywords

```bash
node /workspace/skills/skills/ccdb/scripts/ccdb-search.mjs --compare 电力 天然气 柴油
node /workspace/skills/skills/ccdb/scripts/ccdb-search.mjs --compare electricity "natural gas" --json
```

### Node.js One-Liner (Fallback)

```bash
node -e "const c=require('crypto'),n=process.argv[1],s=c.createHash('md5').update('mcp_ccdb_search'+n).digest('hex');fetch('https://gateway.carbonstop.com/management/system/website/searchFactorDataMcp',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({sign:s,name:n,lang:'en'})}).then(r=>r.json()).then(d=>console.log(JSON.stringify(d,null,2)))" "electricity"
```

## Usage Scenarios & Examples

### Scenario 1: Query Emission Factor for a Specific Energy Source

> User: What is the carbon emission factor for the Chinese power grid?

→ Action: Search using the keyword `"electricity"` or `"China grid"`, filtering for the China region and the most recent year.

### Scenario 2: Carbon Emission Calculation

> User: My company used 500,000 kWh of electricity last year, what is the carbon footprint?

→ Workflow:
1. Search the `"electricity"` factor (JSON output preferably), select China and the latest year.
2. Calculate Carbon Emissions = 500,000 kWh × Factor Value (in kgCO₂e/kWh).

### Scenario 3: Comparing Energy Alternatives

> User: Compare the carbon emission factors of electricity, natural gas, and diesel.

→ Action: Use `compare_factors` with keywords = `["electricity", "natural gas", "diesel"]`.

### Scenario 4: Querying Industry-Specific Data

> User: What is the emission factor for the cement industry?

→ Action: Search using `"cement"`.

## Important Notes

1. **Prioritize China Mainland and the Latest Year**: Unless the user specifies another region or year, implicitly prioritize data for China and the most recent year available.
2. **Pay Close Attention to Unit Conversion**: Different factors might have entirely different units (e.g., kgCO₂/kWh vs. tCO₂/TJ). Always double-check before doing mathematical calculations.
3. **Data Authority / Providers**: Take note of the publishing institutions (e.g., MEE, IPCC, IEA, EPA).
4. **No Results Found? Use Synonyms**: If the search yields empty results, attempt to use synonyms (e.g., translate your query, or map "power" → "electricity" → "grid").
5. **Always Use JSON for Calculations**: The `search_factors_json` format returns highly precise numerical figures that are ideal for programmatic multiplication.
