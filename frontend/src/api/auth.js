import api from './client';

export async function login(data) {
  const res = await api.post('/auth/login', data);
  return res.data;
}

export async function register(data) {
  const res = await api.post('/auth/register', data);
  return res.data;
}

export async function getMe() {
  const res = await api.get('/auth/me');
  return res.data;
}

export async function logout() {
  const res = await api.post('/auth/logout');
  return res.data;
}
