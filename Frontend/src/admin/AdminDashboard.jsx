import React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminApi from "../api/admin";
import { FaTrash } from "react-icons/fa";
import EditProductModal from "./EditProductModal";
import CustomerList from "./customers/CustomerList";
import Swal from "sweetalert2"; // Make sure to install: npm install sweetalert2

export default function Dashboard() {
  const navigate = useNavigate();

  /* ================= STATE ================= */
  const [products, setProducts] = useState([]);
  const [activeTab, setActiveTab] = useState("customers");
  const [editingProduct, setEditingProduct] = useState(null);
  const [deletingProduct, setDeletingProduct] = useState(null);

  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    image: null,
  });

  /* ================= LOAD PRODUCTS ================= */
  useEffect(() => {
    if (activeTab === "products") {
      fetchProducts();
    }
  }, [activeTab]);

  const fetchProducts = async () => {
    try {
      const res = await AdminApi.getProducts();
      setProducts(res.data.products || res.data || []);
    } catch (err) {
      console.error("Failed to load products", err);
    }
  };

  /* ================= ADD PRODUCT ================= */
  const handleAddProduct = async (e) => {
    e.preventDefault();

    // Optional: Frontend check for file size (2MB)
    if (newProduct.image && newProduct.image.size > 2048 * 1024) {
      return Swal.fire("Error", "Image size must be less than 2MB", "error");
    }

    const formData = new FormData();
    Object.keys(newProduct).forEach((key) => {
      formData.append(key, newProduct[key]);
    });

    try {
      await AdminApi.addProduct(formData);
      Swal.fire("Success", "Product added successfully", "success");

      setNewProduct({
        name: "",
        description: "",
        price: "",
        stock: "",
        image: null,
      });
      fetchProducts();
    } catch (err) {
      const errorMsg = err.response?.data?.error || "Product add failed";
      Swal.fire("Error", errorMsg, "error");
    }
  };

  /* ================= DELETE PRODUCT ================= */
  const confirmDelete = async () => {
    try {
      await AdminApi.deleteProduct(deletingProduct.id);

      // Update UI locally
      setProducts((prevProducts) =>
        prevProducts.filter((p) => p.id !== deletingProduct.id)
      );

      setDeletingProduct(null);
      Swal.fire("Deleted!", "Product has been removed.", "success");
    } catch (err) {
      Swal.fire("Error", "Delete failed", "error");
    }
  };

  /* ================= IMAGE HELPER ================= */
  const getImageUrl = (imagePath) => {
    if (!imagePath) return "https://via.placeholder.com/50";

    // If imagePath is a JSON string like '["path.png"]', parse it
    let cleanPath = imagePath;
    if (typeof imagePath === "string" && imagePath.startsWith("[")) {
      try {
        const parsed = JSON.parse(imagePath);
        cleanPath = parsed[0];
      } catch (e) {
        console.error("Path parsing error", e);
      }
    }
    return `http://127.0.0.1:8000/storage/${cleanPath}`;
  };

  /* ================= UI ================= */
  return (
    <div className="min-vh-100 bg-light">
      <nav className="navbar navbar-dark bg-dark px-4 shadow">
        <span className="navbar-brand fw-bold">ADMIN PANEL</span>
        <div className="navbar-nav me-auto d-flex flex-row">
          <button
            className={`nav-link btn mx-2 ${
              activeTab === "customers" ? "text-white border-bottom" : ""
            }`}
            onClick={() => setActiveTab("customers")}
          >
            Customers
          </button>
          <button
            className={`nav-link btn mx-2 ${
              activeTab === "products" ? "text-white border-bottom" : ""
            }`}
            onClick={() => setActiveTab("products")}
          >
            Products
          </button>
        </div>
        <button
          onClick={() => {
            localStorage.clear();
            navigate("/admin/login");
          }}
          className="btn btn-danger btn-sm"
        >
          Logout
        </button>
      </nav>

      <div className="container mt-5">
        {activeTab === "customers" && <CustomerList />}

        {activeTab === "products" && (
          <>
            <div className="card shadow border-0 mb-4 p-4">
              <h5>Add New Product</h5>
              <form onSubmit={handleAddProduct} className="row g-3">
//                 <div className="col-md-4">
//                   <input
//                     className="form-control"
//                     placeholder="Name"
//                     value={newProduct.name}
//                     onChange={(e) =>
//                       setNewProduct({ ...newProduct, name: e.target.value })
//                     }
//                     required
//                   />
//                 </div>
//                 <div className="col-md-4">
//                   <input
//                     type="number"
//                     className="form-control"
//                     placeholder="Price"
//                     value={newProduct.price}
//                     onChange={(e) =>
//                       setNewProduct({ ...newProduct, price: e.target.value })
//                     }
//                     required
//                   />
//                 </div>
//                 <div className="col-md-4">
//                   <input
//                     type="number"
//                     className="form-control"
//                     placeholder="Stock"
//                     value={newProduct.stock}
//                     onChange={(e) =>
//                       setNewProduct({ ...newProduct, stock: e.target.value })
//                     }
//                     required
//                   />
//                 </div>
//                 <div className="col-md-8">
//                   <input
//                     className="form-control"
//                     placeholder="Description"
//                     value={newProduct.description}
//                     onChange={(e) =>
//                       setNewProduct({
//                         ...newProduct,
//                         description: e.target.value,
                    required
                  />
                </div>
                <div className="col-md-4">
                  <input
                    type="file"
                    className="form-control"
                    accept="image/*"
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, image: e.target.files[0] })
                    }
                    required
                  />
                </div>
                <div className="col-12">
                  <button className="btn btn-primary px-5">Save Product</button>
                </div>
              </form>
            </div>

            <div className="card shadow border-0">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-dark">
                  <tr>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th className="text-center actions-col">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p.id}>
                      <td>
                        {p.image ? (
                          <img
                            src={getImageUrl(p.image)}
                            alt={p.name}
                            className="product-thumb"
                          />
                        ) : (
                          <div
                            className="product-thumb-placeholder"
                          >
                           <p> No Img</p>
                          </div>
                        )}
                      </td>
                      <td>{p.name}</td>
                      <td>₹{p.price}</td>
                      <td>{p.stock}</td>
                      <td className="text-center">
                        <button
                          className="btn btn-warning btn-sm me-2"
                          onClick={() => setEditingProduct(p)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => setDeletingProduct(p)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* DELETE MODAL (Same as your previous code) */}
      {deletingProduct && (
        <div
          className="modal show d-block modal-overlay"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header bg-danger text-white">
                <h5>Confirm Delete</h5>
                <button
                  className="btn-close btn-close-white"
                  onClick={() => setDeletingProduct(null)}
                />
              </div>
              <div className="modal-body text-center">
                <FaTrash size={40} className="text-danger mb-3" />
                <p>
                  Delete <strong>{deletingProduct.name}</strong>?
                </p>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setDeletingProduct(null)}
                >
                  Cancel
                </button>
                <button className="btn btn-danger" onClick={confirmDelete}>
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {editingProduct && (
        <EditProductModal
          product={editingProduct}
          onClose={() => setEditingProduct(null)}
          onUpdateSuccess={fetchProducts}
        />
      )}
    </div>
  );
}
