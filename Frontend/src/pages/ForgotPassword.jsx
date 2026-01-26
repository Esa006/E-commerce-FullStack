import React, { useState } from 'react';
import axiosClient from '../api/axiosClient';
import Swal from 'sweetalert2';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await axiosClient.post('/forgot-password', { email });
            Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: response.data.message,
            });
            setEmail('');
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: error.response?.data?.message || 'Something went wrong!',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container-fluid py-5 auth-page-wrapper">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-12 col-md-8 col-lg-5">
                        <div className="card border-0 shadow-lg overflow-hidden auth-card">
                            <div className="card-body p-4 p-md-5 bg-white">
                                <div className="text-center mb-5">
                                    <div className="mb-3 d-inline-block p-3 rounded-circle bg-light text-dark">
                                        <i className="bi bi-shield-lock-fill fs-1"></i>
                                    </div>
                                    <h2 className="fw-bold text-uppercase tracking-wider mb-2 letter-spacing-2">Forgot Password?</h2>
                                    <p className="text-muted small px-3">
                                        No worries! Enter your email and we'll send you instructions to reset your password.
                                    </p>
                                </div>

                                <form onSubmit={handleSubmit} className="d-flex flex-column gap-4">
                                    <div className="form-floating mb-3">
                                        <input
                                            type="email"
                                            className="form-control border-0 bg-light rounded-3 py-3 input-h-60 ps-1-5rem"
                                        />
                                        <label htmlFor="emailInput" className="text-muted small ps-4">Email Address</label>
                                    </div>

                                    <button
                                        type="submit"
                                        className="btn btn-custom-primary w-100 py-3 rounded-3 text-uppercase fw-bold shadow-sm hover-lift transition-all text-spacing-1 fs-09rem"
                                    >
                                        {loading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                Sending...
                                            </>
                                        ) : 'Send Reset Link'}
                                    </button>

                                    <div className="text-center mt-2">
                                        <a href="/login" className="text-decoration-none text-muted small hover-dark transition-all d-inline-flex align-items-center gap-2">
                                            <i className="bi bi-arrow-left"></i> Back to Login
                                        </a>
                                    </div>
                                </form>
                            </div>
                            <div className="card-footer bg-light border-0 py-3 text-center">
                                <span className="text-muted x-small">Secure Authentication System</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
