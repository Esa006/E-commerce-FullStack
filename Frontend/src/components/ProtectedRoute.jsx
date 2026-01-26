import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = () => {
    const { token } = useContext(AuthContext);

    if (!token) {
        // Redirect to login if no token is found
        return <Navigate to="/login" replace />;
    }

    // Render the child routes if authenticated
    return <Outlet />;
};

export default ProtectedRoute;
