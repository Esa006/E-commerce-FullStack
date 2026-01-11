import React from "react";
import { Route, Navigate } from "react-router-dom";

import AdminLayout from "./AdminLayout";
import AdminDashboard from "./AdminDashboard";
import AdminProducts from "./AdminProducts";
import AdminOrders from "./AdminOrders";
import ProductForm from "./ProductForm";
import ProductStock from "./ProductStock";

const adminRoutes = (
   <Route path="/admin" element={<AdminLayout />}>
    
    {/* Default redirect to dashboard */}
    <Route index element={<Navigate to="/admin/dashboard" replace />} />
    
    {/* Dashboard */}
    <Route path="dashboard" element={<AdminDashboard />} />

    {/* Product Management */}
    <Route path="products" element={<AdminProducts />} />
    <Route path="products/add" element={<ProductForm />} />
        <Route path="product/stock" element={<ProductStock />} />


    {/* Order Management */}
    <Route path="orders" element={<AdminOrders />} />
  </Route>
);

export default adminRoutes;