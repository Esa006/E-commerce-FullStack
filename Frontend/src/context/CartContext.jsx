import React, { createContext, useState, useEffect, useCallback } from "react";
import Swal from "sweetalert2";
import CartApi from "../api/CartApi";

export const CartContext = createContext(null);

const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Helper to check authentication status
  const isAuthenticated = () => !!localStorage.getItem("ACCESS_TOKEN");

  // 🟢 Helper to get available stock for an item/size
  const getAvailableStock = (product, size) => {
    if (product.size_stock) {
      let stocks = product.size_stock;
      if (typeof stocks === 'string') {
        try { stocks = JSON.parse(stocks); } catch (e) { }
      }

      // Array (Admin Table)
      if (Array.isArray(stocks)) {
        const found = stocks.find(s => s.size === size);
        return found ? parseInt(found.qty || 0) : 0;
      }
      // Object
      return stocks[size] !== undefined ? parseInt(stocks[size]) : product.stock;
    }
    return product.stock || 0;
  };

  /**
   * 1. INITIAL HYDRATION
   * Loads from LocalStorage if guest, or API if authenticated.
   */
  const hydrateCart = useCallback(async () => {
    setLoading(true);
    try {
      if (isAuthenticated()) {
        const response = await CartApi.getCart();
        // Server returns items with nested product: { id, quantity, size, product: { name, price, stock, ... } }
        // We flatten or adapt if needed, but keeping backend structure is safer
        const backendItems = response.data
          .filter(item => item.product) // 🔴 Safety Filter: Ignore items without product data
          .map(item => ({
            cart_id: item.id, // ID of the cart record
            id: item.product.id, // ID of the product
            name: item.product.name,
            price: item.product.price,
            image: item.product.image,
            size_stock: item.product.size_stock, // 🟢 Added
            stock: item.product.stock,
            quantity: item.quantity,
            size: item.size
          }));
        setCartItems(backendItems);
      } else {
        const savedCart = localStorage.getItem("cartItems");
        setCartItems(savedCart ? JSON.parse(savedCart) : []);
      }
    } catch (error) {
      console.error("Cart hydration failed:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    hydrateCart();
  }, [hydrateCart]);

  /**
   * 2. GUEST PERSISTENCE
   * Only sync LocalStorage for guest users.
   */
  useEffect(() => {
    if (!isAuthenticated()) {
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
    }
  }, [cartItems]);

  /**
   * 3. SYNC GUEST CART -> AUTH
   */
  const syncGuestCart = async () => {
    if (!isAuthenticated()) return;

    const guestItems = JSON.parse(localStorage.getItem("cartItems") || "[]");
    if (guestItems.length === 0) return;

    try {
      const formattedItems = guestItems.map(item => ({
        product_id: item.id,
        quantity: item.quantity,
        size: item.size
      }));

      await CartApi.syncCart(formattedItems);
      localStorage.removeItem("cartItems"); // Clear guest storage after sync
      await hydrateCart(); // Re-hydrate from server truth
    } catch (error) {
      console.error("Failed to sync cart:", error);
    }
  };

  /**
   * 4. ADD TO CART
   */
  const addToCart = async (product, size, quantity = 1) => {
    if (isAuthenticated()) {
      try {
        const response = await CartApi.addToCart({
          product_id: product.id,
          size,
          quantity
        });

        // Use backend response to hydrate state (Source of Truth)
        if (response.data.cart) {
          const updatedItems = response.data.cart.map(item => ({
            cart_id: item.id,
            id: item.product.id,
            name: item.product.name,
            price: item.product.price,
            image: item.product.image,
            size_stock: item.product.size_stock, // 🟢 Added
            stock: item.product.stock,
            quantity: item.quantity,
            size: item.size
          }));
          setCartItems(updatedItems);
        }

        Swal.fire({
          toast: true,
          icon: 'success',
          title: 'Added to cart',
          position: 'top-end',
          showConfirmButton: false,
          timer: 1500
        });
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: error.response?.data?.message || 'Failed to add item',
        });
      }
    } else {
      // Guest Logic
      let cartData = [...cartItems];
      const existingIndex = cartData.findIndex(item => item.id === product.id && item.size === size);

      if (existingIndex > -1) {
        const currentQty = cartData[existingIndex].quantity;
        const available = getAvailableStock(product, size);

        if (currentQty + quantity > available) {
          Swal.fire({
            icon: 'warning',
            title: 'Stock Limit',
            text: `Only ${available} available${size ? ' for size ' + size : ''}.`,
          });
          return;
        }
        cartData[existingIndex].quantity += quantity;
      } else {
        const available = getAvailableStock(product, size);
        if (quantity > available) {
          Swal.fire({ icon: 'error', title: 'Insufficient Stock', text: `Only ${available} available.` });
          return;
        }
        cartData.push({ ...product, size, quantity });
      }
      setCartItems(cartData);

      Swal.fire({
        toast: true,
        icon: 'success',
        title: 'Item added (Guest)',
        position: 'top-end',
        showConfirmButton: false,
        timer: 1500
      });
    }
  };

  /**
   * 5. UPDATE QUANTITY
   */
  const updateQuantity = async (itemId, size, quantity) => {
    if (isAuthenticated()) {
      try {
        const item = cartItems.find(i => i.id === itemId && i.size === size);
        if (!item) return;

        const response = await CartApi.updateQuantity(item.cart_id, quantity);

        if (response.data.cart) {
          const updatedItems = response.data.cart.map(item => ({
            cart_id: item.id,
            id: item.product.id,
            name: item.product.name,
            price: item.product.price,
            image: item.product.image,
            size_stock: item.product.size_stock, // 🟢 Added
            stock: item.product.stock,
            quantity: item.quantity,
            size: item.size
          }));
          setCartItems(updatedItems);
        }
      } catch (error) {
        // 🟢 Robust handling: If backend fixed the cart (e.g. removed invalid item), sync state
        if (error.response?.status === 404 && error.response?.data?.cart) {
          const updatedItems = error.response.data.cart.map(item => ({
            cart_id: item.id,
            id: item.product.id,
            name: item.product.name,
            price: item.product.price,
            image: item.product.image,
            stock: item.product.stock,
            quantity: item.quantity,
            size: item.size
          }));
          setCartItems(updatedItems);
        }

        Swal.fire({
          icon: 'warning',
          title: 'Update failed',
          text: error.response?.data?.message || 'Could not update quantity',
        });
      }
    } else {
      // Guest Logic
      const updatedCart = cartItems.map(item => {
        if (item.id === itemId && item.size === size) {
          const available = getAvailableStock(item, size);
          const finalQty = Math.min(quantity, available);

          if (quantity > available) {
            Swal.fire({ icon: 'warning', title: 'Limit Reached', text: `Only ${available} in stock` });
          }
          return { ...item, quantity: Math.max(1, finalQty) };
        }
        return item;
      });
      setCartItems(updatedCart);
    }
  };

  /**
   * 6. REMOVE ITEM
   */
  const removeFromCart = async (itemId, size) => {
    if (isAuthenticated()) {
      try {
        const item = cartItems.find(i => i.id === itemId && i.size === size);
        if (!item) return;

        const response = await CartApi.removeFromCart(item.cart_id);

        if (response.data.cart) {
          const updatedItems = response.data.cart.map(item => ({
            cart_id: item.id,
            id: item.product.id,
            name: item.product.name,
            price: item.product.price,
            image: item.product.image,
            stock: item.product.stock,
            quantity: item.quantity,
            size: item.size
          }));
          setCartItems(updatedItems);
        }
      } catch (error) {
        console.error("Removal failed:", error);
      }
    } else {
      setCartItems(cartItems.filter((item) => !(item.id === itemId && item.size === size)));
    }
  };

  /**
   * 7. UTILS
   */
  const getTotalAmount = () => {
    return cartItems.reduce((acc, item) => acc + (Number(item.price) * item.quantity), 0);
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem("cartItems");
    // Note: Backend clear should be handled via API if needed (e.g. after order)
  };

  const value = {
    cartItems,
    loading,
    addToCart,
    updateQuantity,
    removeFromCart,
    getTotalAmount,
    clearCart,
    syncGuestCart,
    hydrateCart
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export default CartProvider;
