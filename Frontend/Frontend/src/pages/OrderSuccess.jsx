import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaCheckCircle, FaBox, FaTruck, FaHome } from "react-icons/fa";
import ordersApi from "../api/orders";
import Swal from "sweetalert2";

export default function OrderSuccess() {
    const location = useLocation();
    const navigate = useNavigate();

    const [orderData, setOrderData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check for order data from navigation state (Checkout passes { order: ... })
        const stateOrder = location.state?.order;
        const stateData = location.state?.orderData || stateOrder;
        const stateOrderId = location.state?.orderId;

        console.log("OrderSuccess state:", location.state);

        if (stateData && stateData.id) {
            // Normalize order_items to items if needed
            const normalizedData = {
                ...stateData,
                items: stateData.items || stateData.order_items || []
            };
            setOrderData(normalizedData);
            setLoading(false);
        } else if (stateOrderId) {
            fetchOrderDetails(stateOrderId);
        } else {
            Swal.fire({
                icon: "warning",
                title: "No Order Data",
                text: "No order information available.",
            }).then(() => navigate("/orders"));
            setLoading(false);
        }
    }, [location.state]);

    const fetchOrderDetails = async (orderId) => {
        try {
            const res = await ordersApi.getOrderDetails(orderId);
            const data = res.data?.order || res.data?.data || res.data;
            if (data?.id) setOrderData(data);
            else throw new Error();
        } catch {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Unable to load order.",
            }).then(() => navigate("/orders"));
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (d) =>
        d
            ? new Date(d).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
            })
            : "N/A";

    const getStatusBadge = (s) => {
        s = s?.toLowerCase();
        if (s === "delivered") return "bg-success";
        if (s === "shipped") return "bg-info text-white";
        if (s === "cancelled") return "bg-danger";
        return "bg-warning text-dark";
    };

    const getStatusTimeline = (status) => {
        const steps = [
            { key: "pending", label: "Order Placed", icon: <FaCheckCircle /> },
            { key: "processing", label: "Processing", icon: <FaBox /> },
            { key: "shipped", label: "Shipped", icon: <FaTruck /> },
            { key: "delivered", label: "Delivered", icon: <FaHome /> },
        ];
        const order = ["pending", "processing", "shipped", "delivered"];
        const idx = order.indexOf(status?.toLowerCase());
        return steps.map((s, i) => ({
            ...s,
            completed: i <= idx,
            active: i === idx,
        }));
    };

    if (loading) {
        return (
            <div className="container-fluid py-5 text-center">
                <div className="spinner-border text-dark" />
            </div>
        );
    }

    if (!orderData) return null;

    return (
        <div className="container-fluid px-3 px-md-4 px-lg-5 py-5">

            {/* HEADER */}
            <div className="text-center mb-5">
                <FaCheckCircle size={60} className="text-success mb-3" />
                <h4 className="fw-bold text-uppercase">Order Placed Successfully</h4>
                <p className="text-muted">Thank you for shopping with us.</p>
            </div>

            {/* STATUS */}
            <div className="card border-0 shadow-sm mb-4">
                <div className="card-body p-3 p-md-4">
                    <h6 className="fw-bold mb-4">Order Status</h6>

                    <div className="d-flex justify-content-between text-center mb-4">
                        {getStatusTimeline(orderData.status).map((s, i) => (
                            <div key={i} className="flex-fill d-flex flex-column align-items-center">
                                <div className={`rounded-circle p-3 mb-2 ${s.completed ? "bg-success text-white" :
                                    s.active ? "bg-primary text-white" : "bg-light text-muted"
                                    }`}>
                                    {s.icon}
                                </div>
                                <small className={s.completed || s.active ? "fw-bold" : "text-muted"}>
                                    {s.label}
                                </small>
                            </div>
                        ))}
                    </div>

                    <span className={`badge ${getStatusBadge(orderData.status)} px-3 py-2`}>
                        {orderData.status}
                    </span>
                </div>
            </div>

            {/* INFO */}
            <div className="card border-0 shadow-sm mb-4">
                <div className="card-body p-3 p-md-4">
                    <div className="d-flex flex-column flex-md-row gap-4">
                        <div className="flex-fill">
                            <small className="text-muted">Order Number</small>
                            <div className="fw-bold">{orderData.order_number || `#${orderData.id}`}</div>
                        </div>
                        <div className="flex-fill">
                            <small className="text-muted">Order Date</small>
                            <div>{formatDate(orderData.created_at)}</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ITEMS */}
            <div className="card border-0 shadow-sm mb-4">
                <div className="card-body p-3 p-md-4">
                    {orderData.items.map((item, i) => (
                        <div key={i} className="d-flex flex-column flex-sm-row gap-3 border-bottom pb-3 mb-3">
                            <img src="https://via.placeholder.com/100" className="img-thumbnail" alt="" />
                            <div>
                                <div className="fw-bold">{item.product_name}</div>
                                <small>Qty: {item.quantity}</small>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ACTIONS */}
            <div className="d-grid d-sm-flex justify-content-center gap-3">
                <Link to="/orders" className="btn btn-dark">My Orders</Link>
                <Link to="/" className="btn btn-outline-dark">Shop More</Link>
            </div>

        </div>
    );
}
