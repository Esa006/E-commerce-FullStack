import axiosClient from "./axiosClient";

const AdminApi = {

    /* ================= AUTH ================= */
    login: (data) => axiosClient.post("/login", data),

    register: (data) => axiosClient.post("/register", data),


    /* ================= CUSTOMERS ================= */
    // Get all registered customers
    getCustomers: () => axiosClient.get("/admin/customers"),

    // Update customer (role, status, etc.)
    updateCustomer: (id, data) =>
        axiosClient.put(`/admin/customers/${id}`, data),

    // Delete customer
    deleteCustomer: (id) =>
        axiosClient.delete(`/admin/customers/${id}`),


    /* ================= PRODUCTS ================= */
    // Get all products (admin view)
    getProducts: () => axiosClient.get("/products"),

    // Add new product (image supported)
    addProduct: (formData) =>
        axiosClient.post("/products", formData, {
            headers: { "Content-Type": "multipart/form-data" }
        }),

    // Update product (image supported)
    updateProduct: (id, formData) =>
        axiosClient.post(`/products/${id}?_method=PUT`, formData, {
            headers: { "Content-Type": "multipart/form-data" }
        }),

    // Delete product
    deleteProduct: (id) =>
        axiosClient.delete(`/products/${id}`),


    /* ================= ORDERS ================= */
    // Get all orders
    getAllOrders: () => axiosClient.get("/admin/orders"),

    // Update order status
    updateOrderStatus: (id, status) =>
        axiosClient.put(`/admin/orders/${id}/status`, { status }),

    getCustomers: () => axiosClient.get('/admin/customers'),

updateCustomer: (id, data) =>
    axiosClient.put(`/admin/customers/${id}`, data),

deleteCustomer: (id) =>
    axiosClient.delete(`/admin/customers/${id}`),

};

export default AdminApi;
