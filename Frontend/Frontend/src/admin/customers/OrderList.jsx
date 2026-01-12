import React from "react";
import { useEffect, useState } from 'react';
import AdminApi from "../../api/admin";
import { FaShoppingCart, FaCalendarAlt, FaMoneyBillWave } from "react-icons/fa";

export default function OrderList() {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const fetchOrders = async () => {
            const res = await AdminApi.getAllOrders();
            setOrders(res.data);
        };
        fetchOrders();
    }, []);

    return (
        <div className="card shadow border-0">
            <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center">
                <h5 className="mb-0 fw-bold"><FaShoppingCart className="me-2 text-success" /> Order Management</h5>
                <span className="badge bg-success">{orders.length} Total Orders</span>
            </div>
            <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                    <thead className="table-light">
                        <tr>
                            <th>Order ID</th>
                            <th>Customer Name</th>
                            <th>Total Price</th>
                            <th>Status</th>
                            <th>Order Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map(order => (
                            <tr key={order.id}>
                                <td><strong>#{order.id}</strong></td>
                                <td>{order.user?.name}</td>
                                <td><FaMoneyBillWave className="text-success me-1"/> ₹{order.total_amount}</td>
                                <td>
                                    <span className={`badge ${order.status === 'pending' ? 'bg-warning text-dark' : 'bg-success'}`}>
                                        {order.status.toUpperCase()}
                                    </span>
                                </td>
                                <td><FaCalendarAlt className="me-1 text-muted"/> {new Date(order.created_at).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}