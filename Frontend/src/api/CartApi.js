import axiosClient from "./axiosClient";

const CartApi = {
    // Get all items
    getCart: () => axiosClient.get("/cart"),

    // Add item
    addToCart: (data) => axiosClient.post("/cart", data),

    // Sync guest cart to server
    syncCart: (cartItems) => axiosClient.post("/cart/sync", { cart_items: cartItems }),

    // Update Quantity
    updateQuantity: (id, quantity) => axiosClient.put(`/cart/${id}`, { quantity }),

    // Remove item
    removeFromCart: (id) => axiosClient.delete(`/cart/${id}`),

    // THE NEW CHECKOUT VALIDATION (For the Stock Check)
    validateCart: (cartItems) => axiosClient.post("/cart/validate", { cart_items: cartItems }),
};

export default CartApi;