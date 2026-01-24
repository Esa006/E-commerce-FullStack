import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { parseImages, getImageUrl, PLACEHOLDER_IMG } from "../utils/imageUtils";
import { WishlistContext } from "../context/WishlistContext";
import StarRating from "./StarRating";

const ProductCard = ({ product }) => {
  const { toggleWishlist, isInWishlist } = useContext(WishlistContext);
  const [isImgLoaded, setIsImgLoaded] = React.useState(false);
  const inWishlist = isInWishlist(product.id);

  // Parse images helper
  const images = parseImages(product.image);
  const displayImage = images.length > 0 ? getImageUrl(images[0]) : PLACEHOLDER_IMG;

  const isOutOfStock = !product?.stock || product?.stock <= 0;

  return (

    <div className={`card h-100 border-0 shadow-sm position-relative ${isOutOfStock ? 'bg-light' : ''}`}>

      {/* Out Of Stock Badge */}
      {isOutOfStock && (
        <div className="position-absolute top-50 start-50 translate-middle z-3">
          <p><span className="badge bg-dark text-uppercase px-3 py-2 fs-6 shadow">Sold Out</span></p>
        </div>
      )}

      <button
        className="btn btn-light position-absolute top-0 end-0 m-2 d-flex justify-content-center align-items-center shadow-sm p-2 z-3"
        onClick={() => toggleWishlist(product)}
        disabled={isOutOfStock}
        title={isOutOfStock ? "Out of Stock" : "Add to Wishlist"}
      >
        <i className={`bi fs-6 ${inWishlist ? 'bi-heart-fill text-danger' : 'bi-heart text-dark'}`}></i>
      </button>

      <Link to={`/product/${product?.id}`} className="text-decoration-none">
        <div style={{ height: '300px', backgroundColor: '#f0f0f0' }} className="w-100 rounded-top overflow-hidden position-relative">
          {!isImgLoaded && (
            <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center text-secondary">
              <div className="spinner-border spinner-border-sm" role="status"></div>
            </div>
          )}

          <img
            src={displayImage}
            className={`object-fit-cover w-100 h-100 rounded-top ${isOutOfStock ? 'opacity-50 grayscale' : ''}`}
            loading="lazy"
            alt={product?.name || "Product"}
            onLoad={() => setIsImgLoaded(true)}
            style={{
              filter: isOutOfStock ? 'grayscale(100%)' : 'none',
              opacity: isImgLoaded ? 1 : 0,
              transition: 'opacity 0.3s ease-in-out'
            }}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = PLACEHOLDER_IMG;
            }}
          />
        </div>
      </Link>

      <div className={`card-body d-flex flex-column p-2 text-center ${isOutOfStock ? 'opacity-50' : ''}`}>
        <div className="small text-uppercase fw-bold text-muted mb-1">
          {product?.brand || "Brand"}
        </div>
        <h6 className="card-title text-truncate mb-1 text-secondary">
          {product?.name || "Untitled Product"}
        </h6>

        <div className="d-flex justify-content-center mb-2">
          <StarRating rating={product?.rating || 0} reviews={product?.rating_count || 0} />
        </div>

        <div className="fw-bold text-dark mb-3">
          {isOutOfStock ? <span className="text-danger">Out of Stock</span> : `₹${product?.price || 0}`}
        </div>


        <Link
          to={`/product/${product?.id}`}
          className={`btn w-100 mt-auto rounded-0 text-uppercase fw-bold py-2 ${isOutOfStock ? 'btn-secondary disabled' : 'btn-primary'}`}
          style={{ pointerEvents: isOutOfStock ? 'none' : 'auto' }} // Optional: prevent clicking button if strictly disabled
        >
          {isOutOfStock ? "Sold Out" : "View Details"}
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;