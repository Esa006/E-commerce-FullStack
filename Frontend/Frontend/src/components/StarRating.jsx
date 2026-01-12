import React, { useState } from 'react';

const StarRating = ({ rating }) => {
    // varied check to handle string/number inputs or undefined
    const numericRating = parseFloat(rating) || 0;

    // Generate a consistent random review count for demo purposes
    // In a real app, this would be passed as a prop
    const [reviewCount] = useState(() => Math.floor(Math.random() * (500 - 25 + 1)) + 25);

    // Create an array of 5 elements to map over
    const stars = Array.from({ length: 5 }, (_, index) => {
        const starValue = index + 1;

        if (numericRating >= starValue) {
            return <i key={index} className="bi bi-star-fill text-warning me-1"></i>;
        } else if (numericRating >= starValue - 0.5) {
            return <i key={index} className="bi bi-star-half text-warning me-1"></i>;
        } else {
            return <i key={index} className="bi bi-star text-secondary me-1"></i>;
        }
    });

    return (
        <div className="d-flex align-items-center small">
            {stars}
            <span className="ms-2 text-muted fw-semibold">
                {numericRating.toFixed(1)} <span className="fw-normal text-secondary">({reviewCount} reviews)</span>
            </span>
        </div>
    );
};

export default StarRating;
