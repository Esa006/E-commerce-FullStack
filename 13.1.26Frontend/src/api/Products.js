import axiosClient from './axiosClient';

const ProductApi = {
    // 1. Get Products with dynamic filters
    // Rules: Clean params, Normalize Response
    getProducts: async (params = {}) => {
        // A. Clean Params: Remove null, undefined, empty strings
        const queryParams = Object.fromEntries(
            Object.entries(params).filter(([_, v]) => v != null && v !== '')
        );

        try {
            const response = await axiosClient.get('/products', { params: queryParams });
            
            // B. Normalize Response
            const rawData = response.data;
            let items = [];
            let pagination = {
                current_page: 1,
                last_page: 1,
                total: 0
            };

            if (rawData.success && rawData.data) {
                // Check for Paginated Object
                if (rawData.data.data && Array.isArray(rawData.data.data)) {
                    items = rawData.data.data;
                    pagination = {
                        current_page: rawData.data.current_page || 1,
                        last_page: rawData.data.last_page || 1,
                        total: rawData.data.total || 0,
                    };
                } 
                // Check for Flat Array inside data
                else if (Array.isArray(rawData.data)) {
                    items = rawData.data;
                    pagination.total = items.length;
                }
            } 
            // Check for Root Array (e.g. from curl example)
            else if (Array.isArray(rawData)) {
                items = rawData;
                pagination.total = items.length;
            }

            return {
                items,
                pagination
            };

        } catch (error) {
            console.error("API Error:", error);
            // Return safe default on error
            return { items: [], pagination: { current_page: 1, last_page: 1, total: 0 } };
        }
    },

    // 2. Get Single Product (For Edit or Details page)
    get: (id) => {
        return axiosClient.get(`/products/${id}`);
    },

    // 3. Get All Categories (Dynamic Filter)
    getCategories: async () => {
        try {
             const response = await axiosClient.get('/products/categories');
             if (response.data.success && Array.isArray(response.data.categories)) {
                 return response.data.categories;
             }
             return [];
        } catch (error) {
            return [];
        }
    },

    // 4. Get All Brands (Dynamic Filter)
    getBrands: async () => {
        try {
            const response = await axiosClient.get('/products/brands');
            if (response.data.success && Array.isArray(response.data.brands)) {
                return response.data.brands;
            }
            return [];
        } catch (error) {
            return [];
        }
    },

    // 5. Create New Product (Admin)
    create: (data) => {
        return axiosClient.post('/products', data, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    },

    // 6. Update Product (Admin)
    update: (id, data) => {
        return axiosClient.post(`/products/${id}?_method=PUT`, data, {
             headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    },

    // 7. Delete Product (Admin)
    delete: (id) => {
        return axiosClient.delete(`/products/${id}`);
    }
};

export default ProductApi;