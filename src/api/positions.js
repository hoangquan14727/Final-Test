import http from './http';

export async function getPositions() {
  const res = await http.get('/teacher-positions');
  return res.data;
}

export async function createPosition(payload) {
  const res = await http.post('/teacher-positions', payload);
  return res.data;
}
