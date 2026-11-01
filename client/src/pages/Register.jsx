import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { ArrowRight, BookOpen, Eye, EyeOff, UserRound, Mail, Phone, GraduationCap, LockKeyhole } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const initial = { name: '', email: '', phone: '', course: '', year: '', password: '' };
export default function Register() {
  const { user, register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState(initial);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  if (user) return <Navigate to="/" replace />;
  const change = (event) => setForm({ ...form, [event.target.name]: event.target.value });
  const submit = async (event) => {
    event.preventDefault(); setError(''); setBusy(true);
    try { await register(form); navigate('/', { replace: true }); }
    catch (err) { setError(err.message); }
    finally { setBusy(false); }
  };
  return <div className="auth-page"><section className="auth-art register-art"><div className="auth-art-top"><div className="brand light"><div className="brand-mark"><BookOpen size={22} /></div><div><strong>booknest</strong><span>LIBRARY WORKSPACE</span></div></div><span className="art-tag">YOUR NEXT CHAPTER</span></div><div className="art-copy"><div className="art-orb orb-one" /><div className="art-orb orb-two" /><span className="eyebrow light-eyebrow">A SPACE TO KEEP LEARNING</span><h2>Make room for<br /><em>what's next.</em></h2><p>Create your account and keep your library, student details and learning progress together.</p><div className="art-stats"><div><strong>01</strong><span>Your own reading space</span></div><div><strong>02</strong><span>Simple, organised records</span></div></div></div><div className="art-bottom"><span>START YOUR STORY</span><span>02 — 04</span></div></section><section className="auth-panel register-panel"><div className="auth-panel-inner"><div className="mobile-brand brand"><div className="brand-mark"><BookOpen size={22} /></div><div><strong>booknest</strong><span>LIBRARY WORKSPACE</span></div></div><span className="eyebrow">CREATE YOUR ACCOUNT</span><h1>Your story<br />starts here.</h1><p className="auth-intro">Add your student details. We'll save them to the library database when you sign up.</p><form className="auth-form register-form" onSubmit={submit}><div className="form-grid"><div className="field-block"><label>Full name</label><div className="input-wrap"><UserRound size={16} /><input name="name" placeholder="Your full name" value={form.name} onChange={change} required maxLength="80" /></div></div><div className="field-block"><label>Email address</label><div className="input-wrap"><Mail size={16} /><input type="email" name="email" placeholder="you@example.com" value={form.email} onChange={change} required /></div></div><div className="field-block"><label>Phone number <small>Optional</small></label><div className="input-wrap"><Phone size={16} /><input name="phone" placeholder="Your phone number" value={form.phone} onChange={change} /></div></div><div className="field-block"><label>Course</label><div className="input-wrap"><GraduationCap size={16} /><input name="course" placeholder="e.g. MERN Stack" value={form.course} onChange={change} required /></div></div><div className="field-block"><label>Year / Batch</label><div className="input-wrap"><GraduationCap size={16} /><input name="year" placeholder="e.g. 2026 / Year 2" value={form.year} onChange={change} required /></div></div><div className="field-block"><label>Password</label><div className="input-wrap"><LockKeyhole size={16} /><input type={showPassword ? 'text' : 'password'} name="password" placeholder="At least 8 characters" value={form.password} onChange={change} required minLength="8" autoComplete="new-password" /><button className="input-icon-button" type="button" onClick={() => setShowPassword(!showPassword)} aria-label="Show password">{showPassword ? <EyeOff size={16} /> : <Eye size={16} />}</button></div></div></div>{error && <div className="form-error">{error}</div>}<button className="primary-button full-button" disabled={busy}>{busy ? 'Creating account...' : 'Create account'} <ArrowRight size={17} /></button></form><p className="auth-switch">Already have an account? <Link to="/login">Sign in</Link></p><div className="auth-footnote">No OTP required. Your details are saved securely.</div></div></section></div>;
}
