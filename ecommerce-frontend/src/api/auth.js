// Only if using named exports
import axiosClient from './axiosClient';

const AuthApi = {
    // 1. Customer Registration
    register: (data) => {
        return axiosClient.post('/register', data);
    },

    // 2. Customer Login (For the public shop)
    customerLogin: (email, password) => {
        return axiosClient.post('/login', { email, password });
    },

    // 3. Admin Login (For the Dashboard)
    // We explicitly point to the route we fixed earlier
    adminLogin: (email, password) => {
        return axiosClient.post('/admin/login', { email, password });
    },

    // 4. Logout (Works for both)
    logout: () => {
        return axiosClient.post('/logout');
    },

    // 5. Get User Profile (To check who is logged in)
    getUser: () => {
        return axiosClient.get('/user');
    },

   getCustomers: () => axiosClient.get('/admin/customers'),
    
    // Products
    getProducts: () => axiosClient.get('/products'),
    addProduct: (formData) => axiosClient.post('/products', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
    deleteProduct: (id) => axiosClient.delete(`/products/${id}`),

    // Orders (This was causing the 404)
    getAllOrders: () => axiosClient.get('/admin/orders'),
    updateOrderStatus: (id, status) => axiosClient.put(`/admin/orders/${id}/status`, { status }),

};




export default AuthApi;