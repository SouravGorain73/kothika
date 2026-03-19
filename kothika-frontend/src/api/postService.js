import api from './axiosConfig';

export const postService = {
    // GET /kothika/posts/getAll
    getAllPosts: () => api.get('/kothika/posts/getAll'),
    
    // GET /kothika/posts/{id}
    getPostById: (id) => api.get(`/kothika/posts/${id}`),
    
    // POST /kothika/posts/create
    createPost: (postRequestDto) => api.post('/kothika/posts/create', postRequestDto),
    
    // PUT /kothika/posts/update/{id}
    updatePost: (id, postRequestDto) => api.put(`/kothika/posts/update/${id}`, postRequestDto),
    
    // DELETE /kothika/posts/delete/{id}
    deletePost: (id) => api.delete(`/kothika/posts/delete/${id}`)
};