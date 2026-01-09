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
            // Assuming API returns { addresses: [...] } or just [...]
            // Adjust based on your actual API response structure
            setAddresses(res.data.addresses || res.data || []);
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
            if (editingAddress) {
                await addressApi.updateAddress(editingAddress.id, data);
            } else {
                await addressApi.addAddress(data);
            }
            setShowForm(false);
            fetchAddresses();
        } catch (err) {
            console.error(err);
            alert("Failed to save address");
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
