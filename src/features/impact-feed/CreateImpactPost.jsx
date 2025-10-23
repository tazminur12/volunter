import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useImpactFeedQueries } from './useImpactFeedQueries';
import { FaTimes, FaImage, FaHeart, FaCalendarAlt, FaMapMarkerAlt } from 'react-icons/fa';
import { FiUpload, FiX } from 'react-icons/fi';
import Swal from 'sweetalert2';

const CreateImpactPost = ({ onClose, onSuccess }) => {
  const { useCreateImpactPost } = useImpactFeedQueries();
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'community',
    eventName: '',
    eventDate: '',
    images: []
  });
  
  const [imageFiles, setImageFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  
  const createPost = useCreateImpactPost();

  const categories = [
    { value: 'environment', label: 'Environment', icon: '🌱' },
    { value: 'education', label: 'Education', icon: '📚' },
    { value: 'health', label: 'Health', icon: '🏥' },
    { value: 'community', label: 'Community', icon: '🤝' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    
    // Validate files
    const validFiles = files.filter(file => {
      const isValidType = file.type.startsWith('image/');
      const isValidSize = file.size <= 32 * 1024 * 1024; // 32MB limit
      
      if (!isValidType) {
        Swal.fire({
          icon: 'warning',
          title: 'Invalid File Type',
          text: `${file.name} is not an image file. Please select only image files.`,
        });
        return false;
      }
      
      if (!isValidSize) {
        Swal.fire({
          icon: 'warning',
          title: 'File Too Large',
          text: `${file.name} is larger than 32MB. Please select a smaller image.`,
        });
        return false;
      }
      
      return true;
    });
    
    const newImages = [...imageFiles, ...validFiles].slice(0, 5); // Max 5 images
    setImageFiles(newImages);
    
    // Show success message if files were added
    if (validFiles.length > 0) {
      Swal.fire({
        icon: 'success',
        title: 'Images Added!',
        text: `${validFiles.length} image(s) added to your post.`,
        timer: 2000,
        showConfirmButton: false
      });
    }
  };

  const removeImage = (index) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
  };

  // Upload image to ImgBB
  const uploadToImgBB = async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    
    const response = await fetch(`https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_API_KEY}`, {
      method: 'POST',
      body: formData
    });
    
    const data = await response.json();
    
    if (data.success) {
      return data.data.url;
    } else {
      throw new Error(data.error?.message || 'Failed to upload image');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      let imageUrls = [];
      
      // Upload images to ImgBB if any
      if (imageFiles.length > 0) {
        setUploadingImages(true);
        Swal.fire({
          title: 'Uploading Images...',
          text: 'Please wait while we upload your photos',
          allowOutsideClick: false,
          showConfirmButton: false,
          didOpen: () => {
            Swal.showLoading();
          }
        });
        
        const uploadPromises = imageFiles.map(file => uploadToImgBB(file));
        imageUrls = await Promise.all(uploadPromises);
        
        Swal.close();
      }
      
      const postData = {
        title: formData.title,
        content: formData.content,
        category: formData.category,
        images: imageUrls,
        tags: [] // Add empty tags array as expected by backend
      };

      await createPost.mutateAsync(postData);
      onSuccess();
    } catch (error) {
      console.error('Error creating post:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      
      Swal.fire({
        icon: 'error',
        title: 'Failed to Create Post',
        text: error.response?.data?.message || error.message || 'Failed to create post. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
      setUploadingImages(false);
    }
  };


  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-2xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0">
                <FaHeart className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white truncate">
                  Share Your Impact Story
                </h2>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 truncate">
                  Inspire others with your volunteer experience
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex-shrink-0"
            >
              <FaTimes className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-6 overflow-y-auto max-h-[calc(95vh-120px)] sm:max-h-[calc(90vh-140px)]">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Story Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Give your story a compelling title..."
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Category *
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                {categories.map((category) => (
                  <label
                    key={category.value}
                    className={`flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                      formData.category === category.value
                        ? 'border-primary bg-primary/10'
                        : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                    }`}
                  >
                    <input
                      type="radio"
                      name="category"
                      value={category.value}
                      checked={formData.category === category.value}
                      onChange={handleInputChange}
                      className="sr-only"
                    />
                    <span className="text-lg sm:text-2xl">{category.icon}</span>
                    <span className="font-medium text-gray-900 dark:text-white text-sm sm:text-base">
                      {category.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Content */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Your Story *
              </label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                placeholder="Share your volunteer experience, what you learned, how it impacted you and others..."
                rows="6"
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              />
            </div>

            {/* Event Information */}
            <div className="space-y-3 sm:space-y-4">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <FaCalendarAlt className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                Related Event (Optional)
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Event Name
                  </label>
                  <input
                    type="text"
                    name="eventName"
                    value={formData.eventName}
                    onChange={handleInputChange}
                    placeholder="Name of the event you volunteered for"
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Event Date
                  </label>
                  <input
                    type="date"
                    name="eventDate"
                    value={formData.eventDate}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Photos (Optional) - Max 5 images
              </label>
              
              <div className="space-y-4">
                {/* Upload Button */}
                <label className={`flex items-center justify-center gap-3 p-4 sm:p-6 border-2 border-dashed rounded-lg cursor-pointer transition-all duration-200 ${
                  uploadingImages 
                    ? 'border-primary bg-primary/10 cursor-not-allowed' 
                    : 'border-gray-300 dark:border-gray-600 hover:border-primary hover:bg-primary/5'
                }`}>
                  {uploadingImages ? (
                    <>
                      <div className="loading loading-spinner loading-sm"></div>
                      <span className="text-primary font-medium">
                        Uploading images...
                      </span>
                    </>
                  ) : (
                    <>
                      <FiUpload className="w-5 h-5 sm:w-6 sm:h-6 text-gray-500" />
                      <span className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                        Click to upload photos (max 5)
                      </span>
                    </>
                  )}
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploadingImages}
                    className="hidden"
                  />
                </label>

                {/* Image Preview */}
                {imageFiles.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Selected Images ({imageFiles.length}/5)
                      </span>
                      <button
                        type="button"
                        onClick={() => setImageFiles([])}
                        className="text-xs text-red-600 hover:text-red-700 font-medium"
                      >
                        Clear All
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                      {imageFiles.map((file, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={URL.createObjectURL(file)}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-20 sm:h-24 object-cover rounded-lg border border-gray-200 dark:border-gray-600"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute -top-2 -right-2 w-5 h-5 sm:w-6 sm:h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg"
                          >
                            <FiX className="w-3 h-3" />
                          </button>
                          <div className="absolute bottom-1 left-1 bg-black/50 text-white text-xs px-1 py-0.5 rounded">
                            {(file.size / 1024 / 1024).toFixed(1)}MB
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 btn btn-outline btn-sm sm:btn-md"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !formData.title.trim() || !formData.content.trim()}
                className="flex-1 btn btn-primary btn-sm sm:btn-md gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="loading loading-spinner loading-sm"></div>
                    <span className="hidden sm:inline">Sharing...</span>
                    <span className="sm:hidden">Sharing...</span>
                  </>
                ) : (
                  <>
                    <FaHeart />
                    <span className="hidden sm:inline">Share Story</span>
                    <span className="sm:hidden">Share</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AnimatePresence>
  );
};

export default CreateImpactPost;
