import React, { useState, useEffect } from "react";
import apiClient from "../api/apiClient";

import ProductCard from "../components/ProductCard";
import Swal from "sweetalert2";

const RelativeProduct = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    const fetchProducts = async () => {
      try {
        setApiError(null);
        // Use apiClient instead of axios
        const response = await apiClient.get("/products", {
          signal: controller.signal
        });

        const data = Array.isArray(response.data) ? response.data : (response.data.data || []);
        setProducts(data);
      } catch (err) {
        if (axios.isCancel(err)) return; // Logic for cancelled requests

        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Error fetching products. Please try again later.',
        });

        if (err.response) {
          setApiError(`Server Error: ${err.response.status} - ${err.response.statusText}`);
        } else if (err.request) {
          setApiError("Unable to connect to the server. Please ensure the backend is running on port 8000.");
        } else {
          setApiError(`Error: ${err.message}`);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();

    return () => controller.abort(); // 🟢 Cleanup on unmount
  }, []);

  if (loading)
    return <div className="text-center mt-5 d-flex justify-content-center align-items-center fw-bold text-primary min-h-200"><p>Loading Products...</p></div>;

  if (apiError)
    return (
      <div className="container text-center mt-5">
        <div className="alert alert-danger" role="alert">
          <p> {apiError}</p>
        </div>
      </div>
    );

  return (
    <>

      <div className="container px-3 px-md-4 px-lg-5 py-5">
        <h2 className="text-center fw-bold mb-5">Latest Products</h2>

        <div className="row g-3 justify-content-center">
          {products.length > 0 ? (
            products.slice(0, 20).map((item) => (
              <div
                key={item.id}
                className="col-6 col-md-4 col-lg-3 col-xl-3"
              >
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


    </>
  );
};

export default RelativeProduct;
