import { Link } from 'react-router-dom';
export default function NotFound() { return <div className="not-found"><span>404</span><h1>This page wandered off.</h1><p>Let's get you back to your library.</p><Link className="primary-button" to="/">Back to overview</Link></div>; }
