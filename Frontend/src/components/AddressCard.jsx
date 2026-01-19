import React from "react";
import { FaEdit, FaTrash, FaCheckCircle } from "react-icons/fa";

const AddressCard = ({ address, onEdit, onDelete, onSetDefault }) => {
    return (
        <div className={`bg-white mb-3 border rounded-3 ${address.is_default ? "border-success border-2" : "border-light"}`}>
            <div className="p-3">

                {/* Header: Name + Default Badge */}
                <div className="d-flex justify-content-between align-items-center mb-2">
                    <h6 className="mb-0 fw-bold text-dark">{address.full_name || "No Name"}</h6>
                    {address.is_default && (
                        <span className="badge bg-success-subtle text-success px-2 py-1">
                            <FaCheckCircle className="me-1" size={10} /> Default
                        </span>
                    )}
                </div>

                {/* Address Details */}
                <p className="mb-1 text-secondary small">{address.phone}</p>
                <p className="mb-0 text-dark small lh-base">
                    {address.address_line1}
                    {address.address_line2 && <>, {address.address_line2}</>}
                    <br />
                    {address.city}, {address.state} - {address.zip_code}
                    <br />
                    <span className="text-uppercase text-secondary small">{address.country}</span>
                </p>

                {/* Actions Row */}
                <div className="d-flex align-items-center gap-3 mt-3 pt-2 border-top">
                    <button
                        className="btn btn-link text-primary p-0 text-decoration-none small"
                        onClick={() => onEdit(address)}
                    >
                        <FaEdit className="me-1" size={12} /> Edit
                    </button>

                    <span className="text-muted">|</span>

                    <button
                        className="btn btn-link text-danger p-0 text-decoration-none small"
                        onClick={() => onDelete(address.id)}
                    >
                        <FaTrash className="me-1" size={12} /> Remove
                    </button>

                    {!address.is_default && (
                        <>
                            <span className="text-muted">|</span>
                            <button
                                className="btn btn-link text-secondary p-0 text-decoration-none small"
                                onClick={() => onSetDefault(address.id)}
                            >
                                Set as default
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AddressCard;
