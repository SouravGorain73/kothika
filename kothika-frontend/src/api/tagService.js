import api from './axiosConfig';

export const tagService = {
  getAllTags: () => api.get('/kothika/tags/getAll'),
  createTag: (data) => api.post('/kothika/tags/create', data),
  deleteTag: (id) => api.delete(`/kothika/tags/delete/${id}`),
};