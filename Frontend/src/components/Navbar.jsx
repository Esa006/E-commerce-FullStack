import React from "react";
import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { WishlistContext } from "../context/WishlistContext";

const Navbar = () => {
  const { cartItems } = useContext(CartContext);
  const { wishlistItems } = useContext(WishlistContext);
  const wishlistCount = wishlistItems ? wishlistItems.length : 0;
  const navigate = useNavigate();
  const token = localStorage.getItem("ACCESS_TOKEN");

  const logout = () => {
    localStorage.removeItem("ACCESS_TOKEN");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const totalItems = cartItems ? cartItems.reduce((total, item) => total + item.quantity, 0) : 0;

  return (
    // 🟢 1. Navbar Container: White background, bottom border, sticky
    <nav className="navbar navbar-expand-lg bg-white border-bottom sticky-top py-3">
      <div className="container">
        
        {/* 🟢 2. Brand: Bold, Uppercase, Black */}
        <Link className="navbar-brand fw-bold fs-3 text-uppercase text-black" to="/">
          Forever
        </Link>

        {/* Right Side Icons Container */}
        <div className="d-flex align-items-center gap-4">
          
          {/* 🟢 Wishlist Icon */}
          <Link to="/wishlist" className="position-relative text-danger text-decoration-none">
            <i className="bi bi-heart fs-4"></i>
            {wishlistCount > 0 && (
               <span 
                 className="position-absolute top-0 start-100 translate-middle badge rounded-circle bg-black text-white"
                 style={{ fontSize: '0.7rem', padding: '0.35em 0.5em' }}
               >
                 {wishlistCount}
               </span>
            )}
          </Link>

          {/* 🟢 3. Cart Icon & Badge */}
          <Link to="/cart" className="position-relative text-black text-decoration-none">
            <i className="bi bi-bag fs-4"></i>
            {totalItems > 0 && (
              <span 
                className="position-absolute top-0 start-100 translate-middle badge rounded-circle bg-black text-white"
                style={{ fontSize: '0.7rem', padding: '0.35em 0.5em' }}
              >
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
                        onClick={logout}
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