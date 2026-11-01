import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { ArrowRight, BookOpen, Eye, EyeOff, LockKeyhole, Mail } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  if (user) return <Navigate to="/" replace />;
  const change = (event) => setForm({ ...form, [event.target.name]: event.target.value });
  const submit = async (event) => {
    event.preventDefault(); setError(''); setBusy(true);
    try { await login(form); navigate('/', { replace: true }); }
    catch (err) { setError(err.message); }
    finally { setBusy(false); }
  };
  return <div className="auth-page"><section className="auth-art"><div className="auth-art-top"><div className="brand light"><div className="brand-mark"><BookOpen size={22} /></div><div><strong>booknest</strong><span>LIBRARY WORKSPACE</span></div></div><span className="art-tag">A HOME FOR IDEAS</span></div><div className="art-copy"><div className="art-orb orb-one" /><div className="art-orb orb-two" /><span className="eyebrow light-eyebrow">READ. DISCOVER. GROW.</span><h2>Every great idea<br />starts <em>somewhere.</em></h2><p>Bring your books, people and learning journey into one calm, considered space.</p><div className="art-stats"><div><strong>01</strong><span>Find your next read</span></div><div><strong>02</strong><span>Keep everything in sync</span></div></div></div><div className="art-bottom"><span>CURATED FOR YOUR EVERYDAY</span><span>01 — 04</span></div></section><section className="auth-panel"><div className="auth-panel-inner"><div className="mobile-brand brand"><div className="brand-mark"><BookOpen size={22} /></div><div><strong>booknest</strong><span>LIBRARY WORKSPACE</span></div></div><span className="eyebrow">WELCOME BACK</span><h1>Good to see<br />you again.</h1><p className="auth-intro">Sign in to pick up where your curiosity left off.</p><form className="auth-form" onSubmit={submit}><label>Email address</label><div className="input-wrap"><Mail size={17} /><input type="email" name="email" placeholder="you@example.com" value={form.email} onChange={change} required autoComplete="email" /></div><label>Password</label><div className="input-wrap"><LockKeyhole size={17} /><input type={showPassword ? 'text' : 'password'} name="password" placeholder="Enter your password" value={form.password} onChange={change} required autoComplete="current-password" /><button className="input-icon-button" type="button" onClick={() => setShowPassword(!showPassword)} aria-label="Show password">{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></div>{error && <div className="form-error">{error}</div>}<button className="primary-button full-button" disabled={busy}>{busy ? 'Signing in...' : 'Sign in'} <ArrowRight size={17} /></button></form><p className="auth-switch">New to BookNest? <Link to="/register">Create an account</Link></p><div className="auth-footnote">Your library space, ready when you are.</div></div></section></div>;
}
