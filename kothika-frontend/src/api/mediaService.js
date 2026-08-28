import axios from 'axios';

const API_URL = 'http://localhost:8080/kothika/media';

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

export const mediaService = {
    uploadMedia: async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        return axios.post(`${API_URL}/upload`, formData, {
            headers: {
                ...getAuthHeaders(),
                'Content-Type': 'multipart/form-data'
            }
        });
    }
};
