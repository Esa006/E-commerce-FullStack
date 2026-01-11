import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { parseImages, getImageUrl } from "../utils/imageUtils";
import { WishlistContext } from "../context/WishlistContext";

const ProductCard = ({ product }) => {
  const images = parseImages(product.image);

  const displayImage = images.length > 0 ? getImageUrl(images[0]) : "https://via.placeholder.com/300?text=No+Image";
    console.log(displayImage);
  const { toggleWishlist, isInWishlist } = useContext(WishlistContext);
  const inWishlist = isInWishlist(product.id);

  return (

    <div className="col-lg-3 col-md-4 col-sm-6 col-6 mb-4">
      <div className="card h-100 shadow-sm border-0 product-card position-relative">
        <button 
          className="btn border-0 position-absolute top-0 end-0 p-2 wishlist-btn"

          onClick={() => toggleWishlist(product)}
        >
          <i className={`bi ${inWishlist ? 'bi-heart-fill text-danger' : 'bi-heart text-danger'} wishlist-icon`}></i>
        </button>
        <Link to={`/product/${product.id}`}>
          <img
            src={displayImage}
            className="card-img-top product-card-img"
            alt={product.name}
            onError={(e) => {
              e.target.onerror = null; // Prevent infinite loop
              e.target.src = "https://placehold.co/300x300?text=Image+Error";
            }}
          />
        </Link>

        <div className="card-body d-flex flex-column text-center p-3">

          <h6 className="card-title product-card-title text-truncate-2 mb-2">
            {product.name}
          </h6>
          <p className="text-primary product-card-price">
            ₹{product.price}
          </p>

          <Link
            to={`/product/${product.id}`}
            className="btn btn-dark btn-sm product-card-btn mt-auto"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;