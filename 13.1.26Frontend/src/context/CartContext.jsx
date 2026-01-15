import React, { createContext, useState, useEffect } from "react";
import Swal from "sweetalert2";

export const CartContext = createContext(null);

const CartProvider = ({ children }) => {

  // 1. Initialize state from LocalStorage to fix the "Empty Cart" refresh issue
  const [cartItems, setCartItems] = useState(() => {
    try {
      const savedCart = localStorage.getItem("cartItems");
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      console.error("Error loading cart:", error);
      return [];
    }
  });

  // 2. Save to LocalStorage whenever cartItems changes
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  // 3. Add To Cart Function (Reconstructed to include Stock Check)
  const addToCart = (product, size, quantity = 1) => {
    let cartData = [...cartItems];

    // Check if item with this ID and Size already exists
    const existingItemIndex = cartData.findIndex(item => item.id === product.id && item.size === size);

    if (existingItemIndex > -1) {
      // Item exists: Check if adding more exceeds stock
      const currentQty = cartData[existingItemIndex].quantity;
      if (currentQty + quantity > product.stock) {
        Swal.fire({
          icon: 'warning',
          title: 'Stock Limit Reached',
          text: `You already have ${currentQty} in cart. Only ${product.stock} available.`,
          confirmButtonColor: '#000'
        });
        return;
      }
      cartData[existingItemIndex].quantity += quantity;
    } else {
      // New Item: Check initial stock
      if (quantity > product.stock) {
        Swal.fire({
          icon: 'error',
          title: 'Insufficient Stock',
          text: `Only ${product.stock} units available.`,
          confirmButtonColor: '#000'
        });
        return;
      }
      cartData.push({ ...product, size, quantity });
    }

    setCartItems(cartData);

    // Optional: Success Toast
    Swal.fire({
      toast: true,
      icon: 'success',
      title: 'Item added',
      position: 'top-end',
      showConfirmButton: false,
      timer: 1500
    });
  };

  // 4. Update Quantity (With Stock Validation)
  const updateQuantity = (itemId, size, quantity) => {
    let cartData = [...cartItems];
    const item = cartData.find((item) => item.id === itemId && item.size === size);

    if (item) {
      if (quantity > item.stock) {
        Swal.fire({
          title: 'Limit Reached',
          text: `Only ${item.stock} items available in stock.`,
          icon: 'warning',
          confirmButtonColor: '#000'
        });
        item.quantity = item.stock;
      } else if (quantity < 1) {
        // Do nothing or remove (usually keeping at 1 is safer here)
        item.quantity = 1;
      } else {
        item.quantity = quantity;
      }
      setCartItems(cartData);
    }
  };

  // 5. Remove Item
  const removeFromCart = (itemId, size) => {
    setCartItems(cartItems.filter((item) => !(item.id === itemId && item.size === size)));
  };

  // 6. Get Total Amount (Safe Calculation)
  const getTotalAmount = () => {
    let total = 0;
    cartItems.forEach((item) => {
      if (item.price && item.quantity) {
        total += Number(item.price) * Number(item.quantity);
      }
    });
    return total;
  };

  // 7. Clear Cart
  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem("cartItems");
  };

  const value = {
    cartItems,
    addToCart,
    updateQuantity,
    removeFromCart,
    getTotalAmount,
    clearCart
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export default CartProvider;