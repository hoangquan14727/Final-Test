import http from './http';

export async function getTeachers(page = 1, limit = 10) {
  const res = await http.get('/teachers', { params: { page, limit } });
  return res.data;
}

export async function createTeacher(payload) {
  const res = await http.post('/teachers', payload);
  return res.data;
}
