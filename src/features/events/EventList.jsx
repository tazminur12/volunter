import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useEventQueries } from './useEventQueries';
import { 
  FaCalendarAlt, 
  FaClock, 
  FaMapMarkerAlt, 
  FaUsers, 
  FaTag,
  FaSearch,
  FaFilter,
  FaSort,
  FaHeart,
  FaRegHeart,
  FaBookmark,
  FaBookmark as FaBookmarkOutline,
  FaShareAlt,
  FaEye,
  FaStar,
  FaComments,
  FaThumbsUp,
  FaRegThumbsUp,
  FaArrowRight,
  FaCalendarCheck,
  FaBell,
  FaUserPlus,
  FaUserCheck,
  FaExclamationTriangle,
  FaInfoCircle,
  FaSun,
  FaUmbrella,
  FaCar,
  FaBus,
  FaSubway,
  FaWalking,
  FaShieldAlt,
  FaAward,
  FaCertificate,
  FaCoffee,
  FaUtensils,
  FaGift,
  FaTrophy,
  FaMedal,
  FaMapPin,
  FaDirections,
  FaPhone,
  FaEnvelope,
  FaGlobe,
  FaQrcode,
  FaDownload,
  FaPrint,
  FaCopy,
  FaWhatsapp,
  FaFacebookF,
  FaTwitter,
  FaLinkedin,
  FaSyncAlt,
  FaChevronLeft,
  FaChevronRight
} from 'react-icons/fa';
import LoadingSpinner from '../../shared/components/LoadingSpinner';

const EventList = () => {
  const { useEvents } = useEventQueries();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('asc');
  const [viewMode, setViewMode] = useState('grid'); // grid, list
  const [likedEvents, setLikedEvents] = useState(new Set());
  const [bookmarkedEvents, setBookmarkedEvents] = useState(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [eventsPerPage] = useState(12);

  // Use the useEventQueries hook for data fetching
  const filters = {
    page: currentPage,
    limit: eventsPerPage,
    search: searchTerm,
    category: filterType,
    status: filterStatus,
    sortBy,
    sortOrder
  };
  
  const { data: eventsData, isLoading: loading, error } = useEvents(filters);
  
  const events = eventsData?.events || [];
  const totalPages = eventsData?.totalPages || 1;


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

  const getStatusColor = (status) => {
    const colors = {
      upcoming: 'badge-warning',
      ongoing: 'badge-info',
      completed: 'badge-success',
      cancelled: 'badge-error',
      draft: 'badge-neutral'
    };
    return colors[status] || colors.draft;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown date';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      weekday: 'short'
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

  const handleLike = (eventId) => {
    setLikedEvents(prev => {
      const newSet = new Set(prev);
      if (newSet.has(eventId)) {
        newSet.delete(eventId);
      } else {
        newSet.add(eventId);
      }
      return newSet;
    });
  };

  const handleBookmark = (eventId) => {
    setBookmarkedEvents(prev => {
      const newSet = new Set(prev);
      if (newSet.has(eventId)) {
        newSet.delete(eventId);
      } else {
        newSet.add(eventId);
      }
      return newSet;
    });
  };

  const handleShare = (event, platform) => {
    const url = `${window.location.origin}/events/${event._id}`;
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
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        break;
      default:
        return;
    }
    
    window.open(shareUrl, '_blank', 'width=600,height=400');
  };

  const copyToClipboard = (event) => {
    const url = `${window.location.origin}/events/${event._id}`;
    navigator.clipboard.writeText(url);
    alert('Event link copied to clipboard!');
  };

  // Use events from API (filtering is handled by the API)
  const currentEvents = events;

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2 flex items-center gap-3">
                <FaCalendarAlt className="text-primary" />
                Volunteer Events
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Discover meaningful volunteer opportunities in your community
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <Link to="/events/create" className="btn btn-primary gap-2">
                <FaCalendarCheck />
                Create Event
              </Link>
              <button className="btn btn-outline gap-2">
                <FaDownload />
                Export Data
              </button>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Search */}
            <div className="relative flex-1">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search events..."
                className="input input-bordered w-full pl-10 focus:input-primary"
              />
            </div>
            
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative">
                <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="select select-bordered pl-10 focus:select-primary"
                >
                  <option value="all">All Types</option>
                  <option value="environment">Environment</option>
                  <option value="social">Social Work</option>
                  <option value="education">Education</option>
                  <option value="health">Health</option>
                  <option value="disaster">Disaster Relief</option>
                  <option value="cultural">Cultural</option>
                  <option value="sports">Sports</option>
                </select>
              </div>
              
              <div className="relative">
                <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="select select-bordered pl-10 focus:select-primary"
                >
                  <option value="all">All Status</option>
                  <option value="upcoming">Upcoming</option>
                  <option value="ongoing">Ongoing</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              
              <div className="relative">
                <FaSort className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="select select-bordered pl-10 focus:select-primary"
                >
                  <option value="date">Sort by Date</option>
                  <option value="title">Sort by Title</option>
                  <option value="volunteers">Sort by Volunteers</option>
                  <option value="views">Sort by Views</option>
                  <option value="likes">Sort by Likes</option>
                  <option value="rating">Sort by Rating</option>
                </select>
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  className="btn btn-outline gap-2"
                >
                  <FaSort />
                  {sortOrder === 'asc' ? 'Asc' : 'Desc'}
                </button>
                
                <div className="flex gap-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`btn btn-sm ${viewMode === 'grid' ? 'btn-primary' : 'btn-outline'}`}
                  >
                    Grid
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`btn btn-sm ${viewMode === 'list' ? 'btn-primary' : 'btn-outline'}`}
                  >
                    List
                  </button>
                </div>
                
                <button
                  onClick={() => window.location.reload()}
                  className="btn btn-outline gap-2"
                >
                  <FaSyncAlt />
                  Refresh
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="text-center py-16">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-12 max-w-md mx-auto">
              <div className="text-6xl mb-4">⚠️</div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                Error Loading Events
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                {error.message || 'Failed to load events. Please try again.'}
              </p>
              <button
                onClick={() => window.location.reload()}
                className="btn btn-primary"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {/* Events Grid/List */}
        {!error && currentEvents.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-12 max-w-md mx-auto">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                No Events Found
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Try adjusting your search criteria or browse all categories
              </p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setFilterType('all');
                  setFilterStatus('all');
                }}
                className="btn btn-primary"
              >
                View All Events
              </button>
            </div>
          </div>
        ) : (
          <>
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentEvents.map((event) => (
                  <div key={event._id} className="group">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:-translate-y-2">
                      {/* Event Image */}
                      <div className="relative overflow-hidden">
                        <img
                          src={event.image}
                          alt={event.title}
                          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                        
                        {/* Event Type Badge */}
                        <div className="absolute top-3 left-3">
                          <span className={`badge gap-2 ${getEventTypeColor(event.type)}`}>
                            {getEventTypeIcon(event.type)} {event.type}
                          </span>
                        </div>
                        
                        {/* Status Badge */}
                        <div className="absolute top-3 right-3">
                          <span className={`badge badge-sm ${getStatusColor(event.status)}`}>
                            {event.status}
                          </span>
                        </div>
                        
                        {/* Action Buttons */}
                        <div className="absolute bottom-3 right-3 flex gap-2">
                          <button
                            onClick={() => handleLike(event._id)}
                            className={`btn btn-circle btn-sm ${likedEvents.has(event._id) ? 'btn-primary' : 'btn-outline btn-primary text-white border-white hover:bg-white hover:text-primary'}`}
                          >
                            {likedEvents.has(event._id) ? <FaHeart className="text-white" /> : <FaRegHeart />}
                          </button>
                          <button
                            onClick={() => handleBookmark(event._id)}
                            className={`btn btn-circle btn-sm ${bookmarkedEvents.has(event._id) ? 'btn-secondary' : 'btn-outline btn-primary text-white border-white hover:bg-white hover:text-primary'}`}
                          >
                            {bookmarkedEvents.has(event._id) ? <FaBookmark className="text-white" /> : <FaBookmarkOutline />}
                          </button>
                        </div>
                      </div>

                      {/* Event Content */}
                      <div className="p-6">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold">
                            {event.organizer?.charAt(0) || 'O'}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-800 dark:text-white">
                              {event.organizer || 'Organizer'}
                            </p>
                            <p className="text-xs text-gray-600 dark:text-gray-300">
                              {formatDate(event.date)}
                            </p>
                          </div>
                        </div>

                        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2 group-hover:text-primary transition-colors line-clamp-2">
                          {event.title}
                        </h3>
                        
                        <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                          {event.description}
                        </p>

                        {/* Event Details */}
                        <div className="space-y-2 mb-4">
                          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <FaClock />
                            <span>{formatTime(event.time)} - {formatTime(event.endTime)}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <FaMapMarkerAlt />
                            <span className="line-clamp-1">{event.location}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <FaUsers />
                            <span>{event.currentVolunteers || 0}/{event.maxVolunteers || 0} volunteers</span>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="mb-4">
                          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                            <span>Volunteers</span>
                            <span>{Math.round(((event.currentVolunteers || 0) / (event.maxVolunteers || 1)) * 100)}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-primary h-2 rounded-full transition-all duration-300" 
                              style={{ width: `${((event.currentVolunteers || 0) / (event.maxVolunteers || 1)) * 100}%` }}
                            ></div>
                          </div>
                        </div>

                        {/* Event Stats */}
                        <div className="flex items-center justify-between mb-4 text-sm text-gray-500 dark:text-gray-400">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1">
                              <FaEye />
                              <span>{event.views || 0}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <FaHeart />
                              <span>{event.likes || 0}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <FaComments />
                              <span>{event.comments || 0}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <FaStar className="text-yellow-400" />
                              <span>{event.rating || 0}</span>
                            </div>
                          </div>
                        </div>

                        {/* Tags */}
                        {event.tags && event.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-4">
                            {event.tags.slice(0, 3).map((tag, index) => (
                              <span key={index} className="badge badge-outline badge-xs">
                                {tag}
                              </span>
                            ))}
                            {event.tags.length > 3 && (
                              <span className="badge badge-outline badge-xs">
                                +{event.tags.length - 3}
                              </span>
                            )}
                          </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleShare(event, 'facebook')}
                              className="btn btn-ghost btn-xs"
                              title="Share on Facebook"
                            >
                              <FaFacebookF />
                            </button>
                            <button
                              onClick={() => handleShare(event, 'twitter')}
                              className="btn btn-ghost btn-xs"
                              title="Share on Twitter"
                            >
                              <FaTwitter />
                            </button>
                            <button
                              onClick={() => handleShare(event, 'whatsapp')}
                              className="btn btn-ghost btn-xs"
                              title="Share on WhatsApp"
                            >
                              <FaWhatsapp />
                            </button>
                            <button
                              onClick={() => copyToClipboard(event)}
                              className="btn btn-ghost btn-xs"
                              title="Copy Link"
                            >
                              <FaCopy />
                            </button>
                          </div>
                          
                          <Link
                            to={`/events/${event._id}`}
                            className="btn btn-primary btn-sm gap-2"
                          >
                            View Details
                            <FaArrowRight />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {currentEvents.map((event) => (
                  <div key={event._id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
                    <div className="p-6">
                      <div className="flex items-start gap-4">
                        {/* Event Image */}
                        <img
                          src={event.image}
                          alt={event.title}
                          className="w-24 h-24 rounded-lg object-cover"
                        />
                        
                        {/* Event Info */}
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-1">
                                {event.title}
                              </h3>
                              <div className="flex items-center gap-2 mb-2">
                                <span className={`badge ${getEventTypeColor(event.type)}`}>
                                  {getEventTypeIcon(event.type)} {event.type}
                                </span>
                                <span className={`badge ${getStatusColor(event.status)}`}>
                                  {event.status}
                                </span>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleLike(event._id)}
                                className={`btn btn-circle btn-sm ${likedEvents.has(event._id) ? 'btn-primary' : 'btn-outline'}`}
                              >
                                {likedEvents.has(event._id) ? <FaHeart /> : <FaRegHeart />}
                              </button>
                              <button
                                onClick={() => handleBookmark(event._id)}
                                className={`btn btn-circle btn-sm ${bookmarkedEvents.has(event._id) ? 'btn-secondary' : 'btn-outline'}`}
                              >
                                {bookmarkedEvents.has(event._id) ? <FaBookmark /> : <FaBookmarkOutline />}
                              </button>
                            </div>
                          </div>
                          
                          <p className="text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
                            {event.description}
                          </p>
                          
                          <div className="flex items-center gap-6 text-sm text-gray-600 dark:text-gray-400 mb-3">
                            <div className="flex items-center gap-1">
                              <FaCalendarAlt />
                              <span>{formatDate(event.date)}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <FaClock />
                              <span>{formatTime(event.time)} - {formatTime(event.endTime)}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <FaMapMarkerAlt />
                              <span>{event.location}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <FaUsers />
                              <span>{event.currentVolunteers || 0}/{event.maxVolunteers || 0}</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                              <div className="flex items-center gap-1">
                                <FaEye />
                                <span>{event.views || 0}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <FaHeart />
                                <span>{event.likes || 0}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <FaComments />
                                <span>{event.comments || 0}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <FaStar className="text-yellow-400" />
                                <span>{event.rating || 0}</span>
                              </div>
                            </div>
                            
                            <Link
                              to={`/events/${event._id}`}
                              className="btn btn-primary btn-sm gap-2"
                            >
                              View Details
                              <FaArrowRight />
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-8">
            <div className="join">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className="join-item btn btn-outline"
              >
                <FaChevronLeft />
                Previous
              </button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => paginate(page)}
                  className={`join-item btn ${currentPage === page ? 'btn-primary' : 'btn-outline'}`}
                >
                  {page}
                </button>
              ))}
              
              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="join-item btn btn-outline"
              >
                Next
                <FaChevronRight />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventList;