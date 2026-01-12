import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import { Link } from "react-router-dom";

export default function AdminLayout() {
   
    const token = localStorage.getItem("admin_token") || localStorage.getItem("ACCESS_TOKEN");

    if (!token) {
        return <Navigate to="/admin/login" />;
    }

    return (
        <div className="d-flex min-vh-100">
            {/* Sidebar */}
            <div className="bg-dark text-white p-3 admin-sidebar">
                <h4 className="text-center mb-4">Admin Panel</h4>
                <ul className="nav flex-column gap-2">
                    <li className="nav-item">
                        <Link to="/admin" className="nav-link text-white bg-secondary bg-opacity-25 rounded">
                             Dashboard
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/admin/products" className="nav-link text-white hover-effect">
                             Products
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/admin/orders" className="nav-link text-white hover-effect">
                            <p> Orders</p>
                        </Link>
                    </li>
                </ul>
            </div>

            {/* Main Content Area */}
            <div className="flex-grow-1 bg-light">
                <div className="p-4">
                    <Outlet /> 
                </div>
            </div>
        </div>
    );
}