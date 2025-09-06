import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext'; // <-- Auth context ko import kiya

const LoginPage = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const navigate = useNavigate();
    const { login } = useAuth(); // <-- Context se login function nikaala

    const { email, password } = formData;
    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        try {
            const apiUrl = 'http://localhost:5000/api/auth/login';
            const res = await axios.post(apiUrl, formData);

            login(res.data.token); // <-- localStorage.setItem ki jagah context ka function use kiya

            toast.success('Login Successful!'); // <-- alert() ki jagah
            navigate('/');
        } catch (error) {
            const message = error.response?.data?.message || 'Server error';
            toast.error('Login Failed: ' + message); // <-- alert() ki jagah
        }
    };

    return (
        // ... (JSX for the form is unchanged)
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Login to Your Account</h2>
                <form onSubmit={onSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Email</label>
                        <input type="email" name="email" value={email} onChange={onChange} className="w-full px-4 py-2 border rounded-lg" required />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 mb-2">Password</label>
                        <input type="password" name="password" value={password} onChange={onChange} className="w-full px-4 py-2 border rounded-lg" required />
                    </div>
                    <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">Login</button>
                </form>
                <p className="text-center mt-4 text-gray-600">
                    Don't have an account? <Link to="/register" className="text-blue-600 hover:underline">Register here</Link>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;
