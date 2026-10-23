'use strict';
const KEYWORDS = new Set(['and','break','do','else','elseif','end','false','for','function','if','in','local','nil','not','or','repeat','return','then','true','until','while','goto']);
function tokenize) {
  const tokens = []; let i = 0; const n = src.length;
  while (i < n) {
    const c = src[i];
    if (/\s/.test(c)) { i++; continue; }
    if (c === '-' && src[i+1] === '-') { while (i < n && src[i] !== '\n') i++; continue; }
    if (c === '"' || c === "'") {
      let j = i + 1; while (j < n && src[j] !== c) { if (src[j] === '\\') j++; j++; }
      tokens.push({ type: 'string', value: src.slice(i+1, j) }); i = j + 1; continue;
    }
    if (/[0-9]/.test(c)) { const m = /^[0-9.]+/.exec(src.slice(i)); tokens.push({ type: 'number', value: m[0] }); i += m[0].length; continue; }
    if (/[a-zA-Z_]/.test(c)) { const m = /^[a-zA-Z_][a-zA-Z0-9_]*/.exec(src.slice(i)); const w = m[0]; tokens.push({ type: KEYWORDS.has(w) ? 'keyword' : 'name', value: w }); i += w.length; continue; }
    tokens.push({ type: 'op', value: c }); i++;
  }
  return tokens;
}
module.exports = { tokenize };
