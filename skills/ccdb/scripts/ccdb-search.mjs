#!/usr/bin/env node
/**
 * CCDB 碳排放因子搜索 CLI 工具（轻量版，无需安装 ccdb-mcp-server）
 *
 * 用法：
 *   node ccdb-search.mjs <关键词> [lang]          # 格式化输出
 *   node ccdb-search.mjs <关键词> [lang] --json    # JSON 输出
 *   node ccdb-search.mjs --compare <kw1> <kw2> ... # 多关键词对比
 */

import { createHash } from 'node:crypto';

const API_URL = 'https://gateway.carbonstop.com/management/system/website/searchFactorDataMcp';
const SIGN_SALT = 'mcp_ccdb_search';

function sign(name) {
  return createHash('md5').update(SIGN_SALT + name).digest('hex');
}

async function search(name, lang = 'zh') {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sign: sign(name), name, lang }),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  if (data.code !== 200) throw new Error(`API error: ${data.msg}`);
  return data;
}

function formatRow(row, idx) {
  const lines = [
    `--- 因子 #${idx + 1} ---`,
    `📌 名称: ${row.name}`,
    `📊 因子值: ${row.factor} ${row.unit}`,
    `🌍 地区: ${row.countries}`,
    `📅 年份: ${row.year}`,
    `🏛️ 机构: ${row.institution}`,
  ];
  if (row.specification) lines.push(`📋 规格: ${row.specification}`);
  if (row.business) lines.push(`🏢 行业: ${row.business}`);
  if (row.sourceLevel) lines.push(`📊 级别: ${row.sourceLevel}`);
  if (row.description) lines.push(`💡 描述: ${row.description}`);
  return lines.join('\n');
}

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log('用法: node ccdb-search.mjs <关键词> [lang] [--json]');
    console.log('      node ccdb-search.mjs --compare <kw1> <kw2> ...');
    process.exit(0);
  }

  // 对比模式
  if (args[0] === '--compare') {
    const keywords = args.slice(1).filter(a => a !== '--json');
    const isJson = args.includes('--json');

    if (keywords.length === 0 || keywords.length > 5) {
      console.error('请提供 1-5 个关键词');
      process.exit(1);
    }

    const results = {};
    for (const kw of keywords) {
      results[kw] = await search(kw);
    }

    if (isJson) {
      console.log(JSON.stringify(results, null, 2));
    } else {
      for (const [kw, data] of Object.entries(results)) {
        console.log(`\n🔍「${kw}」— 共 ${data.total} 条结果`);
        console.log('─'.repeat(40));
        if (data.rows.length === 0) {
          console.log('  ⚠️ 未找到匹配数据');
        } else {
          data.rows.slice(0, 3).forEach((r, i) => {
            console.log(`  ${r.factor} ${r.unit} | ${r.name} | ${r.countries} ${r.year} | ${r.institution}`);
          });
          if (data.rows.length > 3) {
            console.log(`  ... 还有 ${data.rows.length - 3} 条结果`);
          }
        }
      }
    }
    return;
  }

  // 普通搜索模式
  const isJson = args.includes('--json');
  const keyword = args[0];
  const lang = args[1] && !args[1].startsWith('-') ? args[1] : 'zh';

  const data = await search(keyword, lang);

  if (isJson) {
    const simplified = data.rows.map(r => ({
      name: r.name, factor: r.factor, unit: r.unit,
      countries: r.countries, year: r.year, institution: r.institution,
      specification: r.specification, business: r.business,
      sourceLevel: r.sourceLevel,
    }));
    console.log(JSON.stringify({ total: data.total, rows: simplified }, null, 2));
  } else {
    console.log(`共找到 ${data.total} 条碳排放因子数据（展示前 ${data.rows.length} 条）：\n`);
    data.rows.forEach((r, i) => console.log(formatRow(r, i) + '\n'));
  }
}

main().catch(e => { console.error('❌ 错误:', e.message); process.exit(1); });
