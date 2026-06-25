import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

let refreshing = null;

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config;

    if (err.response?.status === 401 && !original._retry && original.url !== '/auth/refresh') {
      original._retry = true;

      if (!refreshing) {
        refreshing = api.post('/auth/refresh')
          .finally(() => { refreshing = null; });
      }

      try {
        await refreshing;
        return api(original);
      } catch {
        window.location.href = '/login';
        return Promise.reject(new Error('Session expired'));
      }
    }

    const message = err.response?.data?.error?.message || 'Something went wrong';
    return Promise.reject(new Error(message));
  }
);

export default api;
