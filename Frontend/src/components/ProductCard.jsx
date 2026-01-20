import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { parseImages, getImageUrl, PLACEHOLDER_IMG } from "../utils/imageUtils";
import { WishlistContext } from "../context/WishlistContext";
import StarRating from "./StarRating";

const ProductCard = ({ product }) => {
  const { toggleWishlist, isInWishlist } = useContext(WishlistContext);
  const inWishlist = isInWishlist(product.id);

  // Parse images helper
  const images = parseImages(product.image);
  const displayImage = images.length > 0 ? getImageUrl(images[0]) : PLACEHOLDER_IMG;

  return (

    <div className="card h-100 border-0 shadow-sm position-relative">
      <button
        className="btn btn-light rounded-circle position-absolute top-0 end-0 m-2 d-flex justify-content-center align-items-center shadow-sm p-2 z-3"
        onClick={() => toggleWishlist(product)}
      >
        <i className={`bi fs-6 ${inWishlist ? 'bi-heart-fill text-danger' : 'bi-heart text-dark'}`}></i>
      </button>

      <Link to={`/product/${product?.id}`} className="text-decoration-none">
        <div className="ratio ratio-vertical">
          <img
            src={displayImage}
            className="object-fit-cover w-100 h-100 rounded-top"
            loading="lazy"
            alt={product?.name || "Product"}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = PLACEHOLDER_IMG;
            }}
          />
        </div>
      </Link>

      <div className="card-body d-flex flex-column p-2 text-center">
        <div className="small text-uppercase fw-bold text-muted mb-1">
          {product?.brand || "Brand"}
        </div>
        <h6 className="card-title text-truncate mb-1 text-dark">
          {product?.name || "Untitled Product"}
        </h6>

        <div className="d-flex justify-content-center mb-2">
          <StarRating rating={product?.rating || 0} />
        </div>

        <div className="fw-bold text-dark mb-3">
          ₹{product?.price || 0}
        </div>


        <Link to={`/product/${product?.id}`} className="btn btn-dark w-100 mt-auto rounded-0 text-uppercase fw-bold py-2">
          View Details
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;