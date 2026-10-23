'use strict';
const { tokenize } = require('./lexer');
const { encryptStrings } = require('./transforms');

function obfuscate(source) {
  let tokens = tokenize(source);
  const key = Math.floor(Math.random() * 100) + 30;
  const offset = Math.floor(Math.random() * 100);
  tokens = encryptStrings(tokens, key, offset);
  
  const decoder = `local function __S(t) local o={} for i=1,#t do o[i]=string.char((t[i]+i*${key}+${offset})%256) end return table.concat(o) end\n`;
  let inner = decoder + tokens.map(t => t.value).join(' ');
  const encrypted = Buffer.from(inner).toString('base64');

  return `
local __p = "${encrypted}"
pcall(function()
  local g = getgenv and getgenv() or _G
  if g.__OBFSOO then return end
  g.__OBFSOO = true
  if type(getreg) == "function" then
    for _, v in next,getreg() do
      local s = tostring(v)
      if s:find("dump") or s:find("decompile") then __p = "bad" return end
    end
  end
end)()
if __p == "bad" then return end
local __code = game:GetService("HttpService"):Base64Decode(__p)
local __fn = loadstring(__code, "@OBFSOO")
if __fn then __fn() end
`;
}
module.exports = { obfuscate };
