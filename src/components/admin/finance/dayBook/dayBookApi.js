import api from '../../../../api/client.js';

export async function fetchDaybookSummary(day) {
  const params = {};
  if (day) params.day = typeof day === 'string' ? day : day.toISOString();
  const res = await api.get('/api/daybook/summary', { params });
  return res.data;
}

export async function closeDaybook({ day, remarks }) {
  const body = { remarks: remarks || '' };
  if (day) body.day = typeof day === 'string' ? day : day.toISOString();
  const res = await api.post('/api/daybook/close', body);
  return res.data;
}

export async function fetchDaybookHistory(params = {}) {
  const res = await api.get('/api/daybook/history', { params });
  return res.data;
}
