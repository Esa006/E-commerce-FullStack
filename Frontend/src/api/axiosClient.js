import axios from 'axios';

const axiosClient = axios.create({
    baseURL: 'http://127.0.0.1:8000/api',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});



axiosClient.interceptors.request.use((config) => {

    const token = localStorage.getItem("admin_token") || localStorage.getItem("ACCESS_TOKEN");
    
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
    // 🟢 CRITICAL: You must pass the error back to the component
    return Promise.reject(error);
  }
);
export default axiosClient;

