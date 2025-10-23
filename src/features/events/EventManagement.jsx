import React, { useState, useEffect } from 'react';
import { 
  FaCalendarAlt, 
  FaClock, 
  FaMapMarkerAlt, 
  FaUsers, 
  FaTag,
  FaEdit,
  FaTrash,
  FaEye,
  FaPlus,
  FaFilter,
  FaSearch,
  FaChartBar,
  FaDownload,
  FaPrint,
  FaQrcode,
  FaCheckCircle,
  FaExclamationTriangle,
  FaInfoCircle,
  FaUserCheck,
  FaUserTimes,
  FaEnvelope,
  FaPhone,
  FaGlobe,
  FaCalendarCheck,
  FaBell,
  FaShareAlt,
  FaCopy,
  FaWhatsapp,
  FaFacebookF,
  FaTwitter,
  FaLinkedin,
  FaThumbsUp,
  FaComments,
  FaStar,
  FaEye as FaViews,
  FaRegHeart,
  FaHeart,
  FaBookmark,
  FaBookmark as FaBookmarkOutline,
  FaArrowUp,
  FaArrowDown,
  FaSort,
  FaFilter as FaFilterIcon,
  FaSyncAlt,
  FaCog,
  FaUserCog,
  FaClipboardList,
  FaTasks,
  FaAward,
  FaTrophy,
  FaMedal,
  FaCertificate,
  FaGift,
  FaCoffee,
  FaUtensils,
  FaShieldAlt,
  FaSun,
  FaUmbrella,
  FaCar,
  FaBus,
  FaSubway,
  FaWalking,
  FaMapPin,
  FaDirections
} from 'react-icons/fa';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../../shared/components/LoadingSpinner';

const EventManagement = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [selectedEvents, setSelectedEvents] = useState([]);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [stats, setStats] = useState({
    totalEvents: 0,
    upcomingEvents: 0,
    completedEvents: 0,
    totalVolunteers: 0,
    totalViews: 0,
    totalLikes: 0
  });

  // Mock data - replace with actual API calls
  const mockEvents = [
    {
      id: 1,
      title: 'Community Beach Cleanup Drive',
      date: '2024-12-15',
      time: '08:00',
      endTime: '12:00',
      location: 'Cox\'s Bazar Beach',
      type: 'environment',
      status: 'upcoming',
      maxVolunteers: 100,
      currentVolunteers: 67,
      views: 1247,
      likes: 89,
      comments: 23,
      rating: 4.8,
      createdAt: '2024-11-20T10:00:00Z',
      image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80'
    },
    {
      id: 2,
      title: 'Food Distribution Program',
      date: '2024-12-18',
      time: '14:00',
      endTime: '18:00',
      location: 'Community Center',
      type: 'social',
      status: 'upcoming',
      maxVolunteers: 50,
      currentVolunteers: 45,
      views: 892,
      likes: 67,
      comments: 15,
      rating: 4.6,
      createdAt: '2024-11-22T14:30:00Z',
      image: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80'
    },
    {
      id: 3,
      title: 'Educational Workshop',
      date: '2024-11-25',
      time: '10:00',
      endTime: '16:00',
      location: 'Library Hall',
      type: 'education',
      status: 'completed',
      maxVolunteers: 30,
      currentVolunteers: 28,
      views: 654,
      likes: 45,
      comments: 12,
      rating: 4.9,
      createdAt: '2024-11-15T09:00:00Z',
      image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80'
    },
    {
      id: 4,
      title: 'Health Camp',
      date: '2024-12-20',
      time: '09:00',
      endTime: '17:00',
      location: 'City Hospital',
      type: 'health',
      status: 'upcoming',
      maxVolunteers: 25,
      currentVolunteers: 18,
      views: 456,
      likes: 32,
      comments: 8,
      rating: 4.7,
      createdAt: '2024-11-25T11:15:00Z',
      image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80'
    }
  ];

  useEffect(() => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setEvents(mockEvents);
      calculateStats(mockEvents);
      setLoading(false);
    }, 1000);
  }, []);

  const calculateStats = (eventsData) => {
    const newStats = {
      totalEvents: eventsData.length,
      upcomingEvents: eventsData.filter(e => e.status === 'upcoming').length,
      completedEvents: eventsData.filter(e => e.status === 'completed').length,
      totalVolunteers: eventsData.reduce((sum, e) => sum + e.currentVolunteers, 0),
      totalViews: eventsData.reduce((sum, e) => sum + e.views, 0),
      totalLikes: eventsData.reduce((sum, e) => sum + e.likes, 0)
    };
    setStats(newStats);
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
      day: 'numeric'
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

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || event.status === filterStatus;
    return matchesSearch && matchesFilter;
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
      default:
        comparison = 0;
    }
    return sortOrder === 'desc' ? -comparison : comparison;
  });

  const handleSelectEvent = (eventId) => {
    setSelectedEvents(prev => 
      prev.includes(eventId) 
        ? prev.filter(id => id !== eventId)
        : [...prev, eventId]
    );
  };

  const handleSelectAll = () => {
    if (selectedEvents.length === filteredEvents.length) {
      setSelectedEvents([]);
    } else {
      setSelectedEvents(filteredEvents.map(event => event.id));
    }
  };

  const handleBulkAction = (action) => {
    if (selectedEvents.length === 0) return;
    
    switch (action) {
      case 'delete':
        if (confirm(`Are you sure you want to delete ${selectedEvents.length} events?`)) {
          setEvents(prev => prev.filter(event => !selectedEvents.includes(event.id)));
          setSelectedEvents([]);
        }
        break;
      case 'publish':
        setEvents(prev => prev.map(event => 
          selectedEvents.includes(event.id) 
            ? { ...event, status: 'upcoming' }
            : event
        ));
        setSelectedEvents([]);
        break;
      case 'cancel':
        setEvents(prev => prev.map(event => 
          selectedEvents.includes(event.id) 
            ? { ...event, status: 'cancelled' }
            : event
        ));
        setSelectedEvents([]);
        break;
      default:
        break;
    }
  };

  const handleDeleteEvent = (eventId) => {
    if (confirm('Are you sure you want to delete this event?')) {
      setEvents(prev => prev.filter(event => event.id !== eventId));
    }
  };

  const handleDuplicateEvent = (event) => {
    const newEvent = {
      ...event,
      id: Date.now(),
      title: `${event.title} (Copy)`,
      status: 'draft',
      currentVolunteers: 0,
      views: 0,
      likes: 0,
      comments: 0,
      createdAt: new Date().toISOString()
    };
    setEvents(prev => [newEvent, ...prev]);
  };

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
                Event Management
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Manage and track all your volunteer events
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <Link to="/events/create" className="btn btn-primary gap-2">
                <FaPlus />
                Create Event
              </Link>
              <button className="btn btn-outline gap-2">
                <FaDownload />
                Export
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mt-6">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">Total Events</p>
                  <p className="text-2xl font-bold">{stats.totalEvents}</p>
                </div>
                <FaCalendarAlt className="text-2xl text-blue-200" />
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">Upcoming</p>
                  <p className="text-2xl font-bold">{stats.upcomingEvents}</p>
                </div>
                <FaClock className="text-2xl text-green-200" />
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm">Completed</p>
                  <p className="text-2xl font-bold">{stats.completedEvents}</p>
                </div>
                <FaCheckCircle className="text-2xl text-purple-200" />
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm">Volunteers</p>
                  <p className="text-2xl font-bold">{stats.totalVolunteers}</p>
                </div>
                <FaUsers className="text-2xl text-orange-200" />
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-pink-100 text-sm">Views</p>
                  <p className="text-2xl font-bold">{stats.totalViews}</p>
                </div>
                <FaViews className="text-2xl text-pink-200" />
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-100 text-sm">Likes</p>
                  <p className="text-2xl font-bold">{stats.totalLikes}</p>
                </div>
                <FaHeart className="text-2xl text-red-200" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
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
            <div className="flex gap-3">
              <div className="relative">
                <FaFilterIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="select select-bordered pl-10 focus:select-primary"
                >
                  <option value="all">All Events</option>
                  <option value="upcoming">Upcoming</option>
                  <option value="ongoing">Ongoing</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="draft">Draft</option>
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
                </select>
              </div>
              
              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="btn btn-outline gap-2"
              >
                {sortOrder === 'asc' ? <FaArrowUp /> : <FaArrowDown />}
                {sortOrder === 'asc' ? 'Asc' : 'Desc'}
              </button>
              
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

        {/* Bulk Actions */}
        {selectedEvents.length > 0 && (
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="font-semibold text-blue-800 dark:text-blue-200">
                  {selectedEvents.length} events selected
                </span>
                <button
                  onClick={() => setSelectedEvents([])}
                  className="btn btn-ghost btn-sm"
                >
                  Clear Selection
                </button>
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => handleBulkAction('publish')}
                  className="btn btn-primary btn-sm gap-2"
                >
                  <FaCheckCircle />
                  Publish
                </button>
                <button
                  onClick={() => handleBulkAction('cancel')}
                  className="btn btn-warning btn-sm gap-2"
                >
                  <FaExclamationTriangle />
                  Cancel
                </button>
                <button
                  onClick={() => handleBulkAction('delete')}
                  className="btn btn-error btn-sm gap-2"
                >
                  <FaTrash />
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Events List */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
          {filteredEvents.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">📅</div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                No Events Found
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                {searchTerm || filterStatus !== 'all' 
                  ? 'Try adjusting your search criteria'
                  : 'Create your first event to get started'
                }
              </p>
              <Link to="/events/create" className="btn btn-primary">
                Create Event
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={selectedEvents.length === filteredEvents.length && filteredEvents.length > 0}
                          onChange={handleSelectAll}
                          className="checkbox checkbox-primary"
                        />
                        <span>Select All</span>
                      </label>
                    </th>
                    <th>Event</th>
                    <th>Date & Time</th>
                    <th>Location</th>
                    <th>Volunteers</th>
                    <th>Engagement</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEvents.map((event) => (
                    <tr key={event.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td>
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={selectedEvents.includes(event.id)}
                            onChange={() => handleSelectEvent(event.id)}
                            className="checkbox checkbox-primary"
                          />
                        </label>
                      </td>
                      
                      <td>
                        <div className="flex items-center gap-3">
                          <img
                            src={event.image}
                            alt={event.title}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                          <div>
                            <h3 className="font-semibold text-gray-800 dark:text-white line-clamp-1">
                              {event.title}
                            </h3>
                            <div className="flex items-center gap-2 mt-1">
                              <span className={`badge badge-sm ${getEventTypeColor(event.type)}`}>
                                {getEventTypeIcon(event.type)} {event.type}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>
                      
                      <td>
                        <div>
                          <p className="font-medium text-gray-800 dark:text-white">
                            {formatDate(event.date)}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            {formatTime(event.time)} - {formatTime(event.endTime)}
                          </p>
                        </div>
                      </td>
                      
                      <td>
                        <div className="flex items-center gap-2">
                          <FaMapMarkerAlt className="text-gray-400" />
                          <span className="text-sm text-gray-600 dark:text-gray-300 line-clamp-1">
                            {event.location}
                          </span>
                        </div>
                      </td>
                      
                      <td>
                        <div>
                          <p className="font-medium text-gray-800 dark:text-white">
                            {event.currentVolunteers}/{event.maxVolunteers}
                          </p>
                          <div className="w-20 bg-gray-200 rounded-full h-2 mt-1">
                            <div 
                              className="bg-primary h-2 rounded-full" 
                              style={{ width: `${(event.currentVolunteers / event.maxVolunteers) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>
                      
                      <td>
                        <div className="space-y-1">
                          <div className="flex items-center gap-1 text-sm">
                            <FaViews className="text-gray-400" />
                            <span>{event.views}</span>
                          </div>
                          <div className="flex items-center gap-1 text-sm">
                            <FaHeart className="text-red-400" />
                            <span>{event.likes}</span>
                          </div>
                          <div className="flex items-center gap-1 text-sm">
                            <FaComments className="text-blue-400" />
                            <span>{event.comments}</span>
                          </div>
                        </div>
                      </td>
                      
                      <td>
                        <span className={`badge ${getStatusColor(event.status)}`}>
                          {event.status}
                        </span>
                      </td>
                      
                      <td>
                        <div className="flex items-center gap-1">
                          <Link
                            to={`/events/${event.id}`}
                            className="btn btn-ghost btn-xs"
                            title="View Details"
                          >
                            <FaEye />
                          </Link>
                          
                          <Link
                            to={`/events/edit/${event.id}`}
                            className="btn btn-ghost btn-xs"
                            title="Edit Event"
                          >
                            <FaEdit />
                          </Link>
                          
                          <button
                            onClick={() => handleDuplicateEvent(event)}
                            className="btn btn-ghost btn-xs"
                            title="Duplicate Event"
                          >
                            <FaCopy />
                          </button>
                          
                          <button
                            onClick={() => handleDeleteEvent(event.id)}
                            className="btn btn-ghost btn-xs text-error"
                            title="Delete Event"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination */}
        {filteredEvents.length > 0 && (
          <div className="flex justify-center mt-8">
            <div className="join">
              <button className="join-item btn btn-outline">Previous</button>
              <button className="join-item btn btn-primary">1</button>
              <button className="join-item btn btn-outline">2</button>
              <button className="join-item btn btn-outline">3</button>
              <button className="join-item btn btn-outline">Next</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventManagement;
