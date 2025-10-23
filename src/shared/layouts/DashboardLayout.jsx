import React, { useContext } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { FaPlusCircle, FaTasks, FaUserCircle, FaHome, FaSignOutAlt, FaBlog, FaCalendarAlt, FaCalendarCheck, FaChartBar } from 'react-icons/fa';
import { AuthContext } from '../context/AuthProvider';

const DashboardLayout = () => {
  const { logOut } = useContext(AuthContext);
  // All users can access everything - no role restrictions
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logOut();
      navigate('/login', { replace: true });
    } catch (err) {
      // ignore
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Sidebar */}
      <aside className="lg:col-span-3 bg-white dark:bg-gray-800 rounded-2xl shadow-lg h-max p-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent text-white flex items-center justify-center">
            <FaUserCircle className="text-2xl" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-800 dark:text-white">Dashboard</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">Quick navigation</p>
          </div>
        </div>
        <nav className="flex flex-col gap-2">
          <NavLink
            to="/dashboard"
            end
            className={({ isActive }) =>
              `flex items-center gap-2 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-violet-600 text-white'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`
            }
          >
            <span className="w-2 h-2 rounded-full bg-violet-500"></span>
            Dashboard Home
          </NavLink>
          <NavLink
            to="/dashboard/profile"
            className={({ isActive }) =>
              `flex items-center gap-2 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-info/10 text-info border border-info/20'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`
            }
          >
            <FaUserCircle />
            <span>My Profile</span>
          </NavLink>
          {/* My Applications - REMOVED - Simplified dashboard */}

                    {/* Add Post - Available for all users */}
          <NavLink
            to="/dashboard/add-post"
            className={({ isActive }) =>
              `flex items-center gap-2 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-primary/10 text-primary border border-primary/20'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`
            }
          >
            <FaPlusCircle />
            <span>Add Post</span>
          </NavLink>

          {/* My Posts - Available for all users */}
          <NavLink
            to="/dashboard/my-posts"
            className={({ isActive }) =>
              `flex items-center gap-2 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-success/10 text-success border border-success/20'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`
            }
          >
            <FaTasks />
            <span>My Posts</span>
          </NavLink>

          {/* Blog Management - Available for all users */}
          <NavLink
            to="/dashboard/blog-management"
            className={({ isActive }) =>
              `flex items-center gap-2 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-warning/10 text-warning border border-warning/20'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`
            }
          >
            <FaBlog />
            <span>Blog Management</span>
          </NavLink>

          {/* Event Management Section */}
          <div className="border-t border-gray-200 dark:border-gray-700 my-4"></div>
          <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 px-4">
            Event Management
          </div>

          {/* Events Dashboard */}
          <NavLink
            to="/dashboard/events"
            className={({ isActive }) =>
              `flex items-center gap-2 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-primary/10 text-primary border border-primary/20'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`
            }
          >
            <FaCalendarAlt />
            <span>Event Management</span>
          </NavLink>

          {/* My Events */}
          <NavLink
            to="/dashboard/my-events"
            className={({ isActive }) =>
              `flex items-center gap-2 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-success/10 text-success border border-success/20'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`
            }
          >
            <FaCalendarCheck />
            <span>My Events</span>
          </NavLink>

          {/* Event Analytics */}
          <NavLink
            to="/dashboard/events/analytics"
            className={({ isActive }) =>
              `flex items-center gap-2 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-info/10 text-info border border-info/20'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`
            }
          >
            <FaChartBar />
            <span>Event Analytics</span>
          </NavLink>

          {/* Admin section - REMOVED - All users have same access */}

          {/* Site Home link */}
          <Link
            to="/"
            className="flex items-center gap-2 px-4 py-3 rounded-lg transition-colors text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <FaHome />
            <span>Go to Website</span>
          </Link>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="mt-2 flex items-center gap-2 px-4 py-3 rounded-lg transition-colors text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            <FaSignOutAlt />
            <span>Logout</span>
          </button>
        </nav>
      </aside>

      {/* Main content */}
      <section className="lg:col-span-9">
        <Outlet />
      </section>
    </div>
  );
};

export default DashboardLayout;


