/**
 * CCDB API Core — Handles communication with the Carbonstop CCDB API
 */

import { createHash } from 'node:crypto';

const API_URL = 'https://gateway.carbonstop.com/management/system/website/searchFactorDataMcp';
const SIGN_SALT = 'mcp_ccdb_search';

/**
 * Generate MD5 sign for API authentication
 */
function sign(name) {
  return createHash('md5').update(SIGN_SALT + name).digest('hex');
}

/**
 * Search carbon emission factors from CCDB
 * @param {string} name - Search keyword
 * @param {string} lang - Language code ('zh' or 'en')
 * @returns {Promise<{code: number, total: number, rows: Array}>}
 */
export async function search(name, lang = 'zh') {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sign: sign(name), name, lang }),
  });

  if (!res.ok) {
    throw new Error(`HTTP request failed with status ${res.status}`);
  }

  const data = await res.json();

  if (data.code !== 200) {
    throw new Error(`API error: ${data.msg || 'Unknown error'}`);
  }

  return data;
}
