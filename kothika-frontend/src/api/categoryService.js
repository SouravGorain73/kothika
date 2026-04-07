import api from './axiosConfig';

export const categoryService = {
  getAllCategories: () => api.get('/kothika/categories/getAll'),
  createCategory: (data) => api.post('/kothika/categories/create', data),
  deleteCategory: (id) => api.delete(`/kothika/categories/delete/${id}`),
};