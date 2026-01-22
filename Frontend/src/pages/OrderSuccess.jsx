import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaCheckCircle, FaBox, FaTruck, FaHome, FaMapMarkerAlt, FaFileInvoiceDollar } from "react-icons/fa";
import ordersApi from "../api/orders";
import Swal from "sweetalert2";
import { parseImages, getImageUrl, PLACEHOLDER_IMG } from "../utils/imageUtils";

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

        if (stateData) {
            // Normalize: sometimes data is nested in .data (from axios response or manual wrapping)
            const actualData = stateData.data || stateData;

            if (actualData.id) {
                // Normalize order_items to items if needed
                const normalizedData = {
                    ...actualData,
                    items: actualData.items || actualData.order_items || []
                };
                setOrderData(normalizedData);
                setLoading(false);
                return;
            }
        }

        if (stateOrderId) {
            fetchOrderDetails(stateOrderId);
        } else {
            // Fallback: try to see if just an ID was passed in state directly (unlikely but safe)
            // If completely empty, redirect
            Swal.fire({
                icon: "warning",
                title: "No Order Data",
                text: "No order information available.",
            }).then(() => navigate("/orders"));
            setLoading(false);
        }
    }, [location.state, navigate]);

    const fetchOrderDetails = async (orderId) => {
        try {
            const res = await ordersApi.getOrderDetails(orderId);
            const data = res.data?.order || res.data?.data || res.data;
            if (data?.id) {
                const normalizedData = {
                    ...data,
                    items: data.items || data.order_items || []
                };
                setOrderData(normalizedData);
            }
            else throw new Error();
        } catch (error) {
            console.error("Fetch order error:", error);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Unable to load order details.",
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
                hour: "2-digit",
                minute: "2-digit"
            })
            : "N/A";

    const getStatusBadge = (s) => {
        s = s?.toLowerCase();
        if (s === "delivered") return "bg-success";
        if (s === "shipped") return "bg-info text-white";
        if (s === "cancelled") return "bg-danger";
        return "bg-warning text-dark"; // pending, processing
    };

    const getStatusTimeline = (status) => {
        const steps = [
            { key: "pending", label: "Ordered", icon: <FaCheckCircle /> },
            { key: "processing", label: "Processing", icon: <FaBox /> },
            { key: "shipped", label: "Shipped", icon: <FaTruck /> },
            { key: "delivered", label: "Delivered", icon: <FaHome /> },
        ];

        // Simple mapping for status progress
        const statusOrder = ["pending", "processing", "shipped", "delivered"];

        let currentStatus = status?.toLowerCase() || "pending";
        // Handle variations if backend sends different strings
        if (currentStatus === 'placed') currentStatus = 'pending';

        const idx = statusOrder.indexOf(currentStatus);

        return steps.map((s, i) => ({
            ...s,
            completed: idx !== -1 && i <= idx,
            active: idx !== -1 && i === idx,
        }));
    };

    if (loading) {
        return (
            <div className="container-fluid py-5 text-center order-success-loading">
                <div className="spinner-border text-dark" />
                <p className="mt-3 text-muted">Loading order details...</p>
            </div>
        );
    }

    if (!orderData) return null;

    const calculateSubtotal = () => {
        return orderData.items.reduce((sum, item) => sum + (parseFloat(item.price) * item.quantity), 0);
    };

    const subtotal = orderData.subtotal || calculateSubtotal();
    const shipping = orderData.shipping_fee || 10; // Default from Checkout.jsx logic if missing
    const total = orderData.total_amount || (subtotal + shipping);

    return (
        <div className="container py-5 mt-5">
            {/* SUCCESS HEADER */}
            <div className="text-center mb-5">
                <FaCheckCircle size={64} className="text-success mb-3" />
                <h2 className="fw-bold text-uppercase">Thank You!</h2>
                <p className="text-muted fs-5">Your order has been placed successfully.</p>
                <p className="">
                    <span className="text-muted">Order #</span>
                    <span className="fw-bold text-dark ms-1">{orderData.order_number || orderData.id}</span>
                    <span className={`badge ms-2 ${getStatusBadge(orderData.status)}`}>{orderData.status}</span>
                </p>
            </div>

            <div className="row g-4">

                {/* LEFT COLUMN: DETAILS & ITEMS */}
                <div className="col-lg-8">

                    {/* STATUS TRACKER */}
                    <div className="card border-0 shadow-sm mb-4">
                        <div className="card-body p-4">
                            <h5 className="fw-bold mb-4">Order Status</h5>
                            <div className="position-relative">
                                {/* Connector Line (Optional, CSS can do this better but simple works) */}
                                <div className="d-flex justify-content-between text-center position-relative z-1">
                                    {getStatusTimeline(orderData.status).map((s, i) => (
                                        <div key={i} className="flex-fill d-flex flex-column align-items-center">
                                            <div
                                                className={`rounded-circle d-flex align-items-center justify-content-center mb-2 shadow-sm transition-all`}
                                                style={{
                                                    width: '50px',
                                                    height: '50px',
                                                    backgroundColor: s.completed ? '#198754' : (s.active ? '#0d6efd' : '#e9ecef'),
                                                    color: (s.completed || s.active) ? '#fff' : '#6c757d',
                                                    fontSize: '1.2rem'
                                                }}
                                            >
                                                {s.icon}
                                            </div>
                                            <small className={`${(s.completed || s.active) ? "fw-bold text-dark" : "text-muted"}`}>
                                                {s.label}
                                            </small>
                                        </div>
                                    ))}
                                </div>
                                {/* Background Line */}
                                <div className="position-absolute top-0 start-0 w-100 mt-4 translate-middle-y z-0" style={{ height: '2px', backgroundColor: '#e9ecef', top: '25px' }}>
                                    <div
                                        className="h-100 bg-success transition-all"
                                        style={{ width: `${(getStatusTimeline(orderData.status).filter(step => step.completed).length / 4) * 100}%` }}
                                    ></div>
                                </div>
                            </div>

                            {orderData.status === 'cancelled' && (
                                <div className="alert alert-danger mt-4 mb-0">
                                    This order has been cancelled.
                                </div>
                            )}
                        </div>
                    </div>

                    {/* ITEMS LIST */}
                    <div className="card border-0 shadow-sm mb-4">
                        <div className="card-header bg-white py-3">
                            <h5 className="fw-bold mb-0">Order Items ({orderData.items.length})</h5>
                        </div>
                        <div className="card-body p-0">
                            {orderData.items.map((item, i) => {
                                // Try to resolve image
                                const rawImage = item.product_image || item.image || item.product?.image;
                                const images = parseImages(rawImage);
                                const displayImage = images.length > 0 ? getImageUrl(images[0]) : PLACEHOLDER_IMG;

                                return (
                                    <div key={i} className="d-flex align-items-center p-3 border-bottom last-border-0 gap-3">
                                        <div className="flex-shrink-0" style={{ width: '80px', height: '80px' }}>
                                            <img
                                                src={displayImage}
                                                className="img-fluid rounded object-fit-cover w-100 h-100 border"
                                                alt={item.product_name || "Product"}
                                                onError={(e) => e.target.src = PLACEHOLDER_IMG}
                                            />
                                        </div>
                                        <div className="flex-grow-1">
                                            <h6 className="fw-bold mb-1">{item.product_name || item.name || "Product Name"}</h6>
                                            <div className="text-muted small">
                                                {item.size && <span className="me-3">Size: {item.size}</span>}
                                                <span>Qty: {item.quantity}</span>
                                            </div>
                                        </div>
                                        <div className="text-end">
                                            <span className="fw-bold">₹{parseFloat(item.price).toFixed(2)}</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN: SUMMARY & ADDRESS */}
                <div className="col-lg-4">

                    {/* SHIPPING ADDRESS */}
                    <div className="card border-0 shadow-sm mb-4">
                        <div className="card-header bg-white py-3">
                            <h5 className="fw-bold mb-0 d-flex align-items-center gap-2">
                                <FaMapMarkerAlt className="text-primary" /> Delivery Address
                            </h5>
                        </div>
                        <div className="card-body">
                            <h6 className="fw-bold">{orderData.first_name} {orderData.last_name}</h6>
                            <p className="text-muted mb-1">{orderData.address}</p>
                            {orderData.address_line2 && <p className="text-muted mb-1">{orderData.address_line2}</p>}
                            <p className="text-muted mb-1">
                                {orderData.city}{orderData.district ? `, ${orderData.district}` : ''}
                            </p>
                            <p className="text-muted mb-3">
                                {orderData.state} - {orderData.zip_code}, {orderData.country}
                            </p>
                            <p className="mb-0 small">
                                <span className="fw-bold">Phone:</span> {orderData.phone}
                            </p>
                            <p className="mb-0 small">
                                <span className="fw-bold">Email:</span> {orderData.email}
                            </p>
                        </div>
                    </div>

                    {/* PAYMENT SUMMARY */}
                    <div className="card border-0 shadow-sm mb-4">
                        <div className="card-header bg-white py-3">
                            <h5 className="fw-bold mb-0 d-flex align-items-center gap-2">
                                <FaFileInvoiceDollar className="text-primary" /> Order Summary
                            </h5>
                        </div>
                        <div className="card-body">
                            <div className="d-flex justify-content-between mb-2">
                                <span className="text-muted">Subtotal</span>
                                <span>₹{subtotal.toFixed(2)}</span>
                            </div>
                            <div className="d-flex justify-content-between mb-2">
                                <span className="text-muted">Shipping</span>
                                <span>₹{shipping.toFixed(2)}</span>
                            </div>
                            <hr />
                            <div className="d-flex justify-content-between fw-bold fs-5">
                                <span>Total</span>
                                <span>₹{total.toFixed(2)}</span>
                            </div>

                            <div className="mt-3 pt-3 border-top">
                                <small className="text-muted text-uppercase fw-bold d-block mb-1">Payment Method</small>
                                <span>{orderData.payment_method === 'cod' ? 'Cash on Delivery' : orderData.payment_method || 'Online'}</span>
                            </div>
                            <div className="mt-2">
                                <small className="text-muted text-uppercase fw-bold d-block mb-1">Order Date</small>
                                <span>{formatDate(orderData.created_at)}</span>
                            </div>
                        </div>
                    </div>

                    {/* ACTIONS */}
                    <div className="d-grid gap-2">
                        <Link to="/orders" className="btn btn-primary py-2">View All Orders</Link>
                        <Link to="/" className="btn btn-outline-dark py-2">Continue Shopping</Link>
                    </div>

                </div>
            </div>
        </div >
    );
}
