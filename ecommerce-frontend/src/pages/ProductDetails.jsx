import { useParams } from "react-router-dom";
import { useContext, useState } from "react";
import { products } from "../assets/assets.js";
import { CartContext } from "../context/CartContext";
import Navbar from "../components/Navbar";

const ProductDetails = () => {
  const { id } = useParams();
  const product = products.find((p) => p._id === id);

  const { addToCart } = useContext(CartContext);
  const [size, setSize] = useState(product?.sizes[0] || "");

  if (!product) return <p>Product not found</p>;

  return (
    <>
      <Navbar />

      <div className="container mt-5">
        <div className="row">
          <div className="col-md-6">
            <img
              src={product.image[0]}
              className="img-fluid"
              alt={product.name}
            />
          </div>

          <div className="col-md-6">
            <h3>{product.name}</h3>
            <p>{product.description}</p>
            <h4>₹{product.price}</h4>

            {/* Size selection */}
            <div className="mb-3">
              <strong>Select Size:</strong>
              <br />
              {product.sizes.map((s) => (
                <button
                  key={s}
                  className={`btn btn-sm me-2 mt-2 ${
                    size === s ? "btn-dark" : "btn-outline-dark"
                  }`}
                  onClick={() => setSize(s)}
                >
                  {s}
                </button>
              ))}
            </div>

            {/* ADD TO CART */}
            <button
              className="btn btn-dark mt-3"
              onClick={() => addToCart(product, size)}
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetails;
