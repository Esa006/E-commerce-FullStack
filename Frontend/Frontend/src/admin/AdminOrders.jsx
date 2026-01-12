import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const token = localStorage.getItem('admin_token');

  const fetchOrders = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/admin/orders", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

 const updateStatus = async (orderId, newStatus) => {
  try {
    const token = localStorage.getItem('admin_token');
    
    const response = await axios.put(
      `http://localhost:8000/api/admin/orders/${orderId}/status`, 
      { status: newStatus },
      { 
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json' 
        } 
      }
    );

    if (response.data.success) {
      alert("Status updated successfully!");
      fetchOrders(); 
    }
  } catch (error) {
    console.error("Error:", error.response);
  }
};

  useEffect(() => { fetchOrders(); }, []);

  return (
    <div className="container admin-orders-container">
      <h3 className="page-title">Admin: Customer Order Management</h3>
      <div className="orders-table-container">
        <table className="table table-bordered orders-table">
          <thead className="orders-table-head">
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Total Amount</th>
              <th>Status</th>
              <th>Action</th>
              <th>Address</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}><td className="order-id">#{order.id}</td><td>{order.user?.name || "Guest User"}</td><td>{new Date(order.created_at).toLocaleDateString()}</td><td>₹{order.total_amount}</td><td><span className={`badge ${order.status === 'delivered' ? 'bg-success' : order.status === 'confirmed' ? 'bg-primary' : 'bg-warning text-dark'}`}>{order.status.toUpperCase()}</span></td><td><select className="form-select status-select" value={order.status} onChange={(e) => updateStatus(order.id, e.target.value)}><option value="pending">Pending</option><option value="confirmed">Confirmed</option><option value="delivered">Delivered</option></select></td> <td>{order.address}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminOrders;