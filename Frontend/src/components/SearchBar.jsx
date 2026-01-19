import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';

/**
 * Senior-grade Search Bar Component
 * - Manages URL 'search' parameter as the single source of truth.
 * - Uses debouncing (500ms) to prevent API spam.
 * - Redirects to /products if searched from a different page.
 */
const SearchBar = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const location = useLocation();

    const [text, setText] = useState(searchParams.get('search') || '');

    // 1. Sync local text with URL changes (Back button, external links)
    useEffect(() => {
        setText(searchParams.get('search') || '');
    }, [searchParams]);

    // 2. Debounced URL Update
    useEffect(() => {
        // Skip initial call if empty
        if (!text && !searchParams.get('search')) return;

        const timer = setTimeout(() => {
            if (location.pathname !== '/products') {
                // If on another page, navigate to collection with search term
                if (text.trim()) {
                    navigate(`/products?search=${encodeURIComponent(text.trim())}`);
                }
            } else {
                // On collection page, update search params in place
                const newParams = new URLSearchParams(searchParams);
                if (text.trim()) {
                    newParams.set('search', text.trim());
                    // Reset page to 1 on new search
                    newParams.set('page', '1');
                } else {
                    newParams.delete('search');
                }
                setSearchParams(newParams);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [text]);

    return (
        <div className="search-bar-container mx-2 d-none d-lg-block">
            <div className="position-relative">
                <input
                    type="text"
                    className="form-control form-control-sm rounded-pill ps-4 pe-5 border-secondary-subtle bg-light"
                    placeholder="Search products..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    style={{
                        width: '240px',
                        fontSize: '0.85rem',
                        transition: 'all 0.3s ease'
                    }}
                />
                <i className="bi bi-search position-absolute start-0 top-50 translate-middle-y ms-2 text-muted small"></i>

                {text && (
                    <button
                        className="btn btn-sm p-0 border-0 position-absolute end-0 top-50 translate-middle-y me-2 text-muted"
                        onClick={() => setText('')}
                    >
                        <i className="bi bi-x-circle-fill small"></i>
                    </button>
                )}
            </div>
        </div>
    );
};

export default SearchBar;
