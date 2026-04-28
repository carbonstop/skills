/**
 * Output formatting utilities
 */

import { bold, cyan, green, yellow, gray, dim, magenta, blue, brightCyan } from './colors.mjs';

/**
 * Format a single factor row for terminal display
 */
export function formatFactorRow(row, idx) {
  const lines = [
    '',
    `${bold(cyan(`━━━ Factor #${idx + 1} ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`))}`,
    `  ${bold('📌 Name')}:         ${bold(row.name)}`,
    `  ${bold('📊 Factor')}:       ${green(bold(row.factor))} ${dim(row.unit)}`,
    `  ${bold('🌍 Region')}:       ${row.countries}`,
    `  ${bold('📅 Year')}:         ${yellow(row.year)}`,
    `  ${bold('🏛️  Institution')}: ${row.institution}`,
  ];

  if (row.specification) lines.push(`  ${bold('📋 Spec')}:         ${dim(row.specification)}`);
  if (row.business)      lines.push(`  ${bold('🏢 Industry')}:     ${dim(row.business)}`);
  if (row.sourceLevel)   lines.push(`  ${bold('📊 Level')}:        ${dim(row.sourceLevel)}`);
  if (row.description)   lines.push(`  ${bold('💡 Description')}:  ${dim(row.description)}`);

  return lines.join('\n');
}

/**
 * Format search result header
 */
export function formatSearchHeader(keyword, total, shown) {
  return [
    '',
    `${bold(brightCyan('🔍 CCDB Carbon Emission Factor Search'))}`,
    `${dim('─'.repeat(50))}`,
    `  ${bold('Keyword')}:  ${magenta(keyword)}`,
    `  ${bold('Results')}:  ${green(String(total))} total, showing ${yellow(String(shown))}`,
    `${dim('─'.repeat(50))}`,
  ].join('\n');
}

/**
 * Format compare mode header
 */
export function formatCompareHeader(keyword, total) {
  return [
    '',
    `${bold(blue(`🔍 「${keyword}」`))} ${dim('—')} ${green(String(total))} results`,
    `${dim('─'.repeat(45))}`,
  ].join('\n');
}

/**
 * Format a compact compare row
 */
export function formatCompareRow(row) {
  return `  ${green(bold(row.factor))} ${dim(row.unit)} ${dim('│')} ${row.name} ${dim('│')} ${row.countries} ${yellow(row.year)} ${dim('│')} ${gray(row.institution)}`;
}

/**
 * Format empty result message
 */
export function formatEmpty() {
  return `  ${yellow('⚠')} No matching data found`;
}

/**
 * Format JSON output for search
 */
export function formatSearchJson(data) {
  const simplified = data.rows.map(r => ({
    name: r.name,
    factor: r.factor,
    unit: r.unit,
    countries: r.countries,
    year: r.year,
    institution: r.institution,
    specification: r.specification,
    business: r.business,
    sourceLevel: r.sourceLevel,
  }));
  return JSON.stringify({ total: data.total, rows: simplified }, null, 2);
}

/**
 * Format JSON output for compare
 */
export function formatCompareJson(results) {
  return JSON.stringify(results, null, 2);
}
