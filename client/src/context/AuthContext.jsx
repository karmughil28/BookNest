import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import api from '../services/api';
import { getErrorMessage } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = sessionStorage.getItem('booknest_token');
    if (!token) { setLoading(false); return; }
    api.get('/auth/me')
      .then(({ data }) => { setUser(data.user); setStudent(data.student || null); })
      .catch(() => { sessionStorage.removeItem('booknest_token'); setUser(null); setStudent(null); })
      .finally(() => setLoading(false));
  }, []);

  const saveSession = (data) => {
    sessionStorage.setItem('booknest_token', data.token);
    setUser(data.user);
    setStudent(data.student || null);
  };

  const register = async (payload) => {
    try {
      const { data } = await api.post('/auth/register', payload);
      saveSession(data);
      return data;
    } catch (error) { throw new Error(getErrorMessage(error)); }
  };

  const login = async (payload) => {
    try {
      const { data } = await api.post('/auth/login', payload);
      saveSession(data);
      return data;
    } catch (error) { throw new Error(getErrorMessage(error)); }
  };

  const logout = () => {
    sessionStorage.removeItem('booknest_token');
    setUser(null);
    setStudent(null);
  };

  const value = useMemo(() => ({ user, student, loading, register, login, logout }), [user, student, loading]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
}
