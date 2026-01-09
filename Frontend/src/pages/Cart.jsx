import React, { useContext, useEffect, useState } from "react";
import { CartContext } from "../context/CartContext";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import CartApi from "../api/CartApi";
import "./RelativeProduct";
const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart, getTotalAmount } = useContext(CartContext);
  const [cartData, setCartData] = useState([]);

  useEffect(() => {
    setCartData(cartItems);
  }, [cartItems]);

  useEffect(() => {
    const checkStockOnLoad = async () => {
      if (cartItems.length === 0) return;
      try {
        await CartApi.validateCart(cartItems);
      } catch (error) {
        if (error.response && error.response.status === 409) {
          console.warn("Stock mismatch detected on load.");
        }
      }
    };
    checkStockOnLoad();
  }, [cartItems]);

  const getSafeStock = (item) => {
    let stock = item.stock !== undefined ? item.stock : (item.product?.stock);
    return stock !== undefined && stock !== null ? Number(stock) : 0;
  };

  const handleQuantityChange = (id, size, value, item) => {
    const val = Number(value);
    const maxStock = getSafeStock(item);

    if (maxStock === 0) {
      Swal.fire("Error", "Stock information unavailable. Try refreshing the page.", "error");
      return;
    }

    if (val > maxStock) {
      Swal.fire({
        title: "Stock Limit Reached",
        text: `Sorry, only ${maxStock} items are available in stock.`,
        icon: "warning",
        confirmButtonColor: "#000",
      });
      updateQuantity(id, size, maxStock);
    } else if (val > 0) {
      updateQuantity(id, size, val);
    }
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    try {
      const response = await CartApi.validateCart(cartData);
      if (response.data && response.data.success) {
        window.location.href = "/place-order";
        return;
      }
    } catch (error) {
      const errResponse = error.response || error;
      if (errResponse && errResponse.status === 409) {
        const serverData = errResponse.data || {};
        let errorHtml = '';
        if (serverData.errors && Array.isArray(serverData.errors)) {
          errorHtml = `<ul class="text-start mt-2 text-secondary">${serverData.errors.map(err => `<li>${err}</li>`).join('')}</ul>`;
        }
        Swal.fire({
          icon: 'warning',
          title: 'Item Out of Stock!',
          html: `<p class="fw-bold">${serverData.message || "Some items are unavailable."}</p>${errorHtml}<p class="mt-2 small text-muted">Updating your cart...</p>`,
          confirmButtonText: 'Update Cart & Retry',
          confirmButtonColor: '#d33'
        }).then(() => {
          window.location.reload();
        });
        return;
      }
      if (errResponse && errResponse.status === 401) {
        Swal.fire({ title: 'Login Required', text: 'Please login to proceed to checkout.', icon: 'warning', confirmButtonColor: '#000' }).then(() => { window.location.href = '/login'; });
        return;
      }
      Swal.fire({ icon: 'error', title: 'Error', text: errResponse?.data?.message || "Something went wrong." });
    }
  };

  const hasOutOfStockItems = cartData.some(item => getSafeStock(item) === 0);

  return (
    <div className="container mt-5 pt-5">
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
                  
                  {/* 🟢 CHANGE 1: Use 'w-25' and 'img-fluid' instead of 80px */}
                  <img
                    src={images.length > 0 ? `http://127.0.0.1:8000/storage/${images[0]}` : "https://via.placeholder.com/80x100?text=No+Img"}
                    alt="product"
                    className={`img-fluid rounded w-25 object-fit-cover ${isOutOfStock ? 'out-of-stock' : ''}`} 
                    onError={(e) => { e.target.src = "https://via.placeholder.com/80x100?text=Error"; }}
                  />
                  
                  <div>
                    <h6 className="fs-6 fw-bold mb-1">{item.name || item.product?.name}</h6>
                    {isOutOfStock ? (
                      <p><span className="badge bg-danger">SoldOut</span></p>
                    ) : (
                      <div className="d-flex align-items-center gap-2 small text-muted">
                        <span>₹{item.price || item.product?.price}</span>
                        <span className="px-2 py-1 border bg-light">{item.size}</span>
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
                      {/* 🟢 CHANGE 2: Use 'small text-muted' instead of 10px */}
                      <div className="text-muted small">
                        Max: {availableStock}
                      </div>
                      
                      <input
                        onChange={(e) => handleQuantityChange(item.id, item.size, e.target.value, item)}
                        type="number"
                        min={1}
                        max={availableStock}
                        value={item.quantity}
                        className="form-control d-inline-block text-center"
                        style={{ maxWidth: '60px' }} // Optional: keep input width sane
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
            <Link to="/" className="btn btn-dark mt-3">Go to Collection</Link>
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
                  className={`btn w-100 py-2 fw-bold text-uppercase ${hasOutOfStockItems ? 'btn-secondary' : 'btn-dark'}`}
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