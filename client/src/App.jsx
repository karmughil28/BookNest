import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import AppLayout from './components/AppLayout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Books from './pages/Books';
import Students from './pages/Students';
import Analytics from './pages/Analytics';
import NotFound from './pages/NotFound';
import './styles/global.css';
import './styles/app.css';
import './styles/auth.css';

export default function App() {
  return <BrowserRouter><AuthProvider><Routes>
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route element={<ProtectedRoute />}><Route element={<AppLayout />}>
      <Route path="/" element={<Dashboard />} />
      <Route path="/books" element={<Books />} />
      <Route path="/students" element={<Students />} />
      <Route path="/analytics" element={<Analytics />} />
    </Route></Route>
    <Route path="/404" element={<NotFound />} />
    <Route path="*" element={<NotFound />} />
  </Routes></AuthProvider></BrowserRouter>;
}
