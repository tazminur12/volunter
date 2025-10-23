import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import {
  FaTrash,
  FaInfoCircle,
  FaClock,
  FaCheck,
  FaTimes,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaUserFriends
} from 'react-icons/fa';
import { motion } from 'framer-motion';
import LoadingSpinner from '../../shared/components/LoadingSpinner';


const MyVolunteerRequests = ({ user }) => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [cancellingId, setCancellingId] = useState(null);
    const [viewMode, setViewMode] = useState('table'); // 'table' or 'card'

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                setLoading(true);
                const res = await axios.get('http://localhost:3000/volunteer-requests', {
                    params: { volunteerEmail: user.email },
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                setRequests(res.data || []);
            } catch (err) {
                toast.error(err.response?.data?.message || 'Failed to fetch your volunteer requests');
            } finally {
                setLoading(false);
            }
        };
        if (user?.email) fetchRequests();
    }, [user]);

    const handleCancel = async (id) => {
        try {
            setCancellingId(id);
            await axios.delete(`http://localhost:3000/volunteer-requests/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            setRequests(prev => prev.filter(req => req._id !== id));
            toast.success('Volunteer request cancelled successfully');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to cancel request');
        } finally {
            setCancellingId(null);
        }
    };

    const confirmCancel = (id) => {
        toast.custom((t) => (
            <div className="bg-white p-4 rounded-lg shadow-lg">
                <h3 className="font-bold text-lg mb-2">Confirm Cancellation</h3>
                <p className="mb-4">Are you sure you want to cancel this volunteer request?</p>
                <div className="flex justify-end space-x-2">
                    <button 
                        onClick={() => {
                            toast.dismiss(t.id);
                            handleCancel(id);
                        }}
                        className="btn btn-error btn-sm text-white"
                    >
                        Confirm
                    </button>
                    <button 
                        onClick={() => toast.dismiss(t.id)}
                        className="btn btn-outline btn-sm"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        ), { duration: 10000 });
    };

    const StatusBadge = ({ status }) => {
        const config = {
            pending: { 
                color: 'bg-yellow-100 text-yellow-800', 
                icon: <FaClock className="text-yellow-500" /> 
            },
            approved: { 
                color: 'bg-green-100 text-green-800', 
                icon: <FaCheck className="text-green-500" /> 
            },
            rejected: { 
                color: 'bg-red-100 text-red-800', 
                icon: <FaTimes className="text-red-500" /> 
            },
            completed: { 
                color: 'bg-blue-100 text-blue-800', 
                icon: <FaCheck className="text-blue-500" /> 
            },
        };
        const badge = config[status] || { 
            color: 'bg-gray-100 text-gray-800', 
            icon: <FaInfoCircle className="text-gray-500" /> 
        };

        return (
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${badge.color}`}>
                {badge.icon}
                <span className="ml-1.5">{status.charAt(0).toUpperCase() + status.slice(1)}</span>
            </span>
        );
    };

    if (loading) return <LoadingSpinner fullPage />;

    if (requests.length === 0) {
        return (
            <EmptyState 
                title="No Volunteer Requests"
                description="You haven't signed up for any opportunities yet."
                actionText="Browse Volunteer Posts"
                actionLink="/all-posts"
            />
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="max-w-7xl mx-auto px-4 py-8"
        >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                <div>
                    <h2 className="text-3xl font-bold text-gray-800">My Volunteer Requests</h2>
                    <p className="text-gray-600 mt-2">
                        Review and manage the opportunities you've applied to
                    </p>
                </div>
                <div className="mt-4 md:mt-0">
                    <div className="tabs tabs-boxed bg-gray-100">
                        <button 
                            className={`tab ${viewMode === 'table' ? 'tab-active' : ''}`}
                            onClick={() => setViewMode('table')}
                        >
                            Table View
                        </button> 
                        <button 
                            className={`tab ${viewMode === 'card' ? 'tab-active' : ''}`}
                            onClick={() => setViewMode('card')}
                        >
                            Card View
                        </button>
                    </div>
                </div>
            </div>

            {viewMode === 'table' ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="table w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="text-gray-600 font-medium">Opportunity</th>
                                    <th className="text-gray-600 font-medium">Category</th>
                                    <th className="text-gray-600 font-medium">Status</th>
                                    <th className="text-gray-600 font-medium">Date</th>
                                    <th className="text-gray-600 font-medium">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {requests.map((req) => (
                                    <motion.tr 
                                        key={req._id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ duration: 0.3 }}
                                        className="hover:bg-gray-50"
                                    >
                                        <td>
                                            <div className="flex items-center space-x-4">
                                                <div className="avatar">
                                                    <div className="mask mask-squircle w-12 h-12">
                                                        {req.thumbnail ? (
                                                            <img 
                                                                src={req.thumbnail} 
                                                                alt={req.postTitle} 
                                                                className="object-cover"
                                                                onError={(e) => {
                                                                    e.target.src = 'https://via.placeholder.com/150?text=No+Image';
                                                                    e.target.className = 'bg-gray-200';
                                                                }}
                                                            />
                                                        ) : (
                                                            <div className="bg-gray-200 w-full h-full flex items-center justify-center">
                                                                <span className="text-xs text-gray-500">No Image</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="font-medium text-gray-800">{req.postTitle}</div>
                                                    <div className="flex items-center text-sm text-gray-500 mt-1">
                                                        <FaMapMarkerAlt className="mr-1.5" />
                                                        <span>{req.location || 'Location not specified'}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <span className="badge badge-outline">
                                                {req.category || 'Uncategorized'}
                                            </span>
                                        </td>
                                        <td>
                                            <StatusBadge status={req.status} />
                                        </td>
                                        <td className="text-gray-600">
                                            {new Date(req.createdAt).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric'
                                            })}
                                        </td>
                                        <td>
                                            <button
                                                onClick={() => confirmCancel(req._id)}
                                                disabled={cancellingId === req._id || req.status !== 'pending'}
                                                className={`btn btn-sm ${req.status === 'pending' ? 'btn-error' : 'btn-disabled'}`}
                                            >
                                                {cancellingId === req._id ? (
                                                    <span className="loading loading-spinner"></span>
                                                ) : (
                                                    <>
                                                        <FaTrash className="mr-1.5" />
                                                        Cancel
                                                    </>
                                                )}
                                            </button>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {requests.map((req) => (
                        <motion.div
                            key={req._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className="card bg-white shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
                        >
                            <figure className="relative h-48">
                                <img 
                                    src={req.thumbnail || 'https://via.placeholder.com/400x200?text=No+Image'} 
                                    alt={req.postTitle}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.target.src = 'https://via.placeholder.com/400x200?text=No+Image';
                                    }}
                                />
                                <div className="absolute top-4 right-4">
                                    <StatusBadge status={req.status} />
                                </div>
                            </figure>
                            <div className="card-body">
                                <h3 className="card-title text-lg">{req.postTitle}</h3>
                                <div className="flex items-center text-sm text-gray-600 mb-1">
                                    <FaMapMarkerAlt className="mr-2" />
                                    {req.location || 'Location not specified'}
                                </div>
                                <div className="flex items-center text-sm text-gray-600 mb-1">
                                    <FaUserFriends className="mr-2" />
                                    {req.category || 'Uncategorized'}
                                </div>
                                <div className="flex items-center text-sm text-gray-600 mb-4">
                                    <FaCalendarAlt className="mr-2" />
                                    Applied on {new Date(req.createdAt).toLocaleDateString()}
                                </div>
                                <div className="card-actions justify-end">
                                    <button
                                        onClick={() => confirmCancel(req._id)}
                                        disabled={cancellingId === req._id || req.status !== 'pending'}
                                        className={`btn btn-sm ${req.status === 'pending' ? 'btn-error' : 'btn-disabled'} w-full`}
                                    >
                                        {cancellingId === req._id ? (
                                            <span className="loading loading-spinner"></span>
                                        ) : (
                                            <>
                                                <FaTrash className="mr-1.5" />
                                                Cancel Request
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </motion.div>
    );
};

export default MyVolunteerRequests;