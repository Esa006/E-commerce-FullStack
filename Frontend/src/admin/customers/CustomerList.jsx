import { useEffect, useState } from "react";
import AdminApi from "../../api/admin";
import { FaTrash, FaUserEdit } from "react-icons/fa";
import Swal from "sweetalert2"; 

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
// ... inside your component

const deleteCustomer = async (id) => {
    // 1. Show Confirmation Popup
    const result = await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this customer deletion!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33", // Red for delete
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes, delete it!"
    });

    // 2. If user clicks "Yes"
    if (result.isConfirmed) {
        try {
            await AdminApi.deleteCustomer(id);
            
            // 3. Show Success Popup
            Swal.fire({
                title: "Deleted!",
                text: "The customer has been removed.",
                icon: "success",
                timer: 2000, // Automatically close after 2 seconds
                showConfirmButton: false
            });

            fetchCustomers(); // Refresh the list
        } catch (err) {
            // 4. Show Error Popup if backend fails
            Swal.fire({
                title: "Error!",
                text: "Delete failed. Please try again.",
                icon: "error"
            });
        }
    }
};
 // Update role
const updateRole = async (id, newRole) => {
    try {
        const userToUpdate = customers.find(u => u.id === id);
        if (!userToUpdate) return;

        // Optional: Show a "Processing" state
        Swal.fire({
            title: 'Updating...',
            allowOutsideClick: false,
            didOpen: () => { Swal.showLoading(); }
        });

        await AdminApi.updateCustomer(id, { 
            name: userToUpdate.name, 
            role: newRole 
        });

        setEditingUser(null);
        await fetchCustomers(); 

        // ✅ Success Toast Popup
        const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
        });

        Toast.fire({
            icon: 'success',
            title: `Role updated to ${newRole}!`
        });

    } catch (err) {
        console.error(err.response?.data?.errors); 
        
        // ❌ Error Alert
        Swal.fire({
            icon: 'error',
            title: 'Update Failed',
            text: err.response?.data?.message || "Something went wrong",
            confirmButtonColor: '#212529'
        });
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
                            <th>Address</th>
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
                                    <td>{user.address}</td>
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
