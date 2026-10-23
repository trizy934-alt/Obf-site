const { getStore } = require('@netlify/blobs');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { obfuscate } = require('../../obfuscator');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };
  try {
    const { name, source, password } = JSON.parse(event.body);
    if (!source || !password) return { statusCode: 400, body: JSON.stringify({ error: 'Missing fields' }) };

    const slug = crypto.randomBytes(6).toString('hex');
    const token = crypto.randomBytes(24).toString('hex');
    
    const protectedCode = obfuscate(source);
    const hash = await bcrypt.hash(password, 10);
    
    const store = getStore('obfsoo-scripts');
    await store.setJSON(slug, {
      slug, token, name: name || 'Untitled', code: protectedCode, hash
    });

    const base = `https://${event.headers.host}`;
    return {
      statusCode: 200,
      body: JSON.stringify({
        view_url: `${base}/v/${slug}`,
        loader_url: `${base}/l/${token}`
      })
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: 'Internal Error' }) };
  }
};
