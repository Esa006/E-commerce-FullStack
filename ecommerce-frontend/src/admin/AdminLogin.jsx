import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axios.post("http://127.0.0.1:8000/api/admin/login", {
        email,
        password,
      });

      // Save token and redirect
      localStorage.setItem("admin_token", response.data.token);
      navigate("/admin/dashboard");

    } catch (err) {
      if (err.response && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("Invalid credentials. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    // Bootstrap Container: Full height (vh-100), Flex centered, Light background
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      
      {/* Login Card */}
      <div className="card shadow-lg p-4" style={{ width: "100%", maxWidth: "400px" }}>
        <div className="card-body">
          <h3 className="card-title text-center mb-4 fw-bold text-primary">Admin Login</h3>

          {/* Bootstrap Alert for Errors */}
          {error && (
            <div className="alert alert-danger text-center" role="alert">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Email Input */}
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email Address</label>
              <input
                type="email"
                className="form-control"
                id="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Password Input */}
            <div className="mb-4">
              <label htmlFor="password" className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                id="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {/* Submit Button */}
            <div className="d-grid">
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Logging in...
                  </>
                ) : (
                  "Login"
                )}
              </button>
            </div>
          </form>
        </div>
        
        <div className="card-footer text-center bg-white border-0 mt-3">
          <small className="text-muted">Admin Panel Access Only</small>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;