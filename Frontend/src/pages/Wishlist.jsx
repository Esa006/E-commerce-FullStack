import React, { useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { WishlistContext } from "../context/WishlistContext";
import ProductCard from "../components/ProductCard";
import BackButton from "../components/BackButton";


const Wishlist = () => {
  const { wishlistItems, removeFromWishlist } = useContext(WishlistContext);
  const navigate = useNavigate();

  // Check Auth
  useEffect(() => {
    const token = localStorage.getItem("ACCESS_TOKEN");
    if (!token) {
      Swal.fire({
        icon: "warning",
        title: "Login Required",
        text: "Please login to view your wishlist.",
        confirmButtonText: "Login",
        customClass: {
          confirmButton: "btn btn-dark "
        },
        buttonsStyling: false
      }).then(() => {
        navigate("/login");
      });
    }
  }, [navigate]);

  return (
    <>
      <div className="container py-5">
        <BackButton to="/" label="Continue Shopping" />

        {wishlistItems.length > 0 ? (
          <>
            <div className="text-center mb-5">
              <h2 className="section-title">My Wishlist</h2>
              <p className="text-muted">Your curated collection of favorites.</p>
            </div>
            <div className="row">
              {wishlistItems.map((item) => (
                <div key={item.id} className="col-6 col-md-4 col-lg-3 mb-4">
                  <ProductCard product={item} />
                </div>
              ))}
            </div>
          </>
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
