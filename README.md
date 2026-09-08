# Carbonstop AI Skills

[中文说明](README_zh.md)

This repository contains instruction-only skills. It does not bundle, build or publish CLI/MCP executables.

## CCDB

Install the entire [skills/ccdb](skills/ccdb) directory, containing only SKILL.md, using your Agent's skill installation mechanism. The folder and skill name remain `ccdb` for existing installations. Existing copied installations need to be updated manually.

The skill searches and evaluates emission factors using either:

- The configured OAuth-enabled CCDB MCP tools `search_emission_factors` / `get_emission_factor_detail`; or
- The separately installed `ccdb-cli` CLI (npm requires Node.js 22+; native binaries do not).

See [installation and authentication](skills/ccdb/SKILL.md). Installing this Skill alone does not install software, grant database access or perform login. Never paste tokens or API Keys into chat.

## Related tools

- [CCDB CLI](https://github.com/carbonstop/ccdb-cli): installation and command usage; [latest binaries](https://github.com/carbonstop/ccdb-cli/releases/latest).
- [CCDB MCP](https://github.com/carbonstop/ccdb-mcp): connect your Agent to CCDB.

Installation commands use npm's latest tag instead of a hardcoded release number. Consult release and migration notes before upgrading across breaking changes. Skills and installed tools are updated separately. If a tool is incompatible, report the problem or suggest upgrading; never fall back to unauthenticated legacy endpoints.
