import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ProductApi from "../api/Products";

import ProductCard from "../components/ProductCard";
import Swal from "sweetalert2";

const Home = () => {
  const [newArrivals, setNewArrivals] = useState([]);
  const [bestsellers, setBestsellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(null);

  const fetchHomeData = async () => {
    try {
      setApiError(null);
      // Fetch both New Arrivals and Bestsellers in parallel
      const [arrivalsData, bestsellersData] = await Promise.all([
        ProductApi.getNewArrivals(),
        ProductApi.getBestsellers()
      ]);

      setNewArrivals(arrivalsData);
      setBestsellers(bestsellersData);
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error fetching products. Please try again later.',
      });
      setApiError(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHomeData();
  }, []);

  if (loading)
    return <div className="text-center mt-5 d-flex justify-content-center align-items-center fw-bold text-primary min-h-200"><p>Loading Products...</p></div>;

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
              <div className="category-card-img">
                <img src="https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=600" className="card-img object-fit-cover  w-100 " alt="Men" />
              </div>
              <div className="card-img-overlay d-flex flex-column justify-content-end p-4 category-card-overlay">
                <h3 className="card-title fw-bold">Men</h3>
                <Link to="/products?category=Men" className="btn btn-light btn-sm fw-bold w-auto px-4 stretched-link">Shop Now</Link>
              </div>
            </div>
          </div>

          {/* Women */}
          <div className="col-md-4">
            <div className="card text-white border-0 shadow-sm overflow-hidden category-card position-relative">
              <div className="category-card-img">
                <img src="https://images.pexels.com/photos/762020/pexels-photo-762020.jpeg?auto=compress&cs=tinysrgb&w=600" className="card-img object-fit-cover w-100 h-100" alt="Women" />
              </div>
              <div className="card-img-overlay d-flex flex-column justify-content-end p-4">
                <h3 className="card-title fw-bold">Women</h3>
                <Link to="/products?category=Women" className="btn btn-light btn-sm fw-bold w-auto px-4 stretched-link">Shop Now</Link>
              </div>
            </div>
          </div>

          {/* Kids */}
          <div className="col-md-4 mb-5">
            <div className="card text-white border-0 shadow-sm overflow-hidden category-card position-relative">
              <div className="category-card-img">
                <img src="https://images.unsplash.com/photo-1514090458221-65bb69cf63e6?q=80&w=600&auto=format&fit=crop" className="card-img object-fit-cover w-100 h-100" alt="Kids" />
              </div>
              <div className="card-img-overlay d-flex flex-column justify-content-end p-4">
                <h3 className="card-title fw-bold">Kids</h3>
                <Link to="/products?category=Kids" className="btn btn-light btn-sm fw-bold w-auto px-4 stretched-link">Shop Now</Link>
              </div>
            </div>
          </div>
        </div>




        {/* Bestseller Section */}
        <div className="text-center mb-5 mt-5">
          <h2 className="section-title text-uppercase">Best Sellers</h2>
          <p className="text-muted">Explore our most popular items loved by everyone.</p>
        </div>
        <div className="row mb-5">
          {bestsellers.length > 0 ? (
            bestsellers.slice(0, 4).map((item) => (
              <div key={item.id} className="col-6 col-sm-6 col-md-4 col-lg-3 col-xl-3 mb-4">
                <ProductCard product={item} />
              </div>
            ))
          ) : (
            <div className="col-12 text-center text-muted">
              <p>Check back soon for our top picks!</p>
            </div>
          )}
        </div>

        {/* New Arrivals Section */}
        <div className="text-center mb-5 pt-4">
          <h2 className="section-title text-uppercase">Latest Products</h2>
          <p className="text-muted">Discover our newest arrivals.</p>
        </div>
        <div className="row">
          {newArrivals.length > 0 ? (
            newArrivals.slice(0, 8).map((item) => (
              <div key={item.id} className="col-6 col-sm-6 col-md-4 col-lg-3 col-xl-3 mb-4">
                <ProductCard product={item} />
              </div>
            ))
          ) : (
            <div className="col-12 text-center text-muted">
              <p>No new products found at the moment.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Home;
