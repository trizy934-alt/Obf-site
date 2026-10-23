const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { obfuscate } = require('../../obfuscator');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };
  try {
    const { name, source, password } = JSON.parse(event.body);
    if (!source || !password) return { statusCode: 400, body: JSON.stringify({ error: 'Missing fields' }) };

    const slug = crypto.randomBytes(8).toString('hex');
    const scriptToken = crypto.randomBytes(32).toString('hex');
    const protectedCode = obfuscate(source);
    const hash = await bcrypt.hash(password, 10);

    const { data, error } = await supabase.from('scripts').insert({
      name: name || 'Untitled',
      slug: slug,
      token: scriptToken,
      protected_code: protectedCode,
      password_hash: hash,
      user_id: '00000000-0000-0000-0000-000000000000'
    }).select().single();

    if (error) throw error;

    const base = `https://${event.headers.host}`;
    return {
      statusCode: 200,
      body: JSON.stringify({ view_url: `${base}/v/${slug}`, loader_url: `${base}/l/${scriptToken}` })
    };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: JSON.stringify({ error: 'Internal Error' }) };
  }
};
