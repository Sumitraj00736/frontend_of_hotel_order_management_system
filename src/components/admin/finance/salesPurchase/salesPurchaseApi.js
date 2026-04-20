import api from '../../../../api/client.js';

export async function fetchSalesInvoices(params = {}) {
  const res = await api.get('/api/finance/sales-invoices', { params });
  return res.data;
}

export async function fetchPurchases(params = {}) {
  const res = await api.get('/api/purchases', { params });
  return res.data;
}

export async function createPurchase(payload) {
  const res = await api.post('/api/purchases', payload);
  return res.data;
}

export async function fetchSalesReturns(params = {}) {
  const res = await api.get('/api/sales-returns', { params });
  return res.data;
}

export async function createSalesReturn(payload) {
  const res = await api.post('/api/sales-returns', payload);
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
