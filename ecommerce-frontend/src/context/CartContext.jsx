import { createContext, useState, useEffect } from "react";

export const CartContext = createContext();

export function CartProvider({ children }) {

  // Load cart from localStorage
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Persist cart
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // ✅ ADD TO CART (NORMALIZED)
  const addToCart = (product, size) => {

    // 🔥 ALWAYS convert here
    const productId = Number(product.id ?? product._id);

    setCart((prevCart) => {
      const existing = prevCart.find(
        (item) => item.id === productId && item.size === size
      );

      if (existing) {
        return prevCart.map((item) =>
          item.id === productId && item.size === size
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      // ❌ DO NOT spread product (contains _id)
      return [
        ...prevCart,
        {
          id: productId,          // ✅ ONLY id
          name: product.name,
          price: product.price,
          image: product.image,
          size,
          quantity: 1,
        },
      ];
    });
  };

  const removeFromCart = (id, size) => {
    setCart((prevCart) =>
      prevCart.filter(
        (item) => !(item.id === id && item.size === size)
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("cart");
  };

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
}
