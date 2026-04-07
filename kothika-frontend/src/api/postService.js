import api from './axiosConfig';

export const postService = {
  getAllPosts: () => api.get('/kothika/posts/getAll'),
  getPostById: (id) => api.get(`/kothika/posts/${id}`),
  createPost: (postRequestDto) => api.post('/kothika/posts/create', postRequestDto),
  updatePost: (id, postRequestDto) => api.put(`/kothika/posts/update/${id}`, postRequestDto),
  deletePost: (id) => api.delete(`/kothika/posts/delete/${id}`),
};