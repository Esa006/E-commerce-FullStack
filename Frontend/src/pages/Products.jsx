import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
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
  const [sortType, setSortType] = useState('relevant');
  const [searchQuery, setSearchQuery] = useState('');

  // 1. Fetch Products from API
  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/products');
      const data = Array.isArray(response.data) ? response.data : (response.data.data || []);
      setProducts(data);
      setFilteredProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Sync URL Params with Category State
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    console.log(categoryParam);
    if (categoryParam) {
      setCategory([]);
    } else {
      setCategory([]);
    }
  }, [searchParams]);

  // 2. Toggle Category Filter
  const toggleCategory = (e) => {
    const value = e.target.value;
    console.log(value)
    setCategory(prev => 
      prev.includes(value) ? prev.filter(c => c !== value) : [...prev, value]
    );
  };

  // 3. Apply Filters & Sort
  useEffect(() => {
    let tempProducts = [...products];

    // Search Filter
    if (searchQuery) {
      tempProducts = tempProducts.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category Filter
    if (category.length > 0) {
      tempProducts = tempProducts.filter(item => category.includes(item.category));
    }

    // Sort Filter
    switch (sortType) {
      case 'low-high':
        tempProducts.sort((a, b) => a.price - b.price);
        break;
      case 'high-low':
        tempProducts.sort((a, b) => b.price - a.price);
        break;
      default:
        // 'relevant' - keep original order or random
        break;
    }

    setFilteredProducts(tempProducts);
  }, [products, category, sortType, searchQuery]);

  return (
    <div className='container-fluid px-sm-3 px-lg-5 pt-5 border-top'>
      <Navbar />
      
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
            <div className='border p-3 mt-2 rounded bg-white'>
              <h6 className='fw-bold mb-3 small text-uppercase spacing-wide'>Categories</h6>
              <div className='d-flex flex-column gap-2 text-muted small'>
                {['Men', 'Women', 'Kids',].map((cat) => (
                   <div key={cat} className='form-check'>
                     <input 
                        className='form-check-input' 
                        type='checkbox' 
                        value={cat} 
                        onChange={toggleCategory}
                        id={`cat-${cat}`}
                      />
                     <label className='form-check-label' htmlFor={`cat-${cat}`}>{cat}</label>
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
                    <ProductCard key={item.id} product={item} />
                ))
            ) : (
                <div className='col-12 text-center py-5 text-muted'>
                    <h4>No products found.</h4>
                    <p>Try adjusting your search or filters.</p>
                </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;