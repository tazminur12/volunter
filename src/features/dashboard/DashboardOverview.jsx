import React, { useContext, useMemo } from 'react';
import { AuthContext } from '../../shared/context/AuthProvider';
import { format } from 'date-fns';
import { FaUserShield, FaClock, FaCrown, FaUser, FaStar } from 'react-icons/fa';
import RatingManagement from '../ratings/RatingManagement';

const DashboardOverview = () => {
  const { user, role } = useContext(AuthContext);

  const memberSince = useMemo(() => {
    try {
      const ts = user?.metadata?.creationTime;
      return ts ? format(new Date(ts), 'MMMM d, yyyy') : '—';
    } catch {
      return '—';
    }
  }, [user]);

  const lastLogin = useMemo(() => {
    try {
      const ts = user?.metadata?.lastSignInTime;
      return ts ? format(new Date(ts), 'MMMM d, yyyy h:mm a') : '—';
    } catch {
      return '—';
    }
  }, [user]);



  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-white">My Account</h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2">Manage your profile and dashboard settings</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6">
          <h3 className="font-semibold text-gray-800 dark:text-white mb-4">Account Overview</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-xl border border-gray-200 dark:border-gray-700 p-4">
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-1 flex items-center gap-2">
                <FaUser /> Member Since
              </div>
              <div className="text-lg font-semibold text-gray-800 dark:text-white">{memberSince}</div>
            </div>
            <div className="rounded-xl border border-gray-200 dark:border-gray-700 p-4">
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-1 flex items-center gap-2">
                <FaClock /> Last Login
              </div>
              <div className="text-lg font-semibold text-gray-800 dark:text-white">{lastLogin}</div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6">
          <h3 className="font-semibold text-gray-800 dark:text-white mb-4">Account Status</h3>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <FaUserShield />
            </div>
            <div className="flex-1">
              <div className="font-semibold text-gray-800 dark:text-white capitalize">{role || 'volunteer'}</div>
              <p className="text-sm text-gray-600 dark:text-gray-300">Your current access level in the dashboard</p>
            </div>
            <button className="btn btn-primary btn-sm"><FaCrown className="mr-1"/>Upgrade</button>
          </div>
        </div>
      </div>

      {/* Rating Management Section */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-yellow-500/10 text-yellow-500 flex items-center justify-center">
            <FaStar />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white">My Ratings & Reviews</h3>
            <p className="text-gray-600 dark:text-gray-400">Manage your ratings and reviews for blog posts</p>
          </div>
        </div>
        
        <RatingManagement />
      </div>

    </div>
  );
};

export default DashboardOverview;


