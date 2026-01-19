import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

const BackButton = ({ to, label = "Back", className = "" }) => {
    const navigate = useNavigate();

    const handleBack = (e) => {
        e.preventDefault();
        if (to) {
            navigate(to);
        } else {
            navigate(-1); // Go back one step in history
        }
    };

    return (
        <button
            onClick={handleBack}
            className={`btn btn-link text-decoration-none text-dark p-0 d-flex align-items-center mb-3 fw-bold ${className}`}
        >
            <FaArrowLeft className="me-2" />
            {label}
        </button>
    );
};

export default BackButton;
