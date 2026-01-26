
import React from "react";
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import AuthApi from "../api/auth";
import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";



export default function Login() {
    const navigate = useNavigate();
    const { syncGuestCart } = useContext(CartContext);
    const { login } = useContext(AuthContext);

    // State
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Handle Submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await AuthApi.customerLogin(email, password);
            if (response.status === 200) {
                // 🟢 CLEAR STALE ADMIN TOKEN: Prevents conflicts in axiosClient
                // Handled inside login context now, but keeping for directness
                localStorage.removeItem('admin_token');

                // Use centralized login function
                login(response.data.token, response.data.user);

                // 🟢 SYNC CART: Merge guest items into backend
                await syncGuestCart();

                Swal.fire({
                    icon: 'success',
                    title: 'Welcome Back!',
                    text: 'Login Successful',
                    timer: 1500,
                    showConfirmButton: false
                });

                navigate('/');
            }
        } catch (err) {
            if (err.response && err.response.status === 401) {
                setError("Invalid Email or Password");
            } else {
                setError("Something went wrong. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container d-flex justify-content-center align-items-center min-vh-100 ">
            <div className="card shadow-lg border-0 login-card">
                <div className="card-body p-4">
                    <h3 className="text-center fw-bold mb-4 text-primary">Customer Login</h3>

                    {/* Error Message */}
                    {error && (

                        <p className="alert alert-danger text-center" role="alert">{error}</p>

                    )}

                    <form onSubmit={handleSubmit}>
                        {/* Email */}
                        <div className="mb-3">
                            <label className="form-label text-muted">Email Address</label>
                            <input
                                type="email"
                                className="form-control"
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        {/* Password */}
                        <div className="mb-4">
                            <label className="form-label text-muted">Password</label>
                            <input
                                type="password"
                                className="form-control"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <div className="text-end mt-2">
                                <Link to="/forgot-password" size="sm" className="text-muted small text-decoration-none">Forgot Password?</Link>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="d-flex flex-column">
                            <button type="submit" className="btn btn-custom-primary py-2 fw-bold" disabled={loading}>
                                {loading ? (
                                    <span><span className="spinner-border spinner-border-sm me-2"></span>Logging in...</span>
                                ) : (
                                    'Login'
                                )}
                            </button>
                        </div>
                    </form>

                    <div className="text-center mt-4">
                        <p className="text-muted">Don't have an account? <Link to="/register" className="text-primary text-decoration-none">Register here</Link></p>
                    </div>
                </div>
            </div>
        </div>
    );
}
