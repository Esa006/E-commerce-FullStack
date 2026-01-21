import React, { useState } from 'react';

const StarRating = ({ rating, reviews, onRatingChange }) => {
    // varied check to handle string/number inputs or undefined
    const numericRating = parseFloat(rating) || 0;
    const reviewCount = reviews || 0;

    // Create an array of 5 elements to map over
    const stars = Array.from({ length: 5 }, (_, index) => {
        const starValue = index + 1;
        const isInteractive = !!onRatingChange;

        // Determine icon class
        let iconClass = "bi bi-star text-secondary me-1";
        if (numericRating >= starValue) {
            iconClass = "bi bi-star-fill text-warning me-1";
        } else if (numericRating >= starValue - 0.5) {
            iconClass = "bi bi-star-half text-warning me-1";
        }

        return (
            <i
                key={index}
                className={`${iconClass}`}
                onClick={() => isInteractive && onRatingChange(starValue)}
                style={{ cursor: isInteractive ? 'pointer' : 'default' }}
            ></i>
        );
    });

    return (
        <div className="d-flex align-items-center small">
            <p className="mb-0">
                {stars}
                {!onRatingChange && (
                    <span className="ms-2 text-muted fw-semibold">
                        {numericRating.toFixed(1)} <span className="fw-normal text-secondary">({reviewCount} reviews)</span>
                    </span>
                )}
            </p>
        </div>
    );
};

export default StarRating;
