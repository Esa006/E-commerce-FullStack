import React, { useContext, useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { WishlistContext } from "../context/WishlistContext";
import apiClient from "../api/apiClient";
import Swal from "sweetalert2";
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
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [productNotFound, setProductNotFound] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  // Review State
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  const fetchProductData = async () => {
    try {
      const response = await apiClient.get(`/products/${id}`);
      if (response.data.success) {
        setProductData({
          ...response.data.data,
          sizes: (response.data.data.size_variants && response.data.data.size_variants.length > 0)
            ? response.data.data.size_variants
            : parseImages(response.data.data.sizes)
        });
        setQuantity(response.data.data.qty_step || 1);
        Observability.reportPerformance(`ProductDetailPage_Load_${id}`, 0);
      }
      setLoading(false);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setProductNotFound(true);
      } else {
        Swal.fire({ icon: 'error', title: 'Error', text: 'Failed to load product.' });
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductData();
  }, [id]);

  useEffect(() => {
    if (productData && productData.image) {
      const imgs = parseImages(productData.image);
      if (imgs.length > 0) setSelectedImage(imgs[0]);

      const fetchRelated = async () => {
        try {
          const targetCat = productData.category?.name || productData.category || "";
          if (!targetCat) return;
          const { items } = await ProductApi.getProducts({ category: targetCat, per_page: 8 });
          const related = items.filter(p => p.id !== productData.id).slice(0, 4);
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
      <Link to="/products" className="btn btn-primary mt-3">Browse All Products</Link> {/* FIXED CLASS */}
    </div>
  );

  if (!productData) return <div className="text-center mt-5 text-danger">Product Not Found</div>;

  const images = parseImages(productData.image);

  // 🟢 FIXED HELPER: Look at 'productData.sizes' (Array of Objects)
  const getSizeQty = (selectedSize) => {
    if (!selectedSize) return productData.stock; // Global stock fallback

    // Check if sizes is an array of objects (New Backend)
    if (Array.isArray(productData.sizes) && productData.sizes.length > 0 && typeof productData.sizes[0] === 'object') {
      const variant = productData.sizes.find(s => s.size === selectedSize);
      return variant ? parseInt(variant.stock) : 0;
    }

    // Legacy Fallback
    if (productData.size_stock && productData.size_stock[selectedSize] !== undefined) {
      return parseInt(productData.size_stock[selectedSize]);
    }

    return productData.stock;
  };

  const step = productData.qty_step || 1;

  const handleIncrease = () => {
    const currentStock = size ? getSizeQty(size) : productData.stock;
    if (quantity + step <= currentStock) {
      setQuantity(prev => prev + step);
    } else {
      Swal.fire({
        icon: "warning",
        title: "Stock Limit",
        text: `We only have ${currentStock} units available${size ? ` for size ${size}` : ''}.`,
        confirmButtonColor: "btn-custom-primary" // FIXED: Hex code for Black
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
      Swal.fire({ icon: 'success', title: 'Review Submitted!', text: 'Thank you for your feedback.', confirmButtonColor: "#000000" });
      setReviewRating(0);
      setReviewComment("");
      fetchProductData();
    } catch (error) {
      const msg = error.response?.data?.message || "Failed to submit review.";
      Swal.fire({ icon: 'error', title: 'Review Failed', text: msg });
    } finally {
      setSubmittingReview(false);
    }
  };

  // Calculate current stock for button disable logic
  const currentSizeStock = size ? getSizeQty(size) : (productData.stock || 0);

  return (
    <div className="container py-5">
      <div className="row g-5">
        {/* Left Column: Images */}
        <div className="col-12 col-md-5">
          {/* Breadcrumbs */}
          <nav aria-label="breadcrumb" className="mb-4 ">
            <ol className="breadcrumb d-flex">
              <li className="breadcrumb-item"><Link to="/" className="text-decoration-none text-muted">Home</Link></li>
              <li className="breadcrumb-item">
                <Link to={`/products?category=${productData.category?.name || productData.category || 'All'}`} className="text-decoration-none text-muted">
                  {productData.category?.name || productData.category || productData.category_name || 'Shop'}
                </Link>
              </li>
              <li className="breadcrumb-item active text-dark" aria-current="page">{productData.name}</li>
            </ol>
          </nav>
          <div className="mb-3 text-center product-detail">
            <img src={selectedImage ? getImageUrl(selectedImage) : PLACEHOLDER_IMG} className="img-fluid product-main-img object-fit-contain" alt={productData.name} onError={(e) => (e.target.src = PLACEHOLDER_IMG)} />
          </div>
          {images.length > 1 && (
            <div className="d-flex gap-2 justify-content-center flex-wrap mt-3">
              {images.map((img, i) => (
                <div key={i} className="col-3 col-sm-2">
                  <button onClick={() => setSelectedImage(img)} className={`btn p-1 w-100 border-2 ratio ratio-1x1 ${selectedImage === img ? "border-primary" : "border"}`}>
                    <div><img src={getImageUrl(img)} className="img-fluid object-fit-cover rounded" alt="thumbnail" /></div>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Details */}
        <div className="col-12 col-md-7">
          <div className="small text-muted text-uppercase fw-bold mb-1">{productData.brand}</div>
          <h1 className="display-6 fw-bold mb-2">{productData.name}</h1>
          <div className="mb-3"><StarRating rating={productData.rating} reviews={productData.rating_count} /></div>

          <div className="d-flex align-items-center gap-3 mb-4">
            <h3 className="fw-bold mb-0 text-dark">₹{productData.price}</h3>
            {/* Status Badges... (Kept same) */}
          </div>

          <p className="text-muted mb-4 fs-6 lh-base">{productData.description}</p>
          <hr className="my-4 text-muted" />

          {/* SIZE SELECTOR */}
          {productData.sizes && productData.sizes.length > 0 && (
            <div className="mb-4">
              <span className="d-block small fw-bold text-uppercase text-muted mb-2">Select Size</span>
              <div className="d-flex gap-2">
                {productData.sizes.map((s, i) => {
                  const sizeName = typeof s === 'object' ? s.size : s;
                  const sizeStock = typeof s === 'object' ? s.stock : (productData.stock || 0);
                  const isOutOfStock = sizeStock === 0;

                  return (
                    <button
                      key={i}
                      onClick={() => { setSize(sizeName); setQuantity(1); }}
                      disabled={isOutOfStock}
                      // 🟢 FIXED: Use btn-primary (Black) instead of btn-custom-primary
                      className={`btn h-100 px-4 py-2 ${size === sizeName ? "btn-primary" : "btn-outline-primary"} ${isOutOfStock ? "text-decoration-line-through opacity-50" : ""}`}
                    >
                      {sizeName} {isOutOfStock ? "(Sold Out)" : ""}
                    </button>
                  );
                })}
              </div>
              {size && (
                <div className="mt-2 small text-danger fw-bold">
                  {currentSizeStock <= 5 ? `Only ${currentSizeStock} left in stock!` : "In Stock"}
                </div>
              )}
            </div>
          )}

          {/* QUANTITY */}
          <div className="mb-4">
            <span className="d-block small fw-bold text-uppercase text-muted mb-2">Quantity</span>
            <div className="d-flex align-items-center">
              <div className="input-group qty-input-group">
                <button className="btn btn-outline-primary rounded-0 px-2" type="button" onClick={handleDecrease}><i className="bi bi-dash"></i></button>
                <input type="text" className="form-control text-center border-primary border-start-0 border-end-0 rounded-0" value={quantity} readOnly />
                <button className="btn btn-outline-primary rounded-0 px-2" type="button" onClick={handleIncrease}><i className="bi bi-plus"></i></button>
              </div>
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="d-flex gap-2 mt-5">
            <button
              disabled={currentSizeStock < step}
              onClick={() => {
                if (!size && productData.sizes && productData.sizes.length > 0) {
                  Swal.fire({ icon: "info", title: "Select a size", confirmButtonColor: "#000000" });
                } else {
                  addToCart(productData, size, quantity);
                }
              }}
              // 🟢 FIXED: Use btn-dark for Black color
              className="btn-custom-primary w-50 py-3 fw-bold text-uppercase rounded-0"
            >
              {currentSizeStock >= step ? "Add to Cart" : "Sold Out"}
            </button>
            <button onClick={() => toggleWishlist(productData)} className={`btn border rounded-0 px-3 ${isInWishlist(productData.id) ? "btn-danger border-danger" : "btn-outline-primary"}`}>
              <i className={`fs-5 bi ${isInWishlist(productData.id) ? "bi-heart-fill text-white" : "bi-heart"}`}></i>
            </button>
          </div>

          {/* SPECS TABLE (Kept same) */}
          {productData.product_details && (
            <div className="mt-4 pt-4 border-top">
              {/* ... table code ... */}
            </div>
          )}
        </div>
      </div>

      {/* REVIEW FORM */}
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
                  {productData.rating_count || 0} Reviews
                </div>
              </div>
            </div>

            {productData.can_review ? (
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
                      className="form-control rounded-0"
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
                      className="btn btn-primary rounded-0 px-5 text-uppercase fw-bold text-spacing-1"
                      disabled={submittingReview}
                    >
                      {submittingReview ? "Submitting..." : "Submit Review"}
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="p-4 border rounded-1 bg-light text-center">
                <i className="bi bi-lock fs-4 text-muted mb-2"></i>
                <h6 className="fw-bold text-uppercase mb-2 text-muted">Review Locked</h6>
                <p className="text-muted small mb-0">
                  Only customers who have purchased and received this product can write a review.
                </p>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* RELATED PRODUCTS */}
      {relatedProducts.length > 0 && (
        <div className="mt-5 pt-5 text-center">
          <h3 className="fw-bold mb-4">You May Also Like</h3>
          <div className="row justify-content-center">
            {relatedProducts.map(product => (
              <div key={product.id} className="col-6 col-sm-6 col-md-4 col-lg-3 col-xl-3 mb-4">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;