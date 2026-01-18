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

    // Helper: Normalize address data
    const normalizeAddresses = (data) => {
        if (!Array.isArray(data)) return [];
        return data.map(addr => ({
            ...addr,
            address_line1: addr.address_line1 || addr.address || "",
            full_name: addr.full_name || addr.name || "",
            zip_code: addr.zip_code || addr.zip || "",
            phone: addr.phone || addr.phone_number || "",
            is_default: addr.is_default !== undefined ? addr.is_default : (addr.default !== undefined ? addr.default : false)
        }));
    };

    const fetchAddresses = async () => {
        try {
            setLoading(true);
            const res = await addressApi.getAddresses();

            const rawData = res.data.addresses || res.data || [];
            setAddresses(normalizeAddresses(rawData));
            setError(null);
        } catch (err) {
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
        const Swal = (await import('sweetalert2')).default;
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#000',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        });

        if (result.isConfirmed) {
            try {
                const res = await addressApi.deleteAddress(id);


                // If backend returns updated list, usage it directly
                if (res.data && res.data.addresses) {
                    setAddresses(normalizeAddresses(res.data.addresses));
                } else {
                    // Fallback/Optimistic: Filter out deleted ID locally if backend doesn't return list
                    setAddresses(prev => prev.filter(addr => addr.id !== id));
                    // FORCE RE-FETCH TO VERIFY PERSISTENCE
                    fetchAddresses();
                }

                Swal.fire({
                    title: "Deleted!",
                    text: "Your address has been deleted.",
                    icon: "success",
                    timer: 1500,
                    showConfirmButton: false
                });

            } catch (err) {
                const msg = err.response?.data?.message || "Failed to delete address";
                Swal.fire({
                    icon: 'error',
                    title: 'Restricted Action',
                    text: msg
                });
            }
        }
    };

    const handleSetDefault = async (id) => {
        try {
            const res = await addressApi.setDefaultAddress(id);
            if (res.data && res.data.addresses) {
                setAddresses(normalizeAddresses(res.data.addresses));
            } else {
                fetchAddresses();
            }
        } catch (err) {
            alert("Failed to set default address");
        }
    };

    const handleSave = async (data) => {
        try {
            // Map frontend naming (address_line1) to potentially expected backend naming (address)
            const payload = {
                ...data,
                address: data.address_line1
            };

            let res;
            if (editingAddress) {
                res = await addressApi.updateAddress(editingAddress.id, payload);
            } else {
                res = await addressApi.addAddress(payload);
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

            // Update state from response if possibilities
            if (res.data && res.data.addresses) {
                setAddresses(normalizeAddresses(res.data.addresses));
            } else {
                fetchAddresses();
            }

        } catch (err) {
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
