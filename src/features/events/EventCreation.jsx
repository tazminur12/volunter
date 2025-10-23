import React, { useState, useEffect } from 'react';
import { 
  FaCalendarAlt, 
  FaClock, 
  FaMapMarkerAlt, 
  FaUsers, 
  FaTag,
  FaImage,
  FaSave,
  FaTimes,
  FaCheck,
  FaExclamationTriangle,
  FaInfoCircle,
  FaMagic,
  FaGlobe,
  FaPhone,
  FaEnvelope,
  FaUpload,
  FaLink,
  FaCalendarCheck,
  FaBell,
  FaSpinner,
  FaCheckCircle
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useEventQueries } from './useEventQueries';
import LoadingSpinner from '../../shared/components/LoadingSpinner';
import Swal from 'sweetalert2';

const EventCreation = () => {
  const navigate = useNavigate();
  const { useCreateEvent } = useEventQueries();
  const createEventMutation = useCreateEvent();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    endTime: '',
    location: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'Bangladesh',
    type: 'general',
    category: '',
    maxVolunteers: 50,
    requirements: '',
    contactEmail: '',
    contactPhone: '',
    website: '',
    image: '',
    tags: [],
    isRecurring: false,
    recurringType: 'none', // none, weekly, monthly, yearly
    recurringEndDate: '',
    isPublic: true,
    requiresApproval: false,
    allowWaitlist: true,
    weatherDependent: false,
    ageRestriction: 'all', // all, 18+, 21+
    skillLevel: 'beginner', // beginner, intermediate, advanced
    equipment: '',
    transportation: '',
    refreshments: false,
    certificate: false,
    reminderDays: 1,
    reminderHours: 2
  });

  const [errors, setErrors] = useState({});
  const [smartSuggestions, setSmartSuggestions] = useState([]);
  const [imageLoading, setImageLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');

  const eventTypes = [
    { value: 'environment', label: 'Environment', icon: '🌱', color: 'bg-green-100 text-green-800' },
    { value: 'social', label: 'Social Work', icon: '🤝', color: 'bg-blue-100 text-blue-800' },
    { value: 'education', label: 'Education', icon: '📚', color: 'bg-purple-100 text-purple-800' },
    { value: 'health', label: 'Health', icon: '🏥', color: 'bg-red-100 text-red-800' },
    { value: 'disaster', label: 'Disaster Relief', icon: '🚨', color: 'bg-orange-100 text-orange-800' },
    { value: 'cultural', label: 'Cultural', icon: '🎭', color: 'bg-pink-100 text-pink-800' },
    { value: 'sports', label: 'Sports', icon: '⚽', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'general', label: 'General', icon: '⭐', color: 'bg-gray-100 text-gray-800' }
  ];

  const skillLevels = [
    { value: 'beginner', label: 'Beginner Friendly', description: 'No prior experience required' },
    { value: 'intermediate', label: 'Some Experience', description: 'Basic knowledge helpful' },
    { value: 'advanced', label: 'Advanced', description: 'Requires specific skills' }
  ];

  const ageRestrictions = [
    { value: 'all', label: 'All Ages', description: 'Open to everyone' },
    { value: '18+', label: 'Adults Only', description: '18 years and above' },
    { value: '21+', label: '21+ Only', description: '21 years and above' }
  ];

  // Smart suggestions based on form data
  useEffect(() => {
    if (formData.title && formData.type) {
      const suggestions = generateSmartSuggestions(formData);
      setSmartSuggestions(suggestions);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.title, formData.type, formData.date, formData.location, formData.maxVolunteers, formData.weatherDependent]);

  const generateSmartSuggestions = (data) => {
    const suggestions = [];
    
    // Time suggestions based on event type
    if (data.type === 'environment') {
      suggestions.push({
        type: 'time',
        title: 'Optimal Time Suggestion',
        description: 'Environmental events work best in the morning (8-10 AM) when weather is cooler',
        icon: '⏰',
        action: () => setFormData(prev => ({ ...prev, time: '08:00' }))
      });
    }
    
    // Location suggestions
    if (data.type === 'social' && !data.location) {
      suggestions.push({
        type: 'location',
        title: 'Community Center Suggestion',
        description: 'Community centers are ideal for social events and have good accessibility',
        icon: '🏢',
        action: () => setFormData(prev => ({ ...prev, location: 'Community Center' }))
      });
    }
    
    // Volunteer count suggestions
    if (data.maxVolunteers > 100) {
      suggestions.push({
        type: 'capacity',
        title: 'Large Event Management',
        description: 'Consider breaking into smaller groups or having team leaders for better coordination',
        icon: '👥',
        action: null
      });
    }
    
    // Weather dependency
    if (data.type === 'environment' && !data.weatherDependent) {
      suggestions.push({
        type: 'weather',
        title: 'Weather Backup Plan',
        description: 'Environmental events should have indoor alternatives for bad weather',
        icon: '🌧️',
        action: () => setFormData(prev => ({ ...prev, weatherDependent: true }))
      });
    }
    
    return suggestions;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleTagAdd = (tag) => {
    if (tag && !formData.tags.includes(tag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }));
    }
  };

  const handleTagRemove = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

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
      handleImageUpload(file);
    }
  };

  // Handle direct URL input
  const handleUrlChange = (e) => {
    setImageUrl(e.target.value);
    setPreviewUrl(e.target.value);
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Event title is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Event description is required';
    }
    
    if (!formData.date) {
      newErrors.date = 'Event date is required';
    } else if (new Date(formData.date) < new Date()) {
      newErrors.date = 'Event date cannot be in the past';
    }
    
    if (!formData.time) {
      newErrors.time = 'Event time is required';
    }
    
    if (!formData.location.trim()) {
      newErrors.location = 'Event location is required';
    }
    
    if (formData.maxVolunteers < 1) {
      newErrors.maxVolunteers = 'Maximum volunteers must be at least 1';
    }
    
    if (formData.contactEmail && !/\S+@\S+\.\S+/.test(formData.contactEmail)) {
      newErrors.contactEmail = 'Please enter a valid email address';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    // Include image URL in the form data
    const eventData = {
      ...formData,
      image: imageUrl || formData.image
    };
    
    // Use the createEventMutation from useEventQueries
    createEventMutation.mutate(eventData, {
      onSuccess: () => {
        navigate('/events');
      }
    });
  };

  const handleCancel = () => {
    if (window.confirm('Are you sure you want to cancel? All changes will be lost.')) {
      navigate('/events');
    }
  };

  if (createEventMutation.isPending) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 dark:text-white flex items-center gap-3">
                <FaCalendarAlt className="text-primary" />
                Create New Event
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                Set up a volunteer event with smart scheduling and management features
              </p>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={handleCancel}
                className="btn btn-outline gap-2"
              >
                <FaTimes />
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="btn btn-primary gap-2"
                disabled={createEventMutation.isPending}
              >
                <FaSave />
                {createEventMutation.isPending ? 'Creating...' : 'Create Event'}
              </button>
            </div>
          </div>

          {/* Smart Suggestions */}
          {smartSuggestions.length > 0 && (
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 mb-6">
              <div className="flex items-center gap-2 mb-3">
                <FaMagic className="text-blue-600" />
                <h3 className="font-semibold text-blue-800 dark:text-blue-200">
                  Smart Suggestions
                </h3>
              </div>
              <div className="space-y-2">
                {smartSuggestions.map((suggestion, index) => (
                  <div key={index} className="flex items-center justify-between bg-white dark:bg-gray-700 rounded-lg p-3">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{suggestion.icon}</span>
                      <div>
                        <h4 className="font-medium text-gray-800 dark:text-white">
                          {suggestion.title}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {suggestion.description}
                        </p>
                      </div>
                    </div>
                    {suggestion.action && (
                      <button
                        onClick={suggestion.action}
                        className="btn btn-sm btn-primary"
                      >
                        Apply
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
              <FaInfoCircle className="text-primary" />
              Basic Information
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Event Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className={`input input-bordered w-full ${errors.title ? 'input-error' : 'focus:input-primary'}`}
                  placeholder="Enter event title..."
                />
                {errors.title && (
                  <p className="text-error text-sm mt-1 flex items-center gap-1">
                    <FaExclamationTriangle />
                    {errors.title}
                  </p>
                )}
              </div>
              
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="4"
                  className={`textarea textarea-bordered w-full ${errors.description ? 'textarea-error' : 'focus:textarea-primary'}`}
                  placeholder="Describe your event in detail..."
                />
                {errors.description && (
                  <p className="text-error text-sm mt-1 flex items-center gap-1">
                    <FaExclamationTriangle />
                    {errors.description}
                  </p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Event Type *
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="select select-bordered w-full focus:select-primary"
                >
                  {eventTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.icon} {type.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Category
                </label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="input input-bordered w-full focus:input-primary"
                  placeholder="e.g., Beach Cleanup, Food Drive..."
                />
              </div>
            </div>
          </div>

          {/* Event Image */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
              <FaImage className="text-primary" />
              Event Image
            </h2>
            
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

          {/* Date & Time */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
              <FaClock className="text-primary" />
              Date & Time
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Event Date *
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  min={new Date().toISOString().split('T')[0]}
                  className={`input input-bordered w-full ${errors.date ? 'input-error' : 'focus:input-primary'}`}
                />
                {errors.date && (
                  <p className="text-error text-sm mt-1 flex items-center gap-1">
                    <FaExclamationTriangle />
                    {errors.date}
                  </p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Start Time *
                </label>
                <input
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleInputChange}
                  className={`input input-bordered w-full ${errors.time ? 'input-error' : 'focus:input-primary'}`}
                />
                {errors.time && (
                  <p className="text-error text-sm mt-1 flex items-center gap-1">
                    <FaExclamationTriangle />
                    {errors.time}
                  </p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  End Time
                </label>
                <input
                  type="time"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleInputChange}
                  className="input input-bordered w-full focus:input-primary"
                />
              </div>
              
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="isRecurring"
                    checked={formData.isRecurring}
                    onChange={handleInputChange}
                    className="checkbox checkbox-primary"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Recurring Event
                  </span>
                </label>
              </div>
              
              {formData.isRecurring && (
                <div className="lg:col-span-2">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Recurring Type
                      </label>
                      <select
                        name="recurringType"
                        value={formData.recurringType}
                        onChange={handleInputChange}
                        className="select select-bordered w-full focus:select-primary"
                      >
                        <option value="none">No Recurrence</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                        <option value="yearly">Yearly</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Recurring End Date
                      </label>
                      <input
                        type="date"
                        name="recurringEndDate"
                        value={formData.recurringEndDate}
                        onChange={handleInputChange}
                        className="input input-bordered w-full focus:input-primary"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Location */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
              <FaMapMarkerAlt className="text-primary" />
              Location
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Venue Name *
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className={`input input-bordered w-full ${errors.location ? 'input-error' : 'focus:input-primary'}`}
                  placeholder="e.g., Central Park, Community Center..."
                />
                {errors.location && (
                  <p className="text-error text-sm mt-1 flex items-center gap-1">
                    <FaExclamationTriangle />
                    {errors.location}
                  </p>
                )}
              </div>
              
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Full Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="input input-bordered w-full focus:input-primary"
                  placeholder="Street address..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="input input-bordered w-full focus:input-primary"
                  placeholder="City name..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  State/Province
                </label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  className="input input-bordered w-full focus:input-primary"
                  placeholder="State/Province..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  ZIP/Postal Code
                </label>
                <input
                  type="text"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleInputChange}
                  className="input input-bordered w-full focus:input-primary"
                  placeholder="ZIP/Postal code..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Country
                </label>
                <select
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  className="select select-bordered w-full focus:select-primary"
                >
                  <option value="Bangladesh">Bangladesh</option>
                  <option value="India">India</option>
                  <option value="USA">United States</option>
                  <option value="UK">United Kingdom</option>
                  <option value="Canada">Canada</option>
                </select>
              </div>
            </div>
          </div>

          {/* Event Details */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
              <FaUsers className="text-primary" />
              Event Details
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Maximum Volunteers *
                </label>
                <input
                  type="number"
                  name="maxVolunteers"
                  value={formData.maxVolunteers}
                  onChange={handleInputChange}
                  min="1"
                  className={`input input-bordered w-full ${errors.maxVolunteers ? 'input-error' : 'focus:input-primary'}`}
                />
                {errors.maxVolunteers && (
                  <p className="text-error text-sm mt-1 flex items-center gap-1">
                    <FaExclamationTriangle />
                    {errors.maxVolunteers}
                  </p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Skill Level Required
                </label>
                <select
                  name="skillLevel"
                  value={formData.skillLevel}
                  onChange={handleInputChange}
                  className="select select-bordered w-full focus:select-primary"
                >
                  {skillLevels.map(level => (
                    <option key={level.value} value={level.value}>
                      {level.label} - {level.description}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Age Restriction
                </label>
                <select
                  name="ageRestriction"
                  value={formData.ageRestriction}
                  onChange={handleInputChange}
                  className="select select-bordered w-full focus:select-primary"
                >
                  {ageRestrictions.map(age => (
                    <option key={age.value} value={age.value}>
                      {age.label} - {age.description}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Requirements
                </label>
                <textarea
                  name="requirements"
                  value={formData.requirements}
                  onChange={handleInputChange}
                  rows="3"
                  className="textarea textarea-bordered w-full focus:textarea-primary"
                  placeholder="What should volunteers bring or prepare?"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Equipment Needed
                </label>
                <input
                  type="text"
                  name="equipment"
                  value={formData.equipment}
                  onChange={handleInputChange}
                  className="input input-bordered w-full focus:input-primary"
                  placeholder="e.g., Gloves, shovels, water bottles..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Transportation
                </label>
                <input
                  type="text"
                  name="transportation"
                  value={formData.transportation}
                  onChange={handleInputChange}
                  className="input input-bordered w-full focus:input-primary"
                  placeholder="e.g., Carpool available, Public transport..."
                />
              </div>
            </div>
            
            {/* Checkboxes */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="weatherDependent"
                  checked={formData.weatherDependent}
                  onChange={handleInputChange}
                  className="checkbox checkbox-primary"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Weather Dependent
                </span>
              </label>
              
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="requiresApproval"
                  checked={formData.requiresApproval}
                  onChange={handleInputChange}
                  className="checkbox checkbox-primary"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Requires Approval
                </span>
              </label>
              
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="allowWaitlist"
                  checked={formData.allowWaitlist}
                  onChange={handleInputChange}
                  className="checkbox checkbox-primary"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Allow Waitlist
                </span>
              </label>
              
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="isPublic"
                  checked={formData.isPublic}
                  onChange={handleInputChange}
                  className="checkbox checkbox-primary"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Public Event
                </span>
              </label>
              
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="refreshments"
                  checked={formData.refreshments}
                  onChange={handleInputChange}
                  className="checkbox checkbox-primary"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Refreshments Provided
                </span>
              </label>
              
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="certificate"
                  checked={formData.certificate}
                  onChange={handleInputChange}
                  className="checkbox checkbox-primary"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Certificate Provided
                </span>
              </label>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
              <FaPhone className="text-primary" />
              Contact Information
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Contact Email
                </label>
                <input
                  type="email"
                  name="contactEmail"
                  value={formData.contactEmail}
                  onChange={handleInputChange}
                  className={`input input-bordered w-full ${errors.contactEmail ? 'input-error' : 'focus:input-primary'}`}
                  placeholder="contact@example.com"
                />
                {errors.contactEmail && (
                  <p className="text-error text-sm mt-1 flex items-center gap-1">
                    <FaExclamationTriangle />
                    {errors.contactEmail}
                  </p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Contact Phone
                </label>
                <input
                  type="tel"
                  name="contactPhone"
                  value={formData.contactPhone}
                  onChange={handleInputChange}
                  className="input input-bordered w-full focus:input-primary"
                  placeholder="+880 1234 567890"
                />
              </div>
              
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Website/Registration Link
                </label>
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                  className="input input-bordered w-full focus:input-primary"
                  placeholder="https://example.com/register"
                />
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
              <FaTag className="text-primary" />
              Tags
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Add Tags
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter a tag..."
                    className="input input-bordered flex-1 focus:input-primary"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleTagAdd(e.target.value.trim());
                        e.target.value = '';
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      const input = e.target.previousElementSibling;
                      handleTagAdd(input.value.trim());
                      input.value = '';
                    }}
                    className="btn btn-primary"
                  >
                    Add
                  </button>
                </div>
              </div>
              
              {formData.tags.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Current Tags
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="badge badge-primary gap-2"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleTagRemove(tag)}
                          className="btn btn-ghost btn-xs"
                        >
                          <FaTimes />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Reminder Settings */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
              <FaBell className="text-primary" />
              Reminder Settings
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Reminder Days Before Event
                </label>
                <select
                  name="reminderDays"
                  value={formData.reminderDays}
                  onChange={handleInputChange}
                  className="select select-bordered w-full focus:select-primary"
                >
                  <option value="0">No reminder</option>
                  <option value="1">1 day before</option>
                  <option value="3">3 days before</option>
                  <option value="7">1 week before</option>
                  <option value="14">2 weeks before</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Reminder Hours Before Event
                </label>
                <select
                  name="reminderHours"
                  value={formData.reminderHours}
                  onChange={handleInputChange}
                  className="select select-bordered w-full focus:select-primary"
                >
                  <option value="0">No reminder</option>
                  <option value="1">1 hour before</option>
                  <option value="2">2 hours before</option>
                  <option value="4">4 hours before</option>
                  <option value="6">6 hours before</option>
                </select>
              </div>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={handleCancel}
              className="btn btn-outline btn-lg gap-2"
            >
              <FaTimes />
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary btn-lg gap-2"
              disabled={createEventMutation.isPending}
            >
              {createEventMutation.isPending ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Creating...
                </>
              ) : (
                <>
                  <FaCheck />
                  Create Event
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventCreation;
