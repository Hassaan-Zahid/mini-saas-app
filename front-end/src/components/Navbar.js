import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="bg-blue-600 text-white p-4">
            <div className="container mx-auto flex justify-between items-center">
                <Link to="/" className="text-xl font-bold">Mini SaaS</Link>
                <div className="flex space-x-4">
                    {user ? (
                        <>
                            <Link to="/items" className="hover:underline">Items</Link>
                            <Link to="/dashboard" className="hover:underline">Dashboard</Link>
                            {user.role_id === 1 && (
                                <Link to="/admin" className="hover:underline">Admin</Link>
                            )}
                            <button onClick={handleLogout} className="hover:underline">Logout</button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="hover:underline">Login</Link>
                            <Link to="/register" className="hover:underline">Register</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;