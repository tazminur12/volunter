import React, { useState } from 'react';
import { 
  FaQrcode, 
  FaCheckCircle, 
  FaArrowLeft,
  FaExclamationTriangle,
  FaSpinner
} from 'react-icons/fa';
import { Link, useParams } from 'react-router-dom';
import { useEventQueries } from './useEventQueries';
import LoadingSpinner from '../../shared/components/LoadingSpinner';

const EventCheckIn = () => {
  const { id } = useParams();
  const { useEvent, useCheckInEvent } = useEventQueries();
  const [checkInCode, setCheckInCode] = useState('');
  const [error, setError] = useState('');

  // Fetch event details
  const { data: event, isLoading: eventLoading, error: eventError } = useEvent(id);
  const checkInMutation = useCheckInEvent();

  const handleCheckIn = () => {
    if (!checkInCode.trim()) {
      setError('Please enter a check-in code');
      return;
    }

    if (!id) {
      setError('Event ID is required');
      return;
    }

    setError('');
    checkInMutation.mutate(
      { eventId: id, checkInCode: checkInCode.trim() },
      {
        onError: (error) => {
          setError(error.response?.data?.message || 'Check-in failed');
        }
      }
    );
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleCheckIn();
    }
  };

  if (eventLoading) {
    return <LoadingSpinner />;
  }

  if (eventError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
            <div className="text-center py-16">
              <FaExclamationTriangle className="text-6xl text-red-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                Event Not Found
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                The event you're looking for doesn't exist or has been removed.
              </p>
              <Link to="/events" className="btn btn-primary">
                <FaArrowLeft className="mr-2" />
                Back to Events
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-6">
          <Link
            to="/events"
            className="inline-flex items-center text-primary hover:text-primary-dark dark:text-primary dark:hover:text-primary-light transition-colors group"
          >
            <FaArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Back to Events</span>
          </Link>
        </div>

        {/* Event Information */}
        {event && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
              {event.title}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 dark:text-gray-300">
              <div className="flex items-center gap-2">
                <FaQrcode className="text-primary" />
                <span>Event ID: {event._id}</span>
              </div>
              <div className="flex items-center gap-2">
                <span>Date: {new Date(event.date).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <span>Location: {event.location}</span>
              </div>
            </div>
          </div>
        )}

        {/* Check-in Form */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-8">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-3">
            <FaQrcode className="text-primary" /> Event Check-in
          </h2>
          
          <div className="text-center py-8">
            <FaQrcode className="text-6xl text-primary mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
              QR Code Check-in
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Scan QR code or enter check-in code to confirm attendance.
            </p>
            
            <div className="max-w-md mx-auto">
              <input
                type="text"
                placeholder="Enter Check-in Code"
                className={`input input-bordered w-full mb-4 ${error ? 'input-error' : 'focus:input-primary'}`}
                value={checkInCode}
                onChange={(e) => {
                  setCheckInCode(e.target.value);
                  if (error) setError('');
                }}
                onKeyPress={handleKeyPress}
                disabled={checkInMutation.isPending}
              />
              
              {error && (
                <div className="alert alert-error mb-4">
                  <FaExclamationTriangle />
                  <span>{error}</span>
                </div>
              )}
              
              <button 
                className="btn btn-primary w-full"
                onClick={handleCheckIn}
                disabled={checkInMutation.isPending || !checkInCode.trim()}
              >
                {checkInMutation.isPending ? (
                  <>
                    <FaSpinner className="animate-spin mr-2" />
                    Checking in...
                  </>
                ) : (
                  <>
                    <FaCheckCircle className="mr-2" />
                    Submit Check-in
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCheckIn;
