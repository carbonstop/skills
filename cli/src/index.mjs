/**
 * ccdb — CCDB Carbon Emission Factor Search CLI
 *
 * A command-line tool to query carbon emission factors from the
 * Carbonstop CCDB database. Supports keyword search, structured
 * JSON output, and multi-keyword comparison.
 *
 * Usage:
 *   ccdb search <keyword> [--lang en] [--json]
 *   ccdb compare <kw1> <kw2> ... [--lang en] [--json]
 *   ccdb --help
 *   ccdb --version
 */

import { searchCommand } from './commands/search.mjs';
import { compareCommand } from './commands/compare.mjs';
import { bold, cyan, green, yellow, dim, gray, magenta, brightCyan, red } from './utils/colors.mjs';

const VERSION = '1.0.0';

// ─── Help Text ──────────────────────────────────────────────

function printBanner() {
  console.log('');
  console.log(bold(brightCyan('  ╔══════════════════════════════════════════════╗')));
  console.log(bold(brightCyan('  ║')) + bold('   🌍 CCDB — Carbon Emission Factor CLI      ') + bold(brightCyan('║')));
  console.log(bold(brightCyan('  ║')) + dim('   Powered by Carbonstop CCDB Database        ') + bold(brightCyan('║')));
  console.log(bold(brightCyan('  ╚══════════════════════════════════════════════╝')));
  console.log('');
}

function printHelp() {
  printBanner();

  console.log(bold('  USAGE'));
  console.log('');
  console.log(`    ${green('$')} ${cyan('ccdb')} ${yellow('search')} ${magenta('<keyword>')} ${dim('[options]')}`);
  console.log(`    ${green('$')} ${cyan('ccdb')} ${yellow('compare')} ${magenta('<kw1> <kw2> ...')} ${dim('[options]')}`);
  console.log('');

  console.log(bold('  COMMANDS'));
  console.log('');
  console.log(`    ${yellow('search')}  ${dim('<keyword>')}     Search carbon emission factors by keyword`);
  console.log(`    ${yellow('compare')} ${dim('<kw1> <kw2>')}   Compare factors across up to 5 keywords`);
  console.log('');

  console.log(bold('  OPTIONS'));
  console.log('');
  console.log(`    ${cyan('--lang')} ${dim('<code>')}          Language: ${green('zh')} (default) or ${green('en')}`);
  console.log(`    ${cyan('--json')}                 Output raw JSON (for piping/scripting)`);
  console.log(`    ${cyan('-h, --help')}             Show this help message`);
  console.log(`    ${cyan('-v, --version')}          Show version number`);
  console.log('');

  console.log(bold('  EXAMPLES'));
  console.log('');
  console.log(`    ${dim('#')} Search for electricity emission factors`);
  console.log(`    ${green('$')} ccdb search "电力"`);
  console.log('');
  console.log(`    ${dim('#')} Search in English`);
  console.log(`    ${green('$')} ccdb search "cement" --lang en`);
  console.log('');
  console.log(`    ${dim('#')} JSON output for scripting`);
  console.log(`    ${green('$')} ccdb search "electricity" --lang en --json`);
  console.log('');
  console.log(`    ${dim('#')} Compare multiple energy sources`);
  console.log(`    ${green('$')} ccdb compare electricity "natural gas" diesel --lang en`);
  console.log('');
  console.log(`    ${dim('#')} Pipe JSON to jq`);
  console.log(`    ${green('$')} ccdb search "steel" --json | jq '.rows[0].factor'`);
  console.log('');

  console.log(`  ${dim('Homepage:')} ${cyan('https://github.com/carbonstop/skills')}`);
  console.log(`  ${dim('Database:')} ${cyan('https://ccdb.carbonstop.com')}`);
  console.log('');
}

function printVersion() {
  console.log(`ccdb v${VERSION}`);
}

// ─── Argument Parser ────────────────────────────────────────

function parseArgs(argv) {
  const args = argv.slice(2);

  // Extract flags
  const flags = {
    help: false,
    version: false,
    json: false,
    lang: 'zh',
  };

  const positional = [];

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    if (arg === '-h' || arg === '--help') {
      flags.help = true;
    } else if (arg === '-v' || arg === '--version') {
      flags.version = true;
    } else if (arg === '--json') {
      flags.json = true;
    } else if (arg === '--lang') {
      i++;
      if (i < args.length) {
        flags.lang = args[i];
      } else {
        console.error(red('✖ Error: --lang requires a value (zh or en)'));
        process.exit(1);
      }
    } else if (arg.startsWith('-')) {
      console.error(red(`✖ Unknown option: ${arg}`));
      console.error(dim('  Run "ccdb --help" for usage information'));
      process.exit(1);
    } else {
      positional.push(arg);
    }
  }

  return { flags, positional };
}

// ─── Main ───────────────────────────────────────────────────

async function main() {
  const { flags, positional } = parseArgs(process.argv);

  // Global flags
  if (flags.help) {
    printHelp();
    process.exit(0);
  }

  if (flags.version) {
    printVersion();
    process.exit(0);
  }

  // No command provided
  if (positional.length === 0) {
    printHelp();
    process.exit(0);
  }

  const command = positional[0];
  const commandArgs = positional.slice(1);

  switch (command) {
    case 'search':
    case 's': {
      const keyword = commandArgs[0];
      await searchCommand(keyword, { lang: flags.lang, json: flags.json });
      break;
    }

    case 'compare':
    case 'cmp':
    case 'c': {
      await compareCommand(commandArgs, { lang: flags.lang, json: flags.json });
      break;
    }

    case 'help': {
      printHelp();
      break;
    }

    case 'version': {
      printVersion();
      break;
    }

    default: {
      // Legacy mode: treat as keyword search for backward compatibility
      // e.g., `ccdb 电力` → same as `ccdb search 电力`
      await searchCommand(command, { lang: flags.lang, json: flags.json });
      break;
    }
  }
}

main().catch(err => {
  console.error(red(`✖ Fatal: ${err.message}`));
  process.exit(1);
});
