import React, { useContext, useMemo } from 'react';
import { AuthContext } from '../../context/AuthProvider';
import { format } from 'date-fns';
import { FaUserShield, FaClock, FaCrown, FaUser, FaUsers, FaPlus, FaTools } from 'react-icons/fa';
import { Link } from 'react-router-dom';

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

  const isAdmin = role === 'admin';
  const isOrganizer = role === 'organizer';
  const isVolunteer = role === 'volunteer' || !role;

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

      {/* Role-wise quick actions */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6">
        <h3 className="font-semibold text-gray-800 dark:text-white mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {(isAdmin || isOrganizer) && (
            <Link to="/dashboard/add-post" className="rounded-xl border border-gray-200 dark:border-gray-700 p-5 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                <FaPlus />
              </div>
              <div>
                <div className="font-semibold text-gray-800 dark:text-white">Create Opportunity</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Post a new volunteer need</div>
              </div>
            </Link>
          )}

          <Link to="/dashboard/applications" className="rounded-xl border border-gray-200 dark:border-gray-700 p-5 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-secondary/10 text-secondary flex items-center justify-center">
              <FaTools />
            </div>
            <div>
              <div className="font-semibold text-gray-800 dark:text-white">My Applications</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">View application statuses</div>
            </div>
          </Link>

          {isVolunteer && (
            <Link to="/dashboard/applications" className="rounded-xl border border-gray-200 dark:border-gray-700 p-5 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-accent/10 text-accent flex items-center justify-center">
                <FaUsers />
              </div>
              <div>
                <div className="font-semibold text-gray-800 dark:text-white">My Applications</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Track your requests</div>
              </div>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;


