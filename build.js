const JavaScriptObfuscator = require('javascript-obfuscator');
const fs = require('fs');
const path = require('path');

const publicJsDir = path.join(__dirname, 'public', 'js');
const files = ['app.js', 'view.js', 'auth.js', 'dashboard.js', 'supabase-config.js'];

files.forEach(file => {
  const filePath = path.join(publicJsDir, file);
  if (!fs.existsSync(filePath)) return;

  const code = fs.readFileSync(filePath, 'utf8');
  const obfuscated = JavaScriptObfuscator.obfuscate(code, {
    compact: true,
    controlFlowFlattening: true,
    controlFlowFlatteningThreshold: 0.75,
    deadCodeInjection: true,
    debugProtection: true,
    disableConsoleOutput: true,
    identifierNamesGenerator: 'hexadecimal',
    numbersToExpressions: true,
    selfDefending: true,
    stringArray: true,
    stringArrayEncoding: ['base64'],
    stringArrayThreshold: 0.75,
    transformObjectKeys: true
  }).getObfuscatedCode();

  fs.writeFileSync(filePath, obfuscated, 'utf8');
  console.log(`✓ ${file} obfuscated`);
});
