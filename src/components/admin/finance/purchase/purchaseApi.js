import api from '../../../../api/client.js';

export async function fetchPurchases(params = {}) {
  const res = await api.get('/api/purchases', { params });
  return res.data;
}

export async function createPurchase(payload) {
  const res = await api.post('/api/purchases', payload);
  return res.data;
}

export async function fetchPurchaseReturns(params = {}) {
  const res = await api.get('/api/purchase-returns', { params });
  return res.data;
}

export async function createPurchaseReturn(payload) {
  const res = await api.post('/api/purchase-returns', payload);
  return res.data;
}
