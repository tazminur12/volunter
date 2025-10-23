import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../shared/hooks';
import { useImpactFeedQueries } from './useImpactFeedQueries';
import { 
  FaHeart, 
  FaComment, 
  FaShare, 
  FaEllipsisV, 
  FaEdit, 
  FaTrash,
  FaUser,
  FaCalendarAlt,
  FaMapMarkerAlt
} from 'react-icons/fa';
import { FiHeart, FiMessageCircle, FiShare2 } from 'react-icons/fi';
import Swal from 'sweetalert2';

const ImpactPost = ({ post, onLike, onShare }) => {
  const { user } = useAuth();
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [showMenu, setShowMenu] = useState(false);

  const { 
    usePostComments, 
    useAddComment, 
    useDeleteComment, 
    useDeleteImpactPost 
  } = useImpactFeedQueries();

  const { data: commentsData = { comments: [] }, isLoading: commentsLoading } = usePostComments(post._id);
  const comments = commentsData.comments || [];
  const addComment = useAddComment();
  const deleteComment = useDeleteComment();
  const deletePost = useDeleteImpactPost();

  const isOwner = user?.email === (post.createdBy?.email || post.userEmail);
  const isLiked = post.isLiked || false;

  const handleLike = () => {
    onLike(post._id, !isLiked);
  };

  const handleShare = () => {
    onShare(post._id);
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    addComment.mutate({
      postId: post._id,
      comment: newComment.trim()
    });
    setNewComment('');
  };

  const handleDeleteComment = (commentId) => {
    Swal.fire({
      title: 'Delete Comment?',
      text: "This action cannot be undone!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        deleteComment.mutate({
          postId: post._id,
          commentId
        });
      }
    });
  };

  const handleDeletePost = () => {
    Swal.fire({
      title: 'Delete Post?',
      text: "This action cannot be undone!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        deletePost.mutate(post._id);
      }
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getCategoryColor = (category) => {
    const colors = {
      environment: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      education: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      health: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      community: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    };
    return colors[category] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-700 h-fit"
    >
      {/* Post Header */}
      <div className="p-4 sm:p-6 pb-4">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-primary to-accent p-0.5 flex-shrink-0">
              <div className="bg-white dark:bg-gray-800 rounded-full w-full h-full flex items-center justify-center overflow-hidden">
                {(post.createdBy?.photoURL || post.userPhoto) ? (
                  <img 
                    src={post.createdBy?.photoURL || post.userPhoto} 
                    alt={post.createdBy?.name || post.userName} 
                    className="w-full h-full object-cover" 
                  />
                ) : (
                  <FaUser className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                )}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base truncate">
                {post.createdBy?.name || post.userName}
              </h3>
              <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                <FaCalendarAlt className="w-3 h-3 flex-shrink-0" />
                <span className="truncate">{formatDate(post.createdAt)}</span>
              </div>
            </div>
          </div>

          {/* Post Menu */}
          {isOwner && (
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <FaEllipsisV className="w-4 h-4 text-gray-500" />
              </button>
              
              {showMenu && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute right-0 top-8 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10"
                >
                  <button
                    onClick={handleDeletePost}
                    className="w-full flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  >
                    <FaTrash className="w-4 h-4" />
                    Delete Post
                  </button>
                </motion.div>
              )}
            </div>
          )}
        </div>

        {/* Category Badge */}
        <div className="mb-4">
          <span className={`inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${getCategoryColor(post.category)}`}>
            {post.category}
          </span>
        </div>

        {/* Post Content */}
        <div className="space-y-3 sm:space-y-4">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white leading-tight">
            {post.title}
          </h2>
          
          <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed line-clamp-4">
            {post.content}
          </p>

          {/* Event Info */}
          {post.eventName && (
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 sm:p-4 border border-blue-200 dark:border-blue-800">
              <div className="flex items-center gap-2 text-blue-800 dark:text-blue-200 font-medium mb-2 text-sm sm:text-base">
                <FaMapMarkerAlt className="w-3 h-3 sm:w-4 sm:h-4" />
                Related Event
              </div>
              <h4 className="font-semibold text-blue-900 dark:text-blue-100 text-sm sm:text-base">
                {post.eventName}
              </h4>
              {post.eventDate && (
                <p className="text-xs sm:text-sm text-blue-700 dark:text-blue-300">
                  {formatDate(post.eventDate)}
                </p>
              )}
            </div>
          )}

          {/* Images */}
          {post.images && post.images.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {post.images.slice(0, 4).map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Post image ${index + 1}`}
                  className="w-full h-32 sm:h-40 object-cover rounded-lg"
                />
              ))}
              {post.images.length > 4 && (
                <div className="relative">
                  <img
                    src={post.images[4]}
                    alt={`Post image 5`}
                    className="w-full h-32 sm:h-40 object-cover rounded-lg opacity-60"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg">
                    <span className="text-white font-bold text-lg">+{post.images.length - 4}</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Post Actions */}
      <div className="px-4 sm:px-6 py-3 sm:py-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-4 lg:gap-6">
            <button
              onClick={handleLike}
              className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 rounded-lg transition-all duration-200 text-sm sm:text-base ${
                isLiked 
                  ? 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400' 
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400'
              }`}
            >
              {isLiked ? (
                <FaHeart className="w-3 h-3 sm:w-4 sm:h-4" />
              ) : (
                <FiHeart className="w-3 h-3 sm:w-4 sm:h-4" />
              )}
              <span className="font-medium">{post.likesCount || 0}</span>
            </button>

            <button
              onClick={() => setShowComments(!showComments)}
              className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 transition-all duration-200 text-sm sm:text-base"
            >
              <FiMessageCircle className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="font-medium">{post.commentsCount || 0}</span>
            </button>

            <button
              onClick={handleShare}
              className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 transition-all duration-200 text-sm sm:text-base"
            >
              <FiShare2 className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="font-medium">{post.sharesCount || 0}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Comments Section */}
      {showComments && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="border-t border-gray-200 dark:border-gray-700"
        >
          <div className="p-6">
            {/* Add Comment Form */}
            {user && (
              <form onSubmit={handleAddComment} className="mb-4">
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent p-0.5 flex-shrink-0">
                    <div className="bg-white dark:bg-gray-800 rounded-full w-full h-full flex items-center justify-center">
                      {user.photoURL ? (
                        <img 
                          src={user.photoURL} 
                          alt={user.displayName} 
                          className="w-full h-full object-cover rounded-full" 
                        />
                      ) : (
                        <FaUser className="w-4 h-4 text-primary" />
                      )}
                    </div>
                  </div>
                  <div className="flex-1">
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Write a comment..."
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none"
                      rows="2"
                    />
                    <div className="flex justify-end mt-2">
                      <button
                        type="submit"
                        disabled={!newComment.trim() || addComment.isPending}
                        className="btn btn-primary btn-sm"
                      >
                        {addComment.isPending ? 'Posting...' : 'Post Comment'}
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            )}

            {/* Comments List */}
            <div className="space-y-4">
              {commentsLoading ? (
                <div className="text-center py-4">
                  <div className="loading loading-spinner loading-sm"></div>
                </div>
              ) : comments.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                  No comments yet. Be the first to comment!
                </p>
              ) : (
                comments.map((comment) => (
                  <div key={comment._id} className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-secondary to-accent p-0.5 flex-shrink-0">
                      <div className="bg-white dark:bg-gray-800 rounded-full w-full h-full flex items-center justify-center">
                        {(comment.author?.photoURL || comment.userPhoto) ? (
                          <img 
                            src={comment.author?.photoURL || comment.userPhoto} 
                            alt={comment.author?.name || comment.userName} 
                            className="w-full h-full object-cover rounded-full" 
                          />
                        ) : (
                          <FaUser className="w-4 h-4 text-secondary" />
                        )}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-gray-900 dark:text-white text-sm">
                            {comment.author?.name || comment.userName}
                          </span>
                          {user?.email === (comment.authorEmail || comment.userEmail) && (
                            <button
                              onClick={() => handleDeleteComment(comment._id)}
                              className="text-red-500 hover:text-red-700 text-xs"
                            >
                              Delete
                            </button>
                          )}
                        </div>
                        <p className="text-gray-700 dark:text-gray-300 text-sm">
                          {comment.content || comment.comment}
                        </p>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {formatDate(comment.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ImpactPost;
