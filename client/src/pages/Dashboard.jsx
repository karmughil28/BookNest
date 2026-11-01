import { useEffect, useState } from 'react';
import { ArrowUpRight, BookOpen, Users, BookMarked, Layers3, Plus, Sparkles, Clock3 } from 'lucide-react';
import { Link } from 'react-router-dom';
import api, { getErrorMessage } from '../services/api';
import { useAuth } from '../context/AuthContext';

const money = (value) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value || 0);
export default function Dashboard() {
  const { user, student } = useAuth();
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  useEffect(() => { api.get('/dashboard/overview').then(({ data: response }) => setData(response)).catch((err) => setError(getErrorMessage(err))); }, []);
  const stats = data?.stats || {};
  return <div className="dashboard-page">
    <section className="welcome-banner"><div className="welcome-copy"><span className="eyebrow light-eyebrow"><Sparkles size={13} /> YOUR SPACE, YOUR PACE</span><h2>Good morning, {user?.name?.split(' ')[0] || 'there'}<span>.</span></h2><p>Your library is looking good. Here's what's happening today.</p><div className="welcome-actions"><Link to="/books" className="banner-button">Explore collection <ArrowUpRight size={16} /></Link><span className="student-chip">{student?.studentCode || 'BOOKNEST MEMBER'}</span></div></div><div className="welcome-art"><div className="book-stack"><div /><div /><div /><div /></div><div className="art-spark spark-a">✳</div><div className="art-spark spark-b">✦</div></div><div className="banner-orbit orbit-a" /><div className="banner-orbit orbit-b" /></section>
    {error && <div className="inline-error">{error}</div>}
    <div className="section-heading"><div><span className="eyebrow">AT A GLANCE</span><h2>Your library overview</h2></div><span className="updated-label"><span className="live-dot" /> LIVE DATA</span></div>
    <section className="stats-grid">
      <Stat title="Book titles" value={stats.totalBooks ?? '—'} detail="Across your collection" icon={BookOpen} tone="pink" />
      <Stat title="Registered students" value={stats.totalStudents ?? '—'} detail="Active library members" icon={Users} tone="lilac" />
      <Stat title="Available copies" value={stats.availableCopies ?? '—'} detail="Ready to be borrowed" icon={BookMarked} tone="peach" />
      <Stat title="Issued copies" value={stats.issuedCopies ?? '—'} detail="Currently in circulation" icon={Layers3} tone="mint" />
    </section>
    <section className="dashboard-lower"><div className="panel recent-panel"><div className="panel-heading"><div><span className="eyebrow">FRESH OFF THE SHELF</span><h3>Recently added books</h3></div><Link to="/books" className="text-link">View all <ArrowUpRight size={15} /></Link></div>{data?.recentBooks?.length ? <div className="recent-list">{data.recentBooks.map((book) => <div className="recent-row" key={book._id}><div className="book-thumb"><BookOpen size={18} /></div><div className="recent-main"><strong>{book.title}</strong><span>{book.author} · {book.category}</span></div><div className="recent-price">{money(book.price)}</div></div>)}</div> : <Empty message={error ? 'Could not load your books.' : 'Your collection is ready for its first book.'} />}</div>
      <div className="panel quick-panel"><div className="panel-heading"><div><span className="eyebrow">MAKE IT HAPPEN</span><h3>Quick actions</h3></div><div className="quick-icon"><Sparkles size={17} /></div></div><Link to="/books" className="quick-action"><span className="quick-symbol pink-symbol"><BookOpen size={17} /></span><span><strong>Manage books</strong><small>Add, edit or discover titles</small></span><ArrowUpRight size={16} /></Link><Link to="/students" className="quick-action"><span className="quick-symbol purple-symbol"><Users size={17} /></span><span><strong>Manage students</strong><small>Keep member records up to date</small></span><ArrowUpRight size={16} /></Link><div className="quick-note"><Clock3 size={15} /> Your records are saved to MongoDB.</div></div></section>
    <section className="bottom-strip"><div><span className="eyebrow">A NOTE FROM BOOKNEST</span><p>“A library is not a luxury but one of the necessities of life.”</p></div><span className="quote-mark">“</span></section>
  </div>;
}
function Stat({ title, value, detail, icon: Icon, tone }) { return <article className={`stat-card ${tone}`}><div className="stat-top"><span>{title}</span><div className="stat-icon"><Icon size={18} /></div></div><strong className="stat-value">{value}</strong><span className="stat-detail">{detail}</span></article>; }
function Empty({ message }) { return <div className="empty-mini"><BookOpen size={22} /><span>{message}</span></div>; }
