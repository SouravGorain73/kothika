import api from "./axiosConfig";

export const getCurrentUser = async () => {
  const response = await api.get("/users/me");
  return response.data;
};