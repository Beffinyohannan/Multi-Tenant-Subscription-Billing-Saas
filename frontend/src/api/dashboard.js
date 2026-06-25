import api from './client';

export async function getAdminDashboard() {
  const res = await api.get('/dashboard/admin');
  return res.data;
}

export async function getExpiringSubscriptions() {
  const res = await api.get('/dashboard/expiring-subscriptions');
  return res.data;
}
