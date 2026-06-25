import api from './client';

export async function getSubscriptions() {
  const res = await api.get('/subscriptions');
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
