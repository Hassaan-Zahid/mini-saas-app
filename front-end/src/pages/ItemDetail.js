import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ItemDetail = () => {
    const { id } = useParams();
    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        const fetchItem = async () => {
            try {
                const { data } = await axios.get(`/api/items/${id}`);
                setItem(data);
            } catch (error) {
                console.error('Error fetching item:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchItem();
    }, [id]);

    if (loading) return <div className="text-center py-8">Loading...</div>;
    if (!item) return <div className="text-center py-8">Item not found</div>;

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">{item.title}</h1>
            <div className="bg-white p-6 rounded-lg shadow-md">
                <p className="text-gray-700 mb-4">{item.description}</p>
                <p className="text-blue-600 font-bold text-xl mb-4">${item.price}</p>
                <span className={`px-3 py-1 rounded-full text-sm ${item.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {item.status}
        </span>
                <div className="mt-6 pt-4 border-t">
                    <p className="text-gray-500">Created by: {item?.owner?.name}</p>
                    <p className="text-gray-500">Created at: {new Date(item.created_at).toLocaleString()}</p>
                </div>
                {user && (user.id === item.owner_id || user.role_id === 1) && (
                    <div className="mt-6">
                        <Link
                            to={`/items/${item.id}/edit`}
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mr-2"
                        >
                            Edit Item
                        </Link>
                    </div>
                )}
            </div>
            <Link to="/items" className="inline-block mt-6 text-blue-600 hover:underline">Back to Items</Link>
        </div>
    );
};

export default ItemDetail;