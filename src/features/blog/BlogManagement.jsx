import React, { useState, useEffect, useContext } from 'react';
import { 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaEye, 
  FaHeart, 
  FaCalendarAlt, 
  FaUser, 
  FaTag,
  FaSearch,
  FaFilter,
  FaSort,
  FaBookmark,
  FaClock,
  FaComments,
  FaUpload,
  FaImage,
  FaTimes,
  FaStar
} from 'react-icons/fa';
import { AuthContext } from '../../shared/context/AuthProvider';
import useAxiosSecure from '../../shared/hooks/useAxiosSecure';
import LoadingSpinner from '../../shared/components/LoadingSpinner';
import AdminRatingManagement from '../ratings/AdminRatingManagement';

const BlogManagement = () => {
  const { user } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();
  
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('all');
  const [sortBy, setSortBy] = useState('latest');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [deletingPost, setDeletingPost] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  // Form states
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    image: '',
    tags: '',
    excerpt: ''
  });

  // Image upload states
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageError, setImageError] = useState('');
  const [activeTab, setActiveTab] = useState('posts');

  // Fetch user's blog posts
  const fetchBlogPosts = async () => {
    try {
      setLoading(true);
      const response = await axiosSecure.get('/my-blog-posts');
      setBlogPosts(response.data.blogPosts || []);
    } catch {
      // Silently handle error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogPosts();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle image file selection
  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setImageError('Please select a valid image file');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setImageError('Image size should be less than 5MB');
        return;
      }

      setSelectedImage(file);
      setImageError('');
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Remove selected image
  const removeSelectedImage = () => {
    setSelectedImage(null);
    setImagePreview('');
    setImageError('');
    setFormData(prev => ({ ...prev, image: '' }));
  };

  // Upload image to ImgBB
  const uploadImage = async (file) => {
    try {
      setUploadingImage(true);
      setImageError('');
      
      // Check if ImgBB API key is available
      const apiKey = import.meta.env.VITE_IMGBB_API_KEY;
      if (!apiKey) {
        throw new Error('ImgBB API key not configured. Please add VITE_IMGBB_API_KEY to your environment variables.');
      }
      
      const formData = new FormData();
      formData.append('image', file);
      
      const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        return data.data.url;
      } else {
        throw new Error('Failed to upload image to ImgBB');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      setImageError(error.message || 'Failed to upload image. Please try again.');
      throw error;
    } finally {
      setUploadingImage(false);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      let imageUrl = formData.image;
      
      // Upload image if a new one is selected (prioritize uploaded file over URL)
      if (selectedImage) {
        imageUrl = await uploadImage(selectedImage);
      }
      
      // If no image was uploaded and no URL provided, imageUrl will be empty
      
      if (editingPost) {
        // Update existing post
        await axiosSecure.put(`/blog-posts/${editingPost._id}`, {
          ...formData,
          image: imageUrl
        });
        setSuccessMessage('Blog post updated successfully!');
      } else {
        // Create new post
        await axiosSecure.post('/blog-posts', {
          ...formData,
          image: imageUrl,
          author: user.email,
          tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
        });
        
        setSuccessMessage('Blog post created successfully!');
      }
      
      // Reset form and refresh posts
      setFormData({ title: '', content: '', image: '', tags: '', excerpt: '' });
      setSelectedImage(null);
      setImagePreview('');
      setShowAddForm(false);
      setEditingPost(null);
      fetchBlogPosts();
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error saving blog post:', error);
      alert('Failed to save blog post. Please try again.');
    }
  };

  // Handle edit post
  const handleEdit = (post) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      content: post.content,
      image: post.image || '',
      tags: post.tags?.join(', ') || '',
      excerpt: post.excerpt || ''
    });
    
    // Set image preview if post has an existing image
    if (post.image) {
      setImagePreview(post.image);
      setSelectedImage(null); // No new file selected
    } else {
      setImagePreview('');
      setSelectedImage(null);
    }
    
    setImageError('');
    setShowAddForm(true);
  };

  // Handle delete post
  const handleDelete = async (postId) => {
    if (window.confirm('Are you sure you want to delete this blog post?')) {
      try {
        setDeletingPost(postId);
        await axiosSecure.delete(`/blog-posts/${postId}`);
        setSuccessMessage('Blog post deleted successfully!');
        fetchBlogPosts();
        setTimeout(() => setSuccessMessage(''), 3000);
      } catch (error) {
        console.error('Error deleting blog post:', error);
        alert('Failed to delete blog post. Please try again.');
      } finally {
        setDeletingPost(null);
      }
    }
  };

  // Handle like/unlike
  const handleLike = async (postId, currentLikes, isLiked) => {
    try {
      const action = isLiked ? 'unlike' : 'like';
      await axiosSecure.patch(`/blog-posts/${postId}/like`, { action });
      fetchBlogPosts(); // Refresh to get updated like count
    } catch (error) {
      console.error('Error updating like:', error);
    }
  };

  // Filter and sort posts
  const filteredPosts = blogPosts
    .filter(post => 
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.content.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(post => selectedTag === 'all' || post.tags?.includes(selectedTag))
    .sort((a, b) => {
      if (sortBy === 'latest') return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortBy === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt);
      if (sortBy === 'views') return b.views - a.views;
      if (sortBy === 'likes') return b.likes - a.likes;
      return 0;
    });

  // Get unique tags for filter
  const allTags = [...new Set(blogPosts.flatMap(post => post.tags || []))];

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
            Blog Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your blog posts and share your thoughts with the community
          </p>
        </div>
        <button
          onClick={() => {
            setShowAddForm(true);
            setEditingPost(null);
            setFormData({ title: '', content: '', image: '', tags: '', excerpt: '' });
            setSelectedImage(null);
            setImagePreview('');
            setImageError('');
          }}
          className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors"
        >
          <FaPlus />
          {editingPost ? 'Edit Post' : 'Add New Post'}
        </button>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div
          className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg"
        >
          {successMessage}
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('posts')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'posts'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <FaEdit />
                Blog Posts
              </div>
            </button>
            <button
              onClick={() => setActiveTab('ratings')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'ratings'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <FaStar />
                Ratings & Reviews
              </div>
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'posts' ? (
            <>
              {/* Add/Edit Form */}
              {showAddForm && (
        <div
          className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg"
        >
          <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
            {editingPost ? 'Edit Blog Post' : 'Create New Blog Post'}
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="Enter blog post title"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Image
                </label>
                <div className="space-y-3">
                  {/* File Upload */}
                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageSelect}
                      className="hidden"
                      id="image-upload"
                    />
                    <label 
                      htmlFor="image-upload" 
                      className={`cursor-pointer px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                        uploadingImage || !import.meta.env.VITE_IMGBB_API_KEY
                          ? 'bg-gray-400 cursor-not-allowed' 
                          : 'bg-primary hover:bg-primary/90 text-white'
                      }`}
                    >
                      <FaUpload />
                      {uploadingImage ? 'Uploading...' : 'Upload Image'}
                    </label>
                    {selectedImage && (
                      <div className="flex items-center gap-2">
                        <img src={imagePreview} alt="Preview" className="w-10 h-10 object-cover rounded-full" />
                        <button
                          type="button"
                          onClick={removeSelectedImage}
                          className="p-2 text-red-500 hover:text-red-600 transition-colors"
                          title="Remove image"
                        >
                          <FaTimes />
                        </button>
                      </div>
                    )}
                  </div>
                  
                  {/* Or URL Input */}
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500 text-sm">OR</span>
                    <input
                      type="url"
                      name="image"
                      value={formData.image}
                      onChange={handleInputChange}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                  
                  {imageError && (
                    <p className="text-red-500 text-sm mt-1">{imageError}</p>
                  )}
                  <p className="text-gray-500 text-xs mt-1">
                    Upload image (JPG, PNG, GIF, max 5MB) or provide direct URL. 
                    Images are uploaded to ImgBB.
                  </p>
                  
                  {/* API Key Notice */}
                  {!import.meta.env.VITE_IMGBB_API_KEY && (
                    <div className="mt-2 p-2 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                      <p className="text-yellow-800 dark:text-yellow-200 text-xs">
                        ⚠️ ImgBB API key not configured. Add <code className="bg-yellow-100 px-1 rounded">VITE_IMGBB_API_KEY</code> to your .env file to enable image uploads.
                      </p>
                    </div>
                  )}

                  {/* Image Preview */}
                  {(imagePreview || formData.image) && (
                    <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Final Image Preview:
                      </p>
                      <img
                        src={imagePreview || formData.image}
                        alt="Preview"
                        className="w-full h-32 object-cover rounded-lg"
                        onError={() => {
                          setImageError('Failed to load image preview');
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Content *
              </label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                required
                rows={8}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="Write your blog post content here..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="volunteering, community, health"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Excerpt
                </label>
                <input
                  type="text"
                  name="excerpt"
                  value={formData.excerpt}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="Brief summary of your post..."
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-lg transition-colors disabled:opacity-50"
                disabled={uploadingImage}
              >
                {editingPost ? 'Update Post' : 'Create Post'}
                {uploadingImage && (
                  <span className="ml-2">Uploading...</span>
                )}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowAddForm(false);
                  setEditingPost(null);
                  setFormData({ title: '', content: '', image: '', tags: '', excerpt: '' });
                  setSelectedImage(null);
                  setImagePreview('');
                }}
                className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-6 py-2 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filters and Search */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-lg">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search posts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
          </div>
          
          <select
            value={selectedTag}
            onChange={(e) => setSelectedTag(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="all">All Tags</option>
            {allTags.map(tag => (
              <option key={tag} value={tag}>{tag}</option>
            ))}
          </select>
          
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="latest">Latest</option>
            <option value="oldest">Oldest</option>
            <option value="views">Most Views</option>
            <option value="likes">Most Likes</option>
          </select>
        </div>
      </div>

      {/* Blog Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPosts.map((post) => (
          <div
            key={post._id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
          >
            {/* Post Image */}
            {post.image && (
              <div className="h-48 overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
            )}

            {/* Post Content */}
            <div className="p-6">
              <div className="flex items-center gap-2 mb-3">
                {post.tags?.map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3 line-clamp-2">
                {post.title}
              </h3>

              <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                {post.excerpt || post.content.substring(0, 150) + '...'}
              </p>

              {/* Post Meta */}
              <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                <div className="flex items-center gap-2">
                  <FaUser />
                  <span>{post.author}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaCalendarAlt />
                  <span>{formatDate(post.createdAt)}</span>
                </div>
              </div>

              {/* Stats */}
              <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <FaEye />
                    <span>{post.views || 0}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FaHeart />
                    <span>{post.likes || 0}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <FaClock />
                  <span>{Math.ceil((post.content?.length || 0) / 200)} min read</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex gap-2">
                  <button
                    onClick={() => handleLike(post._id, post.likes, false)}
                    className="p-2 text-gray-500 hover:text-red-500 transition-colors"
                    title="Like post"
                  >
                    <FaHeart />
                  </button>
                  <button
                    onClick={() => handleEdit(post)}
                    className="p-2 text-gray-500 hover:text-blue-500 transition-colors"
                    title="Edit post"
                  >
                    <FaEdit />
                  </button>
                </div>
                
                <button
                  onClick={() => handleDelete(post._id)}
                  disabled={deletingPost === post._id}
                  className="p-2 text-gray-500 hover:text-red-500 transition-colors disabled:opacity-50"
                  title="Delete post"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredPosts.length === 0 && !loading && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📝</div>
          <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
            {searchTerm || selectedTag !== 'all' ? 'No posts found' : 'No blog posts yet'}
          </h3>
          <p className="text-gray-500 dark:text-gray-500 mb-6">
            {searchTerm || selectedTag !== 'all' 
              ? 'Try adjusting your search or filters'
              : 'Start writing your first blog post to share your thoughts with the community!'
            }
          </p>
          {!searchTerm && selectedTag === 'all' && (
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg transition-colors"
            >
              <FaPlus className="inline mr-2" />
              Write Your First Post
            </button>
          )}
        </div>
      )}
            </>
          ) : (
            <AdminRatingManagement />
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogManagement;
