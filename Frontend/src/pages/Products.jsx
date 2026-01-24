import React, { useState, useEffect } from 'react';
import ProductApi from '../api/Products';

import ProductCard from '../components/ProductCard';
import { useSearchParams } from 'react-router-dom';

const Products = () => {
  const [products, setProducts] = useState([]); // Products from API
  const [loading, setLoading] = useState(true);
  const [showFilter, setShowFilter] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  // Filter States
  const [category, setCategory] = useState(() => {
    const cat = searchParams.get('category');
    return cat ? [cat] : [];
  });
  const [categories, setCategories] = useState([]);
  const [brand, setBrand] = useState([]);
  const [brands, setBrands] = useState([]);
  const [sortType, setSortType] = useState('relevant');
  const search = searchParams.get('search') || '';

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // 1. Initial Metadata Fetch (Categories & Brands)
  useEffect(() => {
    fetchCategories();
    fetchBrands();
  }, []);

  // 2. Fetch Products whenever filters/page/search change
  useEffect(() => {
    fetchProducts();
  }, [category, brand, search, sortType, currentPage]);

  // Sync URL Params (Back/Forward Navigation Support)
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    if (categoryParam) {
      // Only update if different to avoid infinite loops if complex
      if (!category.includes(categoryParam)) setCategory([categoryParam]);
    } else {
      if (category.length > 0 && !searchParams.has('category_cleared')) {
        // Optional: Logic to clear category if URL param Removed.
        // For now, simpler to leave unless explicit navigation.
      }
    }

    const pageParam = parseInt(searchParams.get('page')) || 1;
    if (pageParam !== currentPage) setCurrentPage(pageParam);
  }, [searchParams]);

  const fetchCategories = async () => {
    let categories = await ProductApi.getCategories();
    if (!categories || categories.length === 0) {
      categories = ['Men', 'Women', 'Kids'];
    }
    setCategories(categories);
  };

  const fetchBrands = async () => {
    const brands = await ProductApi.getBrands();
    setBrands(brands);
  };

  // --- 🟢 SERVER-SIDE SEARCH & FILTER ---
  const fetchProducts = async () => {
    try {
      setLoading(true);

      const params = {
        page: currentPage,
        search: search,
        sort: sortType,
        category: category.join(','), // Server expects comma-separated
        brand: brand.join(','),       // Server expects comma-separated
        per_page: 12                  // Request 12 per page
      };

      // Call API
      const { items, pagination } = await ProductApi.getProducts(params);

      setProducts(items);
      setTotalPages(pagination.last_page);
      setTotalItems(pagination.total);

    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  // 3. Toggle Category Filter
  const toggleCategory = (e) => {
    const value = e.target.value;
    setCategory(prev => {
      // Reset page to 1 on filter change
      if (currentPage !== 1) setCurrentPage(1);

      const newCats = prev.includes(value) ? prev.filter(c => c !== value) : [...prev, value];

      // Update URL to reflect primary category if single, or remove if empty
      // This is a UI nicety, not core logic
      return newCats;
    });
  };

  // Toggle Brand Filter
  const toggleBrand = (e) => {
    const value = e.target.value;
    setBrand(prev => {
      if (currentPage !== 1) setCurrentPage(1);
      return prev.includes(value) ? prev.filter(b => b !== value) : [...prev, value];
    });
  };

  // Update URL pagination helper
  const handlePageChange = (page) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', page.toString());
    setSearchParams(newParams);
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  return (
    <div className='container-fluid   border-top'>


      {/* Title */}
      <div className='py-4 text-center'>
        <h2 className='fs-2 fw-normal text-uppercase'>
          <span className='text-muted fw-bold'>
            {category.length === 1 ? category[0].toUpperCase() : 'ALL'}
          </span> Collection
        </h2>
        <p className='w-lg-75 mx-auto text-muted'>
          Browse our latest collection of premium products.
        </p>
      </div>

      <div className='row'>
        {/* Left Sidebar - Filters */}
        <div className='col-lg-2'>

          {/* Mobile Filter Toggle */}
          <div className='d-flex align-items-center justify-content-between mb-3 d-lg-none'>
            <p className='fs-5 fw-bold my-2'>Fliter</p>
            <button
              className='btn btn-outline-dark btn-sm'
              onClick={() => setShowFilter(!showFilter)}
            >
              Filters <i className={`bi bi-chevron-${showFilter ? 'up' : 'down'}`}></i>
            </button>
          </div>

          {/* Filter Container */}
          <div className={`filter-box ${showFilter ? '' : 'd-none d-lg-block'}`}>
            {/* Category Filter */}
            <div className='border p-3 mt-2 rounded bg-white'>
              <h6 className='fw-bold mb-3 small text-uppercase spacing-wide'>Categories</h6>
              <div className='d-flex flex-column gap-2 text-muted small'>
                {(categories || []).map((cat) => (
                  <div key={cat} className='form-check'>
                    <input
                      className='form-check-input'
                      type='checkbox'
                      value={cat}
                      onChange={toggleCategory}
                      checked={category.includes(cat)}
                      id={`cat-${cat}`}
                    />
                    <label className='form-check-label' htmlFor={`cat-${cat}`}>{cat}</label>
                  </div>
                ))}
              </div>
            </div>

            {/* Brand Filter */}
            <div className='border p-3 mt-3 rounded bg-white'>
              <h6 className='fw-bold mb-3 small text-uppercase spacing-wide'>Brands</h6>
              <div className='d-flex flex-column gap-2 text-muted small'>
                {(brands || []).map((item) => (
                  <div key={item} className='form-check'>
                    <input
                      className='form-check-input'
                      type='checkbox'
                      value={item}
                      onChange={toggleBrand}
                      id={`brand-${item}`}
                    />
                    <label className='form-check-label' htmlFor={`brand-${item}`}>{item}</label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>





        <div className='col-lg-10'>

          {/* Header: Sort & Meta */}
          <div className='d-flex justify-content-between align-items-center mb-4'>
            <p className='mb-0 small fw-bold text-muted'>
              {loading ? 'Searching...' : `Showing ${products.length} of ${totalItems} products`}
            </p>

            <select
              className='form-select form-select-sm w-auto border-secondary text-secondary'
              onChange={(e) => setSortType(e.target.value)}
              value={sortType}
            >
              <option value="relevant">Sort by: Relevant</option>
              <option value="low-high">Sort by: Low to High</option>
              <option value="high-low">Sort by: High to Low</option>
            </select>
          </div>

          <div className='row g-4'>
            {loading ? (
              <div className='col-12 text-center py-5 min-h-600'>
                <div className="spinner-border text-secondary" role="status"></div>
                <p className="mt-2 text-muted">Loading products...</p>
              </div>
            ) : products.length > 0 ? (
              products.map((item) => (
                <div key={item.id} className="col-6 col-sm-6 col-md-4 col-lg-3 col-xl-3">
                  <ProductCard product={item} />
                </div>
              ))
            ) : (
              <div className='col-12 text-center py-5 text-muted'>
                <h4>No products found.</h4>
                <p>Try adjusting your search or filters.</p>
              </div>
            )}
          </div>

          {/* Pagination Controls */}
          {!loading && products.length > 0 && totalPages > 1 && (
            <div className='d-flex justify-content-center mt-5'>
              <nav aria-label="Page navigation">
                <ul className="pagination">
                  <li className={`page-item ${currentPage === 1 || loading ? 'disabled' : ''}`}>
                    <button
                      className="page-link border-secondary rounded-0 text-secondary"
                      onClick={() => !loading && handlePageChange(Math.max(currentPage - 1, 1))}
                      aria-label="Previous"
                      disabled={loading}
                    >
                      <span aria-hidden="true">&laquo;</span>
                    </button>
                  </li>

                  {[...Array(totalPages)].map((_, i) => (
                    <li key={i + 1} className="page-item">
                      <button
                        className={`page-link border-secondary rounded-0 ${currentPage === i + 1 ? 'active bg-secondary text-white' : 'text-secondary'}`}
                        onClick={() => !loading && handlePageChange(i + 1)}
                        disabled={loading}
                      >
                        {i + 1}
                      </button>
                    </li>
                  ))}

                  <li className={`page-item ${currentPage === totalPages || loading ? 'disabled' : ''}`}>
                    <button
                      className="page-link border-secondary rounded-0 text-secondary"
                      onClick={() => !loading && handlePageChange(Math.min(currentPage + 1, totalPages))}
                      aria-label="Next"
                      disabled={loading}
                    >
                      <span aria-hidden="true">&raquo;</span>
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          )}
        </div>
      </div>
    </div>

  );
};

export default Products;