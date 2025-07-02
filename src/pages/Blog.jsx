import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
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

const Blog = () => {
  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('latest');
  const [likedArticles, setLikedArticles] = useState(new Set());
  const [savedArticles, setSavedArticles] = useState(new Set());

  // Sample blog data - in real app, this would come from API
  const sampleArticles = [
    {
      id: 1,
      title: "The Impact of Community Volunteering on Mental Health",
      excerpt: "Discover how volunteering can improve your mental well-being and create lasting positive changes in your life and community.",
      content: "Volunteering has been shown to have numerous mental health benefits, including reduced stress, increased happiness, and a sense of purpose. This article explores the science behind these benefits and provides practical tips for getting started.",
      author: "Dr. Sarah Johnson",
      authorAvatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      category: "Mental Health",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      publishDate: "2024-01-15",
      readTime: "5 min read",
      views: 1247,
      likes: 89,
      comments: 23,
      featured: true
    },
    {
      id: 2,
      title: "10 Essential Skills Every Volunteer Should Develop",
      excerpt: "From communication to problem-solving, learn the key skills that will make you an effective and impactful volunteer.",
      content: "Being a successful volunteer requires more than just good intentions. This comprehensive guide covers the essential skills that will help you make a real difference in your community.",
      author: "Michael Chen",
      authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      category: "Skills Development",
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      publishDate: "2024-01-12",
      readTime: "8 min read",
      views: 2156,
      likes: 156,
      comments: 34,
      featured: true
    },
    {
      id: 3,
      title: "Environmental Volunteering: Making a Difference for Our Planet",
      excerpt: "Explore various ways to contribute to environmental conservation through volunteering and understand the global impact of local actions.",
      content: "Environmental volunteering offers unique opportunities to protect our planet while connecting with like-minded individuals. Learn about different types of environmental volunteer work and how to get involved.",
      author: "Emma Rodriguez",
      authorAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      category: "Environment",
      image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      publishDate: "2024-01-10",
      readTime: "6 min read",
      views: 1893,
      likes: 134,
      comments: 28,
      featured: false
    },
    {
      id: 4,
      title: "Youth Volunteering: Empowering the Next Generation",
      excerpt: "Discover how young people are making a difference through volunteering and the long-term benefits of early community engagement.",
      content: "Youth volunteering programs are creating the next generation of community leaders. This article highlights successful youth volunteer initiatives and their impact on personal development.",
      author: "David Thompson",
      authorAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      category: "Youth Programs",
      image: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      publishDate: "2024-01-08",
      readTime: "7 min read",
      views: 1678,
      likes: 98,
      comments: 19,
      featured: false
    },
    {
      id: 5,
      title: "Corporate Volunteering: Building Stronger Teams Through Service",
      excerpt: "Learn how companies are implementing volunteer programs to boost employee morale, team building, and corporate social responsibility.",
      content: "Corporate volunteering programs are becoming increasingly popular as companies recognize the benefits of community engagement for employee development and company culture.",
      author: "Lisa Wang",
      authorAvatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      category: "Corporate",
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      publishDate: "2024-01-05",
      readTime: "9 min read",
      views: 2341,
      likes: 178,
      comments: 42,
      featured: false
    },
    {
      id: 6,
      title: "Digital Volunteering: Making an Impact from Home",
      excerpt: "Explore the world of virtual volunteering and how technology is enabling people to contribute to causes they care about remotely.",
      content: "Digital volunteering has opened up new possibilities for people to make a difference without leaving their homes. From online tutoring to virtual fundraising, discover various ways to volunteer digitally.",
      author: "Alex Kim",
      authorAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      category: "Technology",
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      publishDate: "2024-01-03",
      readTime: "4 min read",
      views: 1456,
      likes: 112,
      comments: 31,
      featured: false
    }
  ];

  const categories = [
    { name: 'all', label: 'All Articles', icon: FaGlobe },
    { name: 'Mental Health', label: 'Mental Health', icon: FaHeart },
    { name: 'Skills Development', label: 'Skills Development', icon: FaLightbulb },
    { name: 'Environment', label: 'Environment', icon: FaStar },
    { name: 'Youth Programs', label: 'Youth Programs', icon: FaUsers },
    { name: 'Corporate', label: 'Corporate', icon: FaHandshake },
    { name: 'Technology', label: 'Technology', icon: FaClock }
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setArticles(sampleArticles);
      setFilteredArticles(sampleArticles);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    filterArticles();
  }, [searchTerm, selectedCategory, sortBy, articles]);

  const filterArticles = () => {
    let filtered = articles.filter(article => {
      const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           article.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           article.author.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    // Sort articles
    switch (sortBy) {
      case 'latest':
        filtered.sort((a, b) => new Date(b.publishDate) - new Date(a.publishDate));
        break;
      case 'popular':
        filtered.sort((a, b) => b.views - a.views);
        break;
      case 'most-liked':
        filtered.sort((a, b) => b.likes - a.likes);
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
        newSet.delete(articleId);
      } else {
        newSet.add(articleId);
      }
      return newSet;
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex justify-center items-center">
        <div className="text-center">
          <div className="loading loading-spinner loading-lg text-primary mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading articles...</p>
        </div>
      </div>
    );
  }

  const featuredArticles = articles.filter(article => article.featured);
  const regularArticles = filteredArticles.filter(article => !article.featured);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
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
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Search and Filter Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
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
            </div>
          </div>
        </motion.div>

        {/* Featured Articles */}
        {featuredArticles.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
              <FaStar className="text-primary" />
              Featured Articles
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {featuredArticles.map((article, index) => (
                <motion.div
                  key={article.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                  className="group"
                >
                  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:-translate-y-2">
                    {/* Image */}
                    <div className="relative overflow-hidden">
                      <img
                        src={article.image}
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
                          {article.category}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <img
                          src={article.authorAvatar}
                          alt={article.author}
                          className="w-8 h-8 rounded-full"
                        />
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {article.author}
                        </span>
                        <span className="text-gray-400">•</span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {formatDate(article.publishDate)}
                        </span>
                      </div>

                      <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3 group-hover:text-primary transition-colors">
                        {article.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                        {article.excerpt}
                      </p>

                      {/* Stats */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                          <div className="flex items-center gap-1">
                            <FaEye />
                            <span>{article.views}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <FaComments />
                            <span>{article.comments}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <FaClock />
                            <span>{article.readTime}</span>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleLike(article.id)}
                            className={`btn btn-circle btn-sm ${likedArticles.has(article.id) ? 'btn-primary' : 'btn-outline'}`}
                          >
                            <FaHeart className={likedArticles.has(article.id) ? 'text-white' : ''} />
                          </button>
                          <button
                            onClick={() => handleSave(article.id)}
                            className={`btn btn-circle btn-sm ${savedArticles.has(article.id) ? 'btn-secondary' : 'btn-outline'}`}
                          >
                            <FaBookmark className={savedArticles.has(article.id) ? 'text-white' : ''} />
                          </button>
                          <button className="btn btn-circle btn-sm btn-outline">
                            <FaShareAlt />
                          </button>
                        </div>
                        <Link
                          to={`/blog/${article.id}`}
                          className="btn btn-primary btn-sm gap-2"
                        >
                          Read More
                          <FaArrowRight />
                        </Link>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Regular Articles */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
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
              {regularArticles.map((article, index) => (
                <motion.div
                  key={article.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
                  className="group"
                >
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden transform hover:-translate-y-1">
                    {/* Image */}
                    <div className="relative overflow-hidden">
                      <img
                        src={article.image}
                        alt={article.title}
                        className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute top-3 left-3">
                        <span className="badge badge-primary badge-sm">
                          {article.category}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      <div className="flex items-center gap-2 mb-3">
                        <img
                          src={article.authorAvatar}
                          alt={article.author}
                          className="w-6 h-6 rounded-full"
                        />
                        <span className="text-xs text-gray-600 dark:text-gray-400">
                          {article.author}
                        </span>
                        <span className="text-gray-400">•</span>
                        <span className="text-xs text-gray-600 dark:text-gray-400">
                          {formatDate(article.publishDate)}
                        </span>
                      </div>

                      <h3 className="font-bold text-gray-800 dark:text-white mb-2 group-hover:text-primary transition-colors line-clamp-2">
                        {article.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
                        {article.excerpt}
                      </p>

                      {/* Stats */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                          <div className="flex items-center gap-1">
                            <FaEye />
                            <span>{article.views}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <FaComments />
                            <span>{article.comments}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <FaClock />
                            <span>{article.readTime}</span>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleLike(article.id)}
                            className={`btn btn-circle btn-xs ${likedArticles.has(article.id) ? 'btn-primary' : 'btn-outline'}`}
                          >
                            <FaHeart className={likedArticles.has(article.id) ? 'text-white' : ''} />
                          </button>
                          <button
                            onClick={() => handleSave(article.id)}
                            className={`btn btn-circle btn-xs ${savedArticles.has(article.id) ? 'btn-secondary' : 'btn-outline'}`}
                          >
                            <FaBookmark className={savedArticles.has(article.id) ? 'text-white' : ''} />
                          </button>
                        </div>
                        <Link
                          to={`/blog/${article.id}`}
                          className="btn btn-primary btn-xs gap-1"
                        >
                          Read
                          <FaArrowRight />
                        </Link>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Blog; 