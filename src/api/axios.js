import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://127.0.0.1:8000",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

api.interceptors.response.use(
    (response) => response, 
    async (error) => {
        const originalRequest = error.config;
        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            const refresh = localStorage.getItem('refresh');
            if (refresh) { 
                try {    
                    const { data } = await axios.post(
                        `${import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"}/api/auth/token/refresh/`,
                        { refresh }
                    );
                    localStorage.setItem('token', data.access);
                    originalRequest.headers.authorization = `Bearer ${data.access}`;
                    return api(originalRequest);
                } 
                catch (error) {
                    localStorage.removeItem('token');
                    localStorage.removeItem('refresh');
                    window.location.href = '/login';
                    return Promise.reject(error);
                }
            }
        } 
        return Promise.reject(error);
    }
);

export default api;