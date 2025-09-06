import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ItemCard from '../components/ItemCard';
import Spinner from '../components/Spinner';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const HomePage = () => {
    const [items, setItems] = useState([]);
    const [loadingItems, setLoadingItems] = useState(true);
    const [searchTerm, setSearchTerm] = useState(''); // Search term ke liye nayi state
    const { token, logout } = useAuth();

    // Items fetch karne wala function
    const fetchItems = async () => {
        setLoadingItems(true);
        try {
            const res = await axios.get('http://localhost:5000/api/items');
            setItems(res.data);
        } catch (error) {
            console.error("Failed to fetch items:", error);
        } finally {
            setLoadingItems(false);
        }
    };

    useEffect(() => {
        fetchItems(); // Component load hone par saare items fetch karo
    }, []);

    const handleLogout = () => { logout(); };

    // Search handle karne wala function
    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchTerm.trim()) {
            fetchItems(); // Agar search box khaali hai, toh saare items dikhao
            return;
        }
        setLoadingItems(true);
        try {
            const res = await axios.get(`http://localhost:5000/api/items/search?q=${searchTerm}`);
            setItems(res.data);
        } catch (error) {
            console.error("Search failed:", error);
        } finally {
            setLoadingItems(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-white shadow-md p-4 flex justify-between items-center sticky top-0 z-10">
                <h1 className="text-2xl font-bold text-blue-600">
                    <Link to="/">Student Economy</Link>
                </h1>
                <div>
                    {token ? (
                        <div className="flex items-center space-x-4">
                            <Link to="/my-items" className="text-gray-700 font-medium hover:text-blue-600 transition-colors">
                                My Items
                            </Link>
                            <Link to="/add-item" className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors">
                                + Add Item
                            </Link>
                            <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors">
                                Logout
                            </button>
                        </div>
                    ) : (
                        <div>
                            <Link to="/login" className="text-gray-700 hover:text-blue-600 mr-4">Login</Link>
                            <Link to="/register" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">Register</Link>
                        </div>
                    )}
                </div>
            </nav>

            <main className="container mx-auto p-8">
                {/* Search Bar ka JSX */}
                <div className="mb-8 max-w-2xl mx-auto">
                    <form onSubmit={handleSearch} className="flex">
                        <input
                            type="text"
                            className="w-full px-4 py-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Search for items like 'Calculator', 'Book'..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-r-lg hover:bg-blue-700">
                            Search
                        </button>
                    </form>
                </div>

                <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Available Items</h2>
                {loadingItems ? (
                    <Spinner />
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {items.length > 0 ? (
                            items.map(item => <ItemCard key={item.id} item={item} />)
                        ) : (
                            <p className="col-span-full text-center text-gray-500">No items found. Try a different search!</p>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
};

export default HomePage;