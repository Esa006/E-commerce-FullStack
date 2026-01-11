import React from "react";
import { useContext, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { WishlistContext } from "../context/WishlistContext";
import axios from "axios";
import Swal from "sweetalert2";
import { parseImages, getImageUrl } from "../utils/imageUtils";

const ProductDetails = () => {
  const { id } = useParams();
  const { addToCart } = useContext(CartContext);
  const { toggleWishlist, isInWishlist } = useContext(WishlistContext);

  const [productData, setProductData] = useState(null);
  const [size, setSize] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [loading, setLoading] = useState(true);

  const storageBaseUrl = "http://localhost:8000/storage/";

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/products/${id}`);
        if (response.data.success) {
          const data = response.data.data;
          setProductData(data);
          // Initialize quantity based on product's MOQ step (1, 2, or 5)
          setQuantity(data.qty_step || 1);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching product:", error);
        setLoading(false);
      }
    };
    fetchProductData();
  }, [id]);

  if (loading) return <div className="text-center mt-5"><div className="spinner-border text-dark"></div></div>;
  if (!productData) return <div className="text-center mt-5 text-danger">Product Not Found</div>;

  const images = parseImages(productData.image);
  const sizes = parseImages(productData.sizes);

  // --- 🟢 DYNAMIC QUANTITY LOGIC ---
  const step = productData.qty_step || 1;

  const handleIncrease = () => {
    if (quantity + step <= productData.stock) {
      setQuantity(prev => prev + step);
    } else {
      Swal.fire({
        icon: "warning",
        title: "Stock Limit",
        text: `We only have ${productData.stock} units available.`,
        confirmButtonColor: "#000"
      });
    }
  };

  const handleDecrease = () => {
    if (quantity > step) setQuantity(prev => prev - step);
  };

  return (
    <div className="container mt-5 py-5">
      <div className="row g-5">
        {/* Product Image Section */}
        <div className="col-md-6">
          <div className="card product-image-container">
            <img
              src={images.length > 0 ? getImageUrl(images[0]) : "https://via.placeholder.com/500"}
              className="img-fluid rounded product-image"
              alt={productData.name}
              onError={(e) => { e.target.src = "https://via.placeholder.com/500?text=Image+Not+Found"; }}
            />
          </div>
        </div>

        {/* Product Info Section */}
        <div className="col-md-6">
          <h1 className="fw-bold mb-3">{productData.name}</h1>

          <div className="d-flex align-items-center gap-3 mb-4">
            <h3 className="product-price">₹{productData.price}</h3>
            {/* Status Badges from your Backend Model */}
            {productData.stock_status === 'out_of_stock' && <span className="badge bg-danger p-2 title-uppercase">Out Of Stock</span>}
            {productData.stock_status === 'low_stock' && <span className="badge bg-warning text-dark p-2 title-uppercase">Low Stock ({productData.stock} LEFT)</span>}
            {productData.stock_status === 'in_stock' && <span className="badge bg-success p-2 title-uppercase">In Stock</span>}
          </div>

          <p className="text-muted leading-relaxed">{productData.description}</p>
          <hr />

          {/* Size Selection - Now fixed to show separate buttons */}
          <div className="my-4">
            <p className="fw-bold mb-3 small text-uppercase tracking-wider">Select Size:</p>
            <div className="d-flex gap-2 flex-wrap">
              {sizes.map((s, index) => {
                const cleanSize = s.toString().trim();
                return (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setSize(cleanSize)}
                    className={`size-btn ${size === cleanSize ? "active" : ""}`}
                  >
                    {cleanSize}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Dynamic Quantity Selector */}
          <div className="my-4">
            <p className="fw-bold mb-3 small text-uppercase tracking-wider">Quantity (Steps of {step}):</p>
            <div className="quantity-selector">
              <button className="quantity-btn" onClick={handleDecrease}>-</button>
              <div className="quantity-display">{quantity}</div>
              <button className="quantity-btn" onClick={handleIncrease}>+</button>
            </div>
          </div>

          {/* Add to Cart Action */}
          <div className="mt-5">
            <button
              onClick={() => {
                if (!size) {
                  Swal.fire({ icon: "info", title: "Wait!", text: "Please select a size first." });
                } else if (productData.stock < step) {
                  Swal.fire({ icon: "error", title: "Out of Stock", text: "Minimum order units not available." });
                } else {
                  addToCart(productData, size, quantity);
                  Swal.fire({
                    icon: "success",
                    title: "Added!",
                    text: `${quantity} units added to your cart.`,
                    timer: 2000,
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false
                  });
                }
              }}
              disabled={productData.stock < step}
              className="btn btn-dark action-btn"
            >
              {productData.stock >= step ? "Add to Cart" : "Sold Out"}
            </button>
            <button
                onClick={() => toggleWishlist(productData)}
                className={`btn ms-3 action-btn ${isInWishlist(productData.id) ? 'btn-danger' : 'btn-outline-danger'}`}
            >
                <i className={`bi ${isInWishlist(productData.id) ? 'bi-heart-fill' : 'bi-heart'}`}></i>
            </button>
          </div>

          <p className="small text-muted mt-3 italic">
            * This specific product is sold in batches of {step}.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;