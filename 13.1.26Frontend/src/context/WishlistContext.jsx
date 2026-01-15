import React, { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export const WishlistContext = createContext(null);

const WishlistProvider = ({ children }) => {

  const navigate = useNavigate();

  // 1. Initialize state from LocalStorage
  const [wishlistItems, setWishlistItems] = useState(() => {
    try {
      const savedWishlist = localStorage.getItem("wishlistItems");
      return savedWishlist ? JSON.parse(savedWishlist) : [];
    } catch (error) {
      console.error("Error loading wishlist:", error);
      return [];
    }
  });

  // 2. Save to LocalStorage whenever wishlistItems changes
  useEffect(() => {
    localStorage.setItem("wishlistItems", JSON.stringify(wishlistItems));
  }, [wishlistItems]);

  // 3. Toggle Wishlist Function
  const toggleWishlist = (product) => {
    // Check Auth
    const token = localStorage.getItem("ACCESS_TOKEN");
    if (!token) {
      Swal.fire({
        icon: "warning",
        title: "Login Required",
        text: "Please login to add items to your wishlist.",
        confirmButtonText: "Login",
        customClass: {
          confirmButton: "btn btn-dark py-2 px-4"
        },
        buttonsStyling: false
      }).then(() => {
        navigate("/login");
      });
      return;
    }

    console.log("Toggling wishlist for product:", product);
    let wishlistData = [...wishlistItems];
    const existingItemIndex = wishlistData.findIndex(item => item.id === product.id);

    if (existingItemIndex > -1) {
      // Remove from wishlist
      console.log("Removing from wishlist");
      wishlistData = wishlistData.filter(item => item.id !== product.id);
      Swal.fire({
        toast: true,
        icon: 'info',
        title: 'Removed from Wishlist',
        position: 'top-end',
        showConfirmButton: false,
        timer: 1500
      });
    } else {
      // Add to wishlist
      console.log("Adding to wishlist");
      wishlistData.push(product);
      Swal.fire({
        toast: true,
        icon: 'success',
        title: 'Added to Wishlist',
        position: 'top-end',
        showConfirmButton: false,
        timer: 1500
      });
    }
    console.log("New wishlist data:", wishlistData);
    setWishlistItems(wishlistData);
  };

  // 4. Remove Item
  const removeFromWishlist = (itemId) => {
    setWishlistItems(wishlistItems.filter((item) => item.id !== itemId));
  };

  // 5. Check if in wishlist
  const isInWishlist = (itemId) => {
    return wishlistItems.some(item => item.id === itemId);
  };

  const value = {
    wishlistItems,
    toggleWishlist,
    removeFromWishlist,
    isInWishlist
  };

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
};

export default WishlistProvider;
