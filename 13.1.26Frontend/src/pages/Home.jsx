import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

import ProductCard from "../components/ProductCard";
import Swal from "sweetalert2";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(null);

  const fetchProducts = async () => {
    try {
      setApiError(null);
      const response = await axios.get("http://localhost:8000/api/products");

      // API returns: { success: true, data: [...] }
      const productData = response.data?.data || response.data;
      setProducts(Array.isArray(productData) ? productData : []);
    } catch (err) {
      // console.error("Error fetching products:", err);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error fetching products. Please try again later.',
      });

      if (err.response) {
        // The request was made and the server responded with a status code
        setApiError(`Server Error: ${err.response.status} - ${err.response.statusText}`);
      } else if (err.request) {
        // The request was made but no response was received
        setApiError("Unable to connect to the server. Please ensure the backend is running on port 8000.");
      } else {
        // Something happened in setting up the request that triggered an Error
        setApiError(`Error: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  if (loading)
    return <div className="text-center mt-5 loader"><p>Loading Products...</p></div>;

  if (apiError)
    return (
      <div className="text-center mt-5">
        <div className="alert alert-danger" role="alert">
          <p> {apiError}</p>
        </div>
      </div>
    );

  return (
    <>


      {/* Category Section */}
      <div className="container py-5">
        <div className="text-center mb-5">
          <h2 className="section-title">Shop by Category</h2>
          <p className="text-muted">Explore our curated collections for every style.</p>
        </div>
        <div className="row g-4">
          {/* Men */}
          <div className="col-md-4">
            <div className="card text-white border-0 shadow-sm overflow-hidden category-card position-relative">
              <img src="https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=600" className="card-img object-fit-cover category-card-img" alt="Men" />
              <div className="card-img-overlay d-flex flex-column justify-content-end p-4 category-card-overlay">
                <h3 className="card-title fw-bold">Men</h3>
                <Link to="/products?category=Men" className="btn btn-light btn-sm fw-bold w-auto px-4 stretched-link">Shop Now</Link>
              </div>
            </div>
          </div>

          {/* Women */}
          <div className="col-md-4">
            <div className="card text-white border-0 shadow-sm overflow-hidden category-card position-relative">
              <img src="https://images.pexels.com/photos/762020/pexels-photo-762020.jpeg?auto=compress&cs=tinysrgb&w=600" className="card-img object-fit-cover category-card-img" alt="Women" />
              <div className="card-img-overlay d-flex flex-column justify-content-end p-4 category-card-overlay">
                <h3 className="card-title fw-bold">Women</h3>
                <Link to="/products?category=Women" className="btn btn-light btn-sm fw-bold w-auto px-4 stretched-link">Shop Now</Link>
              </div>
            </div>
          </div>

          {/* Kids */}
          <div className="col-md-4 mb-5">
            <div className="card text-white border-0 shadow-sm overflow-hidden category-card position-relative">
              <img src="https://images.unsplash.com/photo-1514090458221-65bb69cf63e6?q=80&w=600&auto=format&fit=crop" className="card-img object-fit-cover category-card-img" alt="Kids" />
              <div className="card-img-overlay d-flex flex-column justify-content-end p-4 category-card-overlay">
                <h3 className="card-title fw-bold">Kids</h3>
                <Link to="/products?category=Kids" className="btn btn-light btn-sm fw-bold w-auto px-4 stretched-link">Shop Now</Link>
              </div>
            </div>
          </div>

        </div>





        <div className="section-title" >
          <h2 className="section-title">Latest Products</h2>
          <div className="row">
            {products.length > 0 ? (
              products.slice(0, 8).map((item) => (
                <div key={item.id} className="col-6 col-sm-6 col-md-4 col-lg-3 col-xl-3 mb-4">
                  <ProductCard product={item} />
                </div>
              ))
            ) : (
              <div className="col-12 text-center">
                <p>No products found.</p>
              </div>
            )}
          </div>
        </div>
      </div >
    </>
  );
};

export default Home;
