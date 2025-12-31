import axios from 'axios';

const axiosClient = axios.create({
    baseURL: 'http://127.0.0.1:8000/api',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});



axiosClient.interceptors.request.use((config) => {
    // அட்மின் பக்கத்திற்கு 'admin_token' அல்லது 'ACCESS_TOKEN' ஏதாவது ஒன்றை எடுக்கவும்
    const token = localStorage.getItem("admin_token") || localStorage.getItem("ACCESS_TOKEN");
    
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default axiosClient;

