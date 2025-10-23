import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useEventQueries } from './useEventQueries';
import useAuth from '../../shared/hooks/useAuth';
import { 
  FaCalendarAlt, 
  FaClock, 
  FaMapMarkerAlt, 
  FaUsers, 
  FaTag,
  FaShareAlt,
  FaHeart,
  FaRegHeart,
  FaBookmark,
  FaBookmark as FaBookmarkOutline,
  FaPhone,
  FaEnvelope,
  FaGlobe,
  FaQrcode,
  FaCheckCircle,
  FaExclamationTriangle,
  FaInfoCircle,
  FaArrowLeft,
  FaEdit,
  FaTrash,
  FaUserCheck,
  FaUserPlus,
  FaDownload,
  FaPrint,
  FaWhatsapp,
  FaFacebookF,
  FaTwitter,
  FaLinkedin,
  FaCopy,
  FaSun,
  FaUmbrella,
  FaCar,
  FaBus,
  FaSubway,
  FaWalking,
  FaCertificate,
  FaGift,
  FaCoffee,
  FaUtensils,
  FaShieldAlt,
  FaAward,
  FaStar,
  FaComments,
  FaThumbsUp,
  FaRegThumbsUp,
  FaEye,
  FaCalendarCheck,
  FaBell,
  FaMapPin,
  FaDirections
} from 'react-icons/fa';
import LoadingSpinner from '../../shared/components/LoadingSpinner';

const EventDetails = () => {
  const { id } = useParams();
  const { useEvent, useJoinEvent, useCheckInEvent } = useEventQueries();
  const { user } = useAuth();
  
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isRegistered] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [checkInCode, setCheckInCode] = useState('');
  const [showCheckIn, setShowCheckIn] = useState(false);

  // Use the useEventQueries hook for data fetching
  const { data: event, isLoading: loading, error } = useEvent(id);
  const joinEventMutation = useJoinEvent();
  const checkInMutation = useCheckInEvent();

  // Mock event data - replace with actual API call
  // Handle join event
  const handleJoinEvent = () => {
    if (user) {
      joinEventMutation.mutate(id);
    } else {
      alert('Please login to join this event');
    }
  };

  // Handle check-in
  const handleCheckIn = () => {
    if (checkInCode) {
      checkInMutation.mutate({ eventId: id, checkInCode });
    } else {
      alert('Please enter a check-in code');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown date';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return '';
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const getEventTypeColor = (type) => {
    const colors = {
      environment: 'bg-green-100 text-green-800 border-green-200',
      social: 'bg-blue-100 text-blue-800 border-blue-200',
      education: 'bg-purple-100 text-purple-800 border-purple-200',
      health: 'bg-red-100 text-red-800 border-red-200',
      disaster: 'bg-orange-100 text-orange-800 border-orange-200',
      cultural: 'bg-pink-100 text-pink-800 border-pink-200',
      sports: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      general: 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return colors[type] || colors.general;
  };

  const getEventTypeIcon = (type) => {
    const icons = {
      environment: '🌱',
      social: '🤝',
      education: '📚',
      health: '🏥',
      disaster: '🚨',
      cultural: '🎭',
      sports: '⚽',
      general: '⭐'
    };
    return icons[type] || icons.general;
  };

  const getWeatherIcon = (condition) => {
    const icons = {
      sunny: <FaSun className="text-yellow-500" />,
      cloudy: <FaUmbrella className="text-gray-500" />,
      rainy: <FaUmbrella className="text-blue-500" />
    };
    return icons[condition] || icons.sunny;
  };

  const getTransportationIcon = (transport) => {
    if (transport.toLowerCase().includes('car')) return <FaCar className="text-blue-500" />;
    if (transport.toLowerCase().includes('bus')) return <FaBus className="text-green-500" />;
    if (transport.toLowerCase().includes('metro') || transport.toLowerCase().includes('subway')) return <FaSubway className="text-purple-500" />;
    return <FaWalking className="text-orange-500" />;
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  const handleRegister = () => {
    handleJoinEvent();
  };

  const handleShare = (platform) => {
    const url = window.location.href;
    const title = event.title;
    const text = `Check out this volunteer event: ${title}`;
    
    let shareUrl = '';
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        break;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`;
        break;
      default:
        return;
    }
    
    window.open(shareUrl, '_blank', 'width=600,height=400');
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('Event link copied to clipboard!');
  };

  const generateQRCode = () => {
    setShowQRCode(true);
    // In a real app, you would generate an actual QR code
    setTimeout(() => setShowQRCode(false), 3000);
  };

  // Check-in functionality is now handled by the useEventQueries hook

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-12 max-w-md mx-auto text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
            Event Not Found
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            {error.message || 'The event you are looking for does not exist or has been removed.'}
          </p>
          <Link to="/events" className="btn btn-primary">
            Back to Events
          </Link>
        </div>
      </div>
    );
  }

  if (!event) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link 
            to="/events" 
            className="inline-flex items-center text-primary hover:text-primary-dark dark:text-primary dark:hover:text-primary-light transition-colors group"
          >
            <FaArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Back to Events</span>
          </Link>
        </div>

        {/* Event Header */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden mb-8">
          {/* Event Image */}
          <div className="relative">
            <img 
              src={event.image}
              alt={event.title}
              className="w-full h-64 md:h-96 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
            
            {/* Event Type Badge */}
            <div className="absolute top-6 left-6">
              <span className={`badge badge-lg gap-2 ${getEventTypeColor(event.type)}`}>
                {getEventTypeIcon(event.type)}
                {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
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
                onClick={handleBookmark}
                className={`btn btn-circle btn-sm ${isBookmarked ? 'btn-secondary' : 'btn-outline btn-primary text-white border-white hover:bg-white hover:text-primary'}`}
              >
                {isBookmarked ? <FaBookmark className="text-white" /> : <FaBookmarkOutline />}
              </button>
              <div className="relative">
                <button 
                  onClick={() => setShowShareMenu(!showShareMenu)}
                  className="btn btn-circle btn-sm btn-outline btn-primary text-white border-white hover:bg-white hover:text-primary"
                >
                  <FaShareAlt />
                </button>
                {showShareMenu && (
                  <div className="absolute right-0 bottom-full mb-3 bg-white dark:bg-gray-700 rounded-xl shadow-2xl p-4 w-56 z-10">
                    <p className="text-sm font-medium mb-3 text-gray-800 dark:text-white">Share this event:</p>
                    <div className="flex justify-center gap-3 mb-3">
                      <button 
                        onClick={() => handleShare('facebook')}
                        className="btn btn-circle btn-sm bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        <FaFacebookF />
                      </button>
                      <button 
                        onClick={() => handleShare('twitter')}
                        className="btn btn-circle btn-sm bg-blue-400 hover:bg-blue-500 text-white"
                      >
                        <FaTwitter />
                      </button>
                      <button 
                        onClick={() => handleShare('linkedin')}
                        className="btn btn-circle btn-sm bg-blue-700 hover:bg-blue-800 text-white"
                      >
                        <FaLinkedin />
                      </button>
                      <button 
                        onClick={() => handleShare('whatsapp')}
                        className="btn btn-circle btn-sm bg-green-500 hover:bg-green-600 text-white"
                      >
                        <FaWhatsapp />
                      </button>
                    </div>
                    <button 
                      onClick={copyToClipboard}
                      className="btn btn-outline btn-sm w-full gap-2"
                    >
                      <FaCopy />
                      Copy Link
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Header Content */}
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
                {event.title}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-white/90">
                <div className="flex items-center gap-2">
                  <FaCalendarAlt className="text-primary-light" />
                  <span className="font-medium">{formatDate(event.date)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaClock className="text-primary-light" />
                  <span className="font-medium">{formatTime(event.time)} - {formatTime(event.endTime)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaMapMarkerAlt className="text-primary-light" />
                  <span className="font-medium">{event.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaUsers className="text-primary-light" />
                  <span className="font-medium">{event.currentVolunteers}/{event.maxVolunteers} volunteers</span>
                </div>
              </div>
            </div>
          </div>

          {/* Event Stats */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-2">
                  <FaEye />
                  <span>{event.views} views</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaHeart />
                  <span>{event.likes} likes</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaComments />
                  <span>{event.comments} comments</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaStar className="text-yellow-400" />
                  <span>{event.rating}/5 rating</span>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <span className={`badge ${getEventTypeColor(event.type)}`}>
                  {event.category}
                </span>
                <span className="badge badge-outline">
                  {event.skillLevel} level
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Event Description */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
                About This Event
              </h2>
              <div className="prose prose-lg max-w-none dark:prose-invert">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {event.description}
                </p>
              </div>
            </div>

            {/* Event Details */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
                Event Details
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <FaCalendarAlt className="text-primary mt-1" />
                    <div>
                      <h3 className="font-semibold text-gray-800 dark:text-white">Date & Time</h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        {formatDate(event.date)}<br />
                        {formatTime(event.time)} - {formatTime(event.endTime)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <FaMapMarkerAlt className="text-primary mt-1" />
                    <div>
                      <h3 className="font-semibold text-gray-800 dark:text-white">Location</h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        {event.location}<br />
                        {event.address}
                      </p>
                      <button className="btn btn-outline btn-xs mt-2 gap-1">
                        <FaDirections />
                        Get Directions
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <FaUsers className="text-primary mt-1" />
                    <div>
                      <h3 className="font-semibold text-gray-800 dark:text-white">Volunteers</h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        {event.currentVolunteers} of {event.maxVolunteers} spots filled
                      </p>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                        <div 
                          className="bg-primary h-2 rounded-full" 
                          style={{ width: `${(event.currentVolunteers / event.maxVolunteers) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <FaShieldAlt className="text-primary mt-1" />
                    <div>
                      <h3 className="font-semibold text-gray-800 dark:text-white">Requirements</h3>
                      <p className="text-gray-600 dark:text-gray-300">{event.requirements}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <FaAward className="text-primary mt-1" />
                    <div>
                      <h3 className="font-semibold text-gray-800 dark:text-white">Skill Level</h3>
                      <p className="text-gray-600 dark:text-gray-300 capitalize">{event.skillLevel} friendly</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <FaInfoCircle className="text-primary mt-1" />
                    <div>
                      <h3 className="font-semibold text-gray-800 dark:text-white">Age Restriction</h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        {event.ageRestriction === 'all' ? 'All ages welcome' : 
                         event.ageRestriction === '18+' ? '18 years and above' : 
                         '21 years and above'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* What's Included */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
                What's Included
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {event.equipment && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <FaShieldAlt className="text-primary" />
                    <div>
                      <h3 className="font-semibold text-gray-800 dark:text-white">Equipment</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{event.equipment}</p>
                    </div>
                  </div>
                )}
                
                {event.transportation && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    {getTransportationIcon(event.transportation)}
                    <div>
                      <h3 className="font-semibold text-gray-800 dark:text-white">Transportation</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{event.transportation}</p>
                    </div>
                  </div>
                )}
                
                {event.refreshments && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <FaCoffee className="text-primary" />
                    <div>
                      <h3 className="font-semibold text-gray-800 dark:text-white">Refreshments</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Food and drinks provided</p>
                    </div>
                  </div>
                )}
                
                {event.certificate && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <FaCertificate className="text-primary" />
                    <div>
                      <h3 className="font-semibold text-gray-800 dark:text-white">Certificate</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Volunteer certificate provided</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Tags */}
            {event.tags && event.tags.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
                  Tags
                </h2>
                <div className="flex flex-wrap gap-2">
                  {event.tags.map((tag, index) => (
                    <span key={index} className="badge badge-outline badge-primary">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Registration Card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
                Join This Event
              </h3>
              
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">
                    {event.currentVolunteers}/{event.maxVolunteers}
                  </div>
                  <p className="text-gray-600 dark:text-gray-300">Volunteers Registered</p>
                </div>
                
                <button
                  onClick={handleRegister}
                  className={`btn w-full gap-2 ${
                    isRegistered 
                      ? 'btn-error' 
                      : event.currentVolunteers >= event.maxVolunteers 
                        ? 'btn-disabled' 
                        : 'btn-primary'
                  }`}
                  disabled={event.currentVolunteers >= event.maxVolunteers && !isRegistered}
                >
                  {isRegistered ? (
                    <>
                      <FaUserCheck />
                      Cancel Registration
                    </>
                  ) : event.currentVolunteers >= event.maxVolunteers ? (
                    <>
                      <FaExclamationTriangle />
                      Event Full
                    </>
                  ) : (
                    <>
                      <FaUserPlus />
                      Register Now
                    </>
                  )}
                </button>
                
                {event.allowWaitlist && event.currentVolunteers >= event.maxVolunteers && (
                  <button className="btn btn-outline w-full gap-2">
                    <FaBell />
                    Join Waitlist
                  </button>
                )}
              </div>
            </div>

            {/* Weather Card */}
            {event.weatherDependent && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                  {getWeatherIcon(event.weather.condition)}
                  Weather Forecast
                </h3>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-300">Condition</span>
                    <span className="font-semibold capitalize">{event.weather.condition}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-300">Temperature</span>
                    <span className="font-semibold">{event.weather.temperature}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-300">Humidity</span>
                    <span className="font-semibold">{event.weather.humidity}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-300">Wind</span>
                    <span className="font-semibold">{event.weather.windSpeed}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Contact Information */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
                Contact Information
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <FaEnvelope className="text-primary" />
                  <div>
                    <p className="font-semibold text-gray-800 dark:text-white">Email</p>
                    <a 
                      href={`mailto:${event.contactEmail}`}
                      className="text-primary hover:underline"
                    >
                      {event.contactEmail}
                    </a>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <FaPhone className="text-primary" />
                  <div>
                    <p className="font-semibold text-gray-800 dark:text-white">Phone</p>
                    <a 
                      href={`tel:${event.contactPhone}`}
                      className="text-primary hover:underline"
                    >
                      {event.contactPhone}
                    </a>
                  </div>
                </div>
                
                {event.website && (
                  <div className="flex items-center gap-3">
                    <FaGlobe className="text-primary" />
                    <div>
                      <p className="font-semibold text-gray-800 dark:text-white">Website</p>
                      <a 
                        href={event.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        Visit Website
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Organizer */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
                Organized By
              </h3>
              
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold">
                  {event.organizer.charAt(0)}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 dark:text-white">
                    {event.organizer}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Event Organizer
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
                Quick Actions
              </h3>
              
              <div className="space-y-2">
                <button 
                  onClick={generateQRCode}
                  className="btn btn-outline w-full gap-2"
                >
                  <FaQrcode />
                  Generate QR Code
                </button>
                
                <button 
                  onClick={() => setShowCheckIn(true)}
                  className="btn btn-outline w-full gap-2"
                >
                  <FaCheckCircle />
                  Check In
                </button>
                
                <button className="btn btn-outline w-full gap-2">
                  <FaDownload />
                  Download Details
                </button>
                
                <button className="btn btn-outline w-full gap-2">
                  <FaPrint />
                  Print Event
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Check-in Modal */}
        {showCheckIn && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md mx-4">
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
                Event Check-in
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Enter the check-in code provided by the event organizer:
              </p>
              <input
                type="text"
                value={checkInCode}
                onChange={(e) => setCheckInCode(e.target.value)}
                placeholder="Enter check-in code..."
                className="input input-bordered w-full mb-4"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleCheckIn}
                  className="btn btn-primary flex-1"
                >
                  Check In
                </button>
                <button
                  onClick={() => setShowCheckIn(false)}
                  className="btn btn-outline"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* QR Code Modal */}
        {showQRCode && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md mx-4 text-center">
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
                Event QR Code
              </h3>
              <div className="w-48 h-48 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center mx-auto mb-4">
                <FaQrcode className="text-6xl text-gray-400" />
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Scan this QR code to quickly access event details
              </p>
              <button
                onClick={() => setShowQRCode(false)}
                className="btn btn-primary"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventDetails;
