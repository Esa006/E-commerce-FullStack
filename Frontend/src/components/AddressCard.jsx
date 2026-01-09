import React from "react";
import { FaEdit, FaTrash, FaCheckCircle, FaRegCircle } from "react-icons/fa";

const AddressCard = ({ address, onEdit, onDelete, onSetDefault }) => {
    return (
        <div className={`card mb-3 shadow-sm ${address.is_default ? "border-primary" : ""}`}>
            <div className="card-body">
                <div className="d-flex justify-content-between align-items-start">
                    <div>
                        <h6 className="card-title fw-bold mb-1">{address.full_name || "No Name"}</h6>
                        <p className="card-text mb-1 text-muted small">{address.phone}</p>
                        <p className="card-text mb-0">
                            {address.address_line1} {address.address_line2 && <>, {address.address_line2}</>}
                        </p>
                        <p className="card-text mb-2">
                            {address.city}, {address.state} {address.zip_code}
                        </p>
                        <p className="card-text small text-uppercase text-secondary">{address.country}</p>
                    </div>
                    <div className="text-end">
                        {address.is_default ? (
                            <p className="mb-0">
                                <span className="badge bg-primary mb-2">
                                    <FaCheckCircle className="me-1" /> Default
                                </span>
                            </p>
                        ) : (
                            <button
                                className="btn btn-outline-secondary btn-sm mb-2 d-block w-100"
                                onClick={() => onSetDefault(address.id)}
                                title="Set as Default"
                            >
                                Set Default
                            </button>
                        )}
                    </div>
                </div>

                <hr className="my-2" />

                <div className="d-flex justify-content-end gap-2">
                    <button
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => onEdit(address)}
                    >
                        <FaEdit className="me-1" /> Edit
                    </button>
                    <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => onDelete(address.id)}
                    >
                        <FaTrash className="me-1" /> Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddressCard;
