# CCDB Emission Factor Search & Matching

Carbonstop 碳阻迹 · Product Carbon Footprint / LCA

[中文说明](README_zh.md)

Help your Agent use `ccdb-cli` to query CCDB emission factors for electricity, fuels, materials and transport activities, compare units, regions, years, system boundaries and sources, and select factors for product carbon footprints (PCF), corporate carbon accounting and life cycle assessment (LCA).

Answers use actual query results and retain the returned Carbon Agent detail links for verification. Availability depends on account permissions and database coverage. Missing or restricted values are reported, not invented; logging in is not a promise of unrestricted access. This Skill does not perform model writes or replace a complete footprint assessment or compliance review.

## Try asking

- “Find aluminum emission factors suitable for production in China, and explain which process and boundary assumptions still need confirmation.”
- “Compare these two CCDB electricity factors by unit, year and system boundary. Can they be used in the same accounting scenario?”
- “Check whether this CCDB factor fits my product carbon footprint, with its detail link and conditions of use.”

These are task examples, not guaranteed database matches. General conceptual explanations do not require a CCDB query.

## 1. Install the Skill

For hosts supported by the [skills CLI](https://skills.sh/docs/cli), run with Node.js / npm available:

```sh
npx skills add carbonstop/skills
```

Select `ccdb` and your target Agent when prompted. Alternatively, use your host's Skill import mechanism to install the entire [skills/ccdb](skills/ccdb) directory. It contains only `SKILL.md`; the folder and skill name remain `ccdb` for existing installations.

This installs instructions only. It does not install the CLI executable, log you in or grant database access. The target Agent must support local command execution and network access; a marketplace listing or successful Skill import alone does not provide these capabilities.

## 2. Install the CLI and authorize access

Check `ccdb-cli --version` first and reuse an existing installation. If missing and you approve installation, install the CLI (the npm package requires Node.js 22+):

```sh
npm install -g ccdb-cli@latest
ccdb-cli --version
```

Without Node.js, download a [standalone binary](https://github.com/carbonstop/ccdb-cli/releases/latest) and verify the published checksum. For first-time access, run `ccdb-cli auth login` and confirm device authorization in your browser. Reuse valid credentials rather than logging in each time. API Key authentication is an explicitly chosen alternative, not an automatic fallback after OAuth failure.

The default environment is production; for testing, use `--profile test` consistently for both login and queries. Explicit environment variables can override preset endpoints and client IDs. Once authorized, ask your Agent a real question such as the examples above. See [SKILL.md](skills/ccdb/SKILL.md) for authentication, permissions and troubleshooting. Never paste tokens or API Keys into chat.

## Related tools

- [CCDB CLI](https://github.com/carbonstop/ccdb-cli): installation and command usage; [latest binaries](https://github.com/carbonstop/ccdb-cli/releases/latest).
- [CCDB MCP](https://github.com/carbonstop/ccdb-mcp): an independent connector option, not a dependency or execution path of this Skill.

## Updates

The Skill and CCDB CLI are updated separately. Follow the skills CLI's update instructions for managed installations; replace manually copied Skill directories with a current copy. CLI installation commands use npm's latest tag rather than a hardcoded release number. Read release and migration notes before crossing breaking changes; never fall back to unauthenticated legacy endpoints.

This repository maintains Skill instructions, not CLI source code or executables. Marketplace titles and tags must follow each platform's rules; installation and wording changes do not guarantee listing or ranking.
