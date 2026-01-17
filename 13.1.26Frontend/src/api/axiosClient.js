import axios from 'axios';
import Observability from '../utils/Observability';

const axiosClient = axios.create({
    baseURL: 'http://localhost:8000/api',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

axiosClient.interceptors.request.use((config) => {
    // 🟢 HANDLE MULTIPLE TOKEN TYPES: Support both Admin and Customer sessions
    const token = localStorage.getItem("ACCESS_TOKEN") || localStorage.getItem("admin_token");
    
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // 🟢 AUTO-LOG FAILURES: Report to backend for monitoring (except 404s/401s which are usually user errors)
    if (error.response && error.response.status !== 404 && error.response.status !== 401) {
        Observability.reportError({
            message: `API Failure: ${error.config?.method?.toUpperCase()} ${error.config?.url} - ${error.response.status}`,
            stack: error.message,
            component: 'axiosClient'
        });
    }

    return Promise.reject(error);
  }
);
export default axiosClient;

