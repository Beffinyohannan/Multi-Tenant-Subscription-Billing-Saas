import api from './client';

export async function getSubscriptions(params = {}) {
  const res = await api.get('/subscriptions', { params });
  return res.data;
}

export async function getSubscription(id) {
  const res = await api.get(`/subscriptions/${id}`);
  return res.data;
}

export async function createSubscription(data) {
  const res = await api.post('/subscriptions', data);
  return res.data;
}
