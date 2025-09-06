import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const MyItemsPage = () => {
    const [myItems, setMyItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem('token');

    const fetchMyItems = async () => {
        const config = { headers: { 'x-auth-token': token } };
        try {
            const res = await axios.get('https://student-sharing-api.onrender.com/items/user/my-items', config);
            setMyItems(res.data);
        } catch (error) {
            console.error("Failed to fetch your items", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) {
            fetchMyItems();
        }
    }, [token]);

    const handleDelete = async (itemId) => {
        if (window.confirm('Are you sure you want to delete this item?')) {
            const config = { headers: { 'x-auth-token': token } };
            try {
                await axios.delete(`https://student-sharing-api.onrender.com/items/${itemId}`, config);
                fetchMyItems(); 
            } catch (error) {
                alert('Failed to delete item.');
                console.error(error);
            }
        }
    };

    if (loading) return <p className="text-center mt-8">Loading your items...</p>;

    return (
        <div className="container mx-auto p-4 md:p-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl md:text-3xl font-bold">My Posted Items</h1>
                <Link to="/" className="text-blue-600 hover:underline">&larr; Back to Home</Link>
            </div>
            {myItems.length > 0 ? (
                <div className="bg-white shadow-md rounded-lg overflow-hidden">
                    <ul className="divide-y divide-gray-200">
                        {myItems.map(item => (
                            <li key={item.id} className="p-4 flex justify-between items-center">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-800">{item.name}</h3>
                                    <p className="text-gray-600">Price: ₹{item.price}</p>
                                    <span className={`text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full ${item.status === 'available' ? 'text-green-600 bg-green-200' : 'text-red-600 bg-red-200'}`}>
                                        {item.status}
                                    </span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Link to={`/edit-item/${item.id}`} className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 text-sm">
                                        Edit
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(item.id)}
                                        className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 text-sm"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            ) : (
                <p>You have not posted any items yet. <Link to="/add-item" className="text-blue-600 hover:underline">Add one now!</Link></p>
            )}
        </div>
    );
};

export default MyItemsPage;