const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };
  const slug = event.path.split('/').pop();
  const { password } = JSON.parse(event.body);

  const { data: script, error } = await supabase.from('scripts').select('token, password_hash').eq('slug', slug).single();
  if (error || !script) return { statusCode: 404, body: JSON.stringify({ error: 'Not found' }) };

  const ok = await bcrypt.compare(password, script.password_hash);
  if (!ok) return { statusCode: 401, body: JSON.stringify({ error: 'Wrong password' }) };

  const base = `https://${event.headers.host}`;
  return { statusCode: 200, body: JSON.stringify({ loader_url: `${base}/l/${script.token}` }) };
};
