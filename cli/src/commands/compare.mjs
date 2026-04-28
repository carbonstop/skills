/**
 * `ccdb compare` command — Compare multiple emission factors
 */

import { search } from '../core/api.mjs';
import {
  formatCompareHeader,
  formatCompareRow,
  formatCompareJson,
  formatEmpty,
} from '../utils/format.mjs';
import { red, dim, bold, brightCyan } from '../utils/colors.mjs';

/**
 * Execute the compare command
 * @param {string[]} keywords - Search keywords (1-5)
 * @param {{ lang: string, json: boolean }} options
 */
export async function compareCommand(keywords, options) {
  if (keywords.length === 0) {
    console.error(red('✖ Error: Please provide at least one keyword to compare'));
    console.error(dim('  Usage: ccdb compare <kw1> <kw2> ... [--lang en] [--json]'));
    process.exit(1);
  }

  if (keywords.length > 5) {
    console.error(red('✖ Error: Maximum 5 keywords allowed for comparison'));
    process.exit(1);
  }

  try {
    console.log('');
    console.log(bold(brightCyan('⚖️  CCDB Emission Factor Comparison')));

    const results = {};
    for (const kw of keywords) {
      results[kw] = await search(kw, options.lang);
    }

    if (options.json) {
      console.log(formatCompareJson(results));
    } else {
      for (const [kw, data] of Object.entries(results)) {
        console.log(formatCompareHeader(kw, data.total));

        if (data.rows.length === 0) {
          console.log(formatEmpty());
        } else {
          data.rows.slice(0, 3).forEach((r) => {
            console.log(formatCompareRow(r));
          });
          if (data.rows.length > 3) {
            console.log(dim(`  ... and ${data.rows.length - 3} more results`));
          }
        }
      }
      console.log('');
    }
  } catch (err) {
    console.error(red(`✖ Error: ${err.message}`));
    process.exit(1);
  }
}
