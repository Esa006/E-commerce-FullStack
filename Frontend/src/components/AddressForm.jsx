import React, { useState, useEffect } from "react";
import { FaCheckCircle } from "react-icons/fa";

const AddressForm = ({ initialData = {}, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        full_name: "",
        phone: "",
        address_line1: "",
        address_line2: "",
        city: "",
        state: "",
        zip_code: "",
        country: "",
        is_default: false,
    });

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (initialData && Object.keys(initialData).length > 0) {
            setFormData({
                full_name: initialData.full_name || "",
                phone: initialData.phone || "",
                address_line1: initialData.address_line1 || "",
                address_line2: initialData.address_line2 || "",
                city: initialData.city || "",
                state: initialData.state || "",
                zip_code: initialData.zip_code || "",
                country: initialData.country || "",
                is_default: initialData.is_default || false,
            });
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await onSave(formData);
        } catch (error) {
            console.error("Error saving address:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card shadow-sm border-0">
            <div className="card-header bg-white pt-3 pb-2">
                <h5 className="mb-0">{initialData.id ? "Edit Address" : "Add New Address"}</h5>
            </div>
            <div className="card-body">
                <form onSubmit={handleSubmit}>
                    <div className="row g-3">
                        <div className="col-md-6">
                            <label className="form-label">Full Name</label>
                            <input
                                type="text"
                                className="form-control"
                                name="full_name"
                                value={formData.full_name}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label">Phone Number</label>
                            <input
                                type="tel"
                                className="form-control"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="col-12">
                            <label className="form-label">Address Line 1</label>
                            <input
                                type="text"
                                className="form-control"
                                name="address_line1"
                                value={formData.address_line1}
                                onChange={handleChange}
                                required
                                placeholder="Street address, P.O. box, company name, c/o"
                            />
                        </div>
                        <div className="col-12">
                            <label className="form-label">Address Line 2 (Optional)</label>
                            <input
                                type="text"
                                className="form-control"
                                name="address_line2"
                                value={formData.address_line2}
                                onChange={handleChange}
                                placeholder="Apartment, suite, unit, building, floor, etc."
                            />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label">City</label>
                            <input
                                type="text"
                                className="form-control"
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="col-md-4">
                            <label className="form-label">State</label>
                            <input
                                type="text"
                                className="form-control"
                                name="state"
                                value={formData.state}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="col-md-2">
                            <label className="form-label">Zip Code</label>
                            <input
                                type="text"
                                className="form-control"
                                name="zip_code"
                                value={formData.zip_code}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="col-12">
                            <label className="form-label">Country</label>
                            <input
                                type="text"
                                className="form-control"
                                name="country"
                                value={formData.country}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* 
               Only show "Set as Default" checkbox if it's not already default.
               If it's already default, they can't uncheck it here (usually enforced by backend logic that one must be default).
             */}
                        {!initialData.is_default ? (
                            <div className="col-12">
                                <div className="form-check">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        name="is_default"
                                        id="gridCheck"
                                        checked={formData.is_default}
                                        onChange={handleChange}
                                    />
                                    <label className="form-check-label" htmlFor="gridCheck">
                                        Set as my default address
                                    </label>
                                </div>
                            </div>
                        ) : (
                            <div className="col-12">
                                <p className="mb-0">
                                    <span className="badge bg-primary">
                                        <FaCheckCircle className="me-1" /> Default Address
                                    </span>
                                </p>
                            </div>
                        )}

                        <div className="col-12 mt-4 d-flex justify-content-end gap-2">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={onCancel}
                                disabled={loading}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="btn btn-warning"
                                disabled={loading}
                            >
                                {loading ? "Saving..." : "Save Address"}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddressForm;
