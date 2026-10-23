let session;
async function init() {
  const { data } = await supabase.auth.getSession();
  if (!data.session) return window.location.href = '/auth.html';
  session = data.session; loadScripts();
}
async function loadScripts() {
  const list = document.getElementById('script-list');
  const res = await fetch('/api/my-scripts', { headers: { 'Authorization': `Bearer ${session.access_token}` } });
  const scripts = await res.json();
  if (scripts.length === 0) return list.innerHTML = '<p style="color: var(--muted); text-align: center;">No scripts yet. Create one!</p>';
  list.innerHTML = scripts.map(s => `
    <div class="info" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; padding: 12px;">
      <div><strong style="color: var(--text);">${s.name}</strong><div style="font-size: 11px; color: var(--muted); margin-top: 4px;">Created: ${new Date(s.created_at).toLocaleDateString()}</div></div>
      <div style="display: flex; gap: 8px;">
        <a href="/v/${s.slug}" target="_blank" class="copy" style="text-decoration: none; padding: 6px 12px;">View</a>
        <button class="copy" onclick="deleteScript('${s.slug}')" style="color: var(--pink); border-color: var(--pink);">Delete</button>
      </div>
    </div>`).join('');
}
window.deleteScript = async (slug) => {
  if (!confirm('Delete this script?')) return;
  await fetch(`/api/scripts/${slug}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${session.access_token}` } });
  loadScripts();
};
document.getElementById('logout-btn').addEventListener('click', async () => { await supabase.auth.signOut(); window.location.href = '/auth.html'; });
init();
