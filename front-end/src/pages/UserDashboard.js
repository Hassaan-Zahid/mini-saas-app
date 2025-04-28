import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Pusher from 'pusher-js';

const UserDashboard = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserItems = async () => {
            try {
                const { data } = await axios.get('/api/profile');
                const userItems = await axios.get(`/api/items?owner_id=${data.id}`);
                setItems(userItems.data);
            } catch (error) {
                console.error('Error fetching user items:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserItems();

        const pusher = new Pusher(process.env.REACT_APP_PUSHER_KEY, {
            cluster: process.env.REACT_APP_PUSHER_CLUSTER,
            encrypted: true
        });

        const channel = pusher.subscribe('items');
        channel.bind('item.created', (data) => {
            setItems(prev => [...prev, data?.item]);
        });
        channel.bind('item.status.updated', (data) => {
            setItems(prev => prev.map(item =>
                item?.id === data?.item?.id ? data?.item : item
            ));
        });

        return () => {
            channel.unbind_all();
            pusher.unsubscribe('items');
        };
    }, []);

    if (loading) return <div className="text-center py-8">Loading...</div>;

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">My Dashboard</h1>
            <div className="mb-6">
                <Link
                    to="/items/create"
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    Create New Item
                </Link>
            </div>

            <h2 className="text-xl font-semibold mb-4">My Items</h2>
            {items.length === 0 ? (
                <p>You haven't created any items yet.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {items.map(item => (
                        <div key={item.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                            <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                            <p className="text-gray-600 mb-2">{item.description}</p>
                            <p className="text-blue-600 font-bold mb-2">${item.price}</p>
                            <span className={`px-2 py-1 rounded text-sm ${item.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {item.status}
              </span>
                            <div className="mt-4 flex space-x-2">
                                <Link
                                    to={`/items/${item.id}/edit`}
                                    className="text-blue-600 hover:underline"
                                >
                                    Edit
                                </Link>
                                <Link
                                    to={`/items/${item.id}`}
                                    className="text-blue-600 hover:underline"
                                >
                                    View
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default UserDashboard;