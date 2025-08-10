import React, { useState, useEffect } from 'react';
import { FaStar, FaEdit, FaTrash, FaEye, FaCalendarAlt, FaUser } from 'react-icons/fa';
import useAxiosSecure from '../hooks/useAxiosSecure';
import useAuth from '../hooks/useAuth';
import LoadingSpinner from './LoadingSpinner';

const RatingManagement = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingRating, setEditingRating] = useState(null);
  const [formData, setFormData] = useState({
    rating: 5,
    review: ''
  });
  const [showEditForm, setShowEditForm] = useState(false);

  // Fetch user's ratings
  const fetchUserRatings = async () => {
    try {
      setLoading(true);
      const response = await axiosSecure.get('/my-ratings');
      if (response.data.success) {
        setRatings(response.data.ratings);
      }
    } catch (error) {
      console.error('Error fetching user ratings:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserRatings();
  }, []);

  const handleEdit = (rating) => {
    setEditingRating(rating);
    setFormData({
      rating: rating.rating,
      review: rating.review
    });
    setShowEditForm(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editingRating) return;

    try {
      const response = await axiosSecure.put(`/ratings/${editingRating._id}`, {
        rating: formData.rating,
        review: formData.review
      });
      
      if (response.data.success) {
        setRatings(prev => prev.map(r => 
          r._id === editingRating._id 
            ? { ...r, rating: formData.rating, review: formData.review }
            : r
        ));
        setEditingRating(null);
        setShowEditForm(false);
        setFormData({ rating: 5, review: '' });
      }
    } catch (error) {
      console.error('Error updating rating:', error);
    }
  };

  const handleDelete = async (ratingId) => {
    if (!confirm('Are you sure you want to delete this rating?')) return;
    
    try {
      const response = await axiosSecure.delete(`/ratings/${ratingId}`);
      if (response.data.success) {
        setRatings(prev => prev.filter(r => r._id !== ratingId));
      }
    } catch (error) {
      console.error('Error deleting rating:', error);
    }
  };

  const cancelEdit = () => {
    setEditingRating(null);
    setShowEditForm(false);
    setFormData({ rating: 5, review: '' });
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

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            My Ratings & Reviews
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your ratings and reviews for blog posts
          </p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-primary">
            {ratings.length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Total Ratings
          </div>
        </div>
      </div>

      {/* Edit Form */}
      {showEditForm && editingRating && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            Edit Rating for: {editingRating.postTitle || 'Blog Post'}
          </h3>
          
          <form onSubmit={handleUpdate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Rating
              </label>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, rating: star }))}
                    className={`text-2xl ${formData.rating >= star ? 'text-yellow-400' : 'text-gray-300'} hover:scale-110 transition-transform`}
                  >
                    <FaStar />
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Review
              </label>
              <textarea
                value={formData.review}
                onChange={(e) => setFormData(prev => ({ ...prev, review: e.target.value }))}
                className="textarea textarea-bordered w-full"
                rows="3"
                placeholder="Share your thoughts about this post..."
              />
            </div>
            
            <div className="flex gap-2">
              <button type="submit" className="btn btn-primary">
                Update Rating
              </button>
              <button type="button" onClick={cancelEdit} className="btn btn-outline">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Ratings List */}
      {ratings.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-12 text-center">
          <div className="text-6xl mb-4">⭐</div>
          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
            No Ratings Yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            You haven't rated any blog posts yet. Start rating posts to see them here!
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {ratings.map((rating) => (
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
                    onClick={() => handleEdit(rating)}
                    className="btn btn-outline btn-sm"
                    title="Edit Rating"
                  >
                    <FaEdit className="w-3 h-3" />
                  </button>
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

export default RatingManagement;
