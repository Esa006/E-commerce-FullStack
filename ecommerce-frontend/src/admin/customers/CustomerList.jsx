import { useEffect, useState } from "react";
import AdminApi from "../../api/admin";
import { FaTrash, FaUserEdit } from "react-icons/fa";

export default function CustomerList() {
    const [customers, setCustomers] = useState([]);
    const [editingUser, setEditingUser] = useState(null);
    const [loading, setLoading] = useState(false);

    // Load customers on mount
    useEffect(() => {
        fetchCustomers();
    }, []);

    // Fetch customers
    const fetchCustomers = async () => {
        setLoading(true);
        try {
            const res = await AdminApi.getCustomers();
            setCustomers(res.data.customers || []);
        } catch (err) {
            console.error("Failed to load customers", err);
        } finally {
            setLoading(false);
        }
    };

    // Delete customer
    const deleteCustomer = async (id) => {
        if (!window.confirm("Are you sure you want to delete this customer?")) return;

        try {
            await AdminApi.deleteCustomer(id);
            fetchCustomers();
        } catch (err) {
            alert("Delete failed");
        }
    };

 // Update role
const updateRole = async (id, newRole) => {
    try {
        // எடிட் செய்யப்படும் பயனரின் தற்போதைய தரவுகளைக் கண்டறியவும்
        const userToUpdate = customers.find(u => u.id === id);

        if (!userToUpdate) return;

        // Validation-க்குத் தேவையான name மற்றும் role ஆகிய இரண்டையும் அனுப்பவும்
        await AdminApi.updateCustomer(id, { 
            name: userToUpdate.name, // இது மிக முக்கியம்!
            role: newRole 
        });

        setEditingUser(null);
        fetchCustomers(); // பட்டியலைப் புதுப்பிக்கவும்
        alert("Role updated successfully!");
    } catch (err) {
        console.error(err.response?.data?.errors); // என்ன தவறு என்று Console-இல் காட்டும்
        alert("Role update failed: " + (err.response?.data?.message || "Check console"));
    }
};

    return (
        <div className="card shadow border-0">
            <div className="card-header bg-white d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Registered Customers</h5>
                <span className="badge bg-primary">{customers.length} Users</span>
            </div>

            <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                    <thead className="table-light">
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th className="text-center">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {loading && (
                            <tr>
                                <td colSpan="5" className="text-center py-4">
                                    Loading...
                                </td>
                            </tr>
                        )}

                        {!loading && customers.length === 0 && (
                            <tr>
                                <td colSpan="5" className="text-center py-4">
                                    No customers found
                                </td>
                            </tr>
                        )}

                        {!loading &&
                            customers.map((user) => (
                                <tr key={user.id}>
                                    <td>{user.id}</td>
                                    <td>{user.name}</td>
                                    <td>{user.email}</td>
                                    <td>
                                        <span
                                            className={`badge ${
                                                user.role === "admin"
                                                    ? "bg-danger"
                                                    : "bg-success"
                                            }`}
                                        >
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="text-center">
                                        <button
                                            className="btn btn-warning btn-sm me-2"
                                            onClick={() => setEditingUser(user)}
                                        >
                                            <FaUserEdit /> Role
                                        </button>

                                        <button
                                            className="btn btn-danger btn-sm"
                                            onClick={() => deleteCustomer(user.id)}
                                        >
                                            <FaTrash /> Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>

            {/* ================= ROLE UPDATE MODAL ================= */}
            {editingUser && (
                <div
                    className="modal show d-block"
                    style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
                >
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content border-0 shadow">
                            <div className="modal-header bg-primary text-white">
                                <h5 className="modal-title">Update Customer Role</h5>
                                <button
                                    className="btn-close btn-close-white"
                                    onClick={() => setEditingUser(null)}
                                ></button>
                            </div>

                            <div className="modal-body">
                                <p>
                                    Change role for{" "}
                                    <strong>{editingUser.name}</strong>
                                </p>

                                <select
                                    className="form-select"
                                    value={editingUser.role}
                                    onChange={(e) =>
                                        updateRole(editingUser.id, e.target.value)
                                    }
                                >
                                    <option value="customer">Customer</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>

                            <div className="modal-footer bg-light">
                                <button
                                    className="btn btn-secondary"
                                    onClick={() => setEditingUser(null)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
