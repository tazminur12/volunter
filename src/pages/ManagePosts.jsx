import React, { useContext, useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { AuthContext } from '../context/AuthProvider';
import { Link, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaTimes, 
  FaEye, 
  FaCalendarAlt, 
  FaUsers, 
  FaTag,
  FaUser,
  FaCheckCircle,
  FaClock,
  FaExclamationTriangle
} from 'react-icons/fa';

const ManagePosts = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [posts, setPosts] = useState([]);
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('posts');

    const token = localStorage.getItem('token');

    // Check if user is logged in and redirect if not
    useEffect(() => {
        if (!user) {
            console.log('No user found, redirecting to login');
            navigate('/login');
            return;
        }
        
        if (!token) {
            console.log('No token found, redirecting to login');
            navigate('/login');
        }
    }, [user, token, navigate]);

    // Fetch my volunteer posts
    useEffect(() => {
        const fetchPosts = async () => {
            if (!user?.email || !token) {
                setLoading(false);
                return;
            }
            try {
                console.log('Fetching posts for:', user.email);
                console.log('Using token:', token);
                
                const res = await fetch(`https://volunteerhub-server.vercel.app/posts?organizerEmail=${user.email}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                
                console.log('Posts response status:', res.status);
                
                if (!res.ok) {
                    if (res.status === 403) {
                        console.log('No posts found for this user');
                        setPosts([]);
                    } else {
                        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
                    }
                } else {
                    const data = await res.json();
                    console.log('Posts data:', data);
                    
                    // Filter posts to only show current user's posts
                    const myPosts = data.filter(post => post.organizerEmail === user.email);
                    console.log('Filtered posts (my posts only):', myPosts);
                    console.log('Current user email:', user.email);
                    
                    setPosts(myPosts);
                }
            } catch (err) {
                console.error('Error fetching posts', err);
                setPosts([]);
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
    }, [user, token]);

    // Fetch my volunteer requests
    useEffect(() => {
        const fetchRequests = async () => {
            if (!user?.email || !token) return;
            try {
                console.log('Fetching requests for:', user.email);
                
                const res = await fetch(`https://volunteerhub-server.vercel.app/volunteer-requests?email=${user.email}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                
                console.log('Requests response status:', res.status);
                
                if (!res.ok) {
                    throw new Error(`HTTP ${res.status}: ${res.statusText}`);
                }
                
                const data = await res.json();
                console.log('Requests data:', data);
                setRequests(data);
            } catch (err) {
                console.error('Error fetching requests', err);
            }
        };
        fetchRequests();
    }, [user, token]);

        const handleDeletePost = async (id) => {
        if (!token) {
          Swal.fire('Error', 'No token found, please login again.', 'error');
          return;
        }
        
        // Find the post to check ownership
        const postToDelete = posts.find(p => p._id === id);
        console.log('Post to delete:', postToDelete);
        console.log('Delete attempt for post ID:', id);
        console.log('Current user email:', user?.email);
        console.log('Post owner email:', postToDelete?.organizerEmail);
        console.log('Token:', token);
        console.log('Token length:', token?.length);
        
        const result = await Swal.fire({
            title: 'Delete Post?',
            text: 'This action cannot be undone. Are you sure you want to delete this post?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel'
        });

        if (result.isConfirmed) {
            try {
                console.log('Making DELETE request to:', `https://volunteerhub-server.vercel.app/posts/${id}`);
                
                const res = await fetch(`https://volunteerhub-server.vercel.app/posts/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                
                console.log('Full response object:', res);
                
                console.log('Response status:', res.status);
                console.log('Response headers:', res.headers);
                
                if (!res.ok) {
                    const errorData = await res.json();
                    console.error('API Error:', errorData);
                    throw new Error(errorData.message || `HTTP ${res.status}: Delete failed`);
                }
                
                const data = await res.json();
                console.log('Success response:', data);
                
                if (data.message === 'Post deleted') {
                    setPosts(posts.filter(p => p._id !== id));
                    Swal.fire({
                        title: 'Deleted!',
                        text: 'Your post has been successfully deleted.',
                        icon: 'success',
                        timer: 2000,
                        showConfirmButton: false
                    });
                } else {
                    throw new Error('Unexpected response from server');
                }
            } catch (error) {
                console.error('Delete error details:', error);
                Swal.fire('Error', error.message || 'Failed to delete post. Please try again.', 'error');
            }
        }
    };
      

    const handleCancelRequest = async (id) => {
        if (!token) {
          Swal.fire('Error', 'No token found, please login again.', 'error');
          return;
        }
        
        const result = await Swal.fire({
            title: 'Cancel Request?',
            text: 'You will be removed from this volunteer opportunity. Are you sure?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#f59e0b',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Yes, cancel it!',
            cancelButtonText: 'Keep Request'
        });

        if (result.isConfirmed) {
            try {
                const res = await fetch(`https://volunteerhub-server.vercel.app/volunteer-requests/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const data = await res.json();
                if (data.message === 'Request cancelled') {
                    setRequests(requests.filter(r => r._id !== id));
                    Swal.fire({
                        title: 'Cancelled!',
                        text: 'Your request has been successfully cancelled.',
                        icon: 'success',
                        timer: 2000,
                        showConfirmButton: false
                    });
                }
            } catch (err) {
                console.error('Cancel error:', err);
                Swal.fire('Error', 'Failed to cancel request. Please try again.', 'error');
            }
        }
    };

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'approved': return 'badge-success';
            case 'pending': return 'badge-warning';
            case 'rejected': return 'badge-error';
            default: return 'badge-info';
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
                <div className="text-center">
                    <div className="loading loading-spinner loading-lg text-primary"></div>
                    <p className="mt-4 text-gray-600 dark:text-gray-300">Loading your posts...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
            <div className="max-w-7xl mx-auto p-6 space-y-8">
                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-8"
                >
                    <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
                        Manage Your Posts
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                        Keep track of your volunteer opportunities and applications in one place
                    </p>
                </motion.div>

                {/* Stats Cards */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
                >
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border-l-4 border-primary">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Total Posts</p>
                                <p className="text-2xl font-bold text-gray-800 dark:text-white">{posts.length}</p>
                            </div>
                            <FaEdit className="text-3xl text-primary" />
                        </div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border-l-4 border-secondary">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Applications</p>
                                <p className="text-2xl font-bold text-gray-800 dark:text-white">{requests.length}</p>
                            </div>
                            <FaUser className="text-3xl text-secondary" />
                        </div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border-l-4 border-accent">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Active Posts</p>
                                <p className="text-2xl font-bold text-gray-800 dark:text-white">
                                    {posts.filter(p => new Date(p.deadline) > new Date()).length}
                                </p>
                            </div>
                            <FaCheckCircle className="text-3xl text-accent" />
                        </div>
                    </div>
                </motion.div>

                {/* Tab Navigation */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="flex justify-center mb-8"
                >
                    <div className="bg-white dark:bg-gray-800 p-2 rounded-xl shadow-lg">
                        <div className="flex space-x-2">
                            <button
                                onClick={() => setActiveTab('posts')}
                                className={`px-6 py-3 rounded-lg font-medium transition-all ${
                                    activeTab === 'posts'
                                        ? 'bg-primary text-white shadow-lg'
                                        : 'text-gray-600 dark:text-gray-300 hover:text-primary'
                                }`}
                            >
                                My Posts ({posts.length})
                            </button>
                            <button
                                onClick={() => setActiveTab('requests')}
                                className={`px-6 py-3 rounded-lg font-medium transition-all ${
                                    activeTab === 'requests'
                                        ? 'bg-primary text-white shadow-lg'
                                        : 'text-gray-600 dark:text-gray-300 hover:text-primary'
                                }`}
                            >
                                My Applications ({requests.length})
                            </button>
                        </div>
                    </div>
                </motion.div>

                {/* Content Sections */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    {activeTab === 'posts' ? (
                        /* My Volunteer Need Posts */
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
                            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                                <div className="flex justify-between items-center">
                                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                                        My Volunteer Posts
                                    </h2>
                                    <Link 
                                        to="/add-post" 
                                        className="btn btn-primary gap-2"
                                    >
                                        <FaPlus /> Add New Post
                                    </Link>
                                </div>
                            </div>

                            {posts.length === 0 ? (
                                <div className="p-12 text-center">
                                    <FaEdit className="text-6xl text-gray-400 mx-auto mb-4" />
                                    <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-300 mb-2">
                                        No Posts Yet
                                    </h3>
                                    <p className="text-gray-500 dark:text-gray-400 mb-6">
                                        Start by creating your first volunteer opportunity
                                    </p>
                                    <Link to="/add-post" className="btn btn-primary gap-2">
                                        <FaPlus /> Create Your First Post
                                    </Link>
                                </div>
                            ) : (
                                <div className="p-6">
                                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                                        {posts.map((post, index) => (
                                            <motion.div
                                                key={post._id}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: index * 0.1 }}
                                                className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 hover:shadow-lg transition-all"
                                            >
                                                <div className="flex justify-between items-start mb-4">
                                                    <div className="flex-1">
                                                        <h3 className="font-bold text-lg text-gray-800 dark:text-white mb-2">
                                                            {post.title}
                                                        </h3>
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <FaTag className="text-sm text-gray-500" />
                                                            <span className="text-sm text-gray-600 dark:text-gray-300">
                                                                {post.category}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className={`badge ${new Date(post.deadline) < new Date() ? 'badge-error' : 'badge-success'}`}>
                                                        {new Date(post.deadline) < new Date() ? 'Expired' : 'Active'}
                                                    </div>
                                                </div>

                                                <div className="space-y-3 mb-6">
                                                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                                                        <FaUsers className="text-primary" />
                                                        <span>{post.volunteersNeeded} volunteers needed</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                                                        <FaCalendarAlt className="text-secondary" />
                                                        <span>Deadline: {format(new Date(post.deadline), 'MMM dd, yyyy')}</span>
                                                    </div>
                                                </div>

                                                <div className="flex gap-2">
                                                    {post.organizerEmail === user.email ? (
                                                        <>
                                                            <Link 
                                                                to={`/update-post/${post._id}`} 
                                                                className="btn btn-sm btn-outline btn-primary gap-1 flex-1"
                                                            >
                                                                <FaEdit /> Edit
                                                            </Link>
                                                            <button 
                                                                onClick={() => handleDeletePost(post._id)} 
                                                                className="btn btn-sm btn-error text-white gap-1 flex-1"
                                                            >
                                                                <FaTrash /> Delete
                                                            </button>
                                                        </>
                                                    ) : (
                                                        <div className="w-full text-center text-sm text-gray-500 dark:text-gray-400 py-2">
                                                            You can only manage your own posts
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                                                    {post.organizerEmail === user.email ? (
                                                        <span className="text-green-600 dark:text-green-400">✓ Your Post</span>
                                                    ) : (
                                                        <span className="text-red-600 dark:text-red-400">✗ Not Your Post</span>
                                                    )}
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        /* My Volunteer Requests */
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
                            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                                    My Applications
                                </h2>
                            </div>

                            {requests.length === 0 ? (
                                <div className="p-12 text-center">
                                    <FaUser className="text-6xl text-gray-400 mx-auto mb-4" />
                                    <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-300 mb-2">
                                        No Applications Yet
                                    </h3>
                                    <p className="text-gray-500 dark:text-gray-400 mb-6">
                                        Start volunteering by applying to opportunities
                                    </p>
                                    <Link to="/all-posts" className="btn btn-primary gap-2">
                                        <FaEye /> Browse Opportunities
                                    </Link>
                                </div>
                            ) : (
                                <div className="p-6">
                                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                                        {requests.map((req, index) => (
                                            <motion.div
                                                key={req._id}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: index * 0.1 }}
                                                className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 hover:shadow-lg transition-all"
                                            >
                                                <div className="flex justify-between items-start mb-4">
                                                    <div className="flex-1">
                                                        <h3 className="font-bold text-lg text-gray-800 dark:text-white mb-2">
                                                            {req.title}
                                                        </h3>
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <FaUser className="text-sm text-gray-500" />
                                                            <span className="text-sm text-gray-600 dark:text-gray-300">
                                                                {req.organizerEmail}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className={`badge ${getStatusColor(req.status)}`}>
                                                        {req.status}
                                                    </div>
                                                </div>

                                                {req.suggestion && (
                                                    <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                                        <p className="text-sm text-blue-700 dark:text-blue-300">
                                                            <strong>Organizer's Note:</strong> {req.suggestion}
                                                        </p>
                                                    </div>
                                                )}

                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleCancelRequest(req._id)}
                                                        className="btn btn-sm btn-outline btn-error gap-1 flex-1"
                                                    >
                                                        <FaTimes /> Cancel
                                                    </button>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
};

export default ManagePosts;