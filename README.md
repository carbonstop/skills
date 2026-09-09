# CCDB Emission Factor Search & Matching

Carbonstop 碳阻迹 · Product Carbon Footprint / LCA

[中文说明](README_zh.md)

Help your Agent use `ccdb-cli` to query CCDB emission factors for electricity, fuels, materials and transport activities, compare units, regions, years, system boundaries and sources, and select factors for product carbon footprints (PCF), corporate carbon accounting and life cycle assessment (LCA).

Answers use actual query results and retain the returned detail links to [Carbon Agent](https://agent.carbonstop.com), where you can view the corresponding factors and their conditions of use. Availability depends on account permissions and database coverage. This Skill does not perform model writes or replace a complete footprint assessment or compliance review.

## Try asking

- “Find aluminum emission factors suitable for production in China, and explain which process and boundary assumptions still need confirmation.”
- “Compare these two CCDB electricity factors by unit, year and system boundary. Can they be used in the same accounting scenario?”
- “Check whether this CCDB factor fits my product carbon footprint, with its detail link and conditions of use.”

These are task examples, not guaranteed database matches.

## 1. Install the Skill

For hosts supported by the [skills CLI](https://skills.sh/docs/cli), run with Node.js / npm available:

```sh
npx skills add carbonstop/skills
```

Select `ccdb` and your target Agent when prompted. Alternatively, use your host's Skill import mechanism to install the [skills/ccdb](skills/ccdb) directory containing `SKILL.md`.

Your Agent needs local command execution, network access, CCDB CLI and valid authorization. Installing the Skill adds task instructions; it does not install the CLI or log you in.

## 2. Install the CLI and authorize access

Check `ccdb-cli --version` first and reuse an existing installation. If missing and you approve installation, install the CLI (the npm package requires Node.js 22+):

```sh
npm install -g ccdb-cli@latest
ccdb-cli --version
```

Without Node.js, download a [standalone binary](https://github.com/carbonstop/ccdb-cli/releases/latest), verify the checksum, and follow the [CLI installation guide](https://github.com/carbonstop/ccdb-cli). For first-time access, run:

```sh
ccdb-cli auth login
```

Confirm device authorization in your browser. Reuse valid credentials rather than logging in each time. API Key authentication is an explicitly chosen alternative, not an automatic fallback after OAuth failure. Never paste tokens or API Keys into chat.

The default environment is production. If using a test environment, keep `--profile test` consistent across login and queries; see [environment configuration](https://github.com/carbonstop/ccdb-cli/blob/main/docs/CONFIGURATION.md).

## 3. Ask your Agent

Ask one of the example questions above, with the material/activity, unit, region and accounting boundary you need. The Agent uses CLI search and detail results to explain suitable candidates and retain their Carbon Agent links.

If results are missing or values are restricted, the Agent should explain the limitation instead of inventing data; signing in does not guarantee unrestricted access. See [SKILL.md](skills/ccdb/SKILL.md) for the query, selection and safety rules.

If installation or access fails, use the [CLI troubleshooting guide](https://github.com/carbonstop/ccdb-cli). Share only the error code and requestId, not credentials. Importing a Skill cannot enable command execution in a host that does not support it.

## Related tools

- [CCDB CLI](https://github.com/carbonstop/ccdb-cli): installation and command usage; [latest binaries](https://github.com/carbonstop/ccdb-cli/releases/latest).
- [CCDB MCP](https://github.com/carbonstop/ccdb-mcp): an independent connector for MCP hosts.

## Updates

Update the Skill through your installation tool or host; for a manual import, replace the Skill directory with the current repository copy. Update CCDB CLI separately using its installation guide. Read migration notes before crossing breaking changes.
