import api from './axiosConfig';

export const tagService = {
    getAllTags: () => api.get('/kothika/tags/getAll'),
};