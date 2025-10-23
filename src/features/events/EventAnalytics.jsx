import React, { useState } from 'react';
import { 
  FaChartBar, 
  FaChartPie,
  FaUsers,
  FaEye,
  FaHeart,
  FaComments,
  FaStar,
  FaCalendarAlt,
  FaClock,
  FaMapMarkerAlt,
  FaArrowUp,
  FaArrowDown,
  FaExclamationTriangle,
  FaCheckCircle,
  FaTimes,
  FaFilter,
  FaDownload,
  FaSyncAlt
} from 'react-icons/fa';
// import { useParams } from 'react-router-dom'; // For future use
import { useEventQueries } from './useEventQueries';
import LoadingSpinner from '../../shared/components/LoadingSpinner';

const EventAnalytics = () => {
  // const { id } = useParams(); // For future use when implementing specific event analytics
  const { useEvents } = useEventQueries();
  const [timeRange, setTimeRange] = useState('30d'); // 7d, 30d, 90d, 1y
  const [filterType, setFilterType] = useState('all');

  // Fetch all events for general analytics
  const { data: eventsData, isLoading: eventsLoading, error: eventsError } = useEvents({
    status: filterType === 'all' ? undefined : filterType,
    sortBy: 'date',
    sortOrder: 'desc'
  });

  // Fetch specific event analytics if event ID is provided (for future use)
  // const { data: eventAnalytics, isLoading: analyticsLoading, error: analyticsError } = useEventAnalytics(id);

  const events = eventsData?.events || [];

  // Calculate analytics metrics
  const calculateMetrics = () => {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    
    const recentEvents = events.filter(event => new Date(event.date) >= thirtyDaysAgo);
    const upcomingEvents = events.filter(event => new Date(event.date) > now);
    const completedEvents = events.filter(event => new Date(event.date) < now);
    
    const totalVolunteers = events.reduce((sum, event) => sum + (event.currentVolunteers || 0), 0);
    const totalViews = events.reduce((sum, event) => sum + (event.views || 0), 0);
    const totalLikes = events.reduce((sum, event) => sum + (event.likes || 0), 0);
    const totalComments = events.reduce((sum, event) => sum + (event.comments || 0), 0);
    
    const avgAttendance = completedEvents.length > 0 
      ? completedEvents.reduce((sum, event) => sum + (event.currentVolunteers || 0), 0) / completedEvents.length 
      : 0;
    
    const avgRating = events.reduce((sum, event) => sum + (event.rating || 0), 0) / events.length || 0;
    
    return {
      totalEvents: events.length,
      recentEvents: recentEvents.length,
      upcomingEvents: upcomingEvents.length,
      completedEvents: completedEvents.length,
      totalVolunteers,
      totalViews,
      totalLikes,
      totalComments,
      avgAttendance: Math.round(avgAttendance),
      avgRating: Math.round(avgRating * 10) / 10
    };
  };

  const metrics = calculateMetrics();

  // Event type distribution
  const eventTypeDistribution = events.reduce((acc, event) => {
    acc[event.type] = (acc[event.type] || 0) + 1;
    return acc;
  }, {});

  // Monthly event distribution (for future use)
  // const monthlyDistribution = events.reduce((acc, event) => {
  //   const month = new Date(event.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  //   acc[month] = (acc[month] || 0) + 1;
  //   return acc;
  // }, {});

  if (eventsLoading) {
    return <LoadingSpinner />;
  }

  if (eventsError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
            <div className="text-center py-16">
              <FaExclamationTriangle className="text-6xl text-red-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                Error Loading Analytics
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                {eventsError.message || 'Failed to load analytics data. Please try again.'}
              </p>
              <button
                onClick={() => window.location.reload()}
                className="btn btn-primary"
              >
                <FaSyncAlt className="mr-2" />
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2 flex items-center gap-3">
                <FaChartBar className="text-primary" />
                Event Analytics
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Comprehensive insights and metrics for your volunteer events
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex gap-2">
                <select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                  className="select select-bordered select-sm"
                >
                  <option value="7d">Last 7 days</option>
                  <option value="30d">Last 30 days</option>
                  <option value="90d">Last 90 days</option>
                  <option value="1y">Last year</option>
                </select>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="select select-bordered select-sm"
                >
                  <option value="all">All Events</option>
                  <option value="upcoming">Upcoming</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <button className="btn btn-outline btn-sm gap-2">
                <FaDownload />
                Export Data
              </button>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Events</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{metrics.totalEvents}</p>
                <p className="text-sm text-green-600 dark:text-green-400 flex items-center gap-1">
                  <FaArrowUp className="text-xs" />
                  +{metrics.recentEvents} this month
                </p>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-full">
                <FaCalendarAlt className="text-2xl text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Volunteers</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{metrics.totalVolunteers}</p>
                <p className="text-sm text-green-600 dark:text-green-400 flex items-center gap-1">
                  <FaArrowUp className="text-xs" />
                  Avg: {metrics.avgAttendance} per event
                </p>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-full">
                <FaUsers className="text-2xl text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Views</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{metrics.totalViews}</p>
                <p className="text-sm text-blue-600 dark:text-blue-400 flex items-center gap-1">
                  <FaEye className="text-xs" />
                  Engagement metric
                </p>
              </div>
              <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-full">
                <FaEye className="text-2xl text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Average Rating</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{metrics.avgRating}</p>
                <p className="text-sm text-yellow-600 dark:text-yellow-400 flex items-center gap-1">
                  <FaStar className="text-xs" />
                  Out of 5.0
                </p>
              </div>
              <div className="p-3 bg-yellow-100 dark:bg-yellow-900/20 rounded-full">
                <FaStar className="text-2xl text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Event Status Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
              <FaChartPie className="text-primary" />
              Event Status Distribution
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-700 dark:text-gray-300">Upcoming</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-900 dark:text-white">{metrics.upcomingEvents}</span>
                  <span className="text-sm text-gray-500">
                    ({Math.round((metrics.upcomingEvents / metrics.totalEvents) * 100) || 0}%)
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                  <span className="text-gray-700 dark:text-gray-300">Completed</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-900 dark:text-white">{metrics.completedEvents}</span>
                  <span className="text-sm text-gray-500">
                    ({Math.round((metrics.completedEvents / metrics.totalEvents) * 100) || 0}%)
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
              <FaChartBar className="text-primary" />
              Event Type Distribution
            </h3>
            <div className="space-y-4">
              {Object.entries(eventTypeDistribution).map(([type, count]) => (
                <div key={type} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full ${
                      type === 'environment' ? 'bg-green-500' :
                      type === 'social' ? 'bg-blue-500' :
                      type === 'education' ? 'bg-purple-500' :
                      type === 'health' ? 'bg-red-500' :
                      'bg-gray-500'
                    }`}></div>
                    <span className="text-gray-700 dark:text-gray-300 capitalize">{type}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-900 dark:text-white">{count}</span>
                    <span className="text-sm text-gray-500">
                      ({Math.round((count / metrics.totalEvents) * 100) || 0}%)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Engagement Metrics */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-8">
          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
            <FaHeart className="text-primary" />
            Engagement Metrics
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
              <FaHeart className="text-3xl text-red-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{metrics.totalLikes}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Likes</p>
            </div>
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
              <FaComments className="text-3xl text-blue-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{metrics.totalComments}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Comments</p>
            </div>
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
              <FaEye className="text-3xl text-purple-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{metrics.totalViews}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Views</p>
            </div>
          </div>
        </div>

        {/* Recent Events */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
            <FaClock className="text-primary" />
            Recent Events Performance
          </h3>
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr>
                  <th>Event</th>
                  <th>Date</th>
                  <th>Volunteers</th>
                  <th>Views</th>
                  <th>Likes</th>
                  <th>Rating</th>
                </tr>
              </thead>
              <tbody>
                {events.slice(0, 10).map((event) => (
                  <tr key={event._id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                          <FaCalendarAlt className="text-primary" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white">{event.title}</p>
                          <p className="text-sm text-gray-500">{event.type}</p>
                        </div>
                      </div>
                    </td>
                    <td className="text-gray-600 dark:text-gray-400">
                      {new Date(event.date).toLocaleDateString()}
                    </td>
                    <td className="text-gray-600 dark:text-gray-400">
                      {event.currentVolunteers || 0}/{event.maxVolunteers || 0}
                    </td>
                    <td className="text-gray-600 dark:text-gray-400">
                      {event.views || 0}
                    </td>
                    <td className="text-gray-600 dark:text-gray-400">
                      {event.likes || 0}
                    </td>
                    <td className="text-gray-600 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <FaStar className="text-yellow-400" />
                        {event.rating || 0}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventAnalytics;
