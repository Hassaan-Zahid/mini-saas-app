import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useAuth } from "../context/AuthContext";

const ItemsList = () => {
    const { user } = useAuth();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        min_price: '',
        max_price: '',
        status: ''
    });
    const [deletingId, setDeletingId] = useState(null);
    const [deleteError, setDeleteError] = useState(null);

    const handleDelete = async (itemId) => {
        if (!window.confirm('Are you sure you want to delete this item?')) return;

        setDeletingId(itemId);
        setDeleteError(null);
        try {
            await axios.delete(`/api/items/${itemId}`);
            setItems(prevItems => prevItems.filter(item => item.id !== itemId));
        } catch (error) {
            console.error('Delete failed:', error.message);
            setDeleteError('Failed to delete the item.'+error.message);
        } finally {
            setDeletingId(null);
        }
    };

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const params = new URLSearchParams();
                if (filters.min_price) params.append('min_price', filters.min_price);
                if (filters.max_price) params.append('max_price', filters.max_price);
                if (filters.status) params.append('status', filters.status);

                const { data } = await axios.get(`/api/items?${params.toString()}`);
                setItems(data);
            } catch (error) {
                console.error('Error fetching items:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchItems();
    }, [filters]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    if (loading) return <div className="text-center py-8">Loading...</div>;

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">Items</h1>

            {deleteError && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
                    {deleteError}
                </div>
            )}

            <div className="mb-6 p-4 bg-gray-100 rounded-lg">
                <h2 className="text-lg font-semibold mb-3">Filters</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-gray-700 mb-1">Min Price</label>
                        <input
                            type="number"
                            name="min_price"
                            value={filters.min_price}
                            onChange={handleFilterChange}
                            className="w-full px-3 py-2 border rounded"
                            placeholder="Min price"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 mb-1">Max Price</label>
                        <input
                            type="number"
                            name="max_price"
                            value={filters.max_price}
                            onChange={handleFilterChange}
                            className="w-full px-3 py-2 border rounded"
                            placeholder="Max price"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 mb-1">Status</label>
                        <select
                            name="status"
                            value={filters.status}
                            onChange={handleFilterChange}
                            className="w-full px-3 py-2 border rounded"
                        >
                            <option value="">All</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map(item => (
                    <div key={item.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                        <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                        <p className="text-gray-600 mb-2">{item.description}</p>
                        <p className="text-blue-600 font-bold mb-2">${item.price}</p>
                        <span className={`px-2 py-1 rounded text-sm ${item.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {item.status}
                        </span>
                        <div className="mt-4 flex justify-between items-center">
                            <Link to={`/items/${item.id}`} className="text-blue-600 hover:underline">
                                View Details
                            </Link>
                            {user?.role_id === 1 && (
                                <button
                                    onClick={() => handleDelete(item.id)}
                                    disabled={deletingId === item.id}
                                    className="inline-flex items-center px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {deletingId === item.id ? (
                                        <span>Deleting...</span>
                                    ) : (
                                        <>
                                            <svg
                                                className="w-4 h-4 mr-2"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                viewBox="0 0 24 24"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round"
                                                      d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                            Delete
                                        </>
                                    )}
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ItemsList;
