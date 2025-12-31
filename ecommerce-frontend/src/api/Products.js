import axiosClient from './axiosClient';

const ProductApi = {
    // 1. Get All Products (Used in Admin List & Customer Home)
    getAll: () => {
        return axiosClient.get('/products');
    },

    // 2. Get Single Product (For Edit or Details page)
    get: (id) => {
        return axiosClient.get(`/products/${id}`);
    },

    // 3. Create New Product (Requires multipart/form-data for Images)
    create: (data) => {
        return axiosClient.post('/products', data, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    },

    // 4. Update Product
    // Note: For file uploads in Laravel Update, we often use POST with '_method: PUT'
    update: (id, data) => {
        return axiosClient.post(`/products/${id}?_method=PUT`, data, {
             headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    },

    // 5. Delete Product
    delete: (id) => {
        return axiosClient.delete(`/products/${id}`);
    }
};

export default ProductApi;