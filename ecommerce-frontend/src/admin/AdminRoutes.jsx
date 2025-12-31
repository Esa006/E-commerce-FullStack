import { Route, Navigate } from "react-router-dom";

import AdminLayout from "./AdminLayout";
import AdminDashboard from "./AdminDashboard";
import AdminProducts from "./AdminProducts";
import AdminOrders from "./AdminOrders";
import ProductForm from "./ProductForm";

const adminRoutes = (
   <Route path="/admin" element={<AdminLayout />}>
    
    {/* Default redirect to dashboard */}
    <Route index element={<Navigate to="/admin/dashboard" replace />} />
    
    {/* Dashboard */}
    <Route path="dashboard" element={<AdminDashboard />} />

    {/* Product Management */}
    <Route path="products" element={<AdminProducts />} />
    <Route path="products/add" element={<ProductForm />} />

    {/* Order Management */}
    <Route path="orders" element={<AdminOrders />} />
  </Route>
);

export default adminRoutes;
// {/* <Route path="/admin" element={<AdminLayout />}>
//     <Route path="dashboard" element={<AdminDashboard />} />
// {/* ✅ மாற்றம் 2: யாராவது வெறும் '/admin' என்று அடித்தால், அவர்களை 'dashboard'-க்கு அனுப்பவும் */}
//     <Route index element={<Navigate to="/admin/dashboard" replace />} />
//     <Route path="products" element={<AdminProducts />} />
//     <Route path="orders" element={<AdminOrders />} />
//   <Route path="products/add" element={<ProductForm />} /> */}