import React from 'react';
import { Link } from 'react-router-dom';


const ProductCard = ({ product }) => {
    let imagePath = product.image;
    try {
        const parsedImages = JSON.parse(product.image);
        if (Array.isArray(parsedImages) && parsedImages.length > 0) {
            imagePath = parsedImages[0];
        }
    } catch (e) {
        // Not a JSON string or parsing failed, assume it's a direct string
    }

    return (
        <div className="col-md-3 mb-4">
            <div className="card h-100 border-0 shadow-sm">
                <Link to={`/product/${product.id}`}>
                    <img 
                        src={`http://localhost:8000/storage/${imagePath}`} 
                        className="card-img-top" 
                        alt={product.name} 
                        style={{ height: '500px', objectFit: 'cover' }}
                    />
                </Link>
                <div className="card-body">
                    <h6 className="fw-bold">{product.name}</h6>
                    <p className="text-primary">₹{product.price}</p>
                </div>
            </div>
        </div>
    );
};


const Products = ({ products }) => {
    return (
        <div className="container mt-5">
            <div className="row">
                {products && products.map((item) => (
                    <ProductCard key={item.id} product={item} />
                ))}
            </div>
        </div>
    );
};

export default Products;