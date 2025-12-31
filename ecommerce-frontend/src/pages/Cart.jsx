import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";

const Cart = () => {
  const { cart, removeFromCart } = useContext(CartContext);

  // Calculate Subtotal
  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  return (
    <>
      <Navbar />
      <div className="container mt-5">
        <h3 className="mb-4 fw-bold">Your Shopping Cart</h3>

        {cart.length === 0 ? (
          <div className="alert alert-info text-center py-5">
            <h5>Your cart is empty</h5>
            <Link to="/products" className="btn btn-primary mt-3">Continue Shopping</Link>
          </div>
        ) : (
          <div className="row">
            <div className="col-md-8">
              {cart.map((item) => (
                <div key={`${item._id}-${item.size}`} className="card mb-3 shadow-sm border-0 p-3">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="fw-bold mb-1">{item.name}</h6>
                      <p className="text-muted mb-0 small">
                        Size: <span className="badge bg-light text-dark">{item.size}</span> | 
                        Qty: <span className="fw-bold">{item.quantity}</span>
                      </p>
                    </div>
                    <div className="text-end">
                      <p className="fw-bold mb-2">₹{item.price * item.quantity}</p>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => removeFromCart(item._id, item.size)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Price Summary Sidebar */}
            <div className="col-md-4">
              <div className="card shadow-sm border-0 p-4">
                <h5 className="fw-bold mb-3">Order Summary</h5>
                <div className="d-flex justify-content-between mb-2">
                  <span>Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>
                <div className="d-flex justify-content-between mb-3 text-success fw-bold">
                  <span>Shipping</span>
                  <span>FREE</span>
                </div>
                <hr />
                <div className="d-flex justify-content-between mb-4">
                  <span className="h5 fw-bold">Total</span>
                  <span className="h5 fw-bold">₹{subtotal}</span>
                </div>
                <Link to="/checkout" className="btn btn-dark w-100 py-2 fw-bold">
                  Proceed to Checkout
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Cart;