import React, { useState, useEffect } from 'react';
import { FaStar, FaEdit, FaTrash, FaEye, FaCalendarAlt, FaUser, FaSearch, FaFilter } from 'react-icons/fa';
import useAxiosSecure from '../../shared/hooks/useAxiosSecure';
import LoadingSpinner from '../../shared/components/LoadingSpinner';

const AdminRatingManagement = () => {
  const axiosSecure = useAxiosSecure();
  
  const [allRatings, setAllRatings] = useState([]);
  const [filteredRatings, setFilteredRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRating, setFilterRating] = useState('all');
  const [sortBy, setSortBy] = useState('latest');

  // Fetch all ratings (admin only)
  const fetchAllRatings = async () => {
    try {
      setLoading(true);
      // This would be an admin endpoint to get all ratings
      const response = await axiosSecure.get('/admin/ratings');
      if (response.data.success) {
        setAllRatings(response.data.ratings);
        setFilteredRatings(response.data.ratings);
      }
    } catch (error) {
      console.error('Error fetching all ratings:', error);
      // Fallback: try to get ratings from individual posts
      await fetchRatingsFromPosts();
    } finally {
      setLoading(false);
    }
  };

  // Fallback method to get ratings from individual posts
  const fetchRatingsFromPosts = async () => {
    try {
      // Get all blog posts first
      const postsResponse = await axiosSecure.get('/blog-posts');
      if (postsResponse.data.success && postsResponse.data.blogPosts) {
        const allRatings = [];
        
        // Get ratings for each post
        for (const post of postsResponse.data.blogPosts) {
          try {
            const ratingResponse = await axiosSecure.get(`/ratings/post/${post._id}`);
            if (ratingResponse.data.success && ratingResponse.data.ratings.length > 0) {
              // Add post title to each rating
              const ratingsWithPostInfo = ratingResponse.data.ratings.map(rating => ({
                ...rating,
                postTitle: post.title,
                postId: post._id
              }));
              allRatings.push(...ratingsWithPostInfo);
            }
          } catch (error) {
            console.error(`Error fetching ratings for post ${post._id}:`, error);
          }
        }
        
        setAllRatings(allRatings);
        setFilteredRatings(allRatings);
      }
    } catch (error) {
      console.error('Error fetching posts for ratings:', error);
    }
  };

  useEffect(() => {
    fetchAllRatings();
  }, []);

  useEffect(() => {
    filterAndSortRatings();
  }, [searchTerm, filterRating, sortBy, allRatings]);

  const filterAndSortRatings = () => {
    let filtered = allRatings.filter(rating => {
      const matchesSearch = 
        rating.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rating.postTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rating.review?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesRating = filterRating === 'all' || rating.rating === parseInt(filterRating);
      
      return matchesSearch && matchesRating;
    });

    // Sort ratings
    switch (sortBy) {
      case 'latest':
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'oldest':
        filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case 'highest':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'lowest':
        filtered.sort((a, b) => a.rating - b.rating);
        break;
      default:
        break;
    }

    setFilteredRatings(filtered);
  };

  const handleDelete = async (ratingId) => {
    if (!confirm('Are you sure you want to delete this rating? This action cannot be undone.')) return;
    
    try {
      const response = await axiosSecure.delete(`/ratings/${ratingId}`);
      if (response.data.success) {
        setAllRatings(prev => prev.filter(r => r._id !== ratingId));
        // Show success message
        alert('Rating deleted successfully');
      }
    } catch (error) {
      console.error('Error deleting rating:', error);
      alert('Failed to delete rating');
    }
  };

  const renderStars = (rating) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <FaStar 
            key={star}
            className={`text-lg ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
          />
        ))}
        <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
          {rating}/5
        </span>
      </div>
    );
  };

  const getRatingStats = () => {
    const total = allRatings.length;
    const average = total > 0 ? (allRatings.reduce((sum, r) => sum + r.rating, 0) / total).toFixed(1) : 0;
    const fiveStar = allRatings.filter(r => r.rating === 5).length;
    const oneStar = allRatings.filter(r => r.rating === 1).length;
    
    return { total, average, fiveStar, oneStar };
  };

  const stats = getRatingStats();

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            All Ratings & Reviews
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Manage all ratings and reviews in the system
          </p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-primary">
            {stats.total}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Total Ratings
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4">
          <div className="text-2xl font-bold text-primary">{stats.total}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Total Ratings</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4">
          <div className="text-2xl font-bold text-green-500">{stats.average}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Average Rating</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4">
          <div className="text-2xl font-bold text-yellow-500">{stats.fiveStar}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">5-Star Ratings</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4">
          <div className="text-2xl font-bold text-red-500">{stats.oneStar}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">1-Star Ratings</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by user, post title, or review..."
                className="input input-bordered w-full pl-10"
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            <select
              value={filterRating}
              onChange={(e) => setFilterRating(e.target.value)}
              className="select select-bordered"
            >
              <option value="all">All Ratings</option>
              <option value="5">5 Stars</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars</option>
              <option value="2">2 Stars</option>
              <option value="1">1 Star</option>
            </select>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="select select-bordered"
            >
              <option value="latest">Latest First</option>
              <option value="oldest">Oldest First</option>
              <option value="highest">Highest Rating</option>
              <option value="lowest">Lowest Rating</option>
            </select>
          </div>
        </div>
      </div>

      {/* Ratings List */}
      {filteredRatings.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-12 text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
            No Ratings Found
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {searchTerm || filterRating !== 'all' 
              ? 'Try adjusting your search criteria or filters'
              : 'There are no ratings in the system yet.'
            }
          </p>
          {(searchTerm || filterRating !== 'all') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setFilterRating('all');
              }}
              className="btn btn-primary"
            >
              Clear Filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredRatings.map((rating) => (
            <div key={rating._id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold">
                      {rating.userName?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 dark:text-white">
                        {rating.postTitle || 'Blog Post'}
                      </h4>
                      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                        <FaUser className="w-3 h-3" />
                        <span>{rating.userName || 'Anonymous User'}</span>
                        <span>•</span>
                        <FaCalendarAlt className="w-3 h-3" />
                        <span>{new Date(rating.createdAt).toLocaleDateString()}</span>
                        {rating.updatedAt && rating.updatedAt !== rating.createdAt && (
                          <>
                            <span>•</span>
                            <span>Updated: {new Date(rating.updatedAt).toLocaleDateString()}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    {renderStars(rating.rating)}
                  </div>
                  
                  {rating.review && (
                    <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                      "{rating.review}"
                    </p>
                  )}
                </div>
                
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => handleDelete(rating._id)}
                    className="btn btn-error btn-sm"
                    title="Delete Rating"
                  >
                    <FaTrash className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminRatingManagement;
