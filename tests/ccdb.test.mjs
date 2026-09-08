import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile, stat, readdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
test('user access instructions do not require source builds or pin release numbers', async () => {
  for (const file of ['README.md', 'README_zh.md', 'skills/ccdb/SKILL.md']) {
    const text = await readFile(resolve(root, file), 'utf8');
    assert.doesNotMatch(text, /npm ci|npm run (?:verify|build)|dist\/releases\//, file);
    assert.doesNotMatch(text, /ccdb-(?:cli|mcp-server)@\d/, file);
  }
});
test('CCDB skill keeps its install identity and single-file CLI/MCP contract', async () => {
  const skill = await readFile(resolve(root, 'skills/ccdb/SKILL.md'), 'utf8');
  assert.match(skill, /^---\nname: ccdb\ndescription: .+\n---/);
  assert.ok(skill.includes('search_emission_factors'));
  assert.ok(skill.includes('get_emission_factor_detail'));
  assert.ok(skill.includes('ccdb-cli factor search'));
  for (const file of ['SKILL.md']) {
    const path = resolve(root, 'skills/ccdb', file);
    const text = await readFile(path, 'utf8');
    assert.ok(!text.includes('scripts/ccdb.mjs'), 'must not depend on bundled CLI');
    for (const [, target] of text.matchAll(/\[[^\]]+\]\(([^)]+)\)/g)) {
      if (/^https?:/.test(target) || target.startsWith('#')) continue;
      assert.ok((await stat(resolve(dirname(path), target.split('#')[0]))).isFile());
    }
  }
  assert.deepEqual((await readdir(resolve(root, 'skills/ccdb'))).sort(), ['SKILL.md']);
});
