#!/usr/bin/env node
/**
 * Build script for ccdb CLI
 *
 * Usage:
 *   node build.mjs           # Bundle only (produces dist/ccdb.mjs)
 *   node build.mjs --binary  # Bundle + create standalone binary via Node.js SEA
 */

import { execSync } from 'node:child_process';
import { writeFileSync, mkdirSync, existsSync, copyFileSync, chmodSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const buildBinary = process.argv.includes('--binary');

const DIST_DIR = resolve(__dirname, 'dist');
const BUNDLE_PATH = resolve(DIST_DIR, 'ccdb.mjs');
const CJS_BUNDLE_PATH = resolve(DIST_DIR, 'ccdb.cjs');
const SEA_CONFIG_PATH = resolve(DIST_DIR, 'sea-config.json');
const BLOB_PATH = resolve(DIST_DIR, 'ccdb.blob');
const BINARY_PATH = resolve(DIST_DIR, 'ccdb');

// ─── Step 1: Ensure dist directory ──────────────────────────

if (!existsSync(DIST_DIR)) {
  mkdirSync(DIST_DIR, { recursive: true });
}

// ─── Step 2: Bundle with esbuild ────────────────────────────

console.log('📦 Bundling with esbuild...');

try {
  // ESM bundle (for npm distribution)
  execSync(
    `npx -y esbuild src/index.mjs \
      --bundle \
      --platform=node \
      --target=node18 \
      --format=esm \
      --outfile=${BUNDLE_PATH} \
      --banner:js="#!/usr/bin/env node"`,
    { cwd: __dirname, stdio: 'inherit' }
  );
  // Make it executable
  chmodSync(BUNDLE_PATH, 0o755);
  console.log(`✅ ESM bundle created: dist/ccdb.mjs`);
} catch (err) {
  console.error('❌ esbuild failed:', err.message);
  process.exit(1);
}

// ─── Step 3: Create standalone binary (optional) ────────────

if (buildBinary) {
  console.log('');
  console.log('🔨 Building standalone binary with Node.js SEA...');

  // Step 3a: Create CJS bundle (SEA requires CommonJS)
  try {
    execSync(
      `npx -y esbuild src/index.mjs \
        --bundle \
        --platform=node \
        --target=node18 \
        --format=cjs \
        --outfile=${CJS_BUNDLE_PATH}`,
      { cwd: __dirname, stdio: 'inherit' }
    );
    console.log('  ✅ CJS bundle created: dist/ccdb.cjs');
  } catch (err) {
    console.error('  ❌ CJS bundling failed:', err.message);
    process.exit(1);
  }

  // Step 3b: Create SEA config
  const seaConfig = {
    main: CJS_BUNDLE_PATH,
    output: BLOB_PATH,
    disableExperimentalSEAWarning: true,
  };
  writeFileSync(SEA_CONFIG_PATH, JSON.stringify(seaConfig, null, 2));
  console.log('  ✅ SEA config written: dist/sea-config.json');

  // Step 3c: Generate the blob
  try {
    execSync(`node --experimental-sea-config ${SEA_CONFIG_PATH}`, {
      cwd: __dirname,
      stdio: 'inherit',
    });
    console.log('  ✅ SEA blob generated: dist/ccdb.blob');
  } catch (err) {
    console.error('  ❌ SEA blob generation failed:', err.message);
    console.error('  ℹ️  Requires Node.js >= 20.0.0 with SEA support');
    process.exit(1);
  }

  // Step 3d: Copy node binary and inject blob
  try {
    copyFileSync(process.execPath, BINARY_PATH);
    chmodSync(BINARY_PATH, 0o755);

    // Remove code signature (macOS)
    if (process.platform === 'darwin') {
      try {
        execSync(`codesign --remove-signature ${BINARY_PATH}`, { stdio: 'inherit' });
        console.log('  ✅ Code signature removed');
      } catch {
        // Ignore if codesign not available
      }
    }

    // Inject the blob using postject
    execSync(
      `npx -y postject ${BINARY_PATH} NODE_SEA_BLOB ${BLOB_PATH} \
        --sentinel-fuse NODE_SEA_FUSE_fce680ab2cc467b6e072b8b5df1996b2 \
        ${process.platform === 'darwin' ? '--macho-segment-name NODE_SEA' : ''}`,
      { cwd: __dirname, stdio: 'inherit' }
    );
    console.log('  ✅ Blob injected into binary');

    // Re-sign (macOS)
    if (process.platform === 'darwin') {
      try {
        execSync(`codesign --sign - ${BINARY_PATH}`, { stdio: 'inherit' });
        console.log('  ✅ Binary re-signed');
      } catch {
        // Ignore if codesign not available
      }
    }

    console.log('');
    console.log(`🎉 Standalone binary ready: dist/ccdb`);
    console.log(`   Run with: ./dist/ccdb search "电力"`);
  } catch (err) {
    console.error('  ❌ Binary creation failed:', err.message);
    process.exit(1);
  }
}

console.log('');
console.log('🏁 Build complete!');
