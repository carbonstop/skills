import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile, stat, readdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
test('CCDB skill keeps its install identity, references and separate CLI contract', async () => {
  const skill = await readFile(resolve(root, 'skills/ccdb/SKILL.md'), 'utf8');
  assert.match(skill, /^---\nname: ccdb\ndescription: .+\n---/);
  assert.ok(skill.includes('search_emission_factors'));
  assert.ok(skill.includes('get_emission_factor_detail'));
  assert.ok(skill.includes('ccdb-cli factor search'));
  for (const file of ['SKILL.md', 'references/access.md', 'references/matching.md']) {
    const path = resolve(root, 'skills/ccdb', file);
    const text = await readFile(path, 'utf8');
    assert.ok(!text.includes('scripts/ccdb.mjs'), 'must not depend on bundled CLI');
    for (const [, target] of text.matchAll(/\[[^\]]+\]\(([^)]+)\)/g)) {
      if (/^https?:/.test(target) || target.startsWith('#')) continue;
      assert.ok((await stat(resolve(dirname(path), target.split('#')[0]))).isFile());
    }
  }
  assert.ok(!(await readdir(resolve(root, 'skills/ccdb'))).includes('scripts'));
  const metadata = await readFile(resolve(root, 'skills/ccdb/agents/openai.yaml'), 'utf8');
  assert.ok(metadata.includes('$ccdb '));
});
