import React, { useState, useContext, useEffect } from "react";
import { CartContext } from "../context/CartContext";
import addressApi from "../api/address";
import api from "../api/axiosClient";
import { useNavigate, Link } from "react-router-dom";
import Swal from 'sweetalert2';
// import "../style/Checkout.css"; // 🟢 REMOVED: Using pure Bootstrap now

const Checkout = () => {
  const { cartItems, updateQuantity, removeFromCart, getTotalAmount, clearCart } = useContext(CartContext);
  const navigate = useNavigate();

  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [loadingAddresses, setLoadingAddresses] = useState(true);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    city: "",
    district: "",
    state: "",
    zip_code: "",
    country: "",
    phone: ""
  });

  useEffect(() => {
    const token = localStorage.getItem('ACCESS_TOKEN');
    if (!token) {
      Swal.fire({
        title: 'Login Required',
        text: 'Please login to proceed to checkout.',
        icon: 'warning',
        confirmButtonColor: 'btn btn-dark'
      }).then(() => {
        navigate('/login');
      });
    } else {
      fetchSavedAddresses();
    }
  }, [navigate]);

  const fetchSavedAddresses = async () => {
    try {
      setLoadingAddresses(true);
      const res = await addressApi.getAddresses();
      const addrs = res.data.addresses || res.data || [];
      const validAddrs = Array.isArray(addrs) ? addrs : [];
      setSavedAddresses(validAddrs);

      if (validAddrs.length > 0) {
        const defaultAddr = validAddrs.find(a => a.is_default);
        if (defaultAddr) {
          handleAddressSelect(defaultAddr);
        }
      }
    } catch (err) {
      console.error("Failed to load addresses", err);
    } finally {
      setLoadingAddresses(false);
    }
  };

  const handleAddressSelect = (addr) => {
    setSelectedAddressId(addr.id);
    const names = (addr.full_name || addr.name || "").split(" ");
    const fName = names[0] || "";
    const lName = names.slice(1).join(" ") || "";
    const line1 = addr.address_line1 || addr.address || "";
    const line2 = addr.address_line2 || "";
    const fullAddress = line1 + (line2 ? ", " + line2 : "");

    setFormData(prev => ({
      ...prev,
      firstName: fName,
      lastName: lName,
      address: fullAddress,
      city: addr.city || "",
      district: addr.city || "",
      state: addr.state || "",
      zip_code: addr.zip_code || "",
      country: addr.country || "",
      phone: addr.phone || "",
    }));
  };

  const onSavedAddressChange = (e) => {
    const id = e.target.value;
    if (id === "new") {
      setSelectedAddressId("new");
      setFormData({
        firstName: "", lastName: "", email: formData.email, address: "", city: "", district: "", state: "", zip_code: "", country: "", phone: ""
      });
    } else {
      const addr = savedAddresses.find(a => a.id == id);
      if (addr) handleAddressSelect(addr);
    }
  };

  const onChangeHandler = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    const orderData = {
      address: formData.address,
      city: formData.city,
      state: formData.state,
      district: formData.district,
      zip_code: formData.zip_code,
      country: formData.country,
      phone: formData.phone,
      total_amount: getTotalAmount(),
      cart_items: cartItems.map(item => ({
        product_id: item.id,
        price: item.price,
        quantity: item.quantity
      }))
    };

    try {
      const response = await api.post("/orders", orderData);

      console.log('Order creation response:', response.data);

      if (response.data.success) {
        clearCart();
        // Navigate to order success page with the order ID
        const orderId = response.data.order?.id || response.data.order_id || response.data.id;
        console.log('Extracted order ID:', orderId);

        if (orderId) {
          // Extract full order data
          const createdOrder = response.data.order || response.data.data || response.data;
          console.log('Created order:', createdOrder);

          // Pass order data via navigation state to avoid additional API call
          navigate('/order-success', {
            state: {
              orderData: createdOrder,
              orderId: orderId
            }
          });
        } else {
          console.error('No order ID found in response');
          Swal.fire({
            title: 'Order Placed',
            text: 'Your order was placed but we could not retrieve the details. Please check "My Orders".',
            icon: 'warning',
            confirmButtonColor: '#000'
          }).then(() => {
            navigate('/orders');
          });
        }
      }
    } catch (error) {
      if (error.response && error.response.status === 422) {
        const errorMessages = Object.values(error.response.data.errors).flat().join(", ");
        Swal.fire({ title: 'Input Error', text: errorMessages, icon: 'warning', confirmButtonColor: '#btn btn-dark' });
      } else {
        const status = error.response?.status;
        const msg = error.response?.data?.message || error.message;
        Swal.fire({ title: `Error ${status || ''}`, text: msg, icon: 'error', confirmButtonColor: 'btn btn-dark' });
      }
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="container text-center py-5 mt-5">
        <div className="mt-5">
          <h5>Your cart is empty!</h5>
          <p className="text-muted">Add items to proceed to checkout.</p>
          <Link to="/" className="btn btn-dark mt-3">Go to Collection</Link>
        </div>
      </div>
    );
  }

  return (
    // 🟢 MAPPED: .checkout-container -> container mt-5 pt-5 mb-5
    <div className="container mt-5 pt-5 mb-5">
      <form onSubmit={onSubmitHandler} className="row g-4">

        {/* Left Side: Delivery Info */}
        <div className="col-md-7">
          {/* 🟢 MAPPED: .delivery-title -> fw-bold mb-4 */}
          <h4 className="fw-bold mb-4">Delivery Information</h4>

          {loadingAddresses ? (
            <div className="mb-4 text-center text-muted"><p>Loading saved addresses...</p></div>
          ) : savedAddresses.length > 0 ? (
            <div className="mb-4 p-3 bg-light rounded border">
              <label className="form-label fw-bold">Select from Saved Addresses:</label>
              <select className="form-select" value={selectedAddressId} onChange={onSavedAddressChange}>
                <option value="new">-- Use a New Address --</option>
                {savedAddresses.map(addr => (
                  <option key={addr.id} value={addr.id}>
                    {addr.full_name} - {addr.address_line1}, {addr.city} {addr.is_default ? "(Default)" : ""}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div className="mb-4 p-2 text-muted small border rounded bg-light">
              <p>No saved addresses found. <Link to="/profile" className="text-decoration-none">Add one in Profile</Link> for faster checkout.</p>
            </div>
          )}

          <div className="row g-3">
            <div className="col-sm-6"><input required name="firstName" value={formData.firstName} onChange={onChangeHandler} className="form-control" placeholder="First Name" /></div>
            <div className="col-sm-6"><input required name="lastName" value={formData.lastName} onChange={onChangeHandler} className="form-control" placeholder="Last Name" /></div>
            <div className="col-12"><input required name="email" value={formData.email} onChange={onChangeHandler} className="form-control" placeholder="Email Address" /></div>
            <div className="col-12"><input required name="address" value={formData.address} onChange={onChangeHandler} className="form-control" placeholder="Street Address" /></div>
            <div className="col-sm-12"><input required name="phone" value={formData.phone} onChange={onChangeHandler} className="form-control" placeholder="Phone Number" /></div>
            <div className="col-sm-6"><input required name="city" value={formData.city} onChange={onChangeHandler} className="form-control" placeholder="City" /></div>
            <div className="col-sm-6"><input required name="district" value={formData.district} onChange={onChangeHandler} className="form-control" placeholder="District" /></div>
            <div className="col-sm-6"><input required name="state" value={formData.state} onChange={onChangeHandler} className="form-control" placeholder="State" /></div>
            <div className="col-sm-6"><input required name="zip_code" value={formData.zip_code} onChange={onChangeHandler} className="form-control" placeholder="Zip Code" /></div>
            <div className="col-sm-6"><input required name="country" value={formData.country} onChange={onChangeHandler} className="form-control" placeholder="Country" /></div>
          </div>
        </div>

        {/* Right Side: Order Summary */}
        <div className="col-md-5">
          {/* 🟢 MAPPED: .order-summary-card -> card bg-light border-0 shadow-sm p-4 */}
          <div className="card bg-light border-0 shadow-sm p-4">

            {/* 🟢 MAPPED: .summary-title -> fw-bold mb-3 */}
            <h5 className="fw-bold mb-3">Order Summary</h5>

            {/* 🟢 MAPPED: .summary-row -> d-flex justify-content-between mb-2 */}
            <div className="d-flex justify-content-between mb-2">
              <p><span>Subtotal</span></p>
              <p><span>₹{getTotalAmount()}.00</span></p>
            </div>

            {/* 🟢 MAPPED: .summary-row.border-bottom -> d-flex justify-content-between border-bottom pb-2 mb-2 */}
            <div className="d-flex justify-content-between border-bottom pb-2 mb-2">
              <p><span>Shipping Fee</span></p>
              <p><span>₹10.00</span></p>
            </div>

            {/* 🟢 MAPPED: .total-row -> d-flex justify-content-between fw-bold fs-5 mt-2 */}
            <div className="d-flex justify-content-between fw-bold fs-5 mt-2">
              <p><span>Total Amount</span></p>
              <p><span>₹{getTotalAmount() + 10}.00</span></p>
            </div>

            <div className="mt-4">
              <h6 className="fw-bold mb-3">Payment Method</h6>

              {/* 🟢 MAPPED: .payment-method-box -> border p-2 rounded bg-white */}
              <div className="border p-2 rounded bg-white">
                <div className="form-check">
                  <input className="form-check-input ms-1" type="radio" checked readOnly />
                  <label className="form-check-label ms-2">Cash on Delivery</label>
                </div>
              </div>
            </div>

            {/* 🟢 MAPPED: .place-order-btn -> btn btn-dark w-100 mt-3 py-2 fw-bold text-uppercase */}
            <button type="submit" className="btn btn-dark w-100 mt-3 py-2 fw-bold text-uppercase">Place Order</button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Checkout;