import React, { useState } from "react";
import ordersApi from "../api/orders";
import Swal from "sweetalert2";
import { FaCheckCircle, FaBox, FaTruck, FaHome } from "react-icons/fa";

const TrackOrder = () => {
    const [orderNumber, setOrderNumber] = useState("");
    const [email, setEmail] = useState("");
    const [orderData, setOrderData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);

    const handleTrackOrder = async (e) => {
        e.preventDefault();

        // Validation
        if (!orderNumber.trim() || !email.trim()) {
            Swal.fire({
                icon: "warning",
                title: "Missing Information",
                text: "Please enter both order number and email address.",
                confirmButtonColor: "#000",
            });
            return;
        }

        setLoading(true);
        setSearched(false);

        try {
            const response = await ordersApi.trackOrder(orderNumber, email);

            if (response.data && response.data.order) {
                setOrderData(response.data.order);
                setSearched(true);
            } else {
                throw new Error("Invalid response format");
            }
        } catch (error) {
            console.error("Track order error:", error);

            const errorMessage = error.response?.data?.message || "Order not found. Please check your order number and email.";

            Swal.fire({
                icon: "error",
                title: "Order Not Found",
                text: errorMessage,
                confirmButtonColor: "#dc3545",
            });

            setOrderData(null);
            setSearched(false);
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status) => {
        const s = status?.toLowerCase() || "";
        if (s === "delivered") return "bg-success";
        if (s === "shipped") return "bg-info text-white";
        if (s === "cancelled") return "bg-danger";
        return "bg-warning text-dark";
    };

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    // Status timeline configuration
    const getStatusTimeline = (status) => {
        const s = status?.toLowerCase() || "pending";

        const statuses = [
            { key: "pending", label: "Order Placed", icon: <FaCheckCircle /> },
            { key: "processing", label: "Processing", icon: <FaBox /> },
            { key: "shipped", label: "Shipped", icon: <FaTruck /> },
            { key: "delivered", label: "Delivered", icon: <FaHome /> },
        ];

        const statusOrder = ["pending", "processing", "shipped", "delivered"];
        const currentIndex = statusOrder.indexOf(s);

        return statuses.map((item, idx) => ({
            ...item,
            completed: idx <= currentIndex,
            active: idx === currentIndex,
        }));
    };

    return (
        <div className="container mt-5 pt-5 mb-5">
            <div className="row justify-content-center">
                <div className="col-lg-10">
                    {/* Header */}
                    <div className="text-center mb-5">
                        <h2 className="fw-bold text-uppercase mb-2">Track Your Order</h2>
                        <p className="text-muted">Enter your order details to track your shipment</p>
                    </div>

                    {/* Track Order Form */}
                    <div className="card shadow-sm border-0 mb-5">
                        <div className="card-body p-4">
                            <form onSubmit={handleTrackOrder}>
                                <div className="row g-3">
                                    <div className="col-md-5">
                                        <label className="form-label fw-semibold">Order Number</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="e.g., ORD-123456"
                                            value={orderNumber}
                                            onChange={(e) => setOrderNumber(e.target.value)}
                                            disabled={loading}
                                        />
                                    </div>
                                    <div className="col-md-5">
                                        <label className="form-label fw-semibold">Email Address</label>
                                        <input
                                            type="email"
                                            className="form-control"
                                            placeholder="your@email.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            disabled={loading}
                                        />
                                    </div>
                                    <div className="col-md-2 d-flex align-items-end">
                                        <button
                                            type="submit"
                                            className="btn btn-dark w-100 fw-bold"
                                            disabled={loading}
                                        >
                                            {loading ? (
                                                <>
                                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                    Tracking...
                                                </>
                                            ) : (
                                                "Track"
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Order Details Section */}
                    {searched && orderData && (
                        <div className="order-details-section">
                            {/* Order Status Timeline */}
                            <div className="card shadow-sm border-0 mb-4">
                                <div className="card-body p-4">
                                    <h5 className="fw-bold mb-4">Order Status</h5>

                                    {/* Bootstrap Timeline */}
                                    <div className="row text-center mb-4">
                                        {getStatusTimeline(orderData.status).map((item, idx) => (
                                            <div key={idx} className="col-3">
                                                <div className="d-flex flex-column align-items-center">
                                                    <div
                                                        className={`rounded-circle d-flex align-items-center justify-content-center mb-2 ${item.completed
                                                                ? 'bg-success text-white'
                                                                : item.active
                                                                    ? 'bg-primary text-white'
                                                                    : 'bg-light text-muted'
                                                            }`}
                                                        style={{ width: '60px', height: '60px', fontSize: '1.5rem' }}
                                                    >
                                                        {item.icon}
                                                    </div>
                                                    <p className={`mb-0 small ${item.completed
                                                            ? 'text-success fw-bold'
                                                            : item.active
                                                                ? 'text-primary fw-bold'
                                                                : 'text-muted'
                                                        }`}>
                                                        {item.label}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="mt-4 p-3 bg-light rounded">
                                        <div className="row">
                                            <div className="col-md-6">
                                                <p className="mb-1 small text-muted">Current Status</p>
                                                <span className={`badge ${getStatusBadge(orderData.status)} px-3 py-2 text-uppercase`}>
                                                    {orderData.status}
                                                </span>
                                            </div>
                                            {orderData.tracking_number && (
                                                <div className="col-md-6">
                                                    <p className="mb-1 small text-muted">Tracking Number</p>
                                                    <p className="mb-0 fw-bold">{orderData.tracking_number}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Order Information */}
                            <div className="card shadow-sm border-0 mb-4">
                                <div className="card-body p-4">
                                    <h5 className="fw-bold mb-4">Order Information</h5>

                                    <div className="row g-3">
                                        <div className="col-md-6">
                                            <p className="mb-1 small text-muted text-uppercase">Order Number</p>
                                            <p className="mb-0 fw-bold">{orderData.order_number || `#${orderData.id}`}</p>
                                        </div>
                                        <div className="col-md-6">
                                            <p className="mb-1 small text-muted text-uppercase">Order Date</p>
                                            <p className="mb-0">{formatDate(orderData.created_at)}</p>
                                        </div>
                                        <div className="col-md-6">
                                            <p className="mb-1 small text-muted text-uppercase">Total Amount</p>
                                            <p className="mb-0 fw-bold text-dark fs-5">₹{orderData.total_amount}</p>
                                        </div>
                                        <div className="col-md-6">
                                            <p className="mb-1 small text-muted text-uppercase">Payment Method</p>
                                            <p className="mb-0">{orderData.payment_method || "COD"}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Delivery Address */}
                            <div className="card shadow-sm border-0 mb-4">
                                <div className="card-body p-4">
                                    <h5 className="fw-bold mb-3">Delivery Address</h5>
                                    <div className="p-3 bg-light rounded">
                                        <p className="mb-1 fw-semibold">{orderData.customer_name || orderData.user?.name}</p>
                                        <p className="mb-1">{orderData.address}</p>
                                        {orderData.address_line2 && <p className="mb-1">{orderData.address_line2}</p>}
                                        <p className="mb-1">{orderData.city}, {orderData.state} - {orderData.zip_code}</p>
                                        <p className="mb-1">{orderData.country || "India"}</p>
                                        <p className="mb-0 mt-2">
                                            <span className="text-muted">Phone:</span> {orderData.phone}
                                        </p>
                                        <p className="mb-0">
                                            <span className="text-muted">Email:</span> {orderData.email}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Order Items */}
                            <div className="card shadow-sm border-0">
                                <div className="card-body p-4">
                                    <h5 className="fw-bold mb-4">Order Items</h5>

                                    {orderData.items && orderData.items.map((item, idx) => {
                                        let imageUrl = "https://via.placeholder.com/80x100?text=No+Img";
                                        try {
                                            const rawImg = item.product?.image || item.image;
                                            if (rawImg) {
                                                const parsed = JSON.parse(rawImg);
                                                const imgPath = Array.isArray(parsed) ? parsed[0] : parsed;
                                                imageUrl = `http://127.0.0.1:8000/storage/${imgPath}`;
                                            }
                                        } catch (e) {
                                            console.error("Image parsing error:", e);
                                        }

                                        return (
                                            <div key={idx} className={`d-flex gap-3 align-items-start ${idx !== orderData.items.length - 1 ? 'border-bottom pb-3 mb-3' : ''}`}>
                                                <img
                                                    src={imageUrl}
                                                    alt="product"
                                                    className="rounded border object-fit-cover"
                                                    style={{ width: "80px", height: "100px" }}
                                                    onError={(e) => {
                                                        e.target.src = "https://via.placeholder.com/80x100?text=Error";
                                                    }}
                                                />
                                                <div className="flex-grow-1">
                                                    <h6 className="mb-1 fw-bold">
                                                        {item.product_name || item.product?.name || "Product Name"}
                                                    </h6>
                                                    <p className="mb-1 text-muted small">
                                                        Size: {item.size || "N/A"} | Qty: {item.quantity}
                                                    </p>
                                                    <p className="mb-0 fw-semibold text-dark">₹{item.price}</p>
                                                </div>
                                            </div>
                                        );
                                    })}

                                    <div className="mt-4 pt-3 border-top">
                                        <div className="d-flex justify-content-between">
                                            <span className="fw-bold fs-5">Total</span>
                                            <span className="fw-bold fs-5 text-dark">₹{orderData.total_amount}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TrackOrder;
