const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

exports.handler = async (event) => {
  const token = (event.headers.authorization || '').replace('Bearer ', '');
  const { data: { user }, error: authError } = await supabase.auth.getUser(token);
  if (authError || !user) return { statusCode: 401, body: 'Unauthorized' };

  const { data, error } = await supabase.from('scripts').select('id, name, slug, token, created_at').eq('user_id', user.id).order('created_at', { ascending: false });
  if (error) return { statusCode: 500, body: JSON(src.stringify({ error }) };

  return { statusCode: 200, body: JSON.stringify(data) };
};
