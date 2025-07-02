import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FaArrowLeft, 
  FaCalendarAlt, 
  FaUser, 
  FaEye, 
  FaHeart, 
  FaRegHeart,
  FaShareAlt,
  FaTag,
  FaBookmark,
  FaBookmark as FaBookmarkOutline,
  FaComments,
  FaClock,
  FaGlobe,
  FaHandshake,
  FaLightbulb,
  FaUsers,
  FaStar,
  FaFacebookF,
  FaTwitter,
  FaLinkedin,
  FaWhatsapp
} from 'react-icons/fa';

const BlogDetails = () => {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);

  // Sample blog data - in real app, this would come from API
  const sampleArticles = [
    {
      id: 1,
      title: "The Impact of Community Volunteering on Mental Health",
      excerpt: "Discover how volunteering can improve your mental well-being and create lasting positive changes in your life and community.",
      content: `
        <p class="mb-6 text-lg leading-relaxed">
          Volunteering has been shown to have numerous mental health benefits, including reduced stress, increased happiness, and a sense of purpose. This article explores the science behind these benefits and provides practical tips for getting started.
        </p>
        
        <h2 class="text-2xl font-bold text-gray-800 dark:text-white mb-4">The Science Behind Volunteering and Mental Health</h2>
        <p class="mb-6 text-gray-700 dark:text-gray-300 leading-relaxed">
          Research has consistently shown that volunteering can have profound effects on mental health. Studies indicate that regular volunteers experience lower levels of depression, reduced stress hormones, and increased production of endorphins - the body's natural mood elevators.
        </p>
        
        <h3 class="text-xl font-semibold text-gray-800 dark:text-white mb-3">Key Benefits:</h3>
        <ul class="list-disc list-inside mb-6 space-y-2 text-gray-700 dark:text-gray-300">
          <li>Reduced stress and anxiety levels</li>
          <li>Increased sense of purpose and meaning</li>
          <li>Improved self-esteem and confidence</li>
          <li>Enhanced social connections</li>
          <li>Better overall life satisfaction</li>
        </ul>
        
        <h2 class="text-2xl font-bold text-gray-800 dark:text-white mb-4">Getting Started with Volunteering</h2>
        <p class="mb-6 text-gray-700 dark:text-gray-300 leading-relaxed">
          Starting your volunteering journey doesn't have to be overwhelming. Begin by identifying causes that resonate with you personally. Whether it's environmental conservation, animal welfare, or community development, choose something that aligns with your values and interests.
        </p>
        
        <div class="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 mb-6">
          <h3 class="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-3">Pro Tip:</h3>
          <p class="text-blue-700 dark:text-blue-300">
            Start small with just a few hours per month. This allows you to gradually build your commitment and find the right balance for your lifestyle.
          </p>
        </div>
        
        <h2 class="text-2xl font-bold text-gray-800 dark:text-white mb-4">Finding the Right Opportunity</h2>
        <p class="mb-6 text-gray-700 dark:text-gray-300 leading-relaxed">
          There are countless ways to volunteer, from local community centers to international organizations. Consider your skills, interests, and available time when choosing an opportunity. Many organizations offer flexible scheduling and remote volunteering options.
        </p>
        
        <h3 class="text-xl font-semibold text-gray-800 dark:text-white mb-3">Popular Volunteering Areas:</h3>
        <ul class="list-disc list-inside mb-6 space-y-2 text-gray-700 dark:text-gray-300">
          <li>Environmental conservation and cleanup</li>
          <li>Animal shelters and wildlife rehabilitation</li>
          <li>Community food banks and shelters</li>
          <li>Educational programs and tutoring</li>
          <li>Healthcare and medical support</li>
          <li>Disaster relief and emergency response</li>
        </ul>
        
        <h2 class="text-2xl font-bold text-gray-800 dark:text-white mb-4">Making the Most of Your Experience</h2>
        <p class="mb-6 text-gray-700 dark:text-gray-300 leading-relaxed">
          To maximize the mental health benefits of volunteering, approach it with an open mind and positive attitude. Focus on the impact you're making rather than just the time you're spending. Build relationships with other volunteers and the people you're helping.
        </p>
        
        <div class="bg-green-50 dark:bg-green-900/20 rounded-xl p-6 mb-6">
          <h3 class="text-lg font-semibold text-green-800 dark:text-green-200 mb-3">Success Story:</h3>
          <p class="text-green-700 dark:text-green-300">
            "After six months of volunteering at a local animal shelter, I noticed a significant improvement in my mood and overall outlook on life. The connection with animals and other volunteers gave me a sense of community I didn't realize I was missing." - Sarah M.
          </p>
        </div>
        
        <h2 class="text-2xl font-bold text-gray-800 dark:text-white mb-4">Conclusion</h2>
        <p class="mb-6 text-gray-700 dark:text-gray-300 leading-relaxed">
          Volunteering offers a unique combination of personal growth, community impact, and mental health benefits. By giving your time and energy to others, you're also investing in your own well-being. Start your volunteering journey today and discover the positive changes it can bring to your life.
        </p>
      `,
      author: "Dr. Sarah Johnson",
      authorAvatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      authorBio: "Dr. Sarah Johnson is a licensed clinical psychologist with over 15 years of experience in mental health research and community psychology. She specializes in the intersection of community engagement and mental well-being.",
      category: "Mental Health",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      publishDate: "2024-01-15",
      readTime: "5 min read",
      views: 1247,
      likes: 89,
      comments: 23,
      featured: true
    }
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const foundArticle = sampleArticles.find(article => article.id === parseInt(id));
      if (foundArticle) {
        setArticle(foundArticle);
      } else {
        setError('Article not found');
      }
      setLoading(false);
    }, 1000);
  }, [id]);

  const handleLike = () => {
    setIsLiked(!isLiked);
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
  };

  const handleShare = () => {
    setShareOpen(!shareOpen);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex justify-center items-center">
        <div className="text-center">
          <div className="loading loading-spinner loading-lg text-primary mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading article...</p>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 max-w-md mx-4 text-center">
          <div className="text-6xl text-red-500 mb-4">😕</div>
          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
            Article Not Found
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            The article you're looking for doesn't exist or has been removed.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/blog" className="btn btn-primary">
              Back to Blog
            </Link>
            <button 
              onClick={() => window.location.reload()} 
              className="btn btn-outline"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto px-4 py-8"
      >
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Link 
            to="/blog" 
            className="inline-flex items-center text-primary hover:text-primary-dark dark:text-primary dark:hover:text-primary-light mb-6 transition-colors group"
          >
            <FaArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Back to Blog</span>
          </Link>
        </motion.div>

        {/* Main Article */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden"
        >
          {/* Article Header */}
          <div className="relative">
            <img 
              src={article.image}
              alt={article.title}
              className="w-full h-64 md:h-96 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
            
            {/* Category Badge */}
            <div className="absolute top-6 left-6">
              <span className="badge badge-primary badge-lg gap-2">
                <FaTag />
                {article.category}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="absolute top-6 right-6 flex items-center gap-3">
              <button 
                onClick={handleLike}
                className={`btn btn-circle btn-sm ${isLiked ? 'btn-primary' : 'btn-outline btn-primary text-white border-white hover:bg-white hover:text-primary'}`}
              >
                {isLiked ? <FaHeart className="text-white" /> : <FaRegHeart />}
              </button>
              <button 
                onClick={handleSave}
                className={`btn btn-circle btn-sm ${isSaved ? 'btn-secondary' : 'btn-outline btn-primary text-white border-white hover:bg-white hover:text-primary'}`}
              >
                {isSaved ? <FaBookmark className="text-white" /> : <FaBookmarkOutline />}
              </button>
              <div className="relative">
                <button 
                  onClick={handleShare}
                  className="btn btn-circle btn-sm btn-outline btn-primary text-white border-white hover:bg-white hover:text-primary"
                >
                  <FaShareAlt />
                </button>
                {shareOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className="absolute right-0 bottom-full mb-3 bg-white dark:bg-gray-700 rounded-xl shadow-2xl p-4 w-56 z-10"
                  >
                    <p className="text-sm font-medium mb-3 text-gray-800 dark:text-white">Share this article:</p>
                    <div className="flex justify-center gap-3">
                      <button className="btn btn-circle btn-sm bg-blue-600 hover:bg-blue-700 text-white">
                        <FaFacebookF />
                      </button>
                      <button className="btn btn-circle btn-sm bg-blue-400 hover:bg-blue-500 text-white">
                        <FaTwitter />
                      </button>
                      <button className="btn btn-circle btn-sm bg-blue-700 hover:bg-blue-800 text-white">
                        <FaLinkedin />
                      </button>
                      <button className="btn btn-circle btn-sm bg-green-500 hover:bg-green-600 text-white">
                        <FaWhatsapp />
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>

            {/* Header Content */}
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
                {article.title}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-white/90">
                <div className="flex items-center gap-2">
                  <FaUser className="text-primary-light" />
                  <span className="font-medium">{article.author}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaCalendarAlt className="text-primary-light" />
                  <span className="font-medium">{formatDate(article.publishDate)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaClock className="text-primary-light" />
                  <span className="font-medium">{article.readTime}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Article Content */}
          <div className="p-6 md:p-8">
            {/* Article Stats */}
            <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-6 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-2">
                  <FaEye />
                  <span>{article.views} views</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaComments />
                  <span>{article.comments} comments</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaHeart />
                  <span>{article.likes} likes</span>
                </div>
              </div>
            </div>

            {/* Article Body */}
            <div className="prose prose-lg max-w-none dark:prose-invert">
              <div dangerouslySetInnerHTML={{ __html: article.content }} />
            </div>

            {/* Author Section */}
            <div className="mt-12 bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                <FaUser className="text-primary" />
                About the Author
              </h3>
              <div className="flex items-start gap-4">
                <img
                  src={article.authorAvatar}
                  alt={article.author}
                  className="w-16 h-16 rounded-full"
                />
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                    {article.author}
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {article.authorBio}
                  </p>
                </div>
              </div>
            </div>

            {/* Tags */}
            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">Tags:</h4>
              <div className="flex flex-wrap gap-2">
                <span className="badge badge-outline badge-primary">{article.category}</span>
                <span className="badge badge-outline">Volunteering</span>
                <span className="badge badge-outline">Mental Health</span>
                <span className="badge badge-outline">Community</span>
                <span className="badge badge-outline">Wellness</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Related Articles */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16"
        >
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-8 flex items-center gap-2">
            <FaStar className="text-primary" />
            Related Articles
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Sample related articles */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <img 
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
                alt="Related article"
                className="w-full h-48 object-cover"
              />
              <div className="p-5">
                <span className="badge badge-primary badge-sm mb-3">Skills Development</span>
                <h3 className="font-semibold text-gray-800 dark:text-white mb-2">
                  10 Essential Skills Every Volunteer Should Develop
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
                  From communication to problem-solving, learn the key skills that will make you an effective volunteer.
                </p>
                <Link to="/blog/2" className="btn btn-primary btn-sm gap-2">
                  Read More
                  <FaArrowLeft className="rotate-180" />
                </Link>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <img 
                src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
                alt="Related article"
                className="w-full h-48 object-cover"
              />
              <div className="p-5">
                <span className="badge badge-secondary badge-sm mb-3">Environment</span>
                <h3 className="font-semibold text-gray-800 dark:text-white mb-2">
                  Environmental Volunteering: Making a Difference
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
                  Explore various ways to contribute to environmental conservation through volunteering.
                </p>
                <Link to="/blog/3" className="btn btn-primary btn-sm gap-2">
                  Read More
                  <FaArrowLeft className="rotate-180" />
                </Link>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <img 
                src="https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
                alt="Related article"
                className="w-full h-48 object-cover"
              />
              <div className="p-5">
                <span className="badge badge-accent badge-sm mb-3">Youth Programs</span>
                <h3 className="font-semibold text-gray-800 dark:text-white mb-2">
                  Youth Volunteering: Empowering the Next Generation
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
                  Discover how young people are making a difference through volunteering.
                </p>
                <Link to="/blog/4" className="btn btn-primary btn-sm gap-2">
                  Read More
                  <FaArrowLeft className="rotate-180" />
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default BlogDetails;