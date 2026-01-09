import { Routes, Route } from "react-router-dom";
import "./App.css";

import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import TrackOrder from "./pages/TrackOrder";

import Login from "./auth/Login";
import Register from "./auth/Register";
import Navbar from "./components/Navbar"
import adminRoutes from "./admin/AdminRoutes";
import OrderSuccess from "./pages/OrderSuccess"; // Verify this file exists in src/pages/
import Profile from "./pages/Profile";
import Footer from "./components/Footer";
function App() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <div className="flex-grow-1">
        <Routes>

          {/* Customer Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />

          <Route path="/place-order" element={<Checkout />} />
          <Route path="/order-success" element={<OrderSuccess />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/track-order" element={<TrackOrder />} />

          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />

          {/* Admin Protected Routes */}
          {adminRoutes}
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default App;