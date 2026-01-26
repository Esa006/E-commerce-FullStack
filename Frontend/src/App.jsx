import React, { Suspense } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import "./App.css";

// Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// Lazy Load Pages
const Home = React.lazy(() => import("./pages/Home"));
const Products = React.lazy(() => import("./pages/Products"));
const ProductDetails = React.lazy(() => import("./pages/ProductDetails"));
const Cart = React.lazy(() => import("./pages/Cart"));
const Wishlist = React.lazy(() => import("./pages/Wishlist"));
const Checkout = React.lazy(() => import("./pages/Checkout"));
const Orders = React.lazy(() => import("./pages/Orders"));
const TrackOrder = React.lazy(() => import("./pages/TrackOrder"));
const OrderSuccess = React.lazy(() => import("./pages/OrderSuccess"));
const Profile = React.lazy(() => import("./pages/Profile"));

// Static Pages
const About = React.lazy(() => import("./pages/About"));
const Contact = React.lazy(() => import("./pages/Contact"));
const FAQ = React.lazy(() => import("./pages/FAQ"));
const Returns = React.lazy(() => import("./pages/Returns"));
const CancellationPolicy = React.lazy(() => import("./pages/CancellationPolicy"));

// Auth
const Login = React.lazy(() => import("./auth/Login"));
const Register = React.lazy(() => import("./auth/Register"));
const ForgotPassword = React.lazy(() => import("./pages/ForgotPassword"));
const ResetPassword = React.lazy(() => import("./pages/ResetPassword"));

import ErrorBoundary from "./components/ErrorBoundary";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const location = useLocation();
  const isNoLayout = ['/login', '/register', '/forgot-password', '/reset-password'].includes(location.pathname);

  return (
    <div className="d-flex flex-column min-vh-100">
      {!isNoLayout && <Navbar />}

      <div className="flex-grow-1">
        <ErrorBoundary>
          <Suspense fallback={
            <div className="d-flex justify-content-center align-items-center loading-main">
              <div className="spinner-border text-dark" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          }>
            <Routes>
              {/* Customer Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/product/:id" element={<ProductDetails />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/wishlist" element={<Wishlist />} />

              {/* Protected Routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="/place-order" element={<Checkout />} />
                <Route path="/order-success" element={<OrderSuccess />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/track-order" element={<TrackOrder />} />
                <Route path="/profile" element={<Profile />} />
              </Route>

              {/* Static Pages */}
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/returns" element={<Returns />} />
              <Route path="/cancellations" element={<CancellationPolicy />} />

              {/* Auth Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />


            </Routes>
          </Suspense>
        </ErrorBoundary>
      </div>
      {!isNoLayout && <Footer />}
    </div>
  );
}

export default App;