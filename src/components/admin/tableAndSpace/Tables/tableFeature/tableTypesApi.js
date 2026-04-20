import api from '../../../../../api/client.js';

export async function fetchTableTypes(params = {}) {
  const res = await api.get('/api/table-types', { params });
  return res.data;
}

export async function createTableType(payload) {
  const res = await api.post('/api/table-types', payload);
  return res.data;
}

export async function updateTableType(id, payload) {
  const res = await api.put(`/api/table-types/${id}`, payload);
  return res.data;
}

export async function deleteTableType(id) {
  const res = await api.delete(`/api/table-types/${id}`);
  return res.data;
}

