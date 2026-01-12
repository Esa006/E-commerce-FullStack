import React, { useState, useEffect } from "react";
import addressApi from "../api/address";
import AddressCard from "./AddressCard";
import AddressForm from "./AddressForm";
import { FaPlus } from "react-icons/fa";

const AddressList = () => {
    const [addresses, setAddresses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // State for form visibility and mode
    const [showForm, setShowForm] = useState(false);
    const [editingAddress, setEditingAddress] = useState(null);

    useEffect(() => {
        fetchAddresses();
    }, []);

    const fetchAddresses = async () => {
        try {
            setLoading(true);
            const res = await addressApi.getAddresses();
            console.log("Fetched addresses raw response:", res.data);

            let fetchedData = res.data.addresses || res.data || [];
            if (!Array.isArray(fetchedData)) fetchedData = [];

            // Normalize data to ensure consistent field names (address vs address_line1)
            const normalizedAddresses = fetchedData.map(addr => ({
                ...addr,
                address_line1: addr.address_line1 || addr.address || "",
                full_name: addr.full_name || addr.name || "",
                zip_code: addr.zip_code || addr.zip || "",
                phone: addr.phone || addr.phone_number || "",
                is_default: addr.is_default !== undefined ? addr.is_default : (addr.default !== undefined ? addr.default : false)
            }));

            console.log("Normalized addresses:", normalizedAddresses);
            setAddresses(normalizedAddresses);
            setError(null);
        } catch (err) {
            console.error("Failed to fetch addresses", err);
            setError("Failed to load addresses.");
        } finally {
            setLoading(false);
        }
    };

    const handleAddClick = () => {
        setEditingAddress(null);
        setShowForm(true);
    };

    const handleEditClick = (address) => {
        setEditingAddress(address);
        setShowForm(true);
    };

    const handleDeleteClick = async (id) => {
        if (window.confirm("Are you sure you want to delete this address?")) {
            try {
                await addressApi.deleteAddress(id);
                fetchAddresses(); // Refresh list
            } catch (err) {
                alert("Failed to delete address");
            }
        }
    };

    const handleSetDefault = async (id) => {
        try {
            await addressApi.setDefaultAddress(id);
            fetchAddresses(); // Refresh to update badges
        } catch (err) {
            alert("Failed to set default address");
        }
    };

    const handleSave = async (data) => {
        try {
            // Map frontend naming (address_line1) to potentially expected backend naming (address)
            const payload = {
                ...data,
                address: data.address_line1 // Ensure backend validation for 'address' is satisfied
            };

            if (editingAddress) {
                await addressApi.updateAddress(editingAddress.id, payload);
            } else {
                await addressApi.addAddress(payload);
            }

            // Show success message
            const Swal = (await import('sweetalert2')).default;
            await Swal.fire({
                icon: 'success',
                title: editingAddress ? 'Address Updated!' : 'Address Saved!',
                text: 'Your address has been saved successfully.',
                timer: 1500,
                showConfirmButton: false
            });

            setShowForm(false);
            fetchAddresses();
        } catch (err) {
            console.error(err);
            const msg = err.response?.data?.message || "Failed to save address";

            // Show error message
            const Swal = (await import('sweetalert2')).default;
            Swal.fire({
                icon: 'error',
                title: 'Oops!',
                text: msg
            });
        }
    };

    if (loading && !showForm && addresses.length === 0) {
        return <div className="text-center py-4"><div className="spinner-border text-primary" role="status"></div></div>;
    }

    return (
        <div>
            {error && <div className="alert alert-danger">{error}</div>}

            {showForm ? (
                <AddressForm
                    initialData={editingAddress || {}}
                    onSave={handleSave}
                    onCancel={() => setShowForm(false)}
                />
            ) : (
                <>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h5 className="mb-0">My Addresses</h5>
                        <button className="btn btn-primary btn-sm" onClick={handleAddClick}>
                            <FaPlus className="me-1" /> Add New
                        </button>
                    </div>

                    {addresses.length === 0 ? (
                        <div className="text-center text-muted py-5 border rounded bg-light">
                            <p className="mb-0">No addresses found. Add one to get started!</p>
                        </div>
                    ) : (
                        <div className="row">
                            {addresses.map((addr) => (
                                <div key={addr.id} className="col-md-6">
                                    <AddressCard
                                        address={addr}
                                        onEdit={handleEditClick}
                                        onDelete={handleDeleteClick}
                                        onSetDefault={handleSetDefault}
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default AddressList;
