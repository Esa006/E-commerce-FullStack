import { useState } from 'react';
import AdminApi from "../api/admin";


export default function EditProductModal({ product, onClose, onUpdateSuccess }) {
    const [editData, setEditData] = useState({
        ...product,
        newImage: null
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', editData.name);
        formData.append('description', editData.description);
        formData.append('price', editData.price);
        formData.append('stock', editData.stock);
        if (editData.newImage) {
            formData.append('image', editData.newImage);
        }

        try {
            // Laravel-க்கு _method=PUT அவசியம்
            const res = await AdminApi.updateProduct(product.id, formData);
            if (res.status === 200) {
                alert("தயாரிப்பு புதுப்பிக்கப்பட்டது!");
                onUpdateSuccess(); // Dashboard-ல் பட்டியலைப் புதுப்பிக்க
                onClose(); // Modal-ஐ மூட
            }
        } catch (error) {
            console.error("Update Error:", error);
            alert("புதுப்பிப்பதில் பிழை!");
        }
    };

    return (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 1050 }}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content shadow-lg border-0">
                    <div className="modal-header bg-warning text-dark">
                        <h5 className="modal-title fw-bold">Edit Product: {product.name}</h5>
                        <button className="btn-close" onClick={onClose}></button>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="modal-body p-4">
                            <div className="mb-3">
                                <label className="form-label fw-semibold">Product Name</label>
                                <input type="text" className="form-control" value={editData.name} 
                                    onChange={e => setEditData({...editData, name: e.target.value})} required />
                            </div>
                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <label className="form-label fw-semibold">Price (₹)</label>
                                    <input type="number" className="form-control" value={editData.price} 
                                        onChange={e => setEditData({...editData, price: e.target.value})} required />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label className="form-label fw-semibold">Stock</label>
                                    <input type="number" className="form-control" value={editData.stock} 
                                        onChange={e => setEditData({...editData, stock: e.target.value})} required />
                                </div>
                            </div>
                            <div className="mb-3">
                                <label className="form-label fw-semibold">Description</label>
                                <textarea className="form-control" rows="3" value={editData.description} 
                                    onChange={e => setEditData({...editData, description: e.target.value})} required></textarea>
                            </div>
                            <div className="mb-3">
                                <label className="form-label fw-semibold">Change Image (Optional)</label>
                                <input type="file" className="form-control" accept="image/*" 
                                    onChange={e => setEditData({...editData, newImage: e.target.files[0]})} />
                                <small className="text-muted"> {product.image.split('/').pop()}</small>
                            </div>
                        </div>
                        <div className="modal-footer bg-light">
                            <button type="button" className="btn btn-secondary px-4" onClick={onClose}>Cancel</button>
                            <button type="submit" className="btn btn-warning px-4 fw-bold">Save Changes</button>
                        </div>
                    </form>
                </div>
            </div>
            
        </div>
    );
}