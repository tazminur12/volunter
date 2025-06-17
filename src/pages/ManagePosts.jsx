import React, { useContext, useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { AuthContext } from '../context/AuthProvider';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

const ManagePosts = () => {
    const { user } = useContext(AuthContext);
    const [posts, setPosts] = useState([]);
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    const token = localStorage.getItem('token');

    // Fetch my volunteer posts
    useEffect(() => {
        const fetchPosts = async () => {
            if (!user?.email) return;
            try {
                const res = await fetch(`https://volunteerhub-server.vercel.app/posts?organizerEmail=${user.email}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const data = await res.json();
                setPosts(data);
            } catch (err) {
                console.error('Error fetching posts', err);
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
    }, [user, token]);

    // Fetch my volunteer requests
    useEffect(() => {
        const fetchRequests = async () => {
            if (!user?.email) return;
            try {
                const res = await fetch(`https://volunteerhub-server.vercel.app/volunteer-requests?email=${user.email}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const data = await res.json();
                setRequests(data);
            } catch (err) {
                console.error('Error fetching requests', err);
            }
        };
        fetchRequests();
    }, [user, token]);

    const handleDeletePost = async (id) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: 'You cannot undo this action.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
        });

        if (result.isConfirmed) {
            try {
                const res = await fetch(`https://volunteerhub-server.vercel.app/posts/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const data = await res.json();
                if (data.message === 'Post deleted') {
                    setPosts(posts.filter(p => p._id !== id));
                    Swal.fire('Deleted!', 'Your post has been deleted.', 'success');
                }
            } catch (error) {
                Swal.fire('Error', 'Failed to delete post.', 'error');
            }
        }
    };

    const handleCancelRequest = async (id) => {
        const result = await Swal.fire({
            title: 'Cancel your request?',
            text: 'You will be removed from this volunteer opportunity.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, cancel it!'
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
                    Swal.fire('Cancelled!', 'Your request has been cancelled.', 'success');
                }
            } catch (err) {
                Swal.fire('Error', 'Failed to cancel request.', 'error');
            }
        }
    };

    if (loading) return <p className="text-center py-10">Loading...</p>;

    return (
        <div className="max-w-7xl mx-auto p-6 space-y-10">
            {/* My Volunteer Need Posts */}
            <section>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-semibold">My Volunteer Need Posts</h2>
                    <Link to="/add-post" className="btn btn-primary">Add New Post</Link>
                </div>

                {posts.length === 0 ? (
                    <p className="text-gray-500">You haven't added any posts yet.</p>
                ) : (
                    <div className="overflow-x-auto shadow-md rounded-lg">
                        <table className="table w-full">
                            <thead>
                                <tr>
                                    <th>Title</th>
                                    <th>Category</th>
                                    <th>Volunteers</th>
                                    <th>Deadline</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {posts.map(post => (
                                    <tr key={post._id}>
                                        <td>{post.title}</td>
                                        <td>{post.category}</td>
                                        <td>{post.volunteersNeeded}</td>
                                        <td>{format(new Date(post.deadline), 'PPP')}</td>
                                        <td className="space-x-2">
                                            <Link to={`/update-post/${post._id}`} className="btn btn-xs">Edit</Link>
                                            <button onClick={() => handleDeletePost(post._id)} className="btn btn-xs btn-error text-white">Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>

            {/* My Volunteer Requests */}
            <section>
                <h2 className="text-2xl font-semibold mb-4">My Volunteer Request Posts</h2>

                {requests.length === 0 ? (
                    <p className="text-gray-500">You haven't applied for any posts yet.</p>
                ) : (
                    <div className="overflow-x-auto shadow-md rounded-lg">
                        <table className="table w-full">
                            <thead>
                                <tr>
                                    <th>Title</th>
                                    <th>Organizer</th>
                                    <th>Status</th>
                                    <th>Suggestion</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {requests.map(req => (
                                    <tr key={req._id}>
                                        <td>{req.title}</td>
                                        <td>{req.organizerEmail}</td>
                                        <td><span className="badge badge-info">{req.status}</span></td>
                                        <td>{req.suggestion || '—'}</td>
                                        <td>
                                            <button
                                                onClick={() => handleCancelRequest(req._id)}
                                                className="btn btn-xs btn-error text-white"
                                            >
                                                Cancel
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>
        </div>
    );
};

export default ManagePosts;