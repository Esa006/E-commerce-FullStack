import { useState, useEffect } from "react";
import api from "../api/axiosClient";
import AddressList from "../components/AddressList";

const Profile = () => {
  const [form, setForm] = useState({
    name: "",
    phone: "",
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get("/profile");
      const user = res.data.user || {};
      setForm({
        name: user.name || "",
        phone: user.phone || "",
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const saveProfile = async () => {
    try {
      await api.put("/profile", form);
      alert("Profile updated successfully");
    } catch (err) {
      console.error(err);
      alert("Failed to update profile");
    }
  };

  if (loading) return <div className="text-center mt-5"><div className="spinner-border" role="status"></div></div>;

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card shadow-sm border-0 mb-4">
            <div className="card-header bg-white border-bottom-0 pt-4 pb-0">
              <h2 className="mb-0">Your Profile</h2>
            </div>
            <div className="card-body p-4">

              <h5 className="text-muted mb-3 border-bottom pb-2">Personal Information</h5>
              <div className="row mb-3">
                <div className="col-md-6">
                  <label className="form-label fw-bold">Full Name</label>
                  <input
                    name="name"
                    type="text"
                    className="form-control"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-bold">Phone Number</label>
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

              <div className="d-grid gap-2 mt-4">
                <button className="btn btn-warning btn-lg shadow-sm" onClick={saveProfile}>
                  Save Personal Info
                </button>
              </div>

            </div>
          </div>

          {/* Address Book Section - Separated for clarity */}
          <div className="card shadow-sm border-0">
            <div className="card-body p-4">
              <h5 className="text-muted mb-3 border-bottom pb-2">Address Book</h5>
              <AddressList />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Profile;
