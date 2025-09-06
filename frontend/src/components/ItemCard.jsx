import React from 'react';
import { Link } from 'react-router-dom';

const ItemCard = ({ item }) => {
    const imageUrl = item.image_url
        ? `http://localhost:5000/${item.image_url.replace(/\\/g, '/')}`
        : `https://placehold.co/600x400?text=${item.name.replace(/\s/g, "+")}`;

    return (
        <Link to={`/items/${item.id}`} className="block">
            <div className="bg-white border rounded-lg shadow-md overflow-hidden transform hover:-translate-y-1 transition-transform duration-300 h-full flex flex-col">
                <img
                    src={imageUrl}
                    alt={item.name}
                    className="w-full h-48 object-cover"
                    onError={(e) => { e.target.onerror = null; e.target.src=`https://placehold.co/600x400?text=Image+Not+Found`}}
                />
                <div className="p-4 flex flex-col flex-grow">
                    <h3 className="text-lg font-bold text-gray-800 truncate">{item.name}</h3>
                    <p className="text-gray-600 text-sm mt-1">Sold by: {item.seller_name}</p>
                    <div className="flex-grow"></div>
                    <div className="flex justify-between items-center mt-4">
                        <span className="text-xl font-bold text-blue-600">₹{item.price}</span>
                        <span className={`px-3 py-1 rounded-full text-white text-xs font-semibold ${item.item_type === 'buy' ? 'bg-green-500' : 'bg-yellow-500'}`}>
                            {item.item_type === 'buy' ? 'SALE' : 'BORROW'}
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default ItemCard;