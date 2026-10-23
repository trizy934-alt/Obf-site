const { getStore } = require('@netlify/blobs');
const bcrypt = require('bcryptjs');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };
  
  const slug = event.path.split('/').pop();
  const { password } = JSON.parse(event.body);

  try {
    const store = getStore('obfsoo-scripts');
    const script = await store.get(slug, { type: 'json' });
    
    if (!script) return { statusCode: 404, body: JSON.stringify({ error: 'Not found' }) };

    const ok = await bcrypt.compare(password, script.hash);
    if (!ok) return { statusCode: 401, body: JSON.stringify({ error: 'Wrong password' }) };

    const base = `https://${event.headers.host}`;
    return {
      statusCode: 200,
      body: JSON.stringify({ loader_url: `${base}/l/${script.token}` })
    };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: JSON.stringify({ error: 'Internal Error' }) };
  }
};
