import api from "./axiosConfig";

export const userService = {
  getCurrentUser: () => api.get("/kothika/users/me"),
  getUserById: (id) => api.get(`/kothika/users/${id}`),
  getAllUsers: () => api.get("/kothika/users/getAll"),
  addUser: (userData) => api.post("/kothika/users/add", userData),
  updateUser: (id, userData) => api.put(`/kothika/users/update/${id}`, userData),
  deleteUser: (id) => api.delete(`/kothika/users/delete/${id}`),
};