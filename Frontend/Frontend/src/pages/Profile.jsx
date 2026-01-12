import React, { useState, useEffect } from "react";
import AuthApi from "../api/auth";
import AddressList from "../components/AddressList";
import BackButton from "../components/BackButton";
import Swal from "sweetalert2";

const Profile = () => {
  const [form, setForm] = useState({
    name: "",
    phone: "",
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
        text: "Your personal information has been saved.",
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

              <div className="mb-4">
                <h6 className="text-muted fw-semibold mb-3">Personal Information</h6>

                <div className="row g-3">
                  <div className="col-12 col-md-6">
                    <label className="form-label fw-semibold">Full Name</label>
                    <input
                      name="name"
                      type="text"
                      className="form-control"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                    />
                  </div>

                  <div className="col-12 col-md-6">
                    <label className="form-label fw-semibold">Phone Number</label>
                    <input
                      name="phone"
                      type="tel"
                      className="form-control"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="+1 234 567 890"
                    />
                  </div>
                </div>

                <div className="d-grid d-md-flex justify-content-md-end mt-4">
                  <button
                    className="btn btn-warning px-4 fw-semibold"
                    onClick={saveProfile}
                  >
                    Save Personal Info
                  </button>
                </div>
              </div>

            </div>
          </div>

          {/* Address Book */}
          <div className="card border-0 shadow-sm">
            <div className="card-body p-4">
              <h6 className="text-muted fw-semibold mb-3 border-bottom pb-2">
                Address Book
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
