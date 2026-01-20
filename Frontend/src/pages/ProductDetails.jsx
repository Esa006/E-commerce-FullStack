import React from "react";
import { useContext, useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { WishlistContext } from "../context/WishlistContext";
import apiClient from "../api/apiClient";
import axios from "axios";
import Swal from "sweetalert2";
import BackButton from "../components/BackButton";
import { parseImages, getImageUrl, PLACEHOLDER_IMG } from "../utils/imageUtils";
import Observability from "../utils/Observability";
import ProductApi from "../api/Products";
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

  // --- 🟢 REVIEW STATE ---
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);


  useEffect(() => {
    const controller = new AbortController();
    const startTime = performance.now();

    const fetchProductData = async () => {
      try {
        const response = await apiClient.get(`/products/${id}`, {
          signal: controller.signal
        });
        console.log(response.data);

        if (response.data.success) {
          const data = response.data.data;
          setProductData(data);
          setQuantity(data.qty_step || 1);

          const endTime = performance.now();
          const loadTime = Math.round(endTime - startTime);
          Observability.reportPerformance(`ProductDetailPage_Load_${id}`, loadTime);
        }
        setLoading(false);
      } catch (error) {
        if (axios.isCancel(error)) return;

        if (error.response && error.response.status === 404) {
          setProductNotFound(true);
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to load product. Please try again later.',
          });
        }
        setLoading(false);
      }
    };

    fetchProductData();
    return () => controller.abort();
  }, [id]);

  useEffect(() => {
    if (productData && productData.image) {
      const controller = new AbortController();
      const imgs = parseImages(productData.image);
      if (imgs.length > 0) setSelectedImage(imgs[0]);

      const fetchRelated = async () => {
        try {
          // Use the ProductApi for consistency
          const targetCat = productData.category?.name || productData.category || "";

          if (!targetCat) return;

          const { items } = await ProductApi.getProducts({
            category: targetCat,
            per_page: 8
          });

          // Filter out the current product and limit to 4
          const related = items
            .filter(p => p.id !== productData.id)
            .slice(0, 4);

          setRelatedProducts(related);
        } catch (err) {
          console.error("Error fetching related products:", err);
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
        confirmButtonColor: "btn-btn-dark"
      });
    }
  };

  const handleDecrease = () => {
    if (quantity > step) setQuantity(prev => prev - step);
  };

  const submitReview = async (e) => {
    e.preventDefault();
    if (reviewRating === 0) {
      Swal.fire({ icon: 'warning', title: 'Rating Required', text: 'Please select a star rating.' });
      return;
    }

    setSubmittingReview(true);
    try {
      await apiClient.post("/product-review", {
        product_id: productData.id,
        rating: reviewRating,
        review: reviewComment
      });

      Swal.fire({ icon: 'success', title: 'Review Submitted!', text: 'Thank you for your feedback.' });
      setReviewRating(0);
      setReviewComment("");
    } catch (error) {
      const msg = error.response?.data?.message || "Failed to submit review.";
      Swal.fire({ icon: 'error', title: 'Review Failed', text: msg });
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className="container-fluid px-3 px-md-4 px-lg-5 py-5">
      <div className="row g-1">
        {/* Left Column: Image Gallery */}
        <div className="col-12 col-md-6">
          {/* Breadcrumbs */}
          <nav aria-label="breadcrumb" className="mb-4 ">
            <ol className="breadcrumb d-flex justify-content-center ">
              <li className="breadcrumb-item"><Link to="/" className="text-decoration-none text-muted">Home</Link></li>
              <li className="breadcrumb-item">
                <Link to={`/products?category=${productData.category?.name || productData.category || 'All'}`} className="text-decoration-none text-muted">
                  {productData.category?.name || productData.category || productData.category_name || 'Shop'}
                </Link>
              </li>
              <li className="breadcrumb-item active text-dark" aria-current="page">{productData.name}</li>
            </ol>
          </nav>
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

          <p className="text-muted mb-4 fs-6 lh-base">
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
              <div className="input-group qty-input-group">
                <button className="btn btn-outline-dark rounded-0 px-2" type="button" onClick={handleDecrease}>
                  <i className="bi bi-dash"></i>
                </button>
                <input
                  type="text"
                  className="form-control text-center border-dark border-start-0 border-end-0 rounded-0"
                  value={quantity}
                  readOnly
                />
                <button className="btn btn-outline-dark rounded-0 px-2" type="button" onClick={handleIncrease}>
                  <i className="bi bi-plus"></i>
                </button>
              </div>
              {step > 1 && <small className="text-muted ms-3">(Min Order Step: {step})</small>}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="d-flex gap-2 mt-5">
            <button
              disabled={productData.stock < step}
              onClick={() => {
                if (!size && sizes.length > 0) {
                  Swal.fire({ icon: "info", title: "Select a size" });
                } else {
                  addToCart(productData, size, quantity);
                }
              }}
              className="btn btn-dark  w-40 py-3 fw-bold text-uppercase rounded-0"
            >
              {productData.stock >= step ? "Add to Cart" : "Sold Out"}
            </button>

            <button
              onClick={() => toggleWishlist(productData)}
              className={`btn border rounded-0 px-3 ${isInWishlist(productData.id) ? "btn-danger border-danger" : "btn-outline-dark"}`}
              title="Add to Wishlist"
            >
              <i className={`fs-5 bi ${isInWishlist(productData.id) ? "bi-heart-fill text-white" : "bi-heart"}`}></i>
            </button>
          </div>

          <div className="mt-4 pt-3 border-top">
            <div className="d-flex gap-4 small text-muted">
              <span><i className="bi bi-truck me-2"></i>Free Shipping</span>
              <span><i className="bi bi-arrow-return-left me-2"></i>Easy Returns</span>
            </div>
          </div>

          {/* --- 🟢 PRODUCT SPECIFICATIONS --- */}
          {productData.product_details && productData.product_details.length > 0 && (
            <div className="mt-4 pt-4 border-top">
              <h6 className="fw-bold text-uppercase mb-3">Product Specifications</h6>
              <table className="table table-bordered table-sm small mb-0">
                <tbody>
                  {/* Handle array of {key, value} objects */}
                  {Array.isArray(productData.product_details) ? (
                    productData.product_details.map((item, index) => (
                      <tr key={index}>
                        <td className="bg-light fw-semibold text-muted w-40 px-3 py-2">{item.key}</td>
                        <td className="px-3 py-2">{item.value}</td>
                      </tr>
                    ))
                  ) : (
                    /* Fallback for plain object format */
                    Object.entries(productData.product_details).map(([key, value]) => (
                      <tr key={key}>
                        <td className="bg-light fw-semibold text-muted w-40 px-3 py-2">{key}</td>
                        <td className="px-3 py-2">{String(value)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

        </div>
      </div>

      {/* --- 🟢 REVIEW SECTION (Ajio Style) --- */}
      <div className="mt-5 pt-5 border-top">
        <div className="row justify-content-center">
          <div className="col-lg-8">

            <div className="text-center mb-5">
              <h4 className="fw-bold text-uppercase tracking-widest mb-3">Ratings & Reviews</h4>
              <div className="d-flex justify-content-center align-items-center gap-3">
                <div className="bg-success text-white px-3 py-1 fw-bold fs-4 d-flex align-items-center gap-2 rounded-1">
                  {productData.rating?.toFixed(1) || "0.0"} <i className="bi bi-star-fill fs-6"></i>
                </div>
                <div className="text-muted small">
                  Based on Verified Purchases
                </div>
              </div>
            </div>

            <div className="p-4 border rounded-1">
              <h6 className="fw-bold text-uppercase mb-4">Rate this product</h6>
              <form onSubmit={submitReview}>
                <div className="mb-4">
                  <label className="form-label text-muted small mb-2 d-block">Your Rating</label>
                  <div className="fs-3">
                    <StarRating rating={reviewRating} onRatingChange={setReviewRating} />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="form-label text-muted small mb-2">Write a Review</label>
                  <textarea
                    className="form-control rounded-0 border-secondary-subtle"
                    rows="3"
                    placeholder="What did you like or dislike?"
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    required
                    style={{ resize: 'none' }}
                  ></textarea>
                </div>

                <div className="text-end">
                  <button
                    type="submit"
                    className="btn btn-dark rounded-0 px-5 text-uppercase fw-bold text-spacing-1"
                    disabled={submittingReview}
                  >
                    {submittingReview ? "Submitting..." : "Submit Review"}
                  </button>
                </div>
              </form>
            </div>

          </div>
        </div>
      </div>

      <div>
        {/* Related Products Section */}
        {
          relatedProducts.length > 0 && (
            <div className="mt-5 pt-5 text-center">
              <h3 className="fw-bold mb-4">You May Also Like</h3>
              <div className="row justify-content-center">
                {relatedProducts.map(product => (
                  <div key={product.id} className="col-6 col-md-4 col-lg-3 col-xl-3 mb-4">
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            </div>
          )
        }
      </div>


    </div >

  );
};

export default ProductDetails;
