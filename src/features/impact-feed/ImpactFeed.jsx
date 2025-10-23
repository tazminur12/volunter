import { useState } from 'react';
import { useImpactFeedQueries } from './useImpactFeedQueries';
import ImpactPost from './ImpactPost';
import CreateImpactPost from './CreateImpactPost';
import { FaHeart, FaComment, FaShare, FaFilter, FaSort } from 'react-icons/fa';
import { FiRefreshCw } from 'react-icons/fi';

const ImpactFeed = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filters, setFilters] = useState({
    sortBy: 'newest', // newest, oldest, mostLiked, mostCommented
    category: 'all', // all, environment, education, health, community
  });

  const { 
    useImpactFeedPosts, 
    useToggleLike, 
    useSharePost 
  } = useImpactFeedQueries();

  const { data: postsData, isLoading, error, refetch } = useImpactFeedPosts(filters);
  const posts = postsData?.posts || [];
  const toggleLike = useToggleLike();
  const sharePost = useSharePost();

  const handleLike = (postId, isLiked) => {
    toggleLike.mutate({ postId, isLiked });
  };

  const handleShare = (postId) => {
    sharePost.mutate(postId);
  };

  const handleRefresh = () => {
    refetch();
  };


  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="flex flex-col items-center gap-4">
              <div className="loading loading-spinner loading-lg text-primary"></div>
              <p className="text-gray-600 dark:text-gray-400">Loading impact stories...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="text-6xl mb-4">😔</div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                Unable to load impact stories
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {error.message || 'Something went wrong'}
              </p>
              <button 
                onClick={handleRefresh}
                className="btn btn-primary gap-2"
              >
                <FiRefreshCw />
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-primary to-accent rounded-full mb-4 sm:mb-6">
            <span className="text-2xl sm:text-3xl">🌟</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent mb-4 sm:mb-6 leading-tight">
            Impact Feed
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed px-4">
            Share your volunteer experiences and inspire others in our community. 
            Every story makes a difference! 🌟
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 mb-8 sm:mb-12">
          {/* Create Post Button */}
          <div className="flex-shrink-0">
            <button
              onClick={() => setShowCreateModal(true)}
              className="w-full sm:w-auto btn btn-primary btn-lg gap-3 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white border-0"
            >
              <FaHeart className="text-lg" />
              <span className="hidden sm:inline">Share Your Impact Story</span>
              <span className="sm:hidden">Share Story</span>
            </button>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3 flex-1">
            <div className="flex flex-wrap gap-2 sm:gap-3">
              <select
                value={filters.sortBy}
                onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value }))}
                className="select select-bordered select-sm sm:select-md flex-1 sm:flex-none min-w-[140px]"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="mostLiked">Most Liked</option>
                <option value="mostCommented">Most Commented</option>
              </select>

              <select
                value={filters.category}
                onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                className="select select-bordered select-sm sm:select-md flex-1 sm:flex-none min-w-[140px]"
              >
                <option value="all">All Categories</option>
                <option value="environment">🌱 Environment</option>
                <option value="education">📚 Education</option>
                <option value="health">🏥 Health</option>
                <option value="community">🤝 Community</option>
              </select>
            </div>

            <button
              onClick={handleRefresh}
              className="btn btn-ghost btn-sm sm:btn-md gap-2 self-start sm:self-center"
              title="Refresh Feed"
            >
              <FiRefreshCw className="w-4 h-4" />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>
        </div>

        {/* Posts Grid */}
        {posts.length === 0 ? (
          <div className="text-center py-12 sm:py-16 lg:py-20">
            <div className="text-6xl sm:text-8xl mb-4 sm:mb-6">📝</div>
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-gray-800 dark:text-white mb-3 sm:mb-4">
              No impact stories yet
            </h3>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-6 sm:mb-8 max-w-md mx-auto px-4">
              Be the first to share your volunteer experience and inspire others in the community!
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="btn btn-primary btn-lg gap-2 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <FaHeart />
              Share Your First Story
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {posts.map((post) => (
              <div key={post._id}>
                <ImpactPost 
                  post={post}
                  onLike={handleLike}
                  onShare={handleShare}
                />
              </div>
            ))}
          </div>
        )}

        {/* Create Post Modal */}
        {showCreateModal && (
          <CreateImpactPost 
            onClose={() => setShowCreateModal(false)}
            onSuccess={() => {
              setShowCreateModal(false);
              handleRefresh();
            }}
          />
        )}
      </div>
    </div>
  );
};

export default ImpactFeed;
