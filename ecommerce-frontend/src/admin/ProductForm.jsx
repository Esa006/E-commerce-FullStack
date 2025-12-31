import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import ProductApi from '../api/Products';

export default function ProductForm() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    // Form State
    const [product, setProduct] = useState({
        name: '',
        description: '',
        price: '',
        stock: '',
        image: null // ஃபைல் என்பதால் null
    });

    // Input மாற்றம் (Text)
    const handleChange = (e) => {
        setProduct({ ...product, [e.target.name]: e.target.value });
    };

    // Image மாற்றம் (File)
    const handleImageChange = (e) => {
        setProduct({ ...product, image: e.target.files[0] });
    };

    // Submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        // Laravel-க்கு அனுப்ப FormData உருவாக்க வேண்டும்
        const formData = new FormData();
        formData.append('name', product.name);
        formData.append('description', product.description);
        formData.append('price', product.price);
        formData.append('stock', product.stock);
        if (product.image) {
            formData.append('image', product.image);
        }

        try {
            await ProductApi.create(formData);
            
            Swal.fire('Success!', 'Product created successfully.', 'success');
            navigate('/admin/products'); 

        } catch (error) {
            if (error.response && error.response.status === 422) {
                setErrors(error.response.data.errors);
            } else {
                Swal.fire('Error', 'Something went wrong.', 'error');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-4">
            <div className="card shadow-sm" style={{ maxWidth: '600px', margin: '0 auto' }}>
                <div className="card-header bg-white">
                    <h4 className="mb-0">Add New Product</h4>
                </div>
                <div className="card-body">
                    <form onSubmit={handleSubmit} encType="multipart/form-data">
                        
                        {/* Name */}
                        <div className="mb-3">
                            <label className="form-label">Product Name</label>
                            <input type="text" name="name" className="form-control" onChange={handleChange} required />
                            <small className="text-danger">{errors.name}</small>
                        </div>

                        {/* Description */}
                        <div className="mb-3">
                            <label className="form-label">Description</label>
                            <textarea name="description" className="form-control" rows="3" onChange={handleChange}></textarea>
                        </div>

                        {/* Price & Stock */}
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Price (₹)</label>
                                <input type="number" name="price" className="form-control" onChange={handleChange} required />
                                <small className="text-danger">{errors.price}</small>
                            </div>
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Stock Quantity</label>
                                <input type="number" name="stock" className="form-control" onChange={handleChange} required />
                            </div>
                        </div>

                        {/* Image Upload */}
                        <div className="mb-4">
                            <label className="form-label">Product Image</label>
                            <input type="file" className="form-control" onChange={handleImageChange} accept="image/*" />
                            <small className="text-danger">{errors.image}</small>
                        </div>

                        {/* Buttons */}
                        <div className="d-flex justify-content-between">
                            <Link to="/admin/products" className="btn btn-secondary">Cancel</Link>
                            <button type="submit" className="btn btn-primary" disabled={loading}>
                                {loading ? 'Saving...' : 'Save Product'}
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
}