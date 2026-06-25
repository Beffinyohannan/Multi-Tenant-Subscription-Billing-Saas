import api from './client';

export async function runBilling() {
  const res = await api.post('/billing/run');
  return res.data;
}

export async function getBillingLogs() {
  const res = await api.get('/billing-logs');
  return res.data;
}
