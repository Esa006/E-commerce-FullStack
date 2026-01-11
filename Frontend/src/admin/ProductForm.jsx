import React from "react";
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
        category: 'Men', 
        subCategory: 'Topwear', 
        sizes: [], 
        bestseller: false,
        image: null
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setProduct({ 
            ...product, 
            [name]: type === 'checkbox' ? checked : value 
        });
    };

    const handleImageChange = (e) => {
        setProduct({ ...product, image: e.target.files[0] });
    };

    // Submit logic
   const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    const formData = new FormData();
    formData.append('name', product.name);
    formData.append('description', product.description || '');
    formData.append('price', product.price);
    formData.append('stock', product.stock);
    formData.append('category', product.category);
    formData.append('subCategory', product.subCategory);
    formData.append('sizes', JSON.stringify(product.sizes.length > 0 ? product.sizes : ["S", "M", "L"])); 
    formData.append('bestseller', product.bestseller ? '1' : '0'); // Sending as 1/0 is often safer for DB

    if (product.image && product.image instanceof File) {
        formData.append('image', product.image);
    }

    try {
        await ProductApi.create(formData);
        Swal.fire('Success', 'Product Added Successfully!', 'success');
        navigate('/admin/products');
    } catch (error) {
        console.error("Error response:", error.response?.data);
        if (error.response?.status === 422) {
            setErrors(error.response.data.errors);
        } else {
            Swal.fire('Error', error.response?.data?.error || 'Something went wrong while saving.', 'error');
        }
    } finally {
        setLoading(false);
    }
};

    
    return (
        <div className="container product-form-container">
            <div className="product-form-card">
                <div className="product-form-header">
                    <h4 className="product-form-title">Add New Product</h4>
                </div>
                <div className="product-form-body">
                    <form onSubmit={handleSubmit} encType="multipart/form-data">
                        
                        {/* Name */}
                        <div className="mb-3">
                            <label className="form-label">Product Name</label>
                            <input type="text" name="name" className="form-control" onChange={handleChange} required />
                            {errors.name && <small className="text-danger">{errors.name[0]}</small>}
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
                                {errors.price && <small className="text-danger">{errors.price[0]}</small>}
                            </div>
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Stock Quantity</label>
                                <input type="number" name="stock" className="form-control" onChange={handleChange} required />
                            </div>
                        </div>

                        {/* Image Upload */}
                        <div className="mb-4">
                            <label className="form-label">Product Image</label>
                            <input type="file" className="form-control" onChange={handleImageChange} accept="image/*" required />
                            {errors.image && <small className="text-danger">{errors.image[0]}</small>}
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