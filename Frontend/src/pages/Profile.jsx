import React, { useState, useEffect } from "react";
import AuthApi from "../api/auth";
import AddressList from "../components/AddressList";
import BackButton from "../components/BackButton";
import Swal from "sweetalert2";

const Profile = () => {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    address_line2: "",
    city: "",
    state: "",
    zip_code: "",
    country: "",
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await AuthApi.getUser();
      if (response.data) {
        setForm({
          name: response.data.name || "",
          phone: response.data.phone || "",
          address: response.data.address || "",
          address_line2: response.data.address_line2 || "",
          city: response.data.city || "",
          state: response.data.state || "",
          zip_code: response.data.zip_code || "",
          country: response.data.country || "",
        });
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const saveProfile = async () => {
    try {
      await AuthApi.updateProfile(form);
      Swal.fire({
        icon: "success",
        title: "Profile Updated",
        text: "Your personal and delivery information has been saved.",
        timer: 2000,
        showConfirmButton: false
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: "Could not save changes. Please try again.",
      });
    }
  };

  return (
    <div className="container-fluid px-3 px-md-4 px-lg-5 py-4">
      <div className="d-flex justify-content-start mb-3">
        <BackButton to="/" label="Back to Home" />
      </div>

      <div className="row justify-content-center">
        <div className="col-12 col-md-10 col-lg-8 col-xl-7">

          {/* Profile Card */}
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-body p-4">
              <h4 className="fw-bold mb-4 border-bottom pb-2">Your Profile</h4>

              {/* Personal Info */}
              <div className="mb-4 pt-1">
                <h6 className="text-muted fw-bold text-uppercase mb-3 small">Personal Information</h6>
                <div className="row g-3">
                  <div className="col-12 col-md-6">
                    <label className="form-label small fw-bold text-muted">Full Name</label>
                    <input name="name" type="text" className="form-control" value={form.name} onChange={handleChange} placeholder="John Doe" />
                  </div>
                  <div className="col-12 col-md-6">
                    <label className="form-label small fw-bold text-muted">Phone Number</label>
                    <input name="phone" type="tel" className="form-control" value={form.phone} onChange={handleChange} placeholder="+91 00000 00000" />
                  </div>
                </div>
              </div>

              {/* Delivery Info */}
              <div className="mb-4 pt-3 border-top">
                <h6 className="text-muted fw-bold text-uppercase mb-3 small">Default Delivery Address</h6>
                <div className="row g-3">
                  <div className="col-12">
                    <label className="form-label small fw-bold text-muted">Street Address</label>
                    <input name="address" type="text" className="form-control mb-2" value={form.address} onChange={handleChange} placeholder="House No, Street Name" />
                    <input name="address_line2" type="text" className="form-control" value={form.address_line2} onChange={handleChange} placeholder="Apartment, Landmark (Optional)" />
                  </div>
                  <div className="col-12 col-md-6">
                    <label className="form-label small fw-bold text-muted">City</label>
                    <input name="city" type="text" className="form-control" value={form.city} onChange={handleChange} placeholder="Mumbai" />
                  </div>
                  <div className="col-12 col-md-6">
                    <label className="form-label small fw-bold text-muted">State</label>
                    <input name="state" type="text" className="form-control" value={form.state} onChange={handleChange} placeholder="Maharashtra" />
                  </div>
                  <div className="col-12 col-md-6">
                    <label className="form-label small fw-bold text-muted">Zip Code</label>
                    <input name="zip_code" type="text" className="form-control" value={form.zip_code} onChange={handleChange} placeholder="400001" />
                  </div>
                  <div className="col-12 col-md-6">
                    <label className="form-label small fw-bold text-muted">Country</label>
                    <input name="country" type="text" className="form-control" value={form.country} onChange={handleChange} placeholder="India" />
                  </div>
                </div>
              </div>

              <div className="d-grid mt-4">
                <button className="btn btn-primary py-2 fw-bold text-uppercase" onClick={saveProfile}>
                  Save Profile Details
                </button>
              </div>
            </div>
          </div>

          {/* Address Book Card */}
          <div className="card border-0 shadow-sm">
            <div className="card-body p-4">
              <h6 className="text-muted fw-bold text-uppercase mb-3 small border-bottom pb-2">
                Order History Address Book
              </h6>
              <AddressList />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Profile;
