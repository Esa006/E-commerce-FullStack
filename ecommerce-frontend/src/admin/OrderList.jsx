import { useEffect, useState } from 'react';
import AdminApi from "../../api/admin";
import { FaClipboardList, FaCheckCircle, FaTruck, FaClock } from "react-icons/fa";

export default function OrderList() {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const res = await AdminApi.getAllOrders();
            // Laravel returns res.data.orders or res.data
            setOrders(res.data.orders || res.data || []);
        } catch (err) {
            console.error("Order Fetch Error:", err);
        }
    };

    const handleStatusUpdate = async (id, status) => {
        try {
            await AdminApi.updateOrderStatus(id, status);
            alert("Status Updated");
            fetchOrders();
        } catch (err) { alert("Update failed"); }
    };

    return (
        <div className="card shadow border-0">
            <div className="card-header bg-white py-3 d-flex justify-content-between">
                <h5 className="mb-0 fw-bold">Order Management</h5>
                <span className="badge bg-primary">{orders.length} Total</span>
            </div>
            <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                    <thead className="table-light">
                        <tr>
                            <th>ID</th><th>Customer</th><th>Total</th><th>Status</th><th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map(order => (
                            <tr key={order.id}>
                                <td>#{order.id}</td>
                                <td>{order.user?.name}</td>
                                <td className="fw-bold">₹{order.total_amount}</td>
                                <td>
                                    <span className={`badge ${order.status === 'pending' ? 'bg-warning text-dark' : 'bg-success'}`}>
                                        {order.status.toUpperCase()}
                                    </span>
                                </td>
                                <td>
                                    <select 
                                        className="form-select form-select-sm" 
                                        value={order.status}
                                        onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="confirmed">Confirmed</option>
                                        <option value="delivered">Delivered</option>
                                    </select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}