import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import Spinner from '../components/Spinner';

const ItemDetailPage = () => {
    const { id } = useParams();
    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchItem = async () => {
            try {
                const apiUrl = `http://localhost:5000/api/items/${id}`;
                const res = await axios.get(apiUrl);
                setItem(res.data);
            } catch (error) {
                console.error("Failed to fetch item details:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchItem();
    }, [id]);

    if (loading) {
        return <Spinner />;
    }

    if (!item) {
        return <p className="text-center mt-10">Item not found.</p>;
    }

const imageUrl = item.image_url
    ? `http://localhost:5000/${item.image_url.replace(/\\/g, '/')}`
    : `https://placehold.co/1200x800?text=${item.name.replace(/\s/g, "+")}`;

    return (
        <div className="min-h-screen bg-gray-100 p-4 md:p-8">
            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
            <img
    src={imageUrl}
    alt={item.name}
    className="w-full h-64 md:h-96 object-cover"
    onError={(e) => { e.target.onerror = null; e.target.src=`https://placehold.co/1200x800?text=Image+Not+Found`}}
/>
                <div className="p-6">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{item.name}</h1>
                    <span className={`inline-block px-3 py-1 text-sm font-semibold text-white rounded-full ${item.item_type === 'buy' ? 'bg-green-500' : 'bg-yellow-500'}`}>
                        {item.item_type === 'buy' ? 'For Sale' : 'For Borrow'}
                    </span>
                    <p className="text-2xl font-bold text-blue-600 my-4">₹{item.price}</p>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Description</h3>
                    <p className="text-gray-700 whitespace-pre-wrap mb-6">{item.description}</p>
                    <div className="border-t pt-4">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Seller Information</h3>
                        <p className="text-gray-700"><strong>Name:</strong> {item.seller_name}</p>
                        <p className="text-gray-700"><strong>Contact:</strong> {item.seller_email}</p>
                    </div>
                    <div className="mt-6 text-center">
                        <Link to="/" className="text-blue-600 hover:underline">
                            &larr; Back to all items
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ItemDetailPage;