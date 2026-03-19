import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080/api/v1', // Base URL for your Spring Boot backend
});

// Add a request interceptor to automatically attach the JWT token
api.interceptors.request.use(
    (config) => {
        // Get the token from local storage
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = 'Bearer ' + token;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api; // <-- THIS is the exact line React was complaining about missing!