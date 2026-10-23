const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

exports.handler = async (event) => {
  const token = event.path.split('/').pop();
  const ua = event.headers['user-agent'] || '';

  // حماية الـ Raw من المتصفحات
  if (ua.includes('Mozilla') || ua.includes('Chrome') || ua.includes('Safari') || ua.includes('Edg')) {
    const html = fs.readFileSync(path.join(__dirname, '../../public/unauthorized.html'), 'utf8');
    return { statusCode: 403, headers: { 'Content-Type': 'text/html; charset=utf-8' }, body: html };
  }

  const { data: script, error } = await supabase.from('scripts').select('protected_code').eq('token', token).single();
  if (error || !script) return { statusCode: 404, body: '-- not found' };

  return { statusCode: 200, headers: { 'Content-Type': 'text/plain; charset=utf-8' }, body: script.protected_code };
};
