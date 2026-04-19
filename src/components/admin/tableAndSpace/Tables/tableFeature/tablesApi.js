import api from '../../../../../api/client.js';

export async function fetchTables(params = {}) {
  const res = await api.get('/api/tables', { params });
  return res.data;
}

export async function createTable(payload) {
  const res = await api.post('/api/tables', payload);
  return res.data;
}

export async function updateTable(id, payload) {
  const res = await api.put(`/api/tables/${id}`, payload);
  return res.data;
}

export async function moveToTrash(id) {
  const res = await api.delete(`/api/tables/${id}`);
  return res.data;
}

export async function freeTable(id) {
  const res = await api.patch(`/api/tables/${id}/free`);
  return res.data;
}

