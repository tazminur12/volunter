import React, { useState } from 'react';
import { 
  FaQrcode, 
  FaCheckCircle, 
  FaArrowLeft
} from 'react-icons/fa';
import { Link } from 'react-router-dom';

const EventCheckIn = () => {
  const [checkInCode, setCheckInCode] = useState('');

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

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-8">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-3">
            <FaQrcode className="text-primary" /> Event Check-in
          </h2>
          
          <div className="text-center py-16">
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
                className="input input-bordered w-full mb-4"
                value={checkInCode}
                onChange={(e) => setCheckInCode(e.target.value)}
              />
              <button className="btn btn-primary w-full">
                <FaCheckCircle /> Submit Check-in
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCheckIn;
