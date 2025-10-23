import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaSearch, 
  FaCalendarAlt, 
  FaUser, 
  FaEye, 
  FaHeart, 
  FaRegHeart,
  FaShareAlt,
  FaTag,
  FaArrowRight,
  FaBookmark,
  FaBookmark as FaBookmarkOutline,
  FaFilter,
  FaSort,
  FaGlobe,
  FaHandshake,
  FaLightbulb,
  FaUsers,
  FaStar,
  FaClock,
  FaComments
} from 'react-icons/fa';
import useAxiosSecure from '../../shared/hooks/useAxiosSecure';
import LoadingSpinner from '../../shared/components/LoadingSpinner';
import RatingSystem from '../ratings/RatingSystem';

const Blog = () => {
  const axiosSecure = useAxiosSecure();
  
  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('latest');
  const [likedArticles, setLikedArticles] = useState(new Set());
  const [savedArticles, setSavedArticles] = useState(new Set());
  const [error, setError] = useState('');

  // Fetch blog posts from backend only
  const fetchBlogPosts = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Strategy: Try to get posts from both endpoints and merge them
      let allPosts = [];
      let hasPosts = false;
      
      // Try the main blog posts endpoint first
      try {
        const response = await axiosSecure.get('/blog-posts');
        
        if (response.data.success && response.data.blogPosts) {
          allPosts = [...allPosts, ...response.data.blogPosts];
          hasPosts = true;
        } else if (response.data.blogPosts) {
          allPosts = [...allPosts, ...response.data.blogPosts];
          hasPosts = true;
        }
              } catch {
          // Silently handle error
        }
      
      // Try the user's blog posts endpoint
      try {
        const userResponse = await axiosSecure.get('/my-blog-posts');
        
        if (userResponse.data.blogPosts && userResponse.data.blogPosts.length > 0) {
          // Merge posts, avoiding duplicates by ID
          const existingIds = new Set(allPosts.map(post => post._id));
          const newPosts = userResponse.data.blogPosts.filter(post => !existingIds.has(post._id));
          
          if (newPosts.length > 0) {
            allPosts = [...allPosts, ...newPosts];
          }
          
          hasPosts = true;
        }
              } catch {
          // Silently handle error
        }
      
      if (hasPosts && allPosts.length > 0) {
        // Fetch ratings for each post to calculate average ratings
        const postsWithRatings = await Promise.all(
          allPosts.map(async (post) => {
            try {
              const ratingResponse = await axiosSecure.get(`/ratings/post/${post._id}`);
              if (ratingResponse.data.success && ratingResponse.data.ratings.length > 0) {
                const averageRating = ratingResponse.data.ratings.reduce((sum, r) => sum + r.rating, 0) / ratingResponse.data.ratings.length;
                return { ...post, averageRating, ratingCount: ratingResponse.data.ratings.length };
              }
              return { ...post, averageRating: 0, ratingCount: 0 };
            } catch {
              return { ...post, averageRating: 0, ratingCount: 0 };
            }
          })
        );
        
        setArticles(postsWithRatings);
        setFilteredArticles(postsWithRatings);
      } else {
        setError('No blog posts found');
        setArticles([]);
        setFilteredArticles([]);
      }
      
    } catch (error) {
      setError(`Failed to load blog posts: ${error.message}`);
      setArticles([]);
      setFilteredArticles([]);
    } finally {
      setLoading(false);
    }
  };

  // Get unique categories from tags
  const getCategories = () => {
    const allTags = [...new Set(articles.flatMap(article => article.tags || []))];
    return [
      { name: 'all', label: 'All Articles', icon: FaGlobe },
      ...allTags.map(tag => ({
        name: tag,
        label: tag,
        icon: FaTag
      }))
    ];
  };

  const categories = getCategories();

  useEffect(() => {
    fetchBlogPosts();
  }, []);

  useEffect(() => {
    filterArticles();
  }, [searchTerm, selectedCategory, sortBy, articles]);

  const filterArticles = () => {
    let filtered = articles.filter(article => {
      const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (article.excerpt && article.excerpt.toLowerCase().includes(searchTerm.toLowerCase())) ||
                           (article.content && article.content.toLowerCase().includes(searchTerm.toLowerCase())) ||
                           article.author.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || article.tags?.includes(selectedCategory);
      return matchesSearch && matchesCategory;
    });

    // Sort articles
    switch (sortBy) {
      case 'latest':
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'popular':
        filtered.sort((a, b) => (b.views || 0) - (a.views || 0));
        break;
      case 'most-liked':
        filtered.sort((a, b) => (b.likes || 0) - (a.likes || 0));
        break;
      default:
        break;
    }

    setFilteredArticles(filtered);
  };

  const handleLike = (articleId) => {
    setLikedArticles(prev => {
      const newSet = new Set(prev);
      if (newSet.has(articleId)) {
        newSet.delete(articleId);
      } else {
        newSet.add(articleId);
      }
      return newSet;
    });
  };

  const handleSave = (articleId) => {
    setSavedArticles(prev => {
      const newSet = new Set(prev);
      if (newSet.has(articleId)) {
        newSet.add(articleId);
      } else {
        newSet.delete(articleId);
      }
      return newSet;
    });
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown date';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
            {error}
          </h2>
          <div className="space-y-3">
            <button
              onClick={fetchBlogPosts}
              className="btn btn-primary"
            >
              Try Again
            </button>

          </div>
        </div>
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">📝</div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
            No Blog Posts Available
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            There are no blog posts to display at the moment.
          </p>
          <button
            onClick={fetchBlogPosts}
            className="btn btn-primary"
          >
            Refresh
          </button>
        </div>
      </div>
    );
  }

  // Show first 2 articles as featured, or articles marked as featured
  const featuredArticles = articles.filter(article => article.featured).slice(0, 2);
  const regularArticles = filteredArticles.filter(article => !article.featured);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Hero Section */}
      <div
        className="bg-gradient-to-r from-primary to-secondary text-white py-16"
      >
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Volunteer Hub Blog
          </h1>
          <p className="text-xl opacity-90 max-w-3xl mx-auto mb-8">
            Discover inspiring stories, expert insights, and practical tips for making a difference in your community.
          </p>
          <div className="flex items-center justify-center gap-6 text-sm opacity-80">
            <div className="flex items-center gap-2">
              <FaGlobe />
              <span>{articles.length} Articles</span>
            </div>
            <div className="flex items-center gap-2">
              <FaUsers />
              <span>Expert Writers</span>
            </div>
            <div className="flex items-center gap-2">
              <FaStar />
              <span>Quality Content</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Search and Filter Section */}
        <div
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-8"
        >
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Search Bar */}
            <div className="relative flex-1">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search articles..."
                className="input input-bordered w-full pl-10 focus:input-primary"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative">
                <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="select select-bordered pl-10 focus:select-primary"
                >
                  {categories.map(category => (
                    <option key={category.name} value={category.name}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="relative">
                <FaSort className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="select select-bordered pl-10 focus:select-primary"
                >
                  <option value="latest">Latest</option>
                  <option value="popular">Most Popular</option>
                  <option value="most-liked">Most Liked</option>
                </select>
              </div>
              
              {/* Refresh Button */}
              <button
                onClick={fetchBlogPosts}
                className="btn btn-primary btn-outline"
                title="Refresh blog posts"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Featured Articles */}
        {featuredArticles.length > 0 && (
          <div
            className="mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
              <FaStar className="text-primary" />
              Featured Articles
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {featuredArticles.map((article) => (
                <div
                  key={article._id}
                  className="group"
                >
                  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:-translate-y-2">
                    {/* Image */}
                    <div className="relative overflow-hidden">
                      <img
                        src={article.image || 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80'}
                        alt={article.title}
                        className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute top-4 left-4">
                        <span className="badge badge-primary badge-lg gap-2">
                          <FaStar />
                          Featured
                        </span>
                      </div>
                      <div className="absolute top-4 right-4">
                        <span className="badge badge-secondary badge-sm">
                          {article.tags?.[0] || 'General'}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold">
                          {article.author?.charAt(0)?.toUpperCase() || 'U'}
                        </div>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {article.author}
                        </span>
                        <span className="text-gray-400">•</span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {formatDate(article.createdAt)}
                        </span>
                      </div>

                      <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3 group-hover:text-primary transition-colors">
                        {article.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                        {article.excerpt || article.content?.substring(0, 150) + '...'}
                      </p>

                      {/* Stats */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                          <div className="flex items-center gap-1">
                            <FaEye />
                            <span>{article.views || 0}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <FaHeart />
                            <span>{article.likes || 0}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <FaClock />
                            <span>{Math.ceil((article.content?.length || 0) / 200)} min read</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <FaStar className="text-yellow-400" />
                            <span>{article.averageRating ? article.averageRating.toFixed(1) : '0.0'}</span>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleLike(article._id)}
                            className={`btn btn-circle btn-sm ${likedArticles.has(article._id) ? 'btn-primary' : 'btn-outline'}`}
                          >
                            <FaHeart className={likedArticles.has(article._id) ? 'text-white' : ''} />
                          </button>
                          <button
                            onClick={() => handleSave(article._id)}
                            className={`btn btn-circle btn-sm ${savedArticles.has(article._id) ? 'btn-secondary' : 'btn-outline'}`}
                          >
                            <FaBookmark className={savedArticles.has(article._id) ? 'text-white' : ''} />
                          </button>
                          <button className="btn btn-circle btn-sm btn-outline">
                            <FaShareAlt />
                          </button>
                        </div>
                        <Link
                          to={`/blog/${article._id}`}
                          className="btn btn-primary btn-sm gap-2"
                        >
                          Read More
                          <FaArrowRight />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Regular Articles */}
        <div
        >
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
            <FaGlobe className="text-primary" />
            Latest Articles
          </h2>
          
          {regularArticles.length === 0 ? (
            <div className="text-center py-16">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-12 max-w-md mx-auto">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                  No articles found
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Try adjusting your search criteria or browse all categories
                </p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('all');
                  }}
                  className="btn btn-primary"
                >
                  View All Articles
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {regularArticles.map((article) => (
                <div
                  key={article._id}
                  className="group"
                >
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden transform hover:-translate-y-1">
                    {/* Image */}
                    <div className="relative overflow-hidden">
                      <img
                        src={article.image || 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80'}
                        alt={article.title}
                        className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute top-3 left-3">
                        <span className="badge badge-primary badge-sm">
                          {article.tags?.[0] || 'General'}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-xs font-bold">
                          {article.author?.charAt(0)?.toUpperCase() || 'U'}
                        </div>
                        <span className="text-xs text-gray-600 dark:text-gray-400">
                          {article.author}
                        </span>
                        <span className="text-gray-400">•</span>
                        <span className="text-xs text-gray-600 dark:text-gray-400">
                          {formatDate(article.createdAt)}
                        </span>
                      </div>

                      <h3 className="font-bold text-gray-800 dark:text-white mb-2 group-hover:text-primary transition-colors line-clamp-2">
                        {article.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
                        {article.excerpt || article.content?.substring(0, 100) + '...'}
                      </p>

                      {/* Stats */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                          <div className="flex items-center gap-1">
                            <FaEye />
                            <span>{article.views || 0}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <FaHeart />
                            <span>{article.likes || 0}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <FaClock />
                            <span>{Math.ceil((article.content?.length || 0) / 200)} min read</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <FaStar className="text-yellow-400" />
                            <span>{article.averageRating ? article.averageRating.toFixed(1) : '0.0'}</span>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleLike(article._id)}
                            className={`btn btn-circle btn-xs ${likedArticles.has(article._id) ? 'btn-primary' : 'btn-outline'}`}
                          >
                            <FaHeart className={likedArticles.has(article._id) ? 'text-white' : ''} />
                          </button>
                          <button
                            onClick={() => handleSave(article._id)}
                            className={`btn btn-circle btn-xs ${savedArticles.has(article._id) ? 'btn-secondary' : 'btn-outline'}`}
                          >
                            <FaBookmark className={savedArticles.has(article._id) ? 'text-white' : ''} />
                          </button>
                        </div>
                        <Link
                          to={`/blog/${article._id}`}
                          className="btn btn-primary btn-xs gap-1"
                        >
                          Read
                          <FaArrowRight />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Blog; 