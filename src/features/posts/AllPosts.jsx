// Enhanced AllPosts.jsx with Professional Design
import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { debounce } from 'lodash';
/* eslint-disable no-unused-vars */
import { motion } from 'framer-motion';
import usePostQueries from './usePostQueries';
import { 
  FaSearch, 
  FaFilter, 
  FaSort, 
  FaTh, 
  FaList, 
  FaUsers, 
  FaCalendarAlt, 
  FaMapMarkerAlt, 
  FaHeart,
  FaEye,
  FaClock,
  FaTag,
  FaStar,
  FaHandshake,
  FaGlobe
} from 'react-icons/fa';

const AllPosts = () => {
  const [displayPosts, setDisplayPosts] = useState([]);
  const [search, setSearch] = useState('');
  const [layout, setLayout] = useState('card');
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('recent');

  // Use React Query to fetch posts
  const { usePosts } = usePostQueries();
  const { data: posts = [], isLoading: loading, error } = usePosts();

  // Update categories when posts are loaded
  React.useEffect(() => {
    if (posts.length > 0) {
      const uniqueCategories = [...new Set(posts.map(post => post.category))];
      setCategories(['all', ...uniqueCategories]);
      setDisplayPosts(posts);
    }
  }, [posts]);

  const filterPosts = useCallback((keyword, category, sortType) => {
    let filtered = posts.filter(post => {
      const matchesSearch = post.title.toLowerCase().includes(keyword) || post.description.toLowerCase().includes(keyword);
      const matchesCategory = category === 'all' || post.category === category;
      return matchesSearch && matchesCategory;
    });

    if (sortType === 'deadline') {
      filtered.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
    } else {
      filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    setDisplayPosts(filtered);
  }, [posts]);

  const handleSearch = debounce((e) => {
    const keyword = e.target.value.toLowerCase();
    setSearch(keyword);
    filterPosts(keyword, selectedCategory, sortBy);
  }, 300);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    filterPosts(search, category, sortBy);
  };

  const handleSortChange = (value) => {
    setSortBy(value);
    filterPosts(search, selectedCategory, value);
  };

  const toggleLayout = () => {
    setLayout(prev => (prev === 'card' ? 'table' : 'card'));
  };

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch {
      return dateString;
    }
  };

  const getDaysUntilDeadline = (deadline) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex justify-center items-center">
        <div className="text-center">
          <div className="loading loading-spinner loading-lg text-primary mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading volunteer opportunities...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex flex-col justify-center items-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 max-w-md mx-4"
        >
          <div className="text-center">
            <div className="text-6xl text-red-500 mb-4">⚠️</div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Oops! Something went wrong</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">{error.message || 'Failed to load posts'}</p>
            <button className="btn btn-primary" onClick={() => window.location.reload()}>
              Try Again
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

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
            Find Your Perfect Volunteer Opportunity
          </h1>
          <p className="text-xl opacity-90 max-w-3xl mx-auto">
            Discover meaningful ways to give back to your community. Join thousands of volunteers making a difference.
          </p>
          <div className="mt-8 flex items-center justify-center gap-4 text-sm opacity-80">
            <div className="flex items-center gap-2">
              <FaHandshake />
              <span>{posts.length} Opportunities</span>
            </div>
            <div className="flex items-center gap-2">
              <FaGlobe />
              <span>Global Impact</span>
            </div>
            <div className="flex items-center gap-2">
              <FaHeart />
              <span>Community Driven</span>
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
                onChange={handleSearch}
                placeholder="Search volunteer opportunities..."
                className="input input-bordered w-full pl-10 focus:input-primary"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative">
                <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <select
                  value={selectedCategory}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  className="select select-bordered pl-10 focus:select-primary"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category === 'all' ? 'All Categories' : category}
                    </option>
                  ))}
                </select>
              </div>

              <div className="relative">
                <FaSort className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <select
                  value={sortBy}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="select select-bordered pl-10 focus:select-primary"
                >
                  <option value="recent">Most Recent</option>
                  <option value="deadline">Deadline</option>
                </select>
              </div>

              <button
                className="btn btn-outline btn-primary"
                onClick={toggleLayout}
              >
                {layout === 'card' ? <FaList /> : <FaTh />}
                {layout === 'card' ? ' List View' : ' Card View'}
              </button>
            </div>
          </div>
        </motion.div>

        {/* Results Summary */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-6"
        >
          <div className="flex items-center justify-between">
            <p className="text-gray-600 dark:text-gray-300">
              Showing <span className="font-semibold text-primary">{displayPosts.length}</span> of{' '}
              <span className="font-semibold">{posts.length}</span> opportunities
            </p>
            {displayPosts.length > 0 && (
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {sortBy === 'recent' ? 'Sorted by most recent' : 'Sorted by deadline'}
              </div>
            )}
          </div>
        </motion.div>

        {/* Campaign Display */}
        {displayPosts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16"
          >
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-12 max-w-md mx-auto">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                No opportunities found
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Try adjusting your search criteria or browse all categories
              </p>
              <button
                onClick={() => {
                  setSearch('');
                  setSelectedCategory('all');
                  filterPosts('', 'all', sortBy);
                }}
                className="btn btn-primary"
              >
                View All Opportunities
              </button>
            </div>
          </motion.div>
        ) : layout === 'card' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {displayPosts.map((post, index) => (
              <motion.div
                key={post._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group"
              >
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:-translate-y-2">
                  {/* Image Section */}
                  <div className="relative overflow-hidden">
                    <img
                      src={post.thumbnail || 'https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'}
                      alt={post.title}
                      className="h-48 w-full object-cover group-hover:scale-110 transition-transform duration-300"
                      onError={(e) => e.target.src = 'https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'}
                    />
                    <div className="absolute top-3 left-3">
                      <span className="badge badge-primary badge-sm">
                        <FaTag className="mr-1" />
                        {post.category}
                      </span>
                    </div>
                    <div className="absolute top-3 right-3">
                      {getDaysUntilDeadline(post.deadline) <= 7 && getDaysUntilDeadline(post.deadline) > 0 ? (
                        <span className="badge badge-error badge-sm">
                          <FaClock className="mr-1" />
                          {getDaysUntilDeadline(post.deadline)} days left
                        </span>
                      ) : getDaysUntilDeadline(post.deadline) <= 0 ? (
                        <span className="badge badge-warning badge-sm">
                          <FaClock className="mr-1" />
                          Expired
                        </span>
                      ) : (
                        <span className="badge badge-success badge-sm">
                          <FaClock className="mr-1" />
                          Active
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="p-6">
                    <h3 className="font-bold text-lg text-gray-800 dark:text-white mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                      {post.description}
                    </p>

                    {/* Stats */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <FaUsers className="text-primary" />
                        <span>{post.volunteersNeeded} volunteers needed</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <FaCalendarAlt className="text-secondary" />
                        <span>Deadline: {formatDate(post.deadline)}</span>
                      </div>
                      {post.location && (
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <FaMapMarkerAlt className="text-accent" />
                          <span>{post.location}</span>
                        </div>
                      )}
                    </div>

                    {/* Action Button */}
                    <Link
                      to={`/post/${post._id}`}
                      className="btn btn-primary w-full gap-2 group-hover:btn-secondary transition-all"
                    >
                      <FaEye />
                      View Details
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="table w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="text-gray-700 dark:text-gray-300">Opportunity</th>
                    <th className="text-gray-700 dark:text-gray-300">Category</th>
                    <th className="text-gray-700 dark:text-gray-300">Volunteers</th>
                    <th className="text-gray-700 dark:text-gray-300">Deadline</th>
                    <th className="text-gray-700 dark:text-gray-300">Status</th>
                    <th className="text-gray-700 dark:text-gray-300">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {displayPosts.map((post, index) => (
                    <motion.tr
                      key={post._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <td>
                        <div className="flex items-center space-x-4">
                          <div className="avatar">
                            <div className="mask mask-squircle w-12 h-12">
                              <img
                                src={post.thumbnail || 'https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'}
                                alt={post.title}
                                onError={(e) => e.target.src = 'https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'}
                              />
                            </div>
                          </div>
                          <div>
                            <div className="font-bold text-gray-800 dark:text-white">{post.title}</div>
                            <div className="text-sm text-gray-600 dark:text-gray-300 line-clamp-1">{post.description}</div>
                            {post.location && (
                              <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-1">
                                <FaMapMarkerAlt />
                                {post.location}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="badge badge-primary badge-sm">
                          <FaTag className="mr-1" />
                          {post.category}
                        </span>
                      </td>
                      <td>
                        <div className="flex items-center gap-1">
                          <FaUsers className="text-primary text-sm" />
                          <span className="font-medium">{post.volunteersNeeded}</span>
                        </div>
                      </td>
                      <td>
                        <div className="text-sm">
                          <div className="font-medium">{formatDate(post.deadline)}</div>
                          <div className="text-xs text-gray-500">
                            {getDaysUntilDeadline(post.deadline) > 0 
                              ? `${getDaysUntilDeadline(post.deadline)} days left`
                              : 'Expired'
                            }
                          </div>
                        </div>
                      </td>
                      <td>
                        {getDaysUntilDeadline(post.deadline) <= 7 && getDaysUntilDeadline(post.deadline) > 0 ? (
                          <span className="badge badge-error badge-sm">Urgent</span>
                        ) : getDaysUntilDeadline(post.deadline) <= 0 ? (
                          <span className="badge badge-warning badge-sm">Expired</span>
                        ) : (
                          <span className="badge badge-success badge-sm">Active</span>
                        )}
                      </td>
                      <td>
                        <Link
                          to={`/post/${post._id}`}
                          className="btn btn-primary btn-sm gap-2"
                        >
                          <FaEye />
                          View
                        </Link>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AllPosts;