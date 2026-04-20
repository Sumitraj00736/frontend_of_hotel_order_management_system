import api from '../../../../../api/client.js';

export async function fetchSpaces(params = {}) {
  const res = await api.get('/api/spaces', { params });
  return res.data;
}

export async function createSpace(payload) {
  const res = await api.post('/api/spaces', payload);
  return res.data;
}

export async function updateSpace(id, payload) {
  const res = await api.put(`/api/spaces/${id}`, payload);
  return res.data;
}

export async function deleteSpace(id) {
  const res = await api.delete(`/api/spaces/${id}`);
  return res.data;
}

