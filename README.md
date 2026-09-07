# Carbonstop AI Skills

[中文说明](README_zh.md)

This repository contains instruction-only skills. It does not bundle, build or publish CLI/MCP executables.

## CCDB

Install the entire [skills/ccdb](skills/ccdb) directory, including references and agent metadata, using your Agent's skill installation mechanism. The folder and skill name remain `ccdb` for existing installations. Existing copied installations need to be updated manually.

The skill searches and evaluates emission factors using either:

- The configured OAuth-enabled CCDB MCP tools `search_emission_factors` / `get_emission_factor_detail`; or
- The separately installed `ccdb-cli` CLI (npm requires Node.js 22+; native binaries do not).

See [installation and authentication](skills/ccdb/references/access.md). Installing this Skill alone does not install software, grant database access or perform login. Never paste tokens or API Keys into chat.

## Independently maintained projects

| Repository | Responsibility |
| --- | --- |
| [ccdb-cli](https://github.com/carbonstop/ccdb-cli) | CLI source, tests and npm packaging |
| [ccdb-mcp](https://github.com/carbonstop/ccdb-mcp) | MCP server, authentication and deployment integration |
| This repository | Factor selection guidance, tool usage and installation instructions |

The CLI repository may require organization access until its public release is approved. New scoped npm packages are not published as part of this migration; use a maintainer-provided tarball or build from source.

## Migration

Based on `ccdb-integrations` commit `b69f46b5b6f44c70067032a01edaafd13aa790d4`. The previous CLI source, checked-in tarball and CLI release workflow are retired from this branch. Existing Git history, release tags and already published packages remain unchanged.

Legacy `carbonstop-ccdb` / `ccdb` and legacy MCP tool names are not compatible substitutes for the new commands. No automatic fallback to unauthenticated endpoints is permitted. The old bundled Skill script is not shipped: Skill updates and executable updates now have separate lifecycles.

When changing command/tool contracts, update this Skill and its references in a coordinated PR. Current compatibility target: `@carbonstop/ccdb-cli` 0.1.x and `ccdb-mcp-server` 2.x. Future breaking versions require verification. Backend deployment and user permissions remain required.
