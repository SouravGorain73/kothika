import axios from 'axios';

const API_URL = 'http://localhost:8080/kothika/ai';

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

export const aiService = {
    generatePost: async (topic) => {
        return axios.post(`${API_URL}/generate`, { topic }, { headers: getAuthHeaders() });
    },
    suggestImprovements: async (content) => {
        return axios.post(`${API_URL}/improve`, { content }, { headers: getAuthHeaders() });
    },
    summarize: async (content) => {
        return axios.post(`${API_URL}/summarize`, { content }, { headers: getAuthHeaders() });
    }
};
