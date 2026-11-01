import { NavLink } from 'react-router-dom';
import { BookOpen, LayoutDashboard, Users, ChartNoAxesCombined, LibraryBig, LogOut, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const links = [
  { to: '/', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/books', label: 'Book collection', icon: BookOpen },
  { to: '/students', label: 'Students', icon: Users },
  { to: '/analytics', label: 'Analytics', icon: ChartNoAxesCombined },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  return (
    <aside className="sidebar">
      <div className="brand"><div className="brand-mark"><LibraryBig size={22} /></div><div><strong>booknest</strong><span>LIBRARY WORKSPACE</span></div></div>
      <div className="workspace-label">WORKSPACE</div>
      <nav className="side-nav">
        {links.map(({ to, label, icon: Icon, end }) => <NavLink key={to} to={to} end={end} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}><Icon size={18} /><span>{label}</span>{label === 'Overview' && <i className="nav-dot" />}</NavLink>)}
      </nav>
      <div className="sidebar-bottom">
        <div className="sidebar-promo"><div className="promo-icon"><Sparkles size={17} /></div><strong>A little more order.</strong><p>Your library, beautifully organised.</p></div>
        <div className="profile-mini"><div className="avatar">{user?.name?.slice(0, 1)?.toUpperCase() || 'B'}</div><div className="profile-copy"><strong>{user?.name || 'Reader'}</strong><span>{user?.email || 'Signed in'}</span></div><button className="icon-button logout-button" title="Log out" onClick={logout}><LogOut size={17} /></button></div>
      </div>
    </aside>
  );
}
