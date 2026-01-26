import React from "react";
import { useContext } from "react";
import { Link, useNavigate, NavLink, useLocation } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { WishlistContext } from "../context/WishlistContext";
import { AuthContext } from "../context/AuthContext";
import SearchBar from "./SearchBar";

const Navbar = () => {
  const { cartItems } = useContext(CartContext);
  const { wishlistItems } = useContext(WishlistContext);
  const { token, logout } = useContext(AuthContext);
  const wishlistCount = wishlistItems ? wishlistItems.length : 0;
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const currentCategory = searchParams.get("category");

  const isActive = (path, category) => {
    if (path === "/" && location.pathname === "/" && !currentCategory) return "active";
    if (location.pathname === path) {
      if (category) {
        return currentCategory === category ? "active" : "";
      }
      return !currentCategory ? "active" : "";
    }
    return "";
  };
  // const token = localStorage.getItem("ACCESS_TOKEN"); // Now from context

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const totalItems = cartItems ? cartItems.reduce((total, item) => total + item.quantity, 0) : 0;

  return (
    // 🟢 1. Navbar Container: White background, bottom border, sticky
    <nav className="navbar navbar-expand-lg bg-white border-bottom sticky-top py-3">
      <div className="container">

        <Link className="navbar-brand fw-bold fs-3 text-uppercase text-black" to="/">
          Forever
        </Link>

        {/* 🟢 CENTRAL NAVIGATION LINKS */}
        <ul className="d-none d-md-flex align-items-center gap-4 list-unstyled mb-0">
          <li>
            <Link to="/" className={`text-decoration-none text-navbar-theme small fw-bold text-uppercase pb-1 ${isActive("/", null) ? "nav-link-active" : ""}`}>
              Home
            </Link>
          </li>
          <li>
            <Link to="/products" className={`text-decoration-none text-navbar-theme small fw-bold text-uppercase pb-1 ${isActive("/products", null) ? "nav-link-active" : ""}`}>
              Collection
            </Link>
          </li>
          <li>
            <Link to="/products?category=Men" className={`text-decoration-none text-navbar-theme small fw-bold text-uppercase pb-1 ${isActive("/products", "Men") ? "nav-link-active" : ""}`}>
              Men
            </Link>
          </li>
          <li>
            <Link to="/products?category=Women" className={`text-decoration-none text-navbar-theme small fw-bold text-uppercase pb-1 ${isActive("/products", "Women") ? "nav-link-active" : ""}`}>
              Women
            </Link>
          </li>
          <li>
            <Link to="/products?category=Kids" className={`text-decoration-none text-navbar-theme small fw-bold text-uppercase pb-1 ${isActive("/products", "Kids") ? "nav-link-active" : ""}`}>
              Kids
            </Link>
          </li>
        </ul>

        {/* Right Side Icons Container */}
        <div className="d-flex align-items-center gap-4">

          {/* 🟢 SEARCH BAR - Global Access */}
          <SearchBar />

          {/* 🟢 Wishlist Icon */}
          <Link to="/wishlist" className="position-relative text-danger text-decoration-none d-inline-block">
            <i className="bi bi-heart fs-4"></i>
            {wishlistCount > 0 && (
              <span className="position-absolute top-0 start-100 translate-middle badge rounded bg-black text-white small">
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* 🟢 3. Cart Icon & Badge */}
          <Link to="/cart" className="position-relative text-black text-decoration-none d-inline-block">
            <i className="bi bi-bag fs-4"></i>
            {totalItems > 0 && (
              <span className="position-absolute top-0 start-100 translate-middle badge  bg-black text-white small">
                {totalItems}
              </span>
            )}
          </Link>

          {/* 🟢 4. Profile / Login Dropdown */}
          <div className="dropdown d-flex align-items-center">
            <Link
              to={token ? "#" : "/login"}
              className="text-black text-decoration-none d-flex align-items-center"
              role="button"
              data-bs-toggle={token ? "dropdown" : ""}
              aria-expanded="false"
            >
              <i className="bi bi-person fs-4"></i>
            </Link>

            {/* Dropdown Menu (Only renders if logged in) */}
            {token && (
              <ul className="dropdown-menu dropdown-menu-end shadow-sm border-0 mt-3">
                <li><Link className="dropdown-item" to="/profile">My Profile</Link></li>
                <li><Link className="dropdown-item" to="/orders">My Orders</Link></li>
                <li><Link className="dropdown-item" to="/track-order">Track Order</Link></li>
                <li><hr className="dropdown-divider" /></li>
                <li>
                  <button
                    className="dropdown-item text-danger w-100 text-start fw-bold"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </li>
              </ul>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;