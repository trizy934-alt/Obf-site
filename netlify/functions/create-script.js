const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { obfuscate } = require('../../obfuscator');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };
  const token = (event.headers.authorization || '').replace('Bearer ', '');
  const { data: { user }, error: authError } = await supabase.auth.getUser(token);
  if (authError || !user) return { statusCode: 401, body: JSON.stringify({ error: 'Unauthorized' }) };

  try {
    const { name, source, password } = JSON.parse(event.body);
    if (!source || !password) return { statusCode: 400, body: JSON.stringify({ error: 'Missing fields' }) };

    const slug = crypto.randomBytes(8).toString('hex');
    const scriptToken = crypto.randomBytes(32).toString('hex');
    const protectedCode = obfuscate(source);
    const hash = await bcrypt.hash(password, 10);

    const { data, error } = await supabase.from('scripts').insert({
      user_id: user.id,
      name: name || 'Untitled',
      slug, token: scriptToken,
      protected_code: protectedCode,
      password_hash: hash
    }).select().single();

    if (error) throw error;

    const base = `https://${event.headers.host}`;
    return {
      statusCode: 200,
      body: JSON.stringify({ view_url: `${base}/v/${slug}`, loader_url: `${base}/l/${scriptToken}` })
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: 'Internal Error' }) };
  }
};
