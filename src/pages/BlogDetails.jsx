import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  FaArrowLeft, 
  FaCalendarAlt, 
  FaUser, 
  FaEye, 
  FaHeart, 
  FaRegHeart,
  FaShareAlt,
  FaTag,
  FaBookmark,
  FaBookmark as FaBookmarkOutline,
  FaComments,
  FaClock,
  FaGlobe,
  FaHandshake,
  FaLightbulb,
  FaUsers,
  FaStar,
  FaFacebookF,
  FaTwitter,
  FaLinkedin,
  FaWhatsapp
} from 'react-icons/fa';
import useAxiosSecure from '../hooks/useAxiosSecure';
import LoadingSpinner from '../components/LoadingSpinner';
import RatingSystem from '../components/RatingSystem';

const BlogDetails = () => {
  const { id } = useParams();
  const axiosSecure = useAxiosSecure();
  
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);

  // Fetch blog post by ID
  const fetchBlogPost = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Try the main blog posts endpoint first
      try {
        const response = await axiosSecure.get(`/blog-posts/${id}`);
        
        if (response.data.success && response.data.blogPost) {
          const post = response.data.blogPost;
          // Fetch rating data for this post
          try {
            const ratingResponse = await axiosSecure.get(`/ratings/post/${post._id}`);
            if (ratingResponse.data.success && ratingResponse.data.ratings.length > 0) {
              const averageRating = ratingResponse.data.ratings.reduce((sum, r) => sum + r.rating, 0) / ratingResponse.data.ratings.length;
              setArticle({ ...post, averageRating, ratingCount: ratingResponse.data.ratings.length });
            } else {
              setArticle({ ...post, averageRating: 0, ratingCount: 0 });
            }
          } catch {
            setArticle({ ...post, averageRating: 0, ratingCount: 0 });
          }
          return;
        } else if (response.data.blogPost) {
          const post = response.data.blogPost;
          // Fetch rating data for this post
          try {
            const ratingResponse = await axiosSecure.get(`/ratings/post/${post._id}`);
            if (ratingResponse.data.success && ratingResponse.data.ratings.length > 0) {
              const averageRating = ratingResponse.data.ratings.reduce((sum, r) => sum + r.rating, 0) / ratingResponse.data.ratings.length;
              setArticle({ ...post, averageRating, ratingCount: ratingResponse.data.ratings.length });
            } else {
              setArticle({ ...post, averageRating: 0, ratingCount: 0 });
            }
          } catch {
            setArticle({ ...post, averageRating: 0, ratingCount: 0 });
          }
          return;
        } else if (response.data) {
          // If the response is the blog post directly
          const post = response.data;
          // Fetch rating data for this post
          try {
            const ratingResponse = await axiosSecure.get(`/ratings/post/${post._id}`);
            if (ratingResponse.data.success && ratingResponse.data.ratings.length > 0) {
              const averageRating = ratingResponse.data.ratings.reduce((sum, r) => sum + r.rating, 0) / ratingResponse.data.ratings.length;
              setArticle({ ...post, averageRating, ratingCount: ratingResponse.data.ratings.length });
            } else {
              setArticle({ ...post, averageRating: 0, ratingCount: 0 });
            }
          } catch {
            setArticle({ ...post, averageRating: 0, ratingCount: 0 });
          }
          return;
        }
      } catch {
        // Silently handle error
      }
      
      // If main endpoint failed, try to find the post in user's blog posts
      try {
        const userResponse = await axiosSecure.get('/my-blog-posts');
        
        if (userResponse.data.blogPosts && userResponse.data.blogPosts.length > 0) {
          const foundPost = userResponse.data.blogPosts.find(post => post._id === id);
          
          if (foundPost) {
            // Fetch rating data for this post
            try {
              const ratingResponse = await axiosSecure.get(`/ratings/post/${foundPost._id}`);
              if (ratingResponse.data.success && ratingResponse.data.ratings.length > 0) {
                const averageRating = ratingResponse.data.ratings.reduce((sum, r) => sum + r.rating, 0) / ratingResponse.data.ratings.length;
                setArticle({ ...foundPost, averageRating, ratingCount: ratingResponse.data.ratings.length });
              } else {
                setArticle({ ...foundPost, averageRating: 0, ratingCount: 0 });
              }
            } catch {
              setArticle({ ...foundPost, averageRating: 0, ratingCount: 0 });
            }
            return;
          }
        }
      } catch {
        // Silently handle error
      }
      
      // If we reach here, the post was not found
      setError('Blog post not found');
      
    } catch (error) {
      if (error.response?.status === 404) {
        setError('Blog post not found');
      } else if (error.code === 'ERR_NETWORK') {
        setError('Cannot connect to backend server. Please check if your backend is running.');
      } else {
        setError('Failed to load blog post. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };



  useEffect(() => {
    if (id) {
      fetchBlogPost();
    } else {
      setError('No blog post ID provided');
      setLoading(false);
    }
  }, [id]);

  const handleLike = () => {
    setIsLiked(!isLiked);
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
  };

  const handleShare = () => {
    setShareOpen(!shareOpen);
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
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex justify-center items-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 max-w-md mx-4 text-center">
          <div className="text-6xl text-red-500 mb-4">😕</div>
          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
            Article Not Found
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            {error || 'The article you\'re looking for doesn\'t exist or has been removed.'}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/blog" className="btn btn-primary">
              Back to Blog
            </Link>
            <button 
              onClick={() => fetchBlogPost()} 
              className="btn btn-outline"
            >
              Try Again
            </button>

          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link 
            to="/blog" 
            className="inline-flex items-center text-primary hover:text-primary-dark dark:text-primary dark:hover:text-primary-light transition-colors group"
          >
            <FaArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Back to Blog</span>
          </Link>
        </div>

        {/* Main Article */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
          {/* Article Header */}
          <div className="relative">
            {article.image && (
              <img 
                src={article.image}
                alt={article.title}
                className="w-full h-64 md:h-96 object-cover"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
            
            {/* Category Badge */}
            <div className="absolute top-6 left-6">
              <span className="badge badge-primary badge-lg gap-2">
                <FaTag />
                {article.tags?.[0] || 'General'}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="absolute top-6 right-6 flex items-center gap-3">
              <button 
                onClick={handleLike}
                className={`btn btn-circle btn-sm ${isLiked ? 'btn-primary' : 'btn-outline btn-primary text-white border-white hover:bg-white hover:text-primary'}`}
              >
                {isLiked ? <FaHeart className="text-white" /> : <FaRegHeart />}
              </button>
              <button 
                onClick={handleSave}
                className={`btn btn-circle btn-sm ${isSaved ? 'btn-secondary' : 'btn-outline btn-primary text-white border-white hover:bg-white hover:text-primary'}`}
              >
                {isSaved ? <FaBookmark className="text-white" /> : <FaBookmarkOutline />}
              </button>
              <div className="relative">
                <button 
                  onClick={handleShare}
                  className="btn btn-circle btn-sm btn-outline btn-primary text-white border-white hover:bg-white hover:text-primary"
                >
                  <FaShareAlt />
                </button>
                {shareOpen && (
                  <div className="absolute right-0 bottom-full mb-3 bg-white dark:bg-gray-700 rounded-xl shadow-2xl p-4 w-56 z-10">
                    <p className="text-sm font-medium mb-3 text-gray-800 dark:text-white">Share this article:</p>
                    <div className="flex justify-center gap-3">
                      <button className="btn btn-circle btn-sm bg-blue-600 hover:bg-blue-700 text-white">
                        <FaFacebookF />
                      </button>
                      <button className="btn btn-circle btn-sm bg-blue-400 hover:bg-blue-500 text-white">
                        <FaTwitter />
                      </button>
                      <button className="btn btn-circle btn-sm bg-blue-700 hover:bg-blue-800 text-white">
                        <FaLinkedin />
                      </button>
                      <button className="btn btn-circle btn-sm bg-green-500 hover:bg-green-600 text-white">
                        <FaWhatsapp />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Header Content */}
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
                {article.title}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-white/90">
                <div className="flex items-center gap-2">
                  <FaUser className="text-primary-light" />
                  <span className="font-medium">{article.author}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaCalendarAlt className="text-primary-light" />
                  <span className="font-medium">{formatDate(article.createdAt)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaClock className="text-primary-light" />
                  <span className="font-medium">{Math.ceil((article.content?.length || 0) / 200)} min read</span>
                </div>
              </div>
            </div>
          </div>

          {/* Article Content */}
          <div className="p-6 md:p-8">
            {/* Article Stats */}
            <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-6 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-2">
                  <FaEye />
                  <span>{article.views || 0} views</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaComments />
                  <span>{article.comments || 0} comments</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaHeart />
                  <span>{article.likes || 0} likes</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaStar className="text-yellow-400" />
                  <span>{article.averageRating ? article.averageRating.toFixed(1) : '0.0'} rating</span>
                </div>
              </div>
            </div>

            {/* Article Body */}
            <div className="prose prose-lg max-w-none dark:prose-invert">
              <div className="whitespace-pre-wrap text-gray-700 dark:text-gray-300 leading-relaxed">
                {article.content}
              </div>
            </div>

            {/* Author Section */}
            <div className="mt-12 bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                <FaUser className="text-primary" />
                About the Author
              </h3>
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-xl">
                  {article.author?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                    {article.author}
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    A passionate volunteer and community advocate who believes in making a difference through service and engagement.
                  </p>
                </div>
              </div>
            </div>

            {/* Tags */}
            {article.tags && article.tags.length > 0 && (
              <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">Tags:</h4>
                <div className="flex flex-wrap gap-2">
                  {article.tags.map((tag, index) => (
                    <span key={index} className="badge badge-outline badge-primary">{tag}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Rating System */}
        <div className="mt-8">
          <RatingSystem 
            postId={article._id} 
            onRatingUpdate={() => {
              // Refresh the article data to show updated ratings
              fetchBlogPost();
            }}
          />
        </div>

        {/* Related Articles Section - You can implement this later */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-8 flex items-center gap-2">
            <FaStar className="text-primary" />
            More Articles
          </h2>
          <div className="text-center py-12">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-12 max-w-md mx-auto">
              <div className="text-6xl mb-4">📚</div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                Explore More Content
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Discover more inspiring stories and helpful tips in our blog
              </p>
              <Link to="/blog" className="btn btn-primary">
                Browse All Articles
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogDetails;