import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
  FaBookmark,
  FaShareAlt,
  FaEye,
  FaStar,
  FaComments,
  FaThumbsUp,
  FaArrowRight,
  FaCalendarCheck,
  FaBell,
  FaUserPlus,
  FaUserCheck,
  FaUserCheck as FaUserCheckSolid,
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
  FaChevronRight,
  FaCheckCircle,
  FaTimes,
  FaEdit,
  FaTrash,
  FaUserTimes,
  FaCalendarTimes,
  FaCalendarPlus,
  FaUserMinus,
  FaUserClock,
  FaExclamationCircle,
  FaQuestionCircle,
  FaClipboardList,
  FaTasks,
  FaClipboardCheck,
  FaClipboard,
  FaFileAlt,
  FaFileDownload,
  FaFileExport,
  FaFileImport,
  FaFileUpload,
  FaFile,
  FaFilePdf,
  FaFileWord,
  FaFileExcel,
  FaFileImage,
  FaFileVideo,
  FaFileAudio,
  FaFileArchive,
  FaFileCode,
  FaFileContract,
  FaFileInvoice,
  FaFileMedical,
  FaFilePrescription,
  FaFileSignature
} from 'react-icons/fa';
import LoadingSpinner from '../../shared/components/LoadingSpinner';

const MyEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [viewMode, setViewMode] = useState('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [eventsPerPage] = useState(12);
  const [selectedTab, setSelectedTab] = useState('registered'); // registered, created, past, upcoming

  // Mock data - replace with actual API calls
  const mockEvents = {
    registered: [
      {
        id: 1,
        title: 'Community Beach Cleanup Drive',
        description: 'Join us for a comprehensive beach cleanup drive to protect our marine environment.',
        date: '2024-12-15',
        time: '08:00',
        endTime: '12:00',
        location: 'Cox\'s Bazar Beach',
        type: 'environment',
        status: 'upcoming',
        registrationStatus: 'confirmed',
        maxVolunteers: 100,
        currentVolunteers: 67,
        views: 1247,
        likes: 89,
        comments: 23,
        rating: 4.8,
        organizer: 'Green Earth Society',
        image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
        tags: ['Environment', 'Beach Cleanup', 'Community'],
        registeredAt: '2024-11-20T10:00:00Z',
        checkInCode: 'BEACH2024',
        reminderSent: true,
        certificateEligible: true
      },
      {
        id: 2,
        title: 'Food Distribution Program',
        description: 'Help distribute food to families in need.',
        date: '2024-12-18',
        time: '14:00',
        endTime: '18:00',
        location: 'Community Center',
        type: 'social',
        status: 'upcoming',
        registrationStatus: 'confirmed',
        maxVolunteers: 50,
        currentVolunteers: 45,
        views: 892,
        likes: 67,
        comments: 15,
        rating: 4.6,
        organizer: 'Helping Hands NGO',
        image: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
        tags: ['Social Work', 'Food Distribution', 'Community'],
        registeredAt: '2024-11-22T14:30:00Z',
        checkInCode: 'FOOD2024',
        reminderSent: false,
        certificateEligible: true
      }
    ],
    created: [
      {
        id: 3,
        title: 'Educational Workshop',
        description: 'Teach basic computer skills to underprivileged children.',
        date: '2024-12-20',
        time: '10:00',
        endTime: '16:00',
        location: 'Library Hall',
        type: 'education',
        status: 'upcoming',
        registrationStatus: 'organizer',
        maxVolunteers: 30,
        currentVolunteers: 18,
        views: 654,
        likes: 45,
        comments: 12,
        rating: 4.9,
        organizer: 'Digital Literacy Foundation',
        image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
        tags: ['Education', 'Digital Literacy', 'Children'],
        createdAt: '2024-11-15T09:00:00Z',
        checkInCode: 'EDU2024',
        reminderSent: true,
        certificateEligible: true
      }
    ],
    past: [
      {
        id: 4,
        title: 'Health Camp',
        description: 'Provide free health checkups and medical assistance.',
        date: '2024-11-10',
        time: '09:00',
        endTime: '17:00',
        location: 'City Hospital',
        type: 'health',
        status: 'completed',
        registrationStatus: 'attended',
        maxVolunteers: 25,
        currentVolunteers: 20,
        views: 456,
        likes: 32,
        comments: 8,
        rating: 4.7,
        organizer: 'Health for All Foundation',
        image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
        tags: ['Health', 'Medical', 'Community'],
        registeredAt: '2024-10-25T11:15:00Z',
        attendedAt: '2024-11-10T09:00:00Z',
        hoursVolunteered: 8,
        certificateIssued: true,
        certificateUrl: '/certificates/health-camp-2024.pdf'
      }
    ]
  };

  useEffect(() => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setEvents(mockEvents[selectedTab] || []);
      setLoading(false);
    }, 1000);
  }, [selectedTab]);

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

  const getRegistrationStatusColor = (status) => {
    const colors = {
      confirmed: 'badge-success',
      pending: 'badge-warning',
      waitlist: 'badge-info',
      cancelled: 'badge-error',
      attended: 'badge-success',
      organizer: 'badge-primary'
    };
    return colors[status] || colors.pending;
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

  const handleCancelRegistration = (eventId) => {
    if (confirm('Are you sure you want to cancel your registration for this event?')) {
      setEvents(prev => prev.filter(event => event.id !== eventId));
      alert('Registration cancelled successfully.');
    }
  };

  const handleDownloadCertificate = (event) => {
    if (event.certificateUrl) {
      // In a real app, this would download the actual certificate
      alert(`Downloading certificate for ${event.title}`);
    } else {
      alert('Certificate not available yet.');
    }
  };

  const handleCheckIn = (event) => {
    const code = prompt(`Enter check-in code for ${event.title}:`);
    if (code === event.checkInCode) {
      alert('Check-in successful! Welcome to the event.');
    } else {
      alert('Invalid check-in code. Please try again.');
    }
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.organizer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || event.type === filterType;
    const matchesStatus = filterStatus === 'all' || event.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  }).sort((a, b) => {
    let comparison = 0;
    switch (sortBy) {
      case 'date':
        comparison = new Date(a.date) - new Date(b.date);
        break;
      case 'title':
        comparison = a.title.localeCompare(b.title);
        break;
      case 'volunteers':
        comparison = a.currentVolunteers - b.currentVolunteers;
        break;
      case 'views':
        comparison = a.views - b.views;
        break;
      case 'likes':
        comparison = a.likes - b.likes;
        break;
      case 'rating':
        comparison = a.rating - b.rating;
        break;
      default:
        comparison = 0;
    }
    return sortOrder === 'desc' ? -comparison : comparison;
  });

  // Pagination
  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = filteredEvents.slice(indexOfFirstEvent, indexOfLastEvent);
  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);

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
                My Events
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Manage your volunteer events and registrations
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

          {/* Tabs */}
          <div className="mt-6">
            <div className="tabs tabs-boxed">
              <button
                onClick={() => setSelectedTab('registered')}
                className={`tab ${selectedTab === 'registered' ? 'tab-active' : ''}`}
              >
                <FaUserCheck className="mr-2" />
                Registered Events ({mockEvents.registered.length})
              </button>
              <button
                onClick={() => setSelectedTab('created')}
                className={`tab ${selectedTab === 'created' ? 'tab-active' : ''}`}
              >
                <FaCalendarPlus className="mr-2" />
                Created Events ({mockEvents.created.length})
              </button>
              <button
                onClick={() => setSelectedTab('past')}
                className={`tab ${selectedTab === 'past' ? 'tab-active' : ''}`}
              >
                <FaCalendarTimes className="mr-2" />
                Past Events ({mockEvents.past.length})
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
                placeholder="Search my events..."
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

        {/* Events Grid/List */}
        {currentEvents.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-12 max-w-md mx-auto">
              <div className="text-6xl mb-4">
                {selectedTab === 'registered' ? '📅' : 
                 selectedTab === 'created' ? '🎯' : '✅'}
              </div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                {selectedTab === 'registered' ? 'No Registered Events' :
                 selectedTab === 'created' ? 'No Created Events' : 'No Past Events'}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                {selectedTab === 'registered' ? 'You haven\'t registered for any events yet.' :
                 selectedTab === 'created' ? 'You haven\'t created any events yet.' : 'You haven\'t attended any events yet.'}
              </p>
              <Link to="/events" className="btn btn-primary">
                Browse Events
              </Link>
            </div>
          </div>
        ) : (
          <>
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentEvents.map((event) => (
                  <div key={event.id} className="group">
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
                        
                        {/* Status Badges */}
                        <div className="absolute top-3 right-3 flex flex-col gap-1">
                          <span className={`badge badge-sm ${getStatusColor(event.status)}`}>
                            {event.status}
                          </span>
                          <span className={`badge badge-sm ${getRegistrationStatusColor(event.registrationStatus)}`}>
                            {event.registrationStatus}
                          </span>
                        </div>
                        
                        {/* Special Badges */}
                        {event.certificateEligible && (
                          <div className="absolute bottom-3 left-3">
                            <span className="badge badge-success gap-1">
                              <FaCertificate />
                              Certificate
                            </span>
                          </div>
                        )}
                        
                        {event.reminderSent && (
                          <div className="absolute bottom-3 right-3">
                            <span className="badge badge-info gap-1">
                              <FaBell />
                              Reminder Sent
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Event Content */}
                      <div className="p-6">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold">
                            {event.organizer.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-800 dark:text-white">
                              {event.organizer}
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
                            <span>{event.currentVolunteers}/{event.maxVolunteers} volunteers</span>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="mb-4">
                          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                            <span>Volunteers</span>
                            <span>{Math.round((event.currentVolunteers / event.maxVolunteers) * 100)}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-primary h-2 rounded-full transition-all duration-300" 
                              style={{ width: `${(event.currentVolunteers / event.maxVolunteers) * 100}%` }}
                            ></div>
                          </div>
                        </div>

                        {/* Event Stats */}
                        <div className="flex items-center justify-between mb-4 text-sm text-gray-500 dark:text-gray-400">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1">
                              <FaEye />
                              <span>{event.views}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <FaHeart />
                              <span>{event.likes}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <FaComments />
                              <span>{event.comments}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <FaStar className="text-yellow-400" />
                              <span>{event.rating}</span>
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
                            {selectedTab === 'registered' && event.status === 'upcoming' && (
                              <button
                                onClick={() => handleCheckIn(event)}
                                className="btn btn-ghost btn-xs"
                                title="Check In"
                              >
                                <FaUserCheckSolid />
                              </button>
                            )}
                            
                            {event.certificateEligible && (
                              <button
                                onClick={() => handleDownloadCertificate(event)}
                                className="btn btn-ghost btn-xs"
                                title="Download Certificate"
                              >
                                <FaFileDownload />
                              </button>
                            )}
                            
                            {selectedTab === 'registered' && event.status === 'upcoming' && (
                              <button
                                onClick={() => handleCancelRegistration(event.id)}
                                className="btn btn-ghost btn-xs text-error"
                                title="Cancel Registration"
                              >
                                <FaUserTimes />
                              </button>
                            )}
                          </div>
                          
                          <Link
                            to={`/events/${event.id}`}
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
                  <div key={event.id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
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
                                <span className={`badge ${getRegistrationStatusColor(event.registrationStatus)}`}>
                                  {event.registrationStatus}
                                </span>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              {selectedTab === 'registered' && event.status === 'upcoming' && (
                                <button
                                  onClick={() => handleCheckIn(event)}
                                  className="btn btn-primary btn-sm gap-2"
                                >
                                  <FaUserCheckSolid />
                                  Check In
                                </button>
                              )}
                              
                              {event.certificateEligible && (
                                <button
                                  onClick={() => handleDownloadCertificate(event)}
                                  className="btn btn-outline btn-sm gap-2"
                                >
                                  <FaFileDownload />
                                  Certificate
                                </button>
                              )}
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
                              <span>{event.currentVolunteers}/{event.maxVolunteers}</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                              <div className="flex items-center gap-1">
                                <FaEye />
                                <span>{event.views}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <FaHeart />
                                <span>{event.likes}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <FaComments />
                                <span>{event.comments}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <FaStar className="text-yellow-400" />
                                <span>{event.rating}</span>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              {selectedTab === 'registered' && event.status === 'upcoming' && (
                                <button
                                  onClick={() => handleCancelRegistration(event.id)}
                                  className="btn btn-error btn-sm gap-2"
                                >
                                  <FaUserTimes />
                                  Cancel
                                </button>
                              )}
                              
                              <Link
                                to={`/events/${event.id}`}
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

export default MyEvents;
