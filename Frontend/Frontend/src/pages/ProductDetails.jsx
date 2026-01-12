import React from "react";
import { useContext, useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { WishlistContext } from "../context/WishlistContext";
import axios from "axios";
import Swal from "sweetalert2";
import { parseImages, getImageUrl, PLACEHOLDER_IMG } from "../utils/imageUtils";
import BackButton from "../components/BackButton";
import Navbar from "../components/Navbar";
import StarRating from "../components/StarRating";
import ProductCard from "../components/ProductCard";

const ProductDetails = () => {
  const { id } = useParams();
  const { addToCart } = useContext(CartContext);
  const { toggleWishlist, isInWishlist } = useContext(WishlistContext);

  const [productData, setProductData] = useState(null);
  const [size, setSize] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [loading, setLoading] = useState(true);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [productNotFound, setProductNotFound] = useState(false); // New State
  // --- 🟢 IMAGE SELECTION STATE ---
  const [selectedImage, setSelectedImage] = useState(null);

  const storageBaseUrl = "http://localhost:8000/storage/";

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/products/${id}`);
        if (response.data.success) {
          const data = response.data.data;
          setProductData(data);
          // Initialize quantity based on product's MOQ step (1, 2, or 5)
          setQuantity(data.qty_step || 1);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching product:", error);
        if (error.response && error.response.status === 404) {
          setProductNotFound(true);
        }
        setLoading(false);
      }
    };
    fetchProductData();
  }, [id]);

  useEffect(() => {
    if (productData && productData.image) {
      const imgs = parseImages(productData.image);
      if (imgs.length > 0) setSelectedImage(imgs[0]);

      // Fetch Related Products
      const fetchRelated = async () => {
        try {
          const res = await axios.get("http://localhost:8000/api/products");
          const allProducts = Array.isArray(res.data) ? res.data : (res.data.data || []);

          const related = allProducts
            .filter(p => p.category === productData.category && p.id !== productData.id)
            .slice(0, 4);

          setRelatedProducts(related);
        } catch (err) {
          console.error("Error fetching related products", err);
        }
      };
      fetchRelated();
    }
  }, [productData]);

  if (loading) return <div className="text-center mt-5"><div className="spinner-border text-dark"></div></div>;

  if (productNotFound) return (
    <div className="container text-center mt-5 pt-5">
      <h2 className="display-4 text-secondary">Product Not Found</h2>
      <p className="lead text-muted">The product you are looking for might have been removed or the link is invalid.</p>
      <Link to="/products" className="btn btn-dark mt-3">Browse All Products</Link>
    </div>
  );

  if (!productData) return <div className="text-center mt-5 text-danger">Product Not Found</div>;

  const images = parseImages(productData.image);
  const sizes = parseImages(productData.sizes);

  // --- 🟢 DYNAMIC QUANTITY LOGIC ---
  const step = productData.qty_step || 1;

  const handleIncrease = () => {
    if (quantity + step <= productData.stock) {
      setQuantity(prev => prev + step);
    } else {
      Swal.fire({
        icon: "warning",
        title: "Stock Limit",
        text: `We only have ${productData.stock} units available.`,
        confirmButtonColor: "#000"
      });
    }
  };

  const handleDecrease = () => {
    if (quantity > step) setQuantity(prev => prev - step);
  };

  return (
    <div className="container-fluid px-3 px-md-4 px-lg-5 py-5">
      {/* Breadcrumbs */}
      <nav aria-label="breadcrumb" className="mb-4">
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><Link to="/" className="text-decoration-none text-muted">Home</Link></li>
          <li className="breadcrumb-item"><Link to="/products" className="text-decoration-none text-muted">Shop</Link></li>
          <li className="breadcrumb-item active text-dark" aria-current="page">{productData.name}</li>
        </ol>
      </nav>

      <div className="row g-5">
        {/* Left Column: Image Gallery */}
        <div className="col-12 col-md-6">
          <div className="mb-3 text-center">
            <img
              src={selectedImage ? getImageUrl(selectedImage) : PLACEHOLDER_IMG}
              className="img-fluid product-main-img object-fit-contain"
              alt={productData.name}
              onError={(e) => (e.target.src = PLACEHOLDER_IMG)}
            />
          </div>

          {images.length > 1 && (
            <div className="d-flex gap-2 justify-content-center flex-wrap mt-3">
              {images.map((img, i) => (
                <div key={i} className="col-3 col-sm-2">
                  <button
                    onClick={() => setSelectedImage(img)}
                    className={`btn p-1 w-100 border-2 ratio ratio-1x1 ${selectedImage === img ? "border-dark" : "border"}`}
                  >
                    <img
                      src={getImageUrl(img)}
                      className="img-fluid object-fit-cover rounded"
                      alt="thumbnail"
                    />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Product Details */}
        <div className="col-12 col-md-6">

          <div className="small text-muted text-uppercase fw-bold mb-1">{productData.brand}</div>
          <h1 className="display-6 fw-bold mb-2">{productData.name}</h1>

          {/* Rating */}
          <div className="mb-3">
            <StarRating rating={productData.rating} />
          </div>

          <div className="d-flex align-items-center gap-3 mb-4">
            <h3 className="fw-bold mb-0 text-dark">₹{productData.price}</h3>

            {productData.stock_status === "out_of_stock" && (
              <span className="badge bg-danger rounded-pill px-3">Out of Stock</span>
            )}
            {productData.stock_status === "low_stock" && (
              <span className="badge bg-warning text-dark rounded-pill px-3">Low Stock: {productData.stock} left</span>
            )}
            {productData.stock_status === "in_stock" && (
              <span className="badge bg-success rounded-pill px-3">In Stock</span>
            )}
          </div>

          <p className="text-muted mb-4 lead" style={{ fontSize: "1rem", lineHeight: "1.6" }}>
            {productData.description}
          </p>

          <hr className="my-4 text-muted" />

          {/* Size Selector */}
          {sizes.length > 0 && (
            <div className="mb-4">
              <span className="d-block small fw-bold text-uppercase text-muted mb-2">Select Size</span>
              <div className="d-flex gap-2">
                {sizes.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => setSize(s)}
                    className={`btn h-100 px-4 py-2 ${size === s ? "btn-dark" : "btn-outline-dark"}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity Selector */}
          <div className="mb-4">
            <span className="d-block small fw-bold text-uppercase text-muted mb-2">Quantity</span>
            <div className="d-flex align-items-center">
              <div className="input-group" style={{ width: '140px' }}>
                <button className="btn btn-outline-dark" type="button" onClick={handleDecrease}>
                  <i className="bi bi-dash"></i>
                </button>
                <input
                  type="text"
                  className="form-control text-center border-dark border-start-0 border-end-0"
                  value={quantity}
                  readOnly
                />
                <button className="btn btn-outline-dark" type="button" onClick={handleIncrease}>
                  <i className="bi bi-plus"></i>
                </button>
              </div>
              <small className="text-muted ms-3">(Step: {step})</small>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="d-flex gap-3 mt-5">
            <button
              disabled={productData.stock < step}
              onClick={() => {
                if (!size && sizes.length > 0) { // Only enforce size if sizes exist
                  Swal.fire({ icon: "info", title: "Select a size" });
                } else {
                  addToCart(productData, size, quantity);
                  Swal.fire({
                    icon: "success",
                    title: "Added to cart",
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 3000
                  });
                }
              }}
              className="btn btn-dark btn-lg flex-grow-1"
            >
              {productData.stock >= step ? "Add to Cart" : "Sold Out"}
            </button>

            <button
              onClick={() => toggleWishlist(productData)}
              className={`btn btn-lg ${isInWishlist(productData.id) ? "btn-danger" : "btn-outline-danger"}`}
              style={{ width: '60px' }}
            >
              <i className={`bi ${isInWishlist(productData.id) ? "bi-heart-fill" : "bi-heart"}`}></i>
            </button>
          </div>

          <div className="mt-4 pt-3 border-top">
            <div className="d-flex gap-4 small text-muted">
              <span><i className="bi bi-truck me-2"></i>Free Shipping</span>
              <span><i className="bi bi-arrow-return-left me-2"></i>Easy Returns</span>
            </div>
          </div>

        </div>
      </div>


      {/* Related Products Section */}
      {
        relatedProducts.length > 0 && (
          <div className="mt-5 pt-5 text-center">
            <h3 className="fw-bold mb-4">You May Also Like</h3>
            <div className="row justify-content-center">
              {relatedProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        )
      }

    </div >

  );
};

export default ProductDetails;
