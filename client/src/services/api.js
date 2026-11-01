import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 20000,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('booknest_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export function getErrorMessage(error) {
  if (error?.response?.data?.message) return error.response.data.message;
  if (error?.code === 'ERR_NETWORK') return 'Cannot reach the API. Check that the backend is running at http://localhost:5000.';
  if (error?.code === 'ECONNABORTED') return 'The server took too long to respond. Check the backend and database connection.';
  return error?.message || 'Something went wrong. Please try again.';
}

export default api;
