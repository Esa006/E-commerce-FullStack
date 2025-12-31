import { Link } from "react-router-dom";

const ProductCard = ({ product }) => {
  return (
    <div className="col-md-3 mb-4">
      <div className="card h-100">
        <img
          src={product.image[0]}
          className="card-img-top"
          alt={product.name}
        />

        <div className="card-body">
          <h6>{product.name}</h6>

          {/* PRICE – THIS IS THE FIX */}
          <p className="fw-bold">₹{product.price}</p>

          <Link
            to={`/product/${product._id}`}
            className="btn btn-dark btn-sm w-100"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
