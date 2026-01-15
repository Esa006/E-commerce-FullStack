import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";

import ProductCard from "../components/ProductCard";
import Swal from "sweetalert2";

const RelativeProduct = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(null);

  const fetchProducts = async () => {
    try {
      setApiError(null);
      const response = await axios.get("http://localhost:8000/api/products");

      setProducts(Array.isArray(response.data) ? response.data : []);
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
      <div className="container text-center mt-5">
        <div className="alert alert-danger" role="alert">
          <p> {apiError}</p>
        </div>
      </div>
    );

  return (
    <>

      <div className="container-fluid px-3 px-md-4 px-lg-5 py-5">
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
