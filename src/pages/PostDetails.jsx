import React from 'react';
import { useParams, Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { 
  FaCalendarAlt, 
  FaMapMarkerAlt, 
  FaUserFriends, 
  FaClock, 
  FaShareAlt, 
  FaHeart, 
  FaRegHeart, 
  FaArrowLeft, 
  FaFacebookF, 
  FaTwitter, 
  FaYoutube,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaGlobe,
  FaTag,
  FaCheckCircle,
  FaExclamationTriangle,
  FaStar,
  FaHandshake,
  FaUsers,
  FaBookmark,
  FaBookmark as FaBookmarkOutline
} from 'react-icons/fa';
/* eslint-disable no-unused-vars */
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import ErrorPage from './ErrorPage';
import LoadingSpinner from '../components/LoadingSpinner';
import useAxios from '../hooks/useAxios';
import useAxiosSecure from '../hooks/useAxiosSecure';

const PostDetails = () => {
    const { id } = useParams();
    const [post, setPost] = React.useState(null);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);
    const [isLiked, setIsLiked] = React.useState(false);
    const [isSaved, setIsSaved] = React.useState(false);
    const [shareOpen, setShareOpen] = React.useState(false);
    const [applying, setApplying] = React.useState(false);
    const [hasApplied, setHasApplied] = React.useState(false);

    const axiosPublic = useAxios();
    const axiosSecure = useAxiosSecure();

    React.useEffect(() => {
        const fetchPost = async () => {
            try {
                console.log('Fetching post with ID:', id);
                const response = await axiosPublic.get(`/posts/${id}`);
                console.log('Response status:', response.status);
                
                if (response.status !== 200) {
                    if (response.status === 404) {
                        throw new Error('Post not found');
                    } else {
                        throw new Error(`HTTP ${response.status}`);
                    }
                }
                
                const data = response.data;
                console.log('Post data:', data);
                setPost(data);
            } catch (err) {
                console.error('Error fetching post:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPost();
    }, [id, axiosPublic]);

    const handleLike = () => {
        setIsLiked(!isLiked);
        // In a real app, you would also update the backend here
    };

    const handleSave = () => {
        setIsSaved(!isSaved);
        // In a real app, you would also update the backend here
    };

    const handleShare = () => {
        setShareOpen(!shareOpen);
        // In a real app, implement actual sharing functionality
    };

    const handleApply = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            Swal.fire({
                icon: 'warning',
                title: 'Login Required',
                text: 'Please login to apply for this opportunity',
                confirmButtonText: 'Login Now',
                showCancelButton: true,
                cancelButtonText: 'Cancel'
            }).then((result) => {
                if (result.isConfirmed) {
                    window.location.href = '/login';
                }
            });
            return;
        }

        setApplying(true);
        try {
            // Create volunteer request
            const requestData = {
                postId: post._id,
                postTitle: post.title,
                organizerEmail: post.organizerEmail,
                organizerName: post.organizerName,
                status: 'pending',
                appliedAt: new Date().toISOString()
            };

            const requestResponse = await axiosSecure.post('/volunteer-requests', requestData);
            if (requestResponse.status !== 200 && requestResponse.status !== 201) {
                throw new Error('Failed to submit application');
            }

            // Decrease volunteer count
            const decreaseResponse = await axiosSecure.patch(`/posts/${post._id}/decrease-volunteers`);
            if (decreaseResponse.status >= 200 && decreaseResponse.status < 300) {
                setHasApplied(true);
                Swal.fire({
                    icon: 'success',
                    title: 'Application Submitted!',
                    text: 'Your application has been submitted successfully. The organizer will review and contact you soon.',
                    confirmButtonText: 'Great!'
                });
            } else {
                // If decrease fails, still show success but with a note
                setHasApplied(true);
                Swal.fire({
                    icon: 'success',
                    title: 'Application Submitted!',
                    text: 'Your application has been submitted. Note: Volunteer count may be at maximum.',
                    confirmButtonText: 'OK'
                });
            }
        } catch (error) {
            console.error('Apply error:', error);
            Swal.fire({
                icon: 'error',
                title: 'Application Failed',
                text: 'Failed to submit your application. Please try again.',
                confirmButtonText: 'Try Again'
            });
        } finally {
            setApplying(false);
        }
    };

    const getDaysUntilDeadline = (deadline) => {
        const today = new Date();
        const deadlineDate = new Date(deadline);
        const diffTime = deadlineDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    if (loading) return <LoadingSpinner />;
    if (error || !post) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 max-w-md mx-4 text-center">
                    <div className="text-6xl mb-4">😕</div>
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                        {error === 'Post not found' ? 'Post Not Found' : 'Something went wrong'}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                        {error === 'Post not found' 
                            ? 'The volunteer opportunity you\'re looking for doesn\'t exist or has been removed.'
                            : error || 'Failed to load the volunteer opportunity.'
                        }
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <Link to="/all-posts" className="btn btn-primary">
                            Browse Opportunities
                        </Link>
                        <button 
                            onClick={() => window.location.reload()} 
                            className="btn btn-outline"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const daysUntilDeadline = getDaysUntilDeadline(post.deadline);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="max-w-7xl mx-auto px-4 py-8"
            >
                {/* Back Button */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <Link 
                        to="/all-posts" 
                        className="inline-flex items-center text-primary hover:text-primary-dark dark:text-primary dark:hover:text-primary-light mb-6 transition-colors group"
                    >
                        <FaArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" />
                        <span className="font-medium">Back to all opportunities</span>
                    </Link>
                </motion.div>

                {/* Main Content */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden"
                >
                    {/* Post Header */}
                    <div className="relative">
                        <img 
                            src={post.thumbnail || 'https://images.unsplash.com/photo-1521791136064-7986c2920216?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'} 
                            alt={post.title}
                            className="w-full h-64 md:h-96 object-cover"
                            onError={(e) => {
                                e.target.src = 'https://images.unsplash.com/photo-1521791136064-7986c2920216?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80';
                            }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                        
                        {/* Status Badge */}
                        <div className="absolute top-6 left-6">
                            {daysUntilDeadline <= 7 && daysUntilDeadline > 0 ? (
                                <span className="badge badge-error badge-lg gap-2">
                                    <FaExclamationTriangle />
                                    {daysUntilDeadline} days left
                                </span>
                            ) : daysUntilDeadline <= 0 ? (
                                <span className="badge badge-warning badge-lg gap-2">
                                    <FaClock />
                                    Expired
                                </span>
                            ) : (
                                <span className="badge badge-success badge-lg gap-2">
                                    <FaCheckCircle />
                                    Active
                                </span>
                            )}
                        </div>

                        {/* Category Badge */}
                        <div className="absolute top-6 right-6">
                            <span className="badge badge-primary badge-lg gap-2">
                                <FaTag />
                                {post.category}
                            </span>
                        </div>

                        {/* Header Content */}
                        <div className="absolute bottom-0 left-0 right-0 p-8">
                            <div className="flex flex-col md:flex-row md:justify-between md:items-end">
                                <div className="flex-1">
                                    <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">
                                        {post.title}
                                    </h1>
                                    <div className="flex flex-wrap items-center gap-4 text-white/90">
                                        <div className="flex items-center gap-2">
                                            <FaMapMarkerAlt className="text-primary-light" />
                                            <span className="font-medium">{post.location || 'Multiple locations'}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <FaUsers className="text-primary-light" />
                                            <span className="font-medium">{post.volunteersNeeded} volunteers needed</span>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Action Buttons */}
                                <div className="flex items-center gap-3 mt-4 md:mt-0">
                                    <button 
                                        onClick={handleLike}
                                        className="btn btn-circle btn-outline btn-primary text-white border-white hover:bg-white hover:text-primary"
                                        aria-label={isLiked ? 'Unlike post' : 'Like post'}
                                    >
                                        {isLiked ? <FaHeart className="text-red-500" /> : <FaRegHeart />}
                                    </button>
                                    <button 
                                        onClick={handleSave}
                                        className="btn btn-circle btn-outline btn-primary text-white border-white hover:bg-white hover:text-primary"
                                        aria-label={isSaved ? 'Remove from saved' : 'Save post'}
                                    >
                                        {isSaved ? <FaBookmark className="text-yellow-500" /> : <FaBookmarkOutline />}
                                    </button>
                                    <div className="relative">
                                        <button 
                                            onClick={handleShare}
                                            className="btn btn-circle btn-outline btn-primary text-white border-white hover:bg-white hover:text-primary"
                                            aria-label="Share post"
                                        >
                                            <FaShareAlt />
                                        </button>
                                        {shareOpen && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                className="absolute right-0 bottom-full mb-3 bg-white dark:bg-gray-700 rounded-xl shadow-2xl p-4 w-56 z-10"
                                            >
                                                <p className="text-sm font-medium mb-3 text-gray-800 dark:text-white">Share this opportunity:</p>
                                                <div className="flex justify-center gap-4">
                                                    <button className="btn btn-circle btn-sm bg-blue-600 hover:bg-blue-700 text-white">
                                                        <FaFacebookF />
                                                    </button>
                                                    <button className="btn btn-circle btn-sm bg-blue-400 hover:bg-blue-500 text-white">
                                                        <FaTwitter />
                                                    </button>
                                                    <button className="btn btn-circle btn-sm bg-red-600 hover:bg-red-700 text-white">
                                                        <FaYoutube />
                                                    </button>
                                                </div>
                                            </motion.div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Post Body */}
                    <div className="p-6 md:p-8">
                        {/* Quick Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                                        <FaUsers className="text-white text-xl" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Volunteers Needed</p>
                                        <p className="text-2xl font-bold text-gray-800 dark:text-white">{post.volunteersNeeded}</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl p-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                                        <FaCalendarAlt className="text-white text-xl" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Application Deadline</p>
                                        <p className="text-lg font-bold text-gray-800 dark:text-white">
                                            {format(new Date(post.deadline), 'MMM dd, yyyy')}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl p-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                                        <FaClock className="text-white text-xl" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Time Remaining</p>
                                        <p className="text-lg font-bold text-gray-800 dark:text-white">
                                            {daysUntilDeadline > 0 ? `${daysUntilDeadline} days` : 'Expired'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* About Section */}
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
                                <FaHandshake className="text-primary" />
                                About This Opportunity
                            </h2>
                            <div className="prose prose-lg max-w-none dark:prose-invert">
                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
                                    {post.description}
                                </p>
                            </div>
                        </div>

                        {/* Responsibilities & Requirements */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                            {post.responsibilities && (
                                <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
                                    <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                                        <FaCheckCircle className="text-green-500" />
                                        Responsibilities
                                    </h3>
                                    <ul className="space-y-3">
                                        {post.responsibilities.map((item, index) => (
                                            <li key={index} className="flex items-start gap-3 text-gray-700 dark:text-gray-300">
                                                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                                                <span>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {post.requirements && (
                                <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
                                    <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                                        <FaStar className="text-yellow-500" />
                                        Requirements
                                    </h3>
                                    <ul className="space-y-3">
                                        {post.requirements.map((item, index) => (
                                            <li key={index} className="flex items-start gap-3 text-gray-700 dark:text-gray-300">
                                                <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                                                <span>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>

                        {/* Organization Details */}
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 mb-8">
                            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                                <FaUser className="text-primary" />
                                Organization Details
                            </h3>
                            <div className="flex items-start gap-6">
                                <div className="flex-shrink-0">
                                    <div className="w-20 h-20 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-white text-2xl font-bold">
                                        {post.organizerName?.charAt(0) || 'O'}
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                                        {post.organizerName || 'Community Organization'}
                                    </h4>
                                    <div className="space-y-2 text-gray-600 dark:text-gray-300">
                                        <div className="flex items-center gap-2">
                                            <FaEnvelope className="text-primary" />
                                            <span>{post.organizerEmail}</span>
                                        </div>
                                        {post.organizerPhone && (
                                            <div className="flex items-center gap-2">
                                                <FaPhone className="text-primary" />
                                                <span>{post.organizerPhone}</span>
                                            </div>
                                        )}
                                        {post.organizerWebsite && (
                                            <div className="flex items-center gap-2">
                                                <FaGlobe className="text-primary" />
                                                <a href={post.organizerWebsite} className="text-primary hover:underline">
                                                    Visit Website
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                    {post.organizerBio && (
                                        <p className="text-gray-600 dark:text-gray-300 mt-4 leading-relaxed">
                                            {post.organizerBio}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Footer Actions */}
                        <div className="flex flex-col sm:flex-row justify-between items-center border-t border-gray-200 dark:border-gray-700 pt-6">
                            <div className="mb-4 sm:mb-0">
                                <p className="text-gray-600 dark:text-gray-400 text-sm">
                                    Posted on {format(new Date(post.createdAt), 'MMMM dd, yyyy')}
                                </p>
                                <p className="text-gray-500 dark:text-gray-500 text-xs">
                                    Opportunity ID: {post._id}
                                </p>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-3">
                                <button 
                                    className="btn btn-outline btn-primary gap-2"
                                    onClick={handleSave}
                                >
                                    {isSaved ? <FaBookmark /> : <FaBookmarkOutline />}
                                    {isSaved ? 'Saved' : 'Save for Later'}
                                </button>
                                <button 
                                    className={`btn btn-lg gap-2 ${hasApplied ? 'btn-success' : 'btn-primary'}`}
                                    onClick={handleApply}
                                    disabled={applying || hasApplied}
                                >
                                    {applying ? (
                                        <>
                                            <span className="loading loading-spinner loading-sm"></span>
                                            Applying...
                                        </>
                                    ) : hasApplied ? (
                                        <>
                                            <FaCheckCircle />
                                            Applied
                                        </>
                                    ) : (
                                        <>
                                            <FaHandshake />
                                            Apply Now
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Related Posts Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="mt-16"
                >
                    <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-8 flex items-center gap-2">
                        <FaStar className="text-primary" />
                        Similar Volunteer Opportunities
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* In a real app, you would map through related posts here */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                            <img 
                                src="https://images.unsplash.com/photo-1549923746-c502d488b3ea?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
                                alt="Related volunteer opportunity"
                                className="w-full h-48 object-cover"
                            />
                            <div className="p-6">
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="badge badge-primary badge-sm">Healthcare</span>
                                    <span className="text-sm text-gray-500 dark:text-gray-400">Jun 15, 2023</span>
                                </div>
                                <h3 className="font-semibold text-lg text-gray-800 dark:text-white mb-3">
                                    Community Food Drive
                                </h3>
                                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
                                    Help distribute food to families in need during the holiday season.
                                </p>
                                <button className="btn btn-outline btn-primary w-full">
                                    View Details
                                </button>
                            </div>
                        </div>
                        
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                            <img 
                                src="https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
                                alt="Related volunteer opportunity"
                                className="w-full h-48 object-cover"
                            />
                            <div className="p-6">
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="badge badge-secondary badge-sm">Education</span>
                                    <span className="text-sm text-gray-500 dark:text-gray-400">Jun 20, 2023</span>
                                </div>
                                <h3 className="font-semibold text-lg text-gray-800 dark:text-white mb-3">
                                    Youth Mentoring Program
                                </h3>
                                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
                                    Mentor young students and help them achieve their academic goals.
                                </p>
                                <button className="btn btn-outline btn-primary w-full">
                                    View Details
                                </button>
                            </div>
                        </div>
                        
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                            <img 
                                src="https://images.unsplash.com/photo-1521791136064-7986c2920216?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
                                alt="Related volunteer opportunity"
                                className="w-full h-48 object-cover"
                            />
                            <div className="p-6">
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="badge badge-accent badge-sm">Environment</span>
                                    <span className="text-sm text-gray-500 dark:text-gray-400">Jun 25, 2023</span>
                                </div>
                                <h3 className="font-semibold text-lg text-gray-800 dark:text-white mb-3">
                                    Beach Cleanup Initiative
                                </h3>
                                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
                                    Join us in cleaning up our local beaches and protecting marine life.
                                </p>
                                <button className="btn btn-outline btn-primary w-full">
                                    View Details
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default PostDetails;