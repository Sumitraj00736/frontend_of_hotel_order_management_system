import api from '../../../../api/client.js';

export async function fetchFinanceDashboard(params = {}) {
  const res = await api.get('/api/reports/finance-dashboard', { params });
  return res.data;
}

export async function fetchTransactions(params = {}) {
  const res = await api.get('/api/reports/transactions', { params });
  return res.data;
}
