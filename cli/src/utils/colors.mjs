/**
 * ANSI Color Utilities — Zero dependency terminal colors
 */

const isColorSupported = 
  !('NO_COLOR' in process.env) && 
  (process.env.FORCE_COLOR !== '0') &&
  (process.stdout.isTTY || process.env.FORCE_COLOR === '1');

function wrap(open, close) {
  return (str) => isColorSupported ? `\x1b[${open}m${str}\x1b[${close}m` : str;
}

// Styles
export const bold      = wrap('1', '22');
export const dim       = wrap('2', '22');
export const italic    = wrap('3', '23');
export const underline = wrap('4', '24');

// Colors
export const red       = wrap('31', '39');
export const green     = wrap('32', '39');
export const yellow    = wrap('33', '39');
export const blue      = wrap('34', '39');
export const magenta   = wrap('35', '39');
export const cyan      = wrap('36', '39');
export const white     = wrap('37', '39');
export const gray      = wrap('90', '39');

// Bright Colors
export const brightRed     = wrap('91', '39');
export const brightGreen   = wrap('92', '39');
export const brightYellow  = wrap('93', '39');
export const brightBlue    = wrap('94', '39');
export const brightMagenta = wrap('95', '39');
export const brightCyan    = wrap('96', '39');

// Background
export const bgRed     = wrap('41', '49');
export const bgGreen   = wrap('42', '49');
export const bgYellow  = wrap('43', '49');
export const bgBlue    = wrap('44', '49');
export const bgMagenta = wrap('45', '49');
export const bgCyan    = wrap('46', '49');
