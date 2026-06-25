import api from './client';

export async function getPlans(params = {}) {
  const res = await api.get('/plans', { params });
  return res.data;
}

export async function getPlan(id) {
  const res = await api.get(`/plans/${id}`);
  return res.data;
}

export async function createPlan(data) {
  const res = await api.post('/plans', data);
  return res.data;
}

export async function deletePlan(id) {
  const res = await api.delete(`/plans/${id}`);
  return res.data;
}
