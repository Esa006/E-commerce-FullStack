import axiosClient from "./axiosClient";

const AdminApi = {

    login: (data) => axiosClient.post("/login", data),
    register: (data) => axiosClient.post("/register", data),

 
    getCustomers: () => axiosClient.get("/admin/customers"),

    updateCustomer: (id, data) => axiosClient.put(`/admin/customers/${id}`, data),


    deleteCustomer: (id) => axiosClient.delete(`/admin/customers/${id}`),


  getProducts: () => axiosClient.get("/products"),

    addProduct: (formData) =>
        axiosClient.post("/products", formData, {
            headers: { "Content-Type": "multipart/form-data" }
        }),

    // Use POST with ?_method=PUT for image updates
    updateProduct: (id, formData) =>
        axiosClient.post(`/products/${id}?_method=PUT`, formData, {
            headers: { "Content-Type": "multipart/form-data" }
        }),

    deleteProduct: (id) => axiosClient.delete(`/products/${id}`),


    getAllOrders: () => axiosClient.get("/admin/orders"),

   
    updateOrderStatus: (id, status) =>
        axiosClient.put(`/admin/orders/${id}/status`, { status }),

    deleteCustomer: (id) => axiosClient.delete(`/admin/customers/${id}`),
};

export default AdminApi;