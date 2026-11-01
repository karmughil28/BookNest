import { Outlet, useLocation } from 'react-router-dom';
import { Bell, Search, Sun } from 'lucide-react';
import Sidebar from './Sidebar';
import { useAuth } from '../context/AuthContext';

const titles = { '/': 'Overview', '/books': 'Book collection', '/students': 'Students', '/analytics': 'Analytics' };
export default function AppLayout() {
  const location = useLocation();
  const { user } = useAuth();
  const title = titles[location.pathname] || 'Workspace';
  return <div className="app-shell"><Sidebar /><main className="main-area"><header className="topbar"><div><div className="eyebrow">YOUR LIBRARY / {title.toUpperCase()}</div><h1>{title}</h1></div><div className="topbar-actions"><div className="top-search"><Search size={16} /><span>Everything in one place</span><kbd>⌘ K</kbd></div><button className="round-action" aria-label="Theme"><Sun size={17} /></button><button className="round-action notification" aria-label="Notifications"><Bell size={17} /><i /></button><div className="top-avatar">{user?.name?.slice(0, 1)?.toUpperCase() || 'B'}</div></div></header><div className="page-content"><Outlet /></div><footer className="footer-note"><span>BOOKNEST © {new Date().getFullYear()}</span><span>Made for curious minds.</span></footer></main></div>;
}
