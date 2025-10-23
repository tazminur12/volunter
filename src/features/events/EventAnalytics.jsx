import React from 'react';
import { 
  FaChartBar, 
  FaChartPie
} from 'react-icons/fa';

const EventAnalytics = () => {

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-8">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-3">
            <FaChartBar className="text-primary" /> Event Analytics
          </h2>
          
          <div className="text-center py-16">
            <FaChartPie className="text-6xl text-primary mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
              Analytics Dashboard
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Event analytics and insights will be displayed here.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventAnalytics;
