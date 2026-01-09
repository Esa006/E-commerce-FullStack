import { useEffect, useState } from "react";
import axios from "axios";

const AdminProducts = () => {
  const [products, setProducts] = useState([]); // Store data from Backend
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("admin_token"); // Admin authentication token

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/products", {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        // Handle both response.data.data (Laravel resource) or response.data (standard array)
        setProducts(response.data.data || response.data); 
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [token]);

  if (loading) return <p className="loading-msg">Loading Products...</p>;

  return (
    <>
      <div className="admin-products-header">
        <h3 className="products-list-title">Products List</h3>
      </div>

      <div className="products-table-container">
        <table className="table products-table">
          <thead className="products-table-head">
            <tr>
              <th>Name</th>
              <th>Price</th>
              <th>Category</th>
              <th>Stock</th>
            </tr>
          </thead>
          <tbody>
            {products.length > 0 ? (
              products.map((product) => (
                <tr key={product.id}><td>{product.name}</td><td>₹{product.price}</td><td>{product.category}</td><td>{product.stock}</td></tr>
              ))
            ) : (
              <tr><td colSpan="4" className="no-products-msg">No Products Available</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default AdminProducts;