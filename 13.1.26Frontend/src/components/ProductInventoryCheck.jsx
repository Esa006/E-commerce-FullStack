import React, { useState } from 'react';

const ProductItem = ({ item }) => {
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState(false);

  // Define the base URL for Laravel Storage
  const storageBaseUrl = "http://localhost:8000/storage/";

  const handleIncrease = () => {
    // Stock Logic: Check against 'item.stock' from your Laravel API
    if (quantity < item.stock) {
      setQuantity(prev => prev + 1);
      setError(false);
    } else {
      // Trigger the alert if user exceeds stock
      setError(true);
    }
  };

  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
      setError(false);
    }
  };

  return (
    <div className="max-w-sm rounded overflow-hidden shadow-lg border p-4 bg-white">
      {/* 1. PHOTO LOGIC: item.image[0] picks the first photo from your casted array */}
      <div className="relative h-48 w-full mb-4">
        <img
          src={`${storageBaseUrl}${item.image[0]}`}
          alt={item.name}
          className="w-full h-full object-cover rounded"
          onError={(e) => { e.target.src = 'https://via.placeholder.com/300'; }} // Fallback if image fails
        />
      </div>

      <h2 className="font-bold text-xl">{item.name}</h2>
      <p className="text-gray-700 text-sm mb-2">{item.category}</p>

      {/* 2. STOCK DISPLAY */}
      <p className="text-blue-600 font-bold">
        {item.stock > 0 ? `In Stock: ${item.stock}` : "Out of Stock"}
      </p>

      {/* 3. QUANTITY CONTROLS */}
      <div className="flex items-center gap-4 my-4">
        <button
          onClick={handleDecrease}
          className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
        > - </button>

        <p className="font-bold text-lg m-0"><span>{quantity}</span></p>

        <button
          onClick={handleIncrease}
          className={`px-3 py-1 rounded text-white ${quantity >= item.stock ? 'bg-red-300 cursor-not-allowed' : 'bg-black'}`}
        > + </button>
      </div>

      {/* 4. USER ALERT: Shows when trying to go over available stock */}
      {error && (
        <div className="flex items-center gap-2 p-2 bg-red-100 border border-red-400 text-red-700 rounded mb-4 animate-shake">
          <p className="text-xs font-bold m-0"><span> Maximum stock reached ({item.stock} available)</span></p>
        </div>
      )}

      <button className="w-full bg-orange-500 text-white py-2 rounded font-bold hover:bg-orange-600 transition">
        Add to Cart
      </button>
    </div>
  );
};