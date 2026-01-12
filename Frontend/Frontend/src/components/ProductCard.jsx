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

    <div className="col-xl-2 col-lg-3 col-md-4 col-sm-6 col-6 mb-3">
      <div className="card h-100 border-0 shadow-sm position-relative">
        <button
          className="btn btn-light rounded-circle position-absolute top-0 end-0 m-2 d-flex justify-content-center align-items-center shadow-sm"
          style={{ width: '35px', height: '35px', zIndex: 10 }}
          onClick={() => toggleWishlist(product)}
        >
          <i className={`bi ${inWishlist ? 'bi-heart-fill text-danger' : 'bi-heart text-dark'}`} style={{ fontSize: '1rem' }}></i>
        </button>

        <Link to={`/product/${product.id}`} className="text-decoration-none">
          <div className="ratio" style={{ '--bs-aspect-ratio': '125%' }}>
            <img
              src={displayImage}
              className="object-fit-cover w-100 h-100 rounded-top"
              alt={product.name}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = PLACEHOLDER_IMG;
              }}
            />
          </div>
        </Link>

        <div className="card-body d-flex flex-column p-2 text-center">
          <div className="small text-uppercase fw-bold text-muted mb-1">
            {product.brand}
          </div>
          <h6 className="card-title text-truncate mb-1 text-dark">
            {product.name}
          </h6>

          <div className="d-flex justify-content-center mb-2">
            <StarRating rating={product.rating} />
          </div>

          <div className="fw-bold text-dark mb-3">
            ₹{product.price}
          </div>


          <Link to={`/product/${product.id}`} className="btn btn-dark w-100 mt-auto rounded-0 text-uppercase fw-bold py-2">
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;