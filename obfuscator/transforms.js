'use strict';
function encryptStrings(tokens, key, offset) {
  return tokens.map(t => {
    if (t.type !== 'string') return t;
    const enc = Array.from(Buffer.from(t.value, 'utf8')).map((b, i) => (b + (i+1)*key + offset) & 0xff);
    return { type: 'opaque', value: `__S({${enc.join(',')}})` };
  });
}
module.exports = { encryptStrings };
