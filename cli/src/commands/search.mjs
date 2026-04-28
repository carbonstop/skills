/**
 * `ccdb search` command — Search carbon emission factors
 */

import { search } from '../core/api.mjs';
import {
  formatFactorRow,
  formatSearchHeader,
  formatSearchJson,
} from '../utils/format.mjs';
import { red, dim } from '../utils/colors.mjs';

/**
 * Execute the search command
 * @param {string} keyword - Search keyword
 * @param {{ lang: string, json: boolean }} options
 */
export async function searchCommand(keyword, options) {
  if (!keyword) {
    console.error(red('✖ Error: Please provide a search keyword'));
    console.error(dim('  Usage: ccdb search <keyword> [--lang en] [--json]'));
    process.exit(1);
  }

  try {
    const data = await search(keyword, options.lang);

    if (options.json) {
      console.log(formatSearchJson(data));
    } else {
      console.log(formatSearchHeader(keyword, data.total, data.rows.length));

      if (data.rows.length === 0) {
        console.log('  ⚠️  No matching data found. Try using synonyms or a different language.');
      } else {
        data.rows.forEach((row, i) => {
          console.log(formatFactorRow(row, i));
        });
      }
      console.log('');
    }
  } catch (err) {
    console.error(red(`✖ Error: ${err.message}`));
    process.exit(1);
  }
}
