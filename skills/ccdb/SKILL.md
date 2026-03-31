---
name: ccdb
description: |
  CCDB Carbon Emission Factor Search Tool. Based on the Carbonstop CCDB database, it queries carbon emission factor data directly via a lightweight script.
  Supports keyword search for carbon emission factors, retrieving structured JSON data, and multi-keyword comparisons.

  **Use this Skill when**:
  (1) The user queries carbon emission factors (e.g., "electricity emission factor", "cement carbon emission", "natural gas emission coefficient", etc.)
  (2) The user needs to perform carbon emission calculations (needs to query the factor first, then multiply by activity data)
  (3) The user needs to compare the carbon emission factors of different energy sources/materials
  (4) The user mentions "CCDB", "carbon emission factor", "emission coefficient", "carbon footprint", "LCA", or "emission factor"
  (5) The user needs to query carbon emission factor data for a specific country/region or a specific year
---

# CCDB Carbon Emission Factor Search

Queries the Carbonstop CCDB emission factor database via directly calling the public HTTP API.

## Prerequisites

Zero dependencies. The tool uses a native Node.js script `scripts/ccdb-search.mjs` with built-in `crypto` and `fetch`. No API Key is needed.

## Available Tools

This skill comes with a lightweight CLI script `scripts/ccdb-search.mjs` that can be executed directly.
You can execute it by running `node /workspace/skills/skills/ccdb/scripts/ccdb-search.mjs` (replace the path with the actual absolute path to the script).

### 1. Search Emission Factors (Formatted Output)

**Purpose**: Search for carbon emission factors by keyword and return human-readable formatted text.

```bash
node /workspace/skills/skills/ccdb/scripts/ccdb-search.mjs "电力"
node /workspace/skills/skills/ccdb/scripts/ccdb-search.mjs "electricity" en
```

Parameters:
*   `keyword`: Search keyword, e.g., "electricity", "cement", "steel", "natural gas"
*   `lang`: (Optional) Target language for the search. Defaults to `zh`. Pass `en` for English.

Returns: Formatted text containing the factor value, unit, applicable region, year, publishing institution, etc.

### 2. Search Emission Factors (JSON Output)

**Purpose**: Operates the same as regular search, but returns structured JSON data. Highly recommended for programmatic handling and carbon emission calculations.

```bash
node /workspace/skills/skills/ccdb/scripts/ccdb-search.mjs "electricity" en --json
```

Parameters are identical to formatting search, just append the `--json` flag.

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

### 3. Compare Multiple Emission Factors

**Purpose**: Compare the carbon emission factors of up to 5 keywords simultaneously. Useful for horizontal comparison of different energy sources or materials.

```bash
node /workspace/skills/skills/ccdb/scripts/ccdb-search.mjs --compare 电力 天然气 柴油
node /workspace/skills/skills/ccdb/scripts/ccdb-search.mjs --compare electricity "natural gas" en
node /workspace/skills/skills/ccdb/scripts/ccdb-search.mjs --compare electricity "natural gas" --json
```

Parameters:
*   `--compare`: Flag to trigger comparison mode.
*   `keywords`: List of search keywords, 1-5 items maximum.

### Node.js One-Liner (Fallback)

If the script is somehow inaccessible, you can use this standalone Node.js snippet:

```bash
node -e "const c=require('crypto'),n=process.argv[1],s=c.createHash('md5').update('mcp_ccdb_search'+n).digest('hex');fetch('https://gateway.carbonstop.com/management/system/website/searchFactorDataMcp',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({sign:s,name:n,lang:'en'})}).then(r=>r.json()).then(d=>console.log(JSON.stringify(d,null,2)))" "electricity"
```

## Usage Scenarios & Examples

### Scenario 1: Query Emission Factor for a Specific Energy Source

> User: What is the carbon emission factor for the Chinese power grid?

→ Action: Execute `node /workspace/skills/skills/ccdb/scripts/ccdb-search.mjs "electricity" en` or `node /workspace/skills/skills/ccdb/scripts/ccdb-search.mjs "中国电网"`. Find the one corresponding to China and the most recent year.

### Scenario 2: Carbon Emission Calculation

> User: My company used 500,000 kWh of electricity last year, what is the carbon footprint?

→ Workflow:
1. Search the `"electricity"` factor (preferably with `--json`), select China and the latest year.
2. Calculate Carbon Emissions = 500,000 kWh × Factor Value (in kgCO₂e/kWh).

### Scenario 3: Comparing Energy Alternatives

> User: Compare the carbon emission factors of electricity, natural gas, and diesel.

→ Action: Execute `node /workspace/skills/skills/ccdb/scripts/ccdb-search.mjs --compare "electricity" "natural gas" "diesel" en`

### Scenario 4: Querying Industry-Specific Data

> User: What is the emission factor for the cement industry?

→ Action: Search using `"cement"`.

## Important Notes

1. **Prioritize China Mainland and the Latest Year**: Unless the user specifies another region or year, implicitly prioritize data for China and the most recent year available.
2. **Pay Close Attention to Unit Conversion**: Different factors might have entirely different units (e.g., kgCO₂/kWh vs. tCO₂/TJ). Always double-check before doing mathematical calculations.
3. **Data Authority / Providers**: Take note of the publishing institutions (e.g., MEE, IPCC, IEA, EPA).
4. **No Results Found? Use Synonyms**: If the search yields empty results, attempt to use synonyms (e.g., translate your query, or map "power" → "electricity" → "grid").
5. **Always Use JSON for Calculations**: The `--json` format returns highly precise numerical figures that are ideal for programmatic multiplication.
