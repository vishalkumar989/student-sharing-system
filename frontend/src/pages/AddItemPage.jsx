import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

const AddItemPage = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [item_type, setItemType] = useState('buy');
    const [image, setImage] = useState(null); // Image file ke liye state
    const navigate = useNavigate();
    const { token } = useAuth();

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(); // FormData object banaya
        formData.append('name', name);
        formData.append('description', description);
        formData.append('price', price);
        formData.append('item_type', item_type);
        if (image) {
            formData.append('image', image); // Image file ko append kiya
        }

        try {
            const config = { headers: { 'x-auth-token': token, 'Content-Type': 'multipart/form-data' } };
            await axios.post('http://localhost:5000/api/items', formData, config);
            toast.success('Item added successfully!');
            navigate('/');
        } catch (error) {
            toast.error('Failed to add item.');
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-lg">
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Add a New Item</h2>
                <form onSubmit={onSubmit}>
                    <div className="mb-4">
                       <label className="block text-gray-700 mb-2">Item Name</label>
                       <input type="text" name="name" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-2 border rounded-lg" required />
                    </div>
                    <div className="mb-4">
                       <label className="block text-gray-700 mb-2">Description</label>
                       <textarea name="description" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full px-4 py-2 border rounded-lg" required></textarea>
                    </div>
                    <div className="mb-4">
                       <label className="block text-gray-700 mb-2">Price (₹)</label>
                       <input type="number" name="price" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full px-4 py-2 border rounded-lg" required />
                    </div>
                    <div className="mb-4">
                       <label className="block text-gray-700 mb-2">Item Type</label>
                       <select name="item_type" value={item_type} onChange={(e) => setItemType(e.target.value)} className="w-full px-4 py-2 border rounded-lg bg-white">
                           <option value="buy">For Sale</option>
                           <option value="borrow">For Borrow</option>
                       </select>
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 mb-2">Item Image (Optional)</label>
                        <input type="file" name="image" onChange={handleImageChange} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                    </div>
                    <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-300">
                        Add Item
                    </button>
                    <Link to="/" className="block text-center mt-4 text-gray-600 hover:underline">Cancel</Link>
                </form>
            </div>
        </div>
    );
};
export default AddItemPage;
