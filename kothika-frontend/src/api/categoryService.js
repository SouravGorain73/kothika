import api from './axiosConfig';

export const categoryService = {
    getAllCategories: () => api.get('/kothika/categories/getAll'),
};