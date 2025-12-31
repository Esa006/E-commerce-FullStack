import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'; // Professional Alerts
import AuthApi from "../api/auth";// Import the service we made above

export default function Register() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        role: 'customer'
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        
        // UX Standard: Clear the error for this field as soon as user types
        if (errors[name]) {
            setErrors({ ...errors, [name]: null });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        try {
            await AuthApi.register(formData);

            // Success: Show professional popup
            Swal.fire({
                icon: 'success',
                title: 'Registration Successful',
                text: 'Your account has been created! Please login.',
                confirmButtonColor: '#0d6efd'
            }).then(() => {
                navigate('/login');
            });

        } catch (error) {
            if (error.response && error.response.status === 422) {
                // Validation Error: Update state to show red text below inputs
                setErrors(error.response.data.errors);
            } else {
                // Server Error: Show generic popup
                Swal.fire({
                    icon: 'error',
                    title: 'Registration Failed',
                    text: 'Something went wrong. Please try again later.',
                });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container d-flex justify-content-center align-items-center min-vh-100 bg-light">
            <div className="card shadow-lg border-0" style={{ maxWidth: '500px', width: '100%' }}>
                <div className="card-body p-5">
                    <h3 className="text-center fw-bold mb-4 text-primary">Create Account</h3>
                    
                    <form onSubmit={handleSubmit}>
                        {/* Name */}
                        <div className="mb-3">
                            <label className="form-label text-muted">Full Name</label>
                            <input
                                type="text"
                                name="name"
                                className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="John Doe"
                            />
                            {errors.name && <div className="invalid-feedback">{errors.name[0]}</div>}
                        </div>

                        {/* Email */}
                        <div className="mb-3">
                            <label className="form-label text-muted">Email Address</label>
                            <input
                                type="email"
                                name="email"
                                className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="name@company.com"
                            />
                            {errors.email && <div className="invalid-feedback">{errors.email[0]}</div>}
                        </div>

                        {/* Password */}
                        <div className="mb-3">
                            <label className="form-label text-muted">Password</label>
                            <input
                                type="password"
                                name="password"
                                className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="••••••••"
                            />
                            {errors.password && <div className="invalid-feedback">{errors.password[0]}</div>}
                        </div>

                        {/* Confirm Password */}
                        <div className="mb-4">
                            <label className="form-label text-muted">Confirm Password</label>
                            <input
                                type="password"
                                name="password_confirmation"
                                className="form-control"
                                value={formData.password_confirmation}
                                onChange={handleChange}
                                placeholder="••••••••"
                            />
                        </div>

                        {/* Submit Button */}
                        <div className="d-grid">
                            <button type="submit" className="btn btn-primary py-2 fw-bold" disabled={loading}>
                                {loading ? (
                                    <span><span className="spinner-border spinner-border-sm me-2"></span>Processing...</span>
                                ) : (
                                    'Register Now'
                                )}
                            </button>
                        </div>

                        <div className="text-center mt-3">
                            <small className="text-muted">Already have an account? <Link to="/login" className="text-primary text-decoration-none">Login here</Link></small>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}