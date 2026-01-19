import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import Swal from 'sweetalert2';

const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const email = searchParams.get('email');
    const token = searchParams.get('token');

    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== passwordConfirmation) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Passwords do not match!',
            });
            return;
        }

        setLoading(true);

        try {
            const response = await axiosClient.post('/reset-password', {
                email,
                token,
                password,
                password_confirmation: passwordConfirmation,
            });

            Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: response.data.message,
            });
            navigate('/login');
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
        <div className="container-fluid py-5" style={{
            minHeight: '80vh',
            background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
            display: 'flex',
            alignItems: 'center'
        }}>
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-12 col-md-8 col-lg-5">
                        <div className="card border-0 shadow-lg overflow-hidden" style={{ borderRadius: '15px' }}>
                            <div className="card-body p-4 p-md-5 bg-white">
                                <div className="text-center mb-5">
                                    <div className="mb-3 d-inline-block p-3 rounded-circle bg-light text-dark">
                                        <i className="bi bi-key-fill fs-1"></i>
                                    </div>
                                    <h2 className="fw-bold text-uppercase tracking-wider mb-2" style={{ letterSpacing: '2px' }}>Reset Password</h2>
                                    <p className="text-muted small">Please enter your new password to secure your account.</p>
                                </div>

                                <form onSubmit={handleSubmit} className="d-flex flex-column gap-4">
                                    <div className="form-floating mb-1">
                                        <input
                                            type="password"
                                            className="form-control border-0 bg-light rounded-3 py-3"
                                            id="passwordInput"
                                            placeholder="New Password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                            style={{ height: '60px', paddingLeft: '1.5rem' }}
                                        />
                                        <label htmlFor="passwordInput" className="text-muted small ps-4">New Password</label>
                                    </div>

                                    <div className="form-floating mb-3">
                                        <input
                                            type="password"
                                            className="form-control border-0 bg-light rounded-3 py-3"
                                            id="confirmPasswordInput"
                                            placeholder="Confirm Password"
                                            value={passwordConfirmation}
                                            onChange={(e) => setPasswordConfirmation(e.target.value)}
                                            required
                                            style={{ height: '60px', paddingLeft: '1.5rem' }}
                                        />
                                        <label htmlFor="confirmPasswordInput" className="text-muted small ps-4">Confirm New Password</label>
                                    </div>

                                    <button
                                        type="submit"
                                        className="btn btn-dark w-100 py-3 rounded-3 text-uppercase fw-bold shadow-sm hover-lift transition-all"
                                        disabled={loading}
                                        style={{ letterSpacing: '1px', fontSize: '0.9rem' }}
                                    >
                                        {loading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                Resetting...
                                            </>
                                        ) : 'Update Password'}
                                    </button>
                                </form>
                            </div>
                            <div className="card-footer bg-light border-0 py-3 text-center">
                                <span className="text-muted x-small">Finalizing Security Update</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
