import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ordersApi from "../api/orders";

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const [error, setError] = useState(null);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await ordersApi.getMyOrders();
            setOrders(response.data.orders || response.data || []);
        } catch (err) {
            console.error("Failed to fetch orders", err);
            setError(err.message || "Failed to load orders");
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status) => {
        const s = status.toLowerCase();
        if (s === 'delivered') return 'bg-success';
        if (s === 'shipped') return 'bg-info text-white';
        if (s === 'cancelled') return 'bg-danger';
        return 'bg-warning text-dark';
    };

    const formatDate = (dateString, fallbackDate) => {
        const d = dateString || fallbackDate;
        if (!d) return 'N/A';
        return new Date(d).toLocaleDateString("en-US", {
            year: "numeric", month: "long", day: "numeric",
        });
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center vh-100">
                <div className="spinner-border text-dark" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="container py-5" style={{ maxWidth: '900px', marginTop: '50px' }}>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h3 className="fw-bold text-uppercase m-0">My Orders</h3>
                <span className="badge bg-light text-dark border fs-6 rounded-pill">
                    {orders.length} {orders.length === 1 ? 'Order' : 'Orders'}
                </span>
            </div>

            {error && (
                <div className="alert alert-danger mb-4" role="alert">
                    <h4 className="alert-heading">Error Loading Orders</h4>
                    <p>{error}</p>
                    <hr />
                    <p className="mb-0">Please try logging out and logging in again.</p>
                </div>
            )}

            {orders.length === 0 && !error ? (
                <div className="card border-0 bg-light text-center py-5 rounded-3">
                    <div className="card-body">
                        <h5 className="text-muted mb-3">You haven't placed any orders yet.</h5>
                        <Link to="/" className="btn btn-dark px-4 py-2 text-uppercase fw-bold">
                            Start Shopping
                        </Link>
                    </div>
                </div>
            ) : (
                <div className="d-flex flex-column gap-4">
                    {orders.map((order) => (
                        <div key={order.id} className="card border shadow-sm rounded-3 overflow-hidden">
                            {/* Card Header */}
                            <div className="card-header bg-light border-bottom p-3">
                                <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
                                    <div className="d-flex gap-4">
                                        <div className="d-flex flex-column">
                                            <span className="text-uppercase text-muted" style={{ fontSize: '11px', fontWeight: '700' }}>Order Placed</span>
                                            <span className="small fw-semibold">{formatDate(order.created_at, order.items && order.items[0]?.created_at)}</span>
                                        </div>
                                        <div className="d-flex flex-column">
                                            <span className="text-uppercase text-muted" style={{ fontSize: '11px', fontWeight: '700' }}>Total</span>
                                            <span className="small fw-semibold">₹{order.total_amount || (order.items ? order.items.reduce((acc, item) => acc + (parseFloat(item.price) * item.quantity), 0).toFixed(2) : '0.00')}</span>
                                        </div>
                                        <div className="d-flex flex-column d-none d-sm-flex">
                                            <span className="text-uppercase text-muted" style={{ fontSize: '11px', fontWeight: '700' }}>Order ID</span>
                                            <span className="small fw-semibold">#{order.id}</span>
                                        </div>
                                    </div>
                                    
                                    <span className={`badge rounded-pill px-3 py-2 text-uppercase shadow-sm ${getStatusBadge(order.status)}`}>
                                        {order.status}
                                    </span>
                                </div>
                            </div>

                            {/* Card Body (Items) */}
                            <div className="card-body p-0">
                                {order.items && order.items.map((item, idx) => {
                                    const isLastItem = idx === order.items.length - 1;
                                    
                                    // Image Parsing Logic
                                    // Image Parsing Logic
                                    let imageUrl = "https://via.placeholder.com/80x100?text=No+Img";
                                    try {
                                        const rawImg = item.product?.image || item.image;
                                        if (rawImg) {
                                            if (typeof rawImg === 'string' && rawImg.startsWith('[')) {
                                                    // It's likely a JSON array string
                                                    const parsed = JSON.parse(rawImg);
                                                    const imgPath = Array.isArray(parsed) ? parsed[0] : parsed;
                                                    imageUrl = `http://127.0.0.1:8000/storage/${imgPath}`;
                                            } else if (typeof rawImg === 'string') {
                                                    // It's a plain string path
                                                    imageUrl = `http://127.0.0.1:8000/storage/${rawImg}`;
                                            }
                                        }
                                    } catch (e) {
                                        console.error("Image parsing error, using raw:", e);
                                        // Fallback: try using raw if parse failed but it's a string
                                        const rawImg = item.product?.image || item.image;
                                        if (typeof rawImg === 'string') {
                                                imageUrl = `http://127.0.0.1:8000/storage/${rawImg}`;
                                        }
                                    }

                                    return (
                                        <div 
                                            key={idx} 
                                            className={`d-flex gap-3 p-3 ${!isLastItem ? 'border-bottom' : ''}`}
                                        >
                                            <img 
                                                src={imageUrl} 
                                                alt={item.product_name} 
                                                className="rounded border object-fit-cover bg-secondary bg-opacity-10 order-item-img"
                                                style={{}}
                                            />
                                            
                                            <div className="d-flex flex-column justify-content-center">
                                                <h6 className="mb-1 fw-bold text-dark">
                                                    {item.product_name || item.product?.name || "Product Name"}
                                                </h6>
                                                <div className="d-flex align-items-center gap-3 text-muted small mb-2">
                                                    <span className="bg-light border px-2 rounded">Size: {item.size || "N/A"}</span>
                                                    <span>Qty: {item.quantity}</span>
                                                </div>
                                                <span className="fw-bold text-dark">₹{item.price}</span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            )}

        </div>
    );
};

export default Orders;