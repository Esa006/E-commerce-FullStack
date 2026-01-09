import axiosClient from "./axiosClient";

const ordersApi = {
    // Get all orders for the logged-in user
    getMyOrders: () => axiosClient.get("/orders"),

    // Get detailed info for a single order (useful in future)
    getOrderDetails: (orderId) => axiosClient.get(`/orders/${orderId}`),

    // Public endpoint: Track order by order number and email (no auth required)
    trackOrder: (orderNumber, email) => axiosClient.post("/track-order", {
        order_number: orderNumber,
        email: email
    }),
};

export default ordersApi;
