import React, { useState, useEffect } from 'react';
import { FaStar, FaEdit, FaTrash, FaUser, FaCalendarAlt } from 'react-icons/fa';
import useAxiosSecure from '../hooks/useAxiosSecure';
import useAuth from '../hooks/useAuth';

const RatingSystem = ({ postId, onRatingUpdate }) => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  
  const [ratings, setRatings] = useState([]);
  const [userRating, setUserRating] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    rating: 5,
    review: ''
  });
  const [loading, setLoading] = useState(false);
  const [editingRating, setEditingRating] = useState(null);

  // Fetch ratings for this post
  const fetchRatings = async () => {
    try {
      const response = await axiosSecure.get(`/ratings/post/${postId}`);
      if (response.data.ratings) {
        setRatings(response.data.ratings);
        
        // Check if current user has already rated
        const userRating = response.data.ratings.find(r => r.reviewerEmail === user?.email);
        if (userRating) {
          setUserRating(userRating);
          setFormData({
            rating: userRating.rating,
            review: userRating.review
          });
        }
      }
    } catch (error) {
      console.error('Error fetching ratings:', error);
    }
  };

  // Fetch user's ratings
  const fetchUserRatings = async () => {
    if (!user) return;
    
    try {
      const response = await axiosSecure.get('/my-ratings');
      if (response.data.ratings) {
        const userRating = response.data.ratings.find(r => r.postId === postId);
        if (userRating) {
          setUserRating(userRating);
          setFormData({
            rating: userRating.rating,
            review: userRating.review
          });
        }
      }
    } catch (error) {
      console.error('Error fetching user ratings:', error);
    }
  };

  useEffect(() => {
    fetchRatings();
    fetchUserRatings();
  }, [postId, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      if (editingRating) {
        // Update existing rating
        const response = await axiosSecure.put(`/ratings/${editingRating._id}`, {
          rating: formData.rating,
          review: formData.review,
          category: 'general'
        });
        
        if (response.data.updatedRating) {
          setRatings(prev => prev.map(r => 
            r._id === editingRating._id 
              ? { ...r, rating: formData.rating, review: formData.review }
              : r
          ));
          setUserRating(response.data.updatedRating);
          setEditingRating(null);
          setShowForm(false);
          onRatingUpdate && onRatingUpdate();
        }
      } else {
        // Create new rating
        console.log('Sending rating data:', {
          postId,
          rating: formData.rating,
          review: formData.review,
          category: 'general'
        });
        
        const response = await axiosSecure.post('/ratings', {
          postId,
          rating: formData.rating,
          review: formData.review,
          category: 'general'
        });
        
        console.log('Rating response:', response.data);
        
        if (response.data.rating) {
          setRatings(prev => [response.data.rating, ...prev]);
          setUserRating(response.data.rating);
          setShowForm(false);
          onRatingUpdate && onRatingUpdate();
        }
      }
    } catch (error) {
      console.error('Error saving rating:', error);
      console.error('Error response:', error.response?.data);
      console.error('User:', user);
      console.error('PostId:', postId);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (ratingId) => {
    if (!confirm('Are you sure you want to delete this rating?')) return;
    
    try {
      const response = await axiosSecure.delete(`/ratings/${ratingId}`);
      if (response.data.message) {
        setRatings(prev => prev.filter(r => r._id !== ratingId));
        if (userRating?._id === ratingId) {
          setUserRating(null);
          setFormData({ rating: 5, review: '' });
        }
        onRatingUpdate && onRatingUpdate();
      }
    } catch (error) {
      console.error('Error deleting rating:', error);
    }
  };

  const handleEdit = (rating) => {
    setEditingRating(rating);
    setFormData({
      rating: rating.rating,
      review: rating.review
    });
    setShowForm(true);
  };

  const cancelEdit = () => {
    setEditingRating(null);
    setShowForm(false);
    if (userRating) {
      setFormData({
        rating: userRating.rating,
        review: userRating.review
      });
    } else {
      setFormData({ rating: 5, review: '' });
    }
  };

  const averageRating = ratings.length > 0 
    ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length 
    : 0;

  const renderStars = (rating, interactive = false, onChange = null) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type={interactive ? "button" : "button"}
            onClick={interactive && onChange ? () => onChange(star) : undefined}
            className={`text-lg ${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : ''}`}
            disabled={!interactive}
          >
            <FaStar 
              className={`${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
            />
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
            Ratings & Reviews
          </h3>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              {renderStars(averageRating)}
              <span className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                {averageRating.toFixed(1)}
              </span>
            </div>
            <span className="text-gray-600 dark:text-gray-400">
              ({ratings.length} {ratings.length === 1 ? 'rating' : 'ratings'})
            </span>
          </div>
        </div>
        
        {user && !userRating && (
          <button
            onClick={() => setShowForm(true)}
            className="btn btn-primary"
          >
            Rate This Post
          </button>
        )}
      </div>

      {/* Rating Form */}
      {showForm && (
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
          <h4 className="font-semibold text-gray-800 dark:text-white mb-3">
            {editingRating ? 'Edit Your Rating' : 'Add Your Rating'}
          </h4>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Rating
              </label>
              {renderStars(formData.rating, true, (rating) => 
                setFormData(prev => ({ ...prev, rating }))
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Review (Optional)
              </label>
              <textarea
                value={formData.review}
                onChange={(e) => setFormData(prev => ({ ...prev, review: e.target.value }))}
                placeholder="Share your thoughts about this post..."
                className="textarea textarea-bordered w-full"
                rows="3"
              />
            </div>
            
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary btn-sm"
              >
                {loading ? 'Saving...' : (editingRating ? 'Update Rating' : 'Submit Rating')}
              </button>
              <button
                type="button"
                onClick={cancelEdit}
                className="btn btn-outline btn-sm"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* User's Current Rating */}
      {userRating && !showForm && (
        <div className="bg-primary/10 dark:bg-primary/20 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-gray-800 dark:text-white mb-2">
                Your Rating
              </h4>
              <div className="flex items-center gap-2 mb-2">
                {renderStars(userRating.rating)}
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {userRating.rating}/5
                </span>
              </div>
              {userRating.review && (
                <p className="text-gray-700 dark:text-gray-300 text-sm">
                  "{userRating.review}"
                </p>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(userRating)}
                className="btn btn-outline btn-sm"
              >
                <FaEdit className="w-3 h-3" />
                Edit
              </button>
              <button
                onClick={() => handleDelete(userRating._id)}
                className="btn btn-error btn-sm"
              >
                <FaTrash className="w-3 h-3" />
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* All Ratings */}
      {ratings.length > 0 && (
        <div>
          <h4 className="font-semibold text-gray-800 dark:text-white mb-4">
            All Reviews
          </h4>
          <div className="space-y-4">
            {ratings.map((rating) => (
              <div key={rating._id} className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-b-0">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-sm">
                      {rating.userName?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <div>
                      <div className="font-medium text-gray-800 dark:text-white">
                        {rating.userName || 'Anonymous User'}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                        <FaCalendarAlt className="w-3 h-3" />
                        {new Date(rating.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  
                  {user && rating.userId === user.uid && (
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleEdit(rating)}
                        className="btn btn-ghost btn-xs"
                      >
                        <FaEdit className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => handleDelete(rating._id)}
                        className="btn btn-ghost btn-xs text-error"
                      >
                        <FaTrash className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center gap-2 mb-2">
                  {renderStars(rating.rating)}
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {rating.rating}/5
                  </span>
                </div>
                
                {rating.review && (
                  <p className="text-gray-700 dark:text-gray-300 text-sm">
                    {rating.review}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No Ratings Message */}
      {ratings.length === 0 && !userRating && (
        <div className="text-center py-8">
          <div className="text-4xl mb-3">⭐</div>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            No ratings yet. Be the first to rate this post!
          </p>
          {user && (
            <button
              onClick={() => setShowForm(true)}
              className="btn btn-primary"
            >
              Rate This Post
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default RatingSystem;
