import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams, Link } from 'react-router-dom';

const EditItemPage = () => {
    const { id } = useParams(); // URL se item ki ID nikaalo
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        item_type: 'buy',
        status: 'available',
    });
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    useEffect(() => {
        // Pehle item ka purana data fetch karo
        const fetchItemData = async () => {
            try {
                const res = await axios.get(`https://student-sharing-api.onrender.com/api/items/${id}`);
                setFormData({
                    name: res.data.name,
                    description: res.data.description,
                    price: res.data.price,
                    item_type: res.data.item_type,
                    status: res.data.status,
                });
            } catch (error) {
                console.error("Could not fetch item data", error);
                alert("Could not load item data.");
                navigate('/my-items');
            }
        };
        fetchItemData();
    }, [id, navigate]);

    const { name, description, price, item_type, status } = formData;
    const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async (e) => {
        e.preventDefault();
        const config = { headers: { 'x-auth-token': token } };
        try {
            await axios.put(`https://student-sharing-api.onrender.com/api/items/${id}`, formData, config);
            alert('Item updated successfully!');
            navigate('/my-items'); // Update ke baad My Items page par bhej do
        } catch (error) {
            alert('Failed to update item.');
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-lg">
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Edit Your Item</h2>
                <form onSubmit={onSubmit}>
                    {/* ... Form fields for name, description, price ... */}
                    <div className="mb-4">
                       <label className="block text-gray-700 mb-2">Item Name</label>
                       <input type="text" name="name" value={name} onChange={onChange} className="w-full px-4 py-2 border rounded-lg" required />
                   </div>
                   <div className="mb-4">
                       <label className="block text-gray-700 mb-2">Description</label>
                       <textarea name="description" value={description} onChange={onChange} className="w-full px-4 py-2 border rounded-lg" required></textarea>
                   </div>
                   <div className="mb-4">
                       <label className="block text-gray-700 mb-2">Price (₹)</label>
                       <input type="number" name="price" value={price} onChange={onChange} className="w-full px-4 py-2 border rounded-lg" required />
                   </div>
                   <div className="mb-4">
                       <label className="block text-gray-700 mb-2">Item Type</label>
                       <select name="item_type" value={item_type} onChange={onChange} className="w-full px-4 py-2 border rounded-lg bg-white">
                           <option value="buy">For Sale</option>
                           <option value="borrow">For Borrow</option>
                       </select>
                   </div>
                   <div className="mb-6">
                       <label className="block text-gray-700 mb-2">Status</label>
                       <select name="status" value={status} onChange={onChange} className="w-full px-4 py-2 border rounded-lg bg-white">
                           <option value="available">Available</option>
                           <option value="unavailable">Unavailable</option>
                       </select>
                   </div>
                    <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">Update Item</button>
                    <Link to="/my-items" className="block text-center mt-4 text-gray-600 hover:underline">Cancel</Link>
                </form>
            </div>
        </div>
    );
};

export default EditItemPage;
