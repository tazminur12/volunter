import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { format } from 'date-fns';
import { debounce } from 'lodash';

const AllPosts = () => {
  const [posts, setPosts] = useState([]);
  const [displayPosts, setDisplayPosts] = useState([]);
  const [search, setSearch] = useState('');
  const [layout, setLayout] = useState('card');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const token = localStorage.getItem('token');

  const fetchPosts = async () => {
    try {
      const response = await fetch('https://volunteerhub-server.vercel.app/posts', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch posts');
      }

      const data = await response.json();
      const uniqueCategories = [...new Set(data.map(post => post.category))];
      setCategories(['all', ...uniqueCategories]);
      setPosts(data);
      setDisplayPosts(data);
    } catch (err) {
      console.error('Error fetching posts:', err);
      setError(err.message);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to load posts. Please try again later.',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const filterPosts = useCallback((keyword, category) => {
    const filtered = posts.filter(post => {
      const matchesSearch =
        post.title.toLowerCase().includes(keyword) ||
        post.description.toLowerCase().includes(keyword);
      const matchesCategory = category === 'all' || post.category === category;
      return matchesSearch && matchesCategory;
    });
    setDisplayPosts(filtered);
  }, [posts]);

  const handleSearch = debounce((e) => {
    const keyword = e.target.value.toLowerCase();
    setSearch(keyword);
    filterPosts(keyword, selectedCategory);
  }, 300);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    filterPosts(search, category);
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

  if (loading) {
    return (
      <div className="min-h-[60vh] flex justify-center items-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex flex-col justify-center items-center">
        <div className="alert alert-error max-w-md">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{error}</span>
        </div>
        <button 
          className="btn btn-primary mt-4"
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4 w-full">
          <input 
            type="text" 
            onChange={handleSearch} 
            placeholder="Search posts..." 
            className="input input-bordered flex-1" 
          />
          <select
            value={selectedCategory}
            onChange={(e) => handleCategoryChange(e.target.value)}
            className="select select-bordered w-full sm:w-48"
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>
        </div>
        <button className="btn btn-outline" onClick={toggleLayout}>
          {layout === 'card' ? 'Table View' : 'Card View'}
        </button>
      </div>

      {/* Posts */}
      {displayPosts.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <h3 className="text-lg font-medium">No posts found</h3>
          <p className="mt-1">Try adjusting your search or filter</p>
        </div>
      ) : layout === 'card' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayPosts.map(post => (
            <div key={post._id} className="card bg-base-100 shadow-md rounded-lg">
              <figure className="relative">
                <img
                  src={post.thumbnail || 'https://via.placeholder.com/400x200?text=No+Image'}
                  alt={post.title}
                  className="h-48 w-full object-cover"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/400x200?text=No+Image';
                  }}
                />
                <div className="absolute top-2 right-2 badge badge-primary">
                  {post.category}
                </div>
              </figure>
              <div className="card-body">
                <h2 className="card-title text-lg">{post.title}</h2>
                <p className="text-sm text-gray-500 line-clamp-2">{post.description}</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  <div className="badge badge-outline">🧑 {post.volunteersNeeded} needed</div>
                  <div className="badge badge-outline">📅 {formatDate(post.deadline)}</div>
                </div>
                <div className="card-actions justify-end mt-4">
                  <Link to={`/post/${post._id}`} className="btn btn-sm btn-primary">View Details</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="overflow-x-auto shadow-md rounded-lg">
          <table className="table w-full">
            <thead>
              <tr>
                <th>Post</th>
                <th>Category</th>
                <th>Volunteers</th>
                <th>Deadline</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {displayPosts.map(post => (
                <tr key={post._id} className="hover:bg-base-200">
                  <td>
                    <div className="flex items-center space-x-3">
                      <div className="avatar">
                        <div className="mask mask-squircle w-12 h-12">
                          <img 
                            src={post.thumbnail || 'https://via.placeholder.com/48?text=No+Img'} 
                            alt={post.title}
                            onError={(e) => {
                              e.target.src = 'https://via.placeholder.com/48?text=No+Img';
                            }}
                          />
                        </div>
                      </div>
                      <div>
                        <div className="font-bold">{post.title}</div>
                        <div className="text-sm opacity-50 line-clamp-1">{post.description}</div>
                      </div>
                    </div>
                  </td>
                  <td><span className="badge badge-secondary">{post.category}</span></td>
                  <td>{post.volunteersNeeded}</td>
                  <td>{formatDate(post.deadline)}</td>
                  <td>
                    <Link to={`/post/${post._id}`} className="btn btn-primary btn-xs">
                      Details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AllPosts;
