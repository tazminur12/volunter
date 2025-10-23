import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { AuthContext } from '../../shared/context/AuthProvider';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
/* eslint-disable no-unused-vars */
import { motion } from 'framer-motion';
import usePostQueries from './usePostQueries';
import { 
  FaUpload, 
  FaImage, 
  FaCalendarAlt, 
  FaMapMarkerAlt, 
  FaUsers, 
  FaTag, 
  FaUser, 
  FaEnvelope,
  FaSpinner,
  FaCheckCircle,
  FaTimes
} from 'react-icons/fa';

const AddPost = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const { useCreatePost } = usePostQueries();
  const createPostMutation = useCreatePost();
  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [deadline, setDeadline] = useState(new Date());
  const [selectedCategory, setSelectedCategory] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');

  const categories = [
    'Healthcare',
    'Education', 
    'Social Service',
    'Animal Welfare',
    'Environment',
    'Disaster Relief',
    'Community Development',
    'Youth Programs',
    'Elderly Care',
    'Food Security'
  ];

  // Handle image upload to ImgBB
  const handleImageUpload = async (file) => {
    if (!file) return;

    setImageLoading(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      // You can replace this with your actual ImgBB API key
      const apiKey = import.meta.env.VITE_IMGBB_API_KEY;
      
      const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        setImageUrl(data.data.url);
        setPreviewUrl(data.data.url);
        Swal.fire({
          icon: 'success',
          title: 'Image uploaded successfully!',
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 2000
        });
      } else {
        throw new Error('Failed to upload image');
      }
    } catch (error) {
      console.error('Image upload error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Image upload failed',
        text: 'Please try again or use a direct image URL',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000
      });
    } finally {
      setImageLoading(false);
    }
  };

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      handleImageUpload(file);
    }
  };

  // Handle direct URL input
  const handleUrlChange = (e) => {
    setImageUrl(e.target.value);
    setPreviewUrl(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const form = e.target;
    
    const newPost = {
      title: form.title.value,
      description: form.description.value,
      thumbnail: imageUrl || form.thumbnail.value,
      category: selectedCategory,
      location: form.location.value,
      volunteersNeeded: parseInt(form.volunteersNeeded.value),
      deadline: deadline.toISOString(),
      organizerName: user?.displayName || 'Anonymous',
      organizerEmail: user?.email,
      createdAt: new Date().toISOString(),
      status: 'active'
    };

    try {
      await createPostMutation.mutateAsync(newPost);
      navigate('/dashboard/manage-posts');
    } catch (err) {
      // Error handling is done in the mutation
      console.error('Create post error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
            Create Volunteer Opportunity
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Share your volunteer opportunity with the community. Make a difference by connecting volunteers with meaningful causes.
          </p>
        </motion.div>

        {/* Main Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden"
        >
          <form onSubmit={handleSubmit} className="p-8">
            {/* Image Upload Section */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                <FaImage className="text-primary" />
                Event Image
              </h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Upload Section */}
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-6 text-center hover:border-primary transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                      id="image-upload"
                    />
                    <label htmlFor="image-upload" className="cursor-pointer">
                      <FaUpload className="text-4xl text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 dark:text-gray-300 mb-2">
                        {imageLoading ? 'Uploading...' : 'Click to upload image'}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        PNG, JPG, GIF up to 10MB
                      </p>
                    </label>
                  </div>
                  
                  {imageLoading && (
                    <div className="flex items-center justify-center gap-2 text-primary">
                      <FaSpinner className="animate-spin" />
                      <span>Uploading image...</span>
                    </div>
                  )}
                </div>

                {/* Preview Section */}
                <div className="space-y-4">
                  <div className="border-2 border-gray-200 dark:border-gray-700 rounded-xl p-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Or enter image URL directly:
                    </label>
                    <input
                      type="url"
                      value={imageUrl}
                      onChange={handleUrlChange}
                      placeholder="https://example.com/image.jpg"
                      className="input input-bordered w-full"
                    />
                  </div>
                  
                  {previewUrl && (
                    <div className="border-2 border-gray-200 dark:border-gray-700 rounded-xl p-4">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Image Preview:
                      </label>
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="w-full h-32 object-cover rounded-lg"
                        onError={() => setPreviewUrl('')}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Basic Information */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <FaTag className="inline mr-2 text-primary" />
                  Post Title*
                </label>
                <input
                  type="text"
                  name="title"
                  placeholder="Help needed for community clean-up"
                  required
                  className="input input-bordered w-full focus:input-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <FaMapMarkerAlt className="inline mr-2 text-primary" />
                  Location*
                </label>
                <input
                  type="text"
                  name="location"
                  placeholder="City, Country"
                  required
                  className="input input-bordered w-full focus:input-primary"
                />
              </div>
            </div>

            {/* Description */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description*
              </label>
              <textarea
                name="description"
                rows="6"
                placeholder="Describe the volunteer opportunity in detail. What will volunteers be doing? What skills are needed? What impact will this have?"
                required
                className="textarea textarea-bordered w-full focus:textarea-primary resize-none"
              ></textarea>
            </div>

            {/* Category and Volunteers */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <FaTag className="inline mr-2 text-primary" />
                  Category*
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  required
                  className="select select-bordered w-full focus:select-primary"
                >
                  <option value="" disabled>Select a category</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <FaUsers className="inline mr-2 text-primary" />
                  Volunteers Needed*
                </label>
                <input
                  type="number"
                  name="volunteersNeeded"
                  min="1"
                  placeholder="5"
                  required
                  className="input input-bordered w-full focus:input-primary"
                />
              </div>
            </div>

            {/* Deadline */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <FaCalendarAlt className="inline mr-2 text-primary" />
                Application Deadline*
              </label>
              <DatePicker
                selected={deadline}
                onChange={(date) => setDeadline(date)}
                minDate={new Date()}
                className="input input-bordered w-full focus:input-primary"
                required
                placeholderText="Select deadline"
              />
            </div>

            {/* Organizer Info */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 mb-8">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                <FaUser className="text-primary" />
                Organizer Information
              </h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <FaUser className="inline mr-2 text-primary" />
                    Organizer Name
                  </label>
                  <input
                    type="text"
                    value={user?.displayName || 'Anonymous'}
                    readOnly
                    className="input input-bordered w-full bg-gray-100 dark:bg-gray-600"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <FaEnvelope className="inline mr-2 text-primary" />
                    Organizer Email
                  </label>
                  <input
                    type="email"
                    value={user?.email || 'Not provided'}
                    readOnly
                    className="input input-bordered w-full bg-gray-100 dark:bg-gray-600"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                type="submit"
                className="btn btn-primary flex-1 gap-2"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    Creating Post...
                  </>
                ) : (
                  <>
                    <FaCheckCircle />
                    Create Volunteer Opportunity
                  </>
                )}
              </button>
              
              <button
                type="button"
                onClick={() => navigate('/manage-posts')}
                className="btn btn-outline btn-secondary gap-2"
              >
                <FaTimes />
                Cancel
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default AddPost;