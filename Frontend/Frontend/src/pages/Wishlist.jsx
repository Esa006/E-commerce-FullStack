import React, { useContext } from "react";
import { WishlistContext } from "../context/WishlistContext";
import ProductCard from "../components/ProductCard";
import Navbar from "../components/Navbar";
import BackButton from "../components/BackButton";


const Wishlist = () => {
  const { wishlistItems } = useContext(WishlistContext);

  return (
    <>
      <Navbar />
      <div className="container py-5">
        <BackButton to="/" label="Continue Shopping" />
        <div className="text-center mb-5">
          <h2 className="section-title">My Wishlist</h2>
          <p className="text-muted">Your curated collection of favorites.</p>
        </div>

        {wishlistItems.length > 0 ? (
          <div className="row">
            {wishlistItems.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        ) : (
          <div className="text-center py-5">
            <h4 className="text-muted mb-3">Your wishlist is empty.</h4>
            <a href="/products" className="btn btn-dark">
              Continue Shopping
            </a>
          </div>
        )}
      </div>
    </>
  );
};

export default Wishlist;
