const { getStore } = require('@netlify/blobs');
const fs = require('fs');
const path = require('path');

exports.handler = async (event) => {
  const token = event.path.split('/').pop();
  const ua = event.headers['user-agent'] || '';

  if (ua.includes('Mozilla') || ua.includes('Chrome') || ua.includes('Safari') || ua.includes('Edg')) {
    const html = fs.readFileSync(path.join(__dirname, '../../public/unauthorized.html'), 'utf8');
    return { statusCode: 403, headers: { 'Content-Type': 'text/html; charset=utf-8' }, body: html };
  }

  try {
    const store = getStore('obfsoo-scripts');
    const list = await store.list();
    
    let script = null;
    for (const key of list.blobs) {
      const s = await store.get(key.key, { type: 'json' });
      if (s && s.token === token) { script = s; break; }
    }

    if (!script) return { statusCode: 404, body: '-- not found' };

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
      body: script.code
    };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: '-- error' };
  }
};
