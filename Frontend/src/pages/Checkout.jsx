import React, { useState, useContext, useEffect } from "react";
import { CartContext } from "../context/CartContext";
import addressApi from "../api/address";
import api from "../api/axiosClient";
import { useNavigate, Link } from "react-router-dom";
import Swal from 'sweetalert2';
import BackButton from "../components/BackButton";



// ... existing imports

const Checkout = () => {
  const { cartItems, getTotalAmount, clearCart } = useContext(CartContext);
  const navigate = useNavigate();

  const [method, setMethod] = useState("cod");
  const [loadingAddresses, setLoadingAddresses] = useState(true);
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState("new");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    address2: "",
    phone: "",
    city: "",
    district: "",
    state: "",
    zip_code: "",
    country: "India"
  });

  // Check Auth
  useEffect(() => {
    const token = localStorage.getItem("ACCESS_TOKEN");
    if (!token) {
      Swal.fire({
        icon: "warning",
        title: "Login Required",
        text: "Please login to place an order.",
        confirmButtonText: "Login",
        customClass: {
          confirmButton: "btn btn-primary py-2 px-4"
        },
        buttonsStyling: false
      }).then(() => {
        navigate("/login");
      });
    }
  }, [navigate]);

  // Fetch saved addresses on mount
  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        setLoadingAddresses(true);
        const res = await addressApi.getAddresses();
        const addresses = res.data.addresses || res.data || [];
        setSavedAddresses(addresses);

        // Auto-select default address if exists
        const defaultAddr = addresses.find(a => a.is_default);
        if (defaultAddr) {
          selectAddress(defaultAddr);
        }
      } catch (error) {
        console.error("Error loading addresses", error);
      } finally {
        setLoadingAddresses(false);
      }
    };
    fetchAddresses();

    // 🟢 Fetch User Profile for Initial Hydration (Email/Name)
    const fetchProfile = async () => {
      try {
        const res = await api.get("/user");
        const userData = res.data;
        if (userData) {
          setFormData(prev => ({
            ...prev,
            email: userData.email || prev.email,
            firstName: userData.name?.split(" ")[0] || prev.firstName,
            lastName: userData.name?.split(" ").slice(1).join(" ") || prev.lastName,
          }));
        }
      } catch (err) {
        console.error("Profile fetch failed", err);
      }
    };
    fetchProfile();
  }, []);

  const selectAddress = (addr) => {
    setSelectedAddressId(addr.id);
    // Split name if possible (Backend sends 'name')
    const nameParts = (addr.name || addr.full_name || "").split(" ");
    const fName = nameParts[0] || "";
    const lName = nameParts.slice(1).join(" ") || "";

    setFormData({
      firstName: fName,
      lastName: lName,
      email: addr.email || formData.email || "",
      address: addr.address || addr.address_line1 || "",
      address2: addr.address_line2 || "",
      phone: addr.phone || "",
      city: addr.city || "",
      district: addr.state || "",
      state: addr.state || "",
      zip_code: addr.zip_code || "",
      country: addr.country || "India"
    });
  };

  const onSavedAddressChange = (e) => {
    const val = e.target.value;
    if (val === "new") {
      setSelectedAddressId("new");
      setFormData({
        firstName: "", lastName: "", email: "", address: "", address2: "", phone: "",
        city: "", district: "", state: "", zip_code: "", country: "India"
      });
    } else {
      const addr = savedAddresses.find(a => a.id.toString() === val.toString());
      if (addr) selectAddress(addr);
    }
  };

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setFormData((data) => ({ ...data, [name]: value }));
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      const orderItems = cartItems.map(item => ({
        product_id: item.product?.id || item.id,
        size: item.size,
        quantity: item.quantity,
        price: item.price
      }));

      const payload = {
        cart_items: orderItems,
        total_amount: getTotalAmount() + 10,
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        address_line2: formData.address2,
        city: formData.city,
        state: formData.state,
        zip_code: formData.zip_code,
        country: formData.country,
        address_id: selectedAddressId !== "new" ? selectedAddressId : null,
        payment_method: method
      };

      const response = await api.post("/orders", payload);

      if (response.data) {
        clearCart();
        // Backend returns: { success: true, message: "...", data: { ...order... } }
        const orderData = response.data.data || response.data.order || response.data;
        Swal.fire({
          icon: 'success',
          title: 'Order Placed!',
          text: 'Your order has been placed successfully.',
          timer: 2000,
          showConfirmButton: false
        }).then(() => {
          navigate('/order-success', { state: { order: orderData }, replace: true });
        });
      }

    } catch (error) {
      console.error(error);
      setIsSubmitting(false);
      Swal.fire({
        icon: 'error',
        title: 'Order Failed',
        text: error.response?.data?.message || 'Something went wrong. Please try again.'
      });
    }
  };

  return (
    <div className="container mt-5  mb-5">
      <BackButton to="/cart" label="Back to Cart" />

      <form onSubmit={onSubmitHandler} className="d-flex flex-column flex-lg-row justify-content-lg-between gap-4">

        {/* Left Side: Delivery Info */}
        <div className="flex-grow-1">
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
                    {(addr.name || addr.full_name)} - {(addr.address || addr.address_line1)}, {addr.city} {addr.is_default ? "(Default)" : ""}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div className="mb-4 p-2 text-muted small border rounded bg-light">
              <p>No saved addresses found. <Link to="/profile" className="text-decoration-none">Add one in Profile</Link> for faster checkout.</p>
            </div>
          )}

          <div className="d-flex flex-column gap-3">
            <div className="d-flex flex-column flex-sm-row gap-3">
              <input required name="firstName" value={formData.firstName} onChange={onChangeHandler} className="form-control flex-fill" placeholder="First Name" />
            </div>
            <input required name="email" value={formData.email} onChange={onChangeHandler} className="form-control" placeholder="Email Address" />
            <input required name="address" value={formData.address} onChange={onChangeHandler} className="form-control" placeholder="Street Address" />
            <input name="address2" value={formData.address2} onChange={onChangeHandler} className="form-control" placeholder="Address Line 2 (Optional)" />
            <input required name="phone" value={formData.phone} onChange={onChangeHandler} className="form-control" placeholder="Phone Number" />
            <div className="d-flex flex-column flex-sm-row gap-3">
              <input required name="city" value={formData.city} onChange={onChangeHandler} className="form-control flex-fill" placeholder="City" />
              <input required name="district" value={formData.district} onChange={onChangeHandler} className="form-control flex-fill" placeholder="District" />
            </div>
            <div className="d-flex flex-column flex-sm-row gap-3">
              <input required name="state" value={formData.state} onChange={onChangeHandler} className="form-control flex-fill" placeholder="State" />
              <input required name="zip_code" value={formData.zip_code} onChange={onChangeHandler} className="form-control flex-fill" placeholder="Zip Code" />
            </div>
            <input required name="country" value={formData.country} onChange={onChangeHandler} className="form-control" placeholder="Country" />
          </div>
        </div>

        {/* Right Side: Order Summary */}
        <div className="ms-lg-auto col-lg-4">
          <div className="card bg-light border-0 shadow-sm p-4">

            <h5 className="fw-bold mb-3">Order Summary</h5>

            <div className="d-flex justify-content-between mb-2">
              <span>Subtotal</span>
              <span>₹{getTotalAmount()}.00</span>
            </div>

            <div className="d-flex justify-content-between border-bottom pb-2 mb-2">
              <span>Shipping Fee</span>
              <span>₹10.00</span>
            </div>

            <div className="d-flex justify-content-between fw-bold fs-5 mt-2">
              <span>Total Amount</span>
              <span>₹{getTotalAmount() + 10}.00</span>
            </div>

            <div className="mt-4">
              <h6 className="fw-bold mb-3">Payment Method</h6>

              <div className="border p-2 rounded bg-white">
                <div className="form-check">
                  <input className="form-check-input ms-1" type="radio" checked readOnly />
                  <label className="form-check-label ms-2">Cash on Delivery</label>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary w-100 mt-3 py-2 fw-bold text-uppercase"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Processing..." : "Place Order"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Checkout;