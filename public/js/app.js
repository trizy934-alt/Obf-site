supabase.auth.getSession().then(({ data: { session } }) => { if (!session) window.location.href = '/auth.html'; });
document.getElementById('submit').addEventListener('click', async () => {
  const { data: { session } } = await supabase.auth.getSession();
  const name = document.getElementById('name').value, source = document.getElementById('source').value, password = document.getElementById('password').value;
  const err = document.getElementById('err'), btn = document.getElementById('submit');
  if (!source || password.length < 6) return err.textContent = 'Source and password (min 6) required';
  btn.disabled = true; btn.textContent = 'Obfuscating...';
  const res = await fetch('/api/scripts', {
    method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${session.access_token}` },
    body: JSON.stringify({ name, source, password })
  });
  const data = await res.json();
  if (res.ok) {
    document.getElementById('view-url').textContent = data.view_url;
    document.getElementById('loader-url-res').textContent = data.loader_url;
    document.getElementById('result').classList.remove('hidden');
    btn.textContent = 'Done';
  } else { err.textContent = data.error || 'Error'; btn.disabled = false; btn.textContent = 'Create'; }
});
