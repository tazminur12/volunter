import React, { useState, useEffect } from 'react';
import { FaStar, FaEdit, FaTrash, FaEye, FaCalendarAlt, FaUser, FaSearch, FaFilter } from 'react-icons/fa';
import LoadingSpinner from '../../shared/components/LoadingSpinner';
import { useRatingQueries } from './useRatingQueries';

const AdminRatingManagement = () => {
  const {
    useAllRatings,
    useAdminDeleteRating,
    calculateAverageRating,
    getRatingDistribution
  } = useRatingQueries();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRating, setFilterRating] = useState('all');
  const [sortBy, setSortBy] = useState('latest');

  // Use React Query hooks
  const { data: ratingsData, isLoading: loading } = useAllRatings();
  const deleteRatingMutation = useAdminDeleteRating();

  // Extract data from API response
  const allRatings = ratingsData?.ratings || [];
  const [filteredRatings, setFilteredRatings] = useState([]);

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

  const handleDelete = (ratingId) => {
    if (!confirm('Are you sure you want to delete this rating? This action cannot be undone.')) return;
    
    deleteRatingMutation.mutate(ratingId);
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
    const average = calculateAverageRating(allRatings).toFixed(1);
    const distribution = getRatingDistribution(allRatings);
    const fiveStar = distribution[5];
    const oneStar = distribution[1];
    
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
