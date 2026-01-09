import { Link } from "react-router-dom";
import { parseImages, getImageUrl } from "../utils/imageUtils";

const ProductCard = ({ product }) => {
  const images = parseImages(product.image);
  const displayImage = images.length > 0 ? getImageUrl(images[0]) : "https://via.placeholder.com/300?text=No+Image";

  return (

    <div className="col-lg-3 col-md-4 col-sm-6 mb-4">
      <div className="card h-100 shadow-sm border-0 product-card">
        <Link to={`/product/${product.id}`}>
          <img
            src={displayImage}
            className="card-img-top product-card-img"
            alt={product.name}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://via.placeholder.com/300?text=Image+Error";
            }}
          />
        </Link>

        <div className="card-body d-flex flex-column text-center p-3">

          <h6 className="card-title product-card-title">
            {product.name}
          </h6>
          <p className="text-primary product-card-price">
            ₹{product.price}
          </p>

          <Link
            to={`/product/${product.id}`}
            className="btn btn-dark btn-sm product-card-btn"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;