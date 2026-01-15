import React, { useState, useEffect } from 'react';
import ProductApi from '../api/Products';

import ProductCard from '../components/ProductCard';
import { useSearchParams } from 'react-router-dom';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilter, setShowFilter] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  // Filter States
  const [category, setCategory] = useState([]);
  const [categories, setCategories] = useState([]); // Dynamic list
  const [brand, setBrand] = useState([]);
  const [brands, setBrands] = useState([]); // Dynamic brands list
  const [sortType, setSortType] = useState('relevant');
  const [searchQuery, setSearchQuery] = useState('');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // 1. Initial Data Fetch (Brands & Categories)
  useEffect(() => {
    fetchCategories();
    fetchBrands();
  }, []);

  // 2. Fetch Products when Filter/Page Changes
  useEffect(() => {
    fetchProducts();
  }, [currentPage, sortType, category, brand]);

  // Sync URL Params with Category State
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    if (categoryParam) {
      setCategory([categoryParam]);
    } else {
      setCategory([]); // Clear if no param
    }
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


  const fetchProducts = async () => {
    try {
      setLoading(true);

      // Prepare Query Params
      const params = {
        page: currentPage,
        sort: sortType !== 'relevant' ? sortType : undefined,
        category: category.length > 0 ? category.join(',') : undefined,
        brand: brand.length > 0 ? brand.join(',') : undefined
      };

      // Call API (Returns normalized data)
      const { items, pagination } = await ProductApi.getProducts(params);

      setProducts(items);
      setFilteredProducts(items);

      // Update Pagination
      setTotalPages(pagination.last_page);
      setCurrentPage(pagination.current_page);

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
      setCurrentPage(1);
      return prev.includes(value) ? prev.filter(c => c !== value) : [...prev, value];
    });
  };

  // Toggle Brand Filter
  const toggleBrand = (e) => {
    const value = e.target.value;
    setBrand(prev => {
      setCurrentPage(1);
      return prev.includes(value) ? prev.filter(b => b !== value) : [...prev, value];
    });
  };

  // 4. Client-Side Search & Filtering (Robust Fallback)
  useEffect(() => {
    let temp = [...products];

    // Helper to safe-get category name
    const getCatName = (p) => {
      const c = p.category;
      return (c?.name || c || p.category_name || "").toString().toLowerCase().trim();
    };

    // Filter by Category
    if (category.length > 0) {
      temp = temp.filter(item => {
        const itemCat = getCatName(item);
        return category.some(sel => sel.toLowerCase().trim() === itemCat);
      });
    }

    // Filter by Brand
    if (brand.length > 0) {
      temp = temp.filter(item => brand.includes(item.brand));
    }

    // Filter by Search Query
    if (searchQuery) {
      temp = temp.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredProducts(temp);
  }, [searchQuery, products, category, brand]);

  return (
    <div className='container-fluid px-sm-3 px-lg-5 pt-3 border-top'>


      {/* Title */}
      <div className='py-4 text-center'>
        <h2 className='fs-2 fw-normal'>
          <span className='text-muted fw-bold'>ALL</span> COLLECTIONS
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
            <p className='fs-5 fw-bold my-2'>FILTERS</p>
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

        {/* Right Side - Product Grid */}
        <div className='col-lg-10'>

          {/* Header: Sort & Meta */}
          <div className='d-flex justify-content-between align-items-center mb-4'>
            <p className='mb-0 small fw-bold text-muted'>Showing {filteredProducts.length} products</p>

            <select
              className='form-select form-select-sm w-auto border-secondary'
              onChange={(e) => setSortType(e.target.value)}
            >
              <option value="relevant">Sort by: Relevant</option>
              <option value="low-high">Sort by: Low to High</option>
              <option value="high-low">Sort by: High to Low</option>
            </select>
          </div>

          {/* Grid */}
          <div className='row g-4'>
            {loading ? (
              <div className='col-12 text-center py-5'>
                <div className="spinner-border text-secondary" role="status"></div>
              </div>
            ) : filteredProducts.length > 0 ? (
              filteredProducts.map((item) => (
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
          {totalPages > 1 && (
            <div className='d-flex justify-content-center mt-5'>
              <nav aria-label="Page navigation">
                <ul className="pagination">
                  <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                    <button className="page-link" onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} aria-label="Previous">
                      <span aria-hidden="true">&laquo;</span>
                    </button>
                  </li>

                  {[...Array(totalPages)].map((_, i) => (
                    <li key={i + 1} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                      <button className="page-link" onClick={() => setCurrentPage(i + 1)}>
                        {i + 1}
                      </button>
                    </li>
                  ))}

                  <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                    <button className="page-link" onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} aria-label="Next">
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