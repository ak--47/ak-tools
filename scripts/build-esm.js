#!/usr/bin/env node

/**
 * Build script to create ESM wrapper for CommonJS module
 */

const fs = require('fs');
const path = require('path');

// Create esm directory
const esmDir = path.join(__dirname, '..', 'esm');
if (!fs.existsSync(esmDir)) {
    fs.mkdirSync(esmDir, { recursive: true });
}

// Get all exports from the CommonJS module
const utils = require('../index.js');
const exportNames = Object.keys(utils);

// Create ESM wrapper that re-exports everything
const esmContent = `// ESM wrapper for ak-tools
import utils from '../index.js';

// Re-export all named exports
${exportNames.map(name => `export const ${name} = utils.${name};`).join('\n')}

// Export namespaces
export const files = utils.files;
export const validate = utils.validate;
export const display = utils.display;
export const maths = utils.maths;
export const objects = utils.objects;
export const arrays = utils.arrays;
export const functions = utils.functions;
export const logging = utils.logging;

// Default export
export default utils;
`;

// Write the ESM file
fs.writeFileSync(path.join(esmDir, 'index.mjs'), esmContent);

console.log('✅ ESM build complete: esm/index.mjs');
console.log(`✅ Exported ${exportNames.length} functions`);