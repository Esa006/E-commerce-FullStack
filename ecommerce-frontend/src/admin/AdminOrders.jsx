const AdminOrders = () => {
  return (
    <>
      <h3>Orders</h3>

      <table className="table mt-3">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Customer</th>
            <th>Total</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td>#ORD001</td>
            <td>John</td>
            <td>₹1200</td>
            <td>Pending</td>
          </tr>
        </tbody>
      </table>
    </>
  );
};

export default AdminOrders;
