import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthProvider';
import Swal from 'sweetalert2';
import LoadingSpinner from '../components/LoadingSpinner';
import { 
  FaUserFriends, 
  FaMapMarkerAlt, 
  FaCalendarAlt, 
  FaClock,
  FaUser,
  FaEnvelope,
  FaLightbulb
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const PostDetails = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [suggestion, setSuggestion] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`https://volunteerhub-server.vercel.app/posts/${id}`);
        const data = await res.json();
        setPost(data);
      } catch (error) {
        console.error("Error fetching post:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  const handleVolunteerRequest = async (e) => {
    e.preventDefault();

    const volunteerData = {
      postId: post._id,
      thumbnail: post.thumbnail,
      title: post.title,
      description: post.description,
      category: post.category,
      location: post.location,
      volunteersNeeded: post.volunteersNeeded,
      deadline: post.deadline,
      organizerName: post.organizerName,
      organizerEmail: post.organizerEmail,
      volunteerName: user.displayName,
      volunteerEmail: user.email,
      suggestion,
      status: "requested"
    };

    try {
      const res = await fetch('https://volunteerhub-server.vercel.app/volunteer-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(volunteerData)
      });

      const result = await res.json();

      if (result.insertedId) {
        await fetch(`https://volunteerhub-server.vercel.app/posts/${post._id}/decrease-volunteers`, {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        Swal.fire({
          title: "Success!",
          text: "Volunteer request submitted",
          icon: "success",
          confirmButtonColor: "#4f46e5",
        });
        setIsModalOpen(false);
        setSuggestion("");
        setPost(prev => ({
          ...prev,
          volunteersNeeded: prev.volunteersNeeded - 1
        }));
      } else {
        Swal.fire({
          title: "Error!",
          text: "Request failed",
          icon: "error",
          confirmButtonColor: "#4f46e5",
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: error.message,
        icon: "error",
        confirmButtonColor: "#4f46e5",
      });
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!post) return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center text-red-500 text-xl">Post not found</div>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
    >
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        {/* Post Header with Image */}
        {post.thumbnail && (
          <div className="h-64 sm:h-80 w-full overflow-hidden">
            <img
              src={post.thumbnail}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Post Content */}
        <div className="p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <motion.h2 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white"
            >
              {post.title}
            </motion.h2>
            
            <div className="bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 px-4 py-2 rounded-full text-sm font-medium">
              {post.category}
            </div>
          </div>

          {/* Post Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="space-y-4">
              <div className="flex items-center text-gray-700 dark:text-gray-300">
                <FaUserFriends className="text-indigo-500 dark:text-indigo-400 mr-3 text-lg" />
                <span className="font-medium">Volunteers Needed:</span>
                <span className="ml-2 font-semibold">{post.volunteersNeeded}</span>
              </div>
              
              <div className="flex items-center text-gray-700 dark:text-gray-300">
                <FaMapMarkerAlt className="text-indigo-500 dark:text-indigo-400 mr-3 text-lg" />
                <span className="font-medium">Location:</span>
                <span className="ml-2">{post.location}</span>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center text-gray-700 dark:text-gray-300">
                <FaCalendarAlt className="text-indigo-500 dark:text-indigo-400 mr-3 text-lg" />
                <span className="font-medium">Deadline:</span>
                <span className="ml-2">{post.deadline?.slice(0, 10)}</span>
              </div>
              
              <div className="flex items-center text-gray-700 dark:text-gray-300">
                <FaClock className="text-indigo-500 dark:text-indigo-400 mr-3 text-lg" />
                <span className="font-medium">Duration:</span>
                <span className="ml-2">{post.duration || 'Flexible'}</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">About This Opportunity</h3>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              {post.description}
            </p>
          </div>

          {/* Organizer Info */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-8">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">Organizer Information</h3>
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <div className="h-12 w-12 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-indigo-600 dark:text-indigo-300">
                  <FaUser className="text-xl" />
                </div>
              </div>
              <div>
                <h4 className="text-gray-800 dark:text-white font-medium">{post.organizerName}</h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm">{post.organizerEmail}</p>
              </div>
            </div>
          </div>

          {/* Volunteer Button */}
          <div className="flex justify-center">
            <button
              disabled={post.volunteersNeeded === 0}
              onClick={() => setIsModalOpen(true)}
              className={`px-8 py-3 rounded-full font-medium text-lg transition-all duration-300 ${
                post.volunteersNeeded === 0 
                  ? 'bg-gray-300 dark:bg-gray-600 cursor-not-allowed text-gray-500 dark:text-gray-400'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg hover:shadow-xl'
              }`}
            >
              {post.volunteersNeeded === 0 ? 'No Volunteers Needed' : 'Become a Volunteer'}
            </button>
          </div>
        </div>
      </div>

      {/* Volunteer Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", damping: 25 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                    Volunteer for "{post.title}"
                  </h3>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <form onSubmit={handleVolunteerRequest} className="space-y-4">
                  {/* Post Information */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Opportunity Title</label>
                    <input
                      type="text"
                      value={post.title}
                      readOnly
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
                      <input
                        type="text"
                        value={post.category}
                        readOnly
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Location</label>
                      <input
                        type="text"
                        value={post.location}
                        readOnly
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                      />
                    </div>
                  </div>

                  {/* Volunteer Information */}
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <h4 className="text-lg font-medium text-gray-800 dark:text-white mb-4">Your Information</h4>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
                          <FaUser className="mr-2 text-indigo-500 dark:text-indigo-400" /> Your Name
                        </label>
                        <input
                          type="text"
                          value={user?.displayName || ''}
                          readOnly
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
                          <FaEnvelope className="mr-2 text-indigo-500 dark:text-indigo-400" /> Your Email
                        </label>
                        <input
                          type="email"
                          value={user?.email || ''}
                          readOnly
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                        />
                      </div>
                    </div>

                    <div className="space-y-2 mt-4">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
                        <FaLightbulb className="mr-2 text-indigo-500 dark:text-indigo-400" /> Your Suggestions (Optional)
                      </label>
                      <textarea
                        value={suggestion}
                        onChange={(e) => setSuggestion(e.target.value)}
                        placeholder="Share any ideas or questions you have for the organizer..."
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 min-h-[100px]"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
                    >
                      Submit Request
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default PostDetails;