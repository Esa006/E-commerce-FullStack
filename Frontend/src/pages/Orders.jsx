import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ordersApi from "../api/orders";
import BackButton from "../components/BackButton";
import { getImageUrl, PLACEHOLDER_IMG } from "../utils/imageUtils";
import axios from "axios";



const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const controller = new AbortController();

        const fetchOrders = async () => {
            try {
                const response = await ordersApi.getMyOrders();
                // signal is handled by adding it to config if needed, but ordersApi doesn't pass it yet.
                // For now, focus on the state update guard.

                const data = response.data.orders || response.data.data || response.data;
                setOrders(Array.isArray(data) ? data : []);
            } catch (err) {
                if (axios.isCancel(err)) return;
                setError(err.response?.status === 401 ? "Please log in to view orders." : "Failed to load your orders. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
        return () => controller.abort();
    }, []);

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const getStatusBadge = (status) => {
        const s = status ? status.toLowerCase() : "";
        if (s === "delivered") return "bg-success";
        if (s === "shipped") return "bg-primary";
        if (s === "cancelled") return "bg-danger";
        return "bg-warning text-dark";
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center order-loading-container">
                <div className="spinner-border text-dark" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="container-fluid px-3 px-md-4 px-lg-5 py-5">

            {/* Back Button */}
            <BackButton to="/" label="Back" className="mb-3" />

            {/* Header: Title + Badge */}
            <div className="d-flex align-items-center justify-content-between mb-4">
                <h5 className="fw-bold text-uppercase m-0">My Orders</h5>

                <span className="badge bg-light text-dark border rounded-pill align-self-start align-self-md-center">
                    {orders.length} {orders.length === 1 ? "Order" : "Orders"}
                </span>
            </div>

            {error && (
                <div className="alert alert-danger">
                    <h6 className="fw-bold">Error Loading Orders</h6>
                    <p className="mb-0">{error}</p>
                </div>
            )}

            {orders.length === 0 && !error ? (
                <div className="card border-0 bg-light text-center p-4">
                    <h6 className="text-muted mb-2">You haven't placed any orders yet.</h6>
                    <Link to="/" className="btn btn-custom-primary btn-sm px-3 py-1 mx-auto">Start Shopping</Link>
                </div>
            ) : (
                <div className="d-flex flex-column gap-4">

                    {orders.map(order => (
                        <div key={order.id} className="card border-0 shadow-sm">

                            {/* Header */}
                            <div className="card-body border-bottom">
                                <div className="d-flex flex-column flex-md-row justify-content-between gap-3">

                                    <div className="d-flex flex-wrap gap-4">
                                        <div>
                                            <small className="text-muted text-uppercase">Order Placed</small>
                                            <div className="fw-semibold">{formatDate(order.created_at)}</div>
                                        </div>
                                        <div>
                                            <small className="text-muted text-uppercase">Total</small>
                                            <div className="fw-semibold">
                                                ₹{order?.total_amount || "0.00"}
                                            </div>
                                        </div>
                                        <div className="d-none d-md-block">
                                            <small className="text-muted text-uppercase">Order ID</small>
                                            <div className="fw-semibold">{order.order_number || `#${order.id}`}</div>
                                        </div>
                                    </div>

                                    <span className={`badge ${getStatusBadge(order.status)} text-center align-self-center px-3 py-2`}>
                                        {order.status}
                                    </span>

                                </div>
                            </div>

                            {/* Items */}
                            <div className="card-body p-0">
                                {(order.order_items || order.items || []).map((item, idx) => {
                                    const itemImages = item?.product?.image;
                                    const imageUrl = (Array.isArray(itemImages) && itemImages.length > 0)
                                        ? getImageUrl(itemImages[0])
                                        : (itemImages ? getImageUrl(itemImages) : PLACEHOLDER_IMG);

                                    return (
                                        <div key={idx} className="d-flex gap-3 p-3 border-top">
                                            <div>
                                                <img
                                                    src={imageUrl}
                                                    alt={item.product?.name || "Product"}
                                                    className="img-thumbnail object-fit-cover order-item-img"
                                                />
                                            </div>

                                            <div className="d-flex justify-content-between align-items-center w-100">
                                                <div>
                                                    <div className="fw-bold">
                                                        {item.product?.name || item.product_name || "Product"}
                                                    </div>
                                                    <small className="text-muted d-block">
                                                        Size: {item.size || 'N/A'}
                                                    </small>
                                                    <small className="text-muted">
                                                        Qty: {item.quantity}
                                                    </small>
                                                    <div className="fw-semibold">₹{item.price}</div>
                                                </div>
                                                {(order.status || '').toLowerCase() === 'delivered' && (
                                                    <Link
                                                        to={`/product/${item.product?.id || item.product_id}`}
                                                        className="btn btn-outline-dark btn-sm rounded-0"
                                                    >
                                                        Write Review
                                                    </Link>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                        </div>
                    ))}

                </div>
            )
            }
        </div >

    );
};

export default Orders;