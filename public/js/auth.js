let isSignUp = false;
const title = document.getElementById('auth-title');
const subtitle = document.getElementById('auth-subtitle');
const toggle = document.getElementById('toggle-auth');
const submitBtn = document.getElementById('submit-btn');

toggle.addEventListener('click', (e) => {
  e.preventDefault(); isSignUp = !isSignUp;
  title.textContent = isSignUp ? 'Create Account' : 'Welcome Back';
  subtitle.textContent = isSignUp ? 'Start securing your scripts' : 'Sign in to manage your scripts';
  submitBtn.textContent = isSignUp ? 'Sign Up' : 'Sign In';
  toggle.textContent = isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up";
});

submitBtn.addEventListener('click', async () => {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const err = document.getElementById('err');
  err.textContent = ''; submitBtn.disabled = true;
  const { error } = isSignUp ? await supabase.auth.signUp({ email, password }) : await supabase.auth.signInWithPassword({ email, password });
  if (error) { err.textContent = error.message; submitBtn.disabled = false; } 
  else window.location.href = '/dashboard.html';
});
supabase.auth.getSession().then(({ data: { session } }) => { if (session) window.location.href = '/dashboard.html'; });
