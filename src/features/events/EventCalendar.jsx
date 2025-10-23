import React, { useState } from 'react';
import { 
  FaCalendarAlt, 
  FaClock, 
  FaMapMarkerAlt, 
  FaUsers, 
  FaPlus,
  FaFilter,
  FaSearch,
  FaChevronLeft,
  FaChevronRight,
  FaEye,
  FaEdit,
  FaTrash,
  FaCheckCircle,
  FaExclamationTriangle,
  FaInfoCircle
} from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useEventQueries } from './useEventQueries';
import LoadingSpinner from '../../shared/components/LoadingSpinner';

const EventCalendar = () => {
  const { useEvents } = useEventQueries();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('month'); // month, week, day
  const [filterType, setFilterType] = useState('all'); // all, my-events, upcoming, past
  const [searchTerm, setSearchTerm] = useState('');

  // Use the useEventQueries hook for data fetching
  const filters = {
    search: searchTerm,
    status: filterType === 'all' ? undefined : filterType,
    sortBy: 'date',
    sortOrder: 'asc'
  };
  
  const { data: eventsData, isLoading: loading, error } = useEvents(filters);
  const events = eventsData?.events || [];

  // Convert API events to calendar format
  const calendarEvents = events.map(event => ({
    ...event,
    date: new Date(event.date),
    volunteers: event.currentVolunteers || 0,
    maxVolunteers: event.maxVolunteers || 0
  }));

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const days = [];
    
    // Previous month's trailing days
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const prevDate = new Date(year, month, -i);
      days.push({ date: prevDate, isCurrentMonth: false, events: [] });
    }
    
    // Current month's days
    for (let day = 1; day <= daysInMonth; day++) {
      const currentDate = new Date(year, month, day);
      const dayEvents = calendarEvents.filter(event => 
        event.date.toDateString() === currentDate.toDateString()
      );
      days.push({ 
        date: currentDate, 
        isCurrentMonth: true, 
        events: dayEvents 
      });
    }
    
    // Next month's leading days
    const remainingDays = 42 - days.length; // 6 weeks * 7 days
    for (let day = 1; day <= remainingDays; day++) {
      const nextDate = new Date(year, month + 1, day);
      days.push({ date: nextDate, isCurrentMonth: false, events: [] });
    }
    
    return days;
  };

  const navigateMonth = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  const getEventTypeColor = (type) => {
    const colors = {
      environment: 'bg-green-100 text-green-800 border-green-200',
      social: 'bg-blue-100 text-blue-800 border-blue-200',
      education: 'bg-purple-100 text-purple-800 border-purple-200',
      health: 'bg-red-100 text-red-800 border-red-200',
      default: 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return colors[type] || colors.default;
  };

  const getEventStatusIcon = (status) => {
    switch (status) {
      case 'upcoming':
        return <FaClock className="text-blue-500" />;
      case 'ongoing':
        return <FaCheckCircle className="text-green-500" />;
      case 'completed':
        return <FaCheckCircle className="text-gray-500" />;
      case 'cancelled':
        return <FaExclamationTriangle className="text-red-500" />;
      default:
        return <FaInfoCircle className="text-gray-500" />;
    }
  };

  const filteredEvents = calendarEvents.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (event.description && event.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (event.organizer && event.organizer.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesFilter = filterType === 'all' || 
                          (filterType === 'upcoming' && event.status === 'upcoming') ||
                          (filterType === 'my-events' && event.volunteers > 0);
    
    return matchesSearch && matchesFilter;
  });

  const days = getDaysInMonth(currentDate);
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
            <div className="text-center py-16">
              <FaExclamationTriangle className="text-6xl text-red-500 mx-auto mb-4" />
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
        </div>
      </div>
    );
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
                Event Calendar
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Manage and track all volunteer events in one place
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <Link to="/events/create" className="btn btn-primary gap-2">
                <FaPlus />
                Create Event
              </Link>
              <Link to="/events/my-events" className="btn btn-outline gap-2">
                <FaUsers />
                My Events
              </Link>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="mt-6 flex flex-col lg:flex-row gap-4">
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
            
            <div className="flex gap-3">
              <div className="relative">
                <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="select select-bordered pl-10 focus:select-primary"
                >
                  <option value="all">All Events</option>
                  <option value="upcoming">Upcoming</option>
                  <option value="my-events">My Events</option>
                  <option value="past">Past Events</option>
                </select>
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => setViewMode('month')}
                  className={`btn btn-sm ${viewMode === 'month' ? 'btn-primary' : 'btn-outline'}`}
                >
                  Month
                </button>
                <button
                  onClick={() => setViewMode('week')}
                  className={`btn btn-sm ${viewMode === 'week' ? 'btn-primary' : 'btn-outline'}`}
                >
                  Week
                </button>
                <button
                  onClick={() => setViewMode('day')}
                  className={`btn btn-sm ${viewMode === 'day' ? 'btn-primary' : 'btn-outline'}`}
                >
                  Day
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Calendar View */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
          {/* Calendar Header */}
          <div className="bg-gradient-to-r from-primary to-secondary text-white p-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={() => navigateMonth(-1)}
                  className="btn btn-circle btn-sm btn-outline text-white border-white hover:bg-white hover:text-primary"
                >
                  <FaChevronLeft />
                </button>
                <button
                  onClick={() => setCurrentDate(new Date())}
                  className="btn btn-sm btn-outline text-white border-white hover:bg-white hover:text-primary"
                >
                  Today
                </button>
                <button
                  onClick={() => navigateMonth(1)}
                  className="btn btn-circle btn-sm btn-outline text-white border-white hover:bg-white hover:text-primary"
                >
                  <FaChevronRight />
                </button>
              </div>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="p-6">
            {/* Day Headers */}
            <div className="grid grid-cols-7 gap-1 mb-4">
              {dayNames.map(day => (
                <div key={day} className="text-center font-semibold text-gray-600 dark:text-gray-400 py-2">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7 gap-1">
              {days.map((day, index) => (
                <div
                  key={index}
                  className={`min-h-[120px] p-2 border border-gray-200 dark:border-gray-700 rounded-lg ${
                    day.isCurrentMonth 
                      ? 'bg-white dark:bg-gray-800' 
                      : 'bg-gray-50 dark:bg-gray-900 text-gray-400'
                  } ${
                    day.date.toDateString() === new Date().toDateString()
                      ? 'ring-2 ring-primary bg-primary/10'
                      : ''
                  } hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer`}
                  onClick={() => setSelectedDate(day.date)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className={`font-semibold ${
                      day.isCurrentMonth ? 'text-gray-800 dark:text-white' : 'text-gray-400'
                    }`}>
                      {day.date.getDate()}
                    </span>
                    {day.events.length > 0 && (
                      <span className="badge badge-primary badge-sm">
                        {day.events.length}
                      </span>
                    )}
                  </div>
                  
                  {/* Events for this day */}
                  <div className="space-y-1">
                    {day.events.slice(0, 2).map(event => (
                      <div
                        key={event.id}
                        className={`text-xs p-1 rounded border ${getEventTypeColor(event.type)} truncate`}
                        title={event.title}
                      >
                        <div className="flex items-center gap-1">
                          {getEventStatusIcon(event.status)}
                          <span className="truncate">{event.title}</span>
                        </div>
                      </div>
                    ))}
                    {day.events.length > 2 && (
                      <div className="text-xs text-gray-500 text-center">
                        +{day.events.length - 2} more
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Selected Date Events */}
        {selectedDate && (
          <div className="mt-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
              <FaCalendarAlt className="text-primary" />
              Events on {selectedDate.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </h3>
            
            {filteredEvents.filter(event => 
              event.date.toDateString() === selectedDate.toDateString()
            ).length === 0 ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-3">📅</div>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  No events scheduled for this date
                </p>
                <Link to="/events/create" className="btn btn-primary">
                  Create Event
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredEvents.filter(event => 
                  event.date.toDateString() === selectedDate.toDateString()
                ).map(event => (
                  <div key={event.id} className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 hover:shadow-lg transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800 dark:text-white mb-1">
                          {event.title}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                          {event.description}
                        </p>
                      </div>
                      <div className="flex gap-1">
                        <Link 
                          to={`/events/${event._id}`}
                          className="btn btn-ghost btn-xs"
                          title="View Details"
                        >
                          <FaEye />
                        </Link>
                        <button className="btn btn-ghost btn-xs" title="Edit">
                          <FaEdit />
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-3">
                      <div className="flex items-center gap-1">
                        <FaClock />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <FaMapMarkerAlt />
                        <span>{event.location}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FaUsers />
                        <span className="text-sm">
                          {event.volunteers}/{event.maxVolunteers} volunteers
                        </span>
                      </div>
                      <span className={`badge badge-sm ${getEventTypeColor(event.type)}`}>
                        {event.type}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EventCalendar;
