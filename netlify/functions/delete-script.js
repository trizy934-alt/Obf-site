const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

exports.handler = async (event) => {
  if (event.httpMethod !== 'DELETE') return { statusCode: 405, body: 'Method Not Allowed' };
  const token = (event.headers.authorization || '').replace('Bearer ', '');
  const { data: { user }, error: authError } = await supabase.auth.getUser(token);
  if (authError || !user) return { statusCode: 401, body: 'Unauthorized' };

  const slug = event.path.split('/').pop();
  const { error } = await supabase.from('scripts').delete().eq('slug', slug).eq('user_id', user.id);
  if (error) return { statusCode: 500, body: JSON.stringify({ error }) };

  return { statusCode: 200, body: JSON.stringify({ success: true }) };
};
