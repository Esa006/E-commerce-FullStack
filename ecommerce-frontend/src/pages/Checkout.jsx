import { useContext, useEffect, useState } from "react";
import { CartContext } from "../context/CartContext";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import axiosClient from "../api/axiosClient";

const Checkout = () => {
  const { cart, clearCart } = useContext(CartContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", address: "" });

  // 🔐 Auth Guard: லாகின் இல்லை என்றால் திருப்பி விடு
  useEffect(() => {
    const token = localStorage.getItem("ACCESS_TOKEN") || localStorage.getItem("token") || localStorage.getItem("admin_token");
    if (!token) {
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  // 🛒 Empty Cart Guard
  useEffect(() => {
    if (cart.length === 0) {
      navigate("/", { replace: true });
    }
  }, [cart, navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
        const payload = {
            // லாராவெல் validate-ல் உள்ள அதே பெயர்களைப் பயன்படுத்தவும்
            address: form.address.trim(),
            phone: form.phone.trim(),
            total_amount: Number(totalAmount),
            // 'cart_items' - இந்த ஸ்பெல்லிங் மிக முக்கியம்
            cart_items: cart.map((item) => ({
                product_id: Number(item.id), 
                quantity: Number(item.quantity),
                price: Number(item.price),
            })),
        };

        const { data } = await axiosClient.post("/orders", payload);
        
        if (data.success) {
            alert(data.message); // "ஆர்டர் வெற்றிகரமாகச் சேமிக்கப்பட்டது!"
            clearCart();
            navigate("/order-success");
        }
    } catch (error) {
        // லாராவெல் 'catch' பிளாக்கில் உள்ள 'message' இங்கே தெரியும்
        const errorMsg = error.response?.data?.message || "ஏதோ தவறு நடந்துள்ளது!";
        alert("பிழை: " + errorMsg);
        console.log("Details:", error.response?.data);
    } finally {
        setLoading(false);
    }
};
  return (
    <>
      <Navbar />
      <div className="container mt-5 mb-5">
        <h3 className="mb-4">Checkout</h3>
        <div className="row">
          <div className="col-md-6">
            <form onSubmit={handleSubmit} className="card p-4 shadow-sm border-0">
              <input type="text" name="name" className="form-control mb-3" placeholder="Full Name" onChange={handleChange} required />
              <input type="email" name="email" className="form-control mb-3" placeholder="Email" onChange={handleChange} required />
              <input type="text" name="phone" className="form-control mb-3" placeholder="Phone" onChange={handleChange} required />
              <textarea name="address" className="form-control mb-3" rows="4" placeholder="Delivery Address" onChange={handleChange} required />
              <button type="submit" className="btn btn-dark w-100 py-2 fw-bold" disabled={loading}>
                {loading ? "Placing Order..." : "Place Order"}
              </button>
            </form>
          </div>
          <div className="col-md-6">
            <div className="card p-4 shadow-sm border-0 bg-light">
              <h5 className="mb-3">Order Summary</h5>
              {cart.map((item, index) => (
                <div key={index} className="d-flex justify-content-between border-bottom py-2">
                  <span>{item.name} × {item.quantity}</span>
                  <span className="fw-bold">₹{item.price * item.quantity}</span>
                </div>
              ))}
              <h5 className="mt-3 text-end text-primary">Total: ₹{totalAmount}</h5>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Checkout;