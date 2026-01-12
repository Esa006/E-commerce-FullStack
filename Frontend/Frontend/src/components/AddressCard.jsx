import React from "react";
import { FaEdit, FaTrash, FaCheckCircle } from "react-icons/fa";

const AddressCard = ({ address, onEdit, onDelete, onSetDefault }) => {
    return (
        <div className={`card mb-3 border ${address.is_default ? "border-success border-2" : "border-light"}`}
            style={{ borderRadius: '8px', transition: 'box-shadow 0.2s' }}>
            <div className="card-body p-3">

                {/* Header: Name + Default Badge */}
                <div className="d-flex justify-content-between align-items-center mb-2">
                    <h6 className="mb-0 fw-bold text-dark">{address.full_name || "No Name"}</h6>
                    {address.is_default && (
                        <span className="badge bg-success-subtle text-success px-2 py-1" style={{ fontSize: '11px' }}>
                            <FaCheckCircle className="me-1" size={10} /> Default
                        </span>
                    )}
                </div>

                {/* Address Details */}
                <p className="mb-1 text-secondary small">{address.phone}</p>
                <p className="mb-0 text-dark" style={{ fontSize: '14px', lineHeight: '1.5' }}>
                    {address.address_line1}
                    {address.address_line2 && <>, {address.address_line2}</>}
                    <br />
                    {address.city}, {address.state} - {address.zip_code}
                    <br />
                    <span className="text-uppercase text-secondary" style={{ fontSize: '12px' }}>{address.country}</span>
                </p>

                {/* Actions Row */}
                <div className="d-flex align-items-center gap-3 mt-3 pt-2 border-top">
                    <button
                        className="btn btn-link text-primary p-0 text-decoration-none"
                        onClick={() => onEdit(address)}
                        style={{ fontSize: '13px' }}
                    >
                        <FaEdit className="me-1" size={12} /> Edit
                    </button>

                    <span className="text-muted">|</span>

                    <button
                        className="btn btn-link text-danger p-0 text-decoration-none"
                        onClick={() => onDelete(address.id)}
                        style={{ fontSize: '13px' }}
                    >
                        <FaTrash className="me-1" size={12} /> Remove
                    </button>

                    {!address.is_default && (
                        <>
                            <span className="text-muted">|</span>
                            <button
                                className="btn btn-link text-secondary p-0 text-decoration-none"
                                onClick={() => onSetDefault(address.id)}
                                style={{ fontSize: '13px' }}
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
