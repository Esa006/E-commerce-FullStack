import React, { useContext, useEffect, useState } from "react";
import { CartContext } from "../context/CartContext";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import CartApi from "../api/CartApi";
import BackButton from "../components/BackButton";
import { getImageUrl, PLACEHOLDER_IMG } from "../utils/imageUtils";
import "./RelativeProduct";


// ... existing imports

const Cart = () => {

  // Destructure Context
  const { cartItems, updateQuantity, removeFromCart, getTotalAmount } = useContext(CartContext);
  const cartData = cartItems; // Alias to match existing code usage

  const [loading, setLoading] = useState(false); // If needed, or remove if unused in this scope
  const navigate = useNavigate();

  // Helper: Get available stock safely
  const getSafeStock = (item) => {
    // Check top-level stock or nested product stock
    if (item.stock !== undefined) return item.stock;
    if (item.product && item.product.stock !== undefined) return item.product.stock;
    return 0; // Default to 0 if unknown
  };

  // Handle Quantity Input Change
  const handleQuantityChange = (id, size, value, item) => {
    const newQty = parseInt(value);
    if (isNaN(newQty) || newQty < 1) return;
    // context updateQuantity usually handles stock check, but we can double check max here if we want
    // For now just pass it through
    updateQuantity(id, size, newQty);
  };

  // Check for Out of Stock items to disable checkout
  const hasOutOfStockItems = cartData.some(item => getSafeStock(item) === 0);

  const handleCheckout = () => {
    navigate('/place-order');
  };

  return (
    <div className="container mt-5 pt-5">
      <BackButton to="/" label="Continue Shopping" />
      <div className="mb-4">
        <h3 className="fw-bold text-uppercase">Your<span className="text-muted">Cart</span></h3>
      </div>

      <div>
        {cartData.length > 0 ? (
          cartData.map((item, index) => {
            const availableStock = getSafeStock(item);
            const isOutOfStock = availableStock === 0;
            const rawImageData = item.image || item.product?.image;
            let images = [];
            try {
              if (Array.isArray(rawImageData)) { images = rawImageData; }
              else { const parsed = JSON.parse(rawImageData); images = Array.isArray(parsed) ? parsed : [parsed]; }
            } catch (e) { images = rawImageData ? [rawImageData] : []; }

            return (
              <div key={index} className={`row align-items-center border-top border-bottom py-3 ${isOutOfStock ? 'bg-light opacity-75' : ''}`}>

                {/* Product Image & Details */}
                <div className="col-6 col-md-4 d-flex align-items-center gap-3">
                  <Link to={`/product/${item.product?.id || item.product_id || item.id}`} className="w-25">
                    {/* 🟢 CHANGE 1: Use 'w-25' and 'img-fluid' instead of 80px */}
                    <img
                      src={images.length > 0 ? getImageUrl(images[0]) : PLACEHOLDER_IMG}
                      alt="product"
                      className={`img-fluid rounded w-100 object-fit-cover ${isOutOfStock ? 'out-of-stock' : ''}`}
                      onError={(e) => { e.target.src = PLACEHOLDER_IMG; }}
                    />
                  </Link>
                  <div>
                    <h6 className="fs-6 fw-bold mb-1">{item?.name || item?.product?.name || "Untitled Product"}</h6>
                    {isOutOfStock ? (
                      <p><span className="badge bg-danger text-uppercase">Sold Out</span></p>
                    ) : (
                      <div className="d-flex align-items-center gap-2 small text-muted">
                        <span>₹{item?.price || item?.product?.price || 0}</span>
                        <span className="badge bg-light text-dark border">{item?.size || "N/A"}</span>
                      </div>
                    )}
                    {!isOutOfStock && availableStock <= 5 && availableStock > 0 && (
                      <div className="text-danger small mt-1">Only {availableStock} left!</div>
                    )}
                  </div>
                </div>

                {/* Quantity Input */}
                <div className="col-3 col-md-4 text-center">
                  {isOutOfStock ? (
                    <span className="text-danger fw-bold small">Unavailable</span>
                  ) : (
                    <>
                      <input
                        onChange={(e) => handleQuantityChange(item?.id, item?.size, e.target.value, item)}
                        type="number"
                        min={1}
                        max={availableStock}
                        value={item?.quantity || 1}
                        className="form-control d-inline-block text-center cart-quantity-input"
                      />
                    </>
                  )}
                </div>

                {/* Delete Button */}
                <div className="col-3 col-md-4 text-end">
                  <button onClick={() => removeFromCart(item.id, item.size)} className="btn btn-link text-danger p-0">
                    <i className="bi bi-trash3 fs-5"></i>
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-5">
            <h5>Your cart is empty!</h5>
            <Link to="/" className="btn btn-custom-primary mt-3">Go to Collection</Link>
          </div>
        )}
      </div>

      {/* Cart Totals Section */}
      {cartData.length > 0 && (
        <div className="row mt-5 justify-content-end">
          <div className="col-md-5">
            <div className="card border-0 shadow-sm p-4 bg-light">
              <h5 className="fw-bold mb-4 text-uppercase">Cart Totals</h5>
              <div className="d-flex justify-content-between border-bottom pb-2 mb-2">
                <p><span>Subtotal</span></p>
                <p><span>₹{getTotalAmount()}.00</span></p>
              </div>
              <div className="d-flex justify-content-between border-bottom pb-2 mb-2">
                <p><span>Shipping Fee</span></p>
                <p><span>₹10.00</span></p>
              </div>
              <div className="d-flex justify-content-between fw-bold fs-5">
                <p><span>Total</span></p>
                <p><span>₹{getTotalAmount() + 10}.00</span></p>
              </div>
              <hr />
              <div className="mt-4">
                <button
                  className={`btn w-100 py-2 fw-bold text-uppercase ${hasOutOfStockItems ? 'btn-secondary' : 'btn-custom-primary'}`}
                  onClick={handleCheckout}
                  disabled={hasOutOfStockItems}
                  title={hasOutOfStockItems ? "Please remove sold out items before proceeding" : ""}
                >
                  {hasOutOfStockItems ? "Remove Sold Out Items" : "Proceed to Checkout"}
                </button>
              </div>
            </div>
          </div>
        </div>

      )}
    </div>

  );
};

export default Cart;