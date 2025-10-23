/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import useAxiosSecure from '../hooks/useAxiosSecure';
import {
  FaHandsHelping, FaCalendarAlt, FaMapMarkerAlt, FaClock, FaHeart, FaUsers,
  FaSearch, FaArrowRight, FaStar, FaEnvelope, FaPhone, FaGlobe, FaAward,
  FaShieldAlt, FaLeaf, FaGraduationCap, FaHandHoldingHeart, FaLightbulb,
  FaRocket, FaGift, FaPercent, FaFacebookF, FaTwitter, FaInstagram, FaHome,
  FaUser, FaBookOpen
} from 'react-icons/fa';

const Home = () => {
  const axiosSecure = useAxiosSecure();
  const [posts, setPosts] = useState([]);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');

  useEffect(() => {
    // Fetch volunteer posts
    axiosSecure.get('/posts?sort=deadline&limit=8')
      .then(res => {
        setPosts(res.data);
      })
      .catch(error => {
        console.error('Error fetching posts:', error);
      });

    // Fetch blog posts from backend using exact same logic as Blog.jsx
    const fetchBlogPosts = async () => {
      try {
        setLoading(true);
        let allPosts = [];
        let hasPosts = false;
        
        // Try the main blog posts endpoint first
        try {
          const response = await axiosSecure.get('/blog-posts');
          
          if (response.data.success && response.data.blogPosts) {
            allPosts = [...allPosts, ...response.data.blogPosts];
            hasPosts = true;
          } else if (response.data.blogPosts) {
            allPosts = [...allPosts, ...response.data.blogPosts];
            hasPosts = true;
          }
        } catch {
          // Silently handle error
        }
        
        // Try the user's blog posts endpoint
        try {
          const userResponse = await axiosSecure.get('/my-blog-posts');
          
          if (userResponse.data.blogPosts && userResponse.data.blogPosts.length > 0) {
            // Merge posts, avoiding duplicates by ID
            const existingIds = new Set(allPosts.map(post => post._id));
            const newPosts = userResponse.data.blogPosts.filter(post => !existingIds.has(post._id));
            
            if (newPosts.length > 0) {
              allPosts = [...allPosts, ...newPosts];
            }
            
            hasPosts = true;
          }
        } catch {
          // Silently handle error
        }
        
        if (hasPosts && allPosts.length > 0) {
          // Take only first 6 posts for home page
          setArticles(allPosts.slice(0, 6));
        } else {
          setArticles([]);
        }
        
      } catch (error) {
        console.error('Error fetching blog posts:', error);
        setArticles([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogPosts();
  }, [axiosSecure]);

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 6000,
    pauseOnHover: true,
    arrows: false,
    fade: true,
    cssEase: 'cubic-bezier(0.645, 0.045, 0.355, 1)'
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const cardVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100, damping: 15 }
    }
  };

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    console.log('Newsletter subscription:', email);
    setEmail('');
  };

  const categories = [
    { name: 'Education', icon: FaGraduationCap, color: 'primary', count: 45 },
    { name: 'Environment', icon: FaLeaf, color: 'success', count: 32 },
    { name: 'Healthcare', icon: FaHeart, color: 'error', count: 28 },
    { name: 'Community', icon: FaHandHoldingHeart, color: 'secondary', count: 56 },
    { name: 'Technology', icon: FaLightbulb, color: 'warning', count: 23 },
    { name: 'Emergency', icon: FaShieldAlt, color: 'accent', count: 15 }
  ];

  const colorClasses = {
    primary: 'bg-primary/10 text-primary',
    secondary: 'bg-secondary/10 text-secondary',
    success: 'bg-success/10 text-success',
    error: 'bg-error/10 text-error',
    warning: 'bg-warning/10 text-warning',
    accent: 'bg-accent/10 text-accent'
  };



  const specialOffers = [
    {
      id: 1,
      title: 'New Volunteer Welcome Package',
      description: 'Get started with our comprehensive welcome kit.',
      discount: '25%',
      validUntil: '2024-02-15',
      icon: FaGift
    },
    {
      id: 2,
      title: 'Referral Rewards Program',
      description: 'Earn points for every friend you refer.',
      discount: '50%',
      validUntil: '2024-03-01',
      icon: FaRocket
    }
  ];

  // Format date safely
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return isNaN(date.getTime()) ? 'No date' : date.toLocaleDateString();
    } catch {
      return 'No date';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Hero Section */}
      <section className="h-[60vh] md:h-[70vh] mb-16 rounded-2xl overflow-hidden shadow-2xl">
        <Slider {...sliderSettings}>
          {/* Slide 1 */}
          <div className="relative h-full">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-secondary/80 z-10"></div>
            <img
              src="https://images.unsplash.com/photo-1521791136064-7986c2920216"
              alt="Community Service"
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 flex items-center z-20 px-8 md:px-16">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="max-w-2xl text-white"
              >
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                  Make a Difference <span className="text-accent">Today</span>
                </h1>
                <p className="text-lg md:text-xl lg:text-2xl mb-8 font-light">
                  Join our community of changemakers and create lasting impact
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link
                    to="/all-posts"
                    className="btn btn-accent text-white px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1"
                  >
                    Find Opportunities
                  </Link>
                  <Link
                    to="/about"
                    className="btn btn-outline btn-accent text-white px-8 py-4 rounded-full border-2 hover:bg-accent/20 transition-all"
                  >
                    Learn More
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Slide 2 */}
          <div className="relative h-full">
            <div className="absolute inset-0 bg-gradient-to-r from-secondary/90 to-accent/80 z-10"></div>
            <img
              src="https://images.unsplash.com/photo-1549923746-c502d488b3ea"
              alt="Helping Hands"
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 flex items-center z-20 px-8 md:px-16">
              <div className="max-w-2xl text-white">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                  Your <span className="text-primary">Skills</span> Matter
                </h1>
                <p className="text-lg md:text-xl lg:text-2xl mb-8 font-light">
                  Share your talents and transform lives in your community
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link
                    to="/dashboard/add-post"
                    className="btn btn-primary text-white px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1"
                  >
                    Post a Need
                  </Link>
                  <Link
                    to="/register"
                    className="btn btn-outline btn-primary text-white px-8 py-4 rounded-full border-2 hover:bg-primary/20 transition-all"
                  >
                    Join Now
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </Slider>
      </section>

      

      {/* Highlighted Products Section */}
      <section className="my-24">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Featured Opportunities
              </span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Handpicked volunteer opportunities that need your immediate attention
            </p>
          </motion.div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="loading loading-spinner loading-lg text-primary"></div>
          </div>
        ) : (
          <>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {posts.slice(0, 4).map((post) => (
                <motion.div
                  key={post._id}
                  variants={cardVariants}
                  whileHover={{ y: -10 }}
                  className="card bg-base-100 shadow-lg rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl h-full flex flex-col"
                >
                  <figure className="relative h-48">
                    <img
                      src={post.thumbnail || 'https://images.unsplash.com/photo-1521791136064-7986c2920216'}
                      alt={post.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1521791136064-7986c2920216';
                      }}
                    />
                    <div className="absolute top-4 right-4 badge badge-primary text-white shadow-md">
                      {post.category}
                    </div>
                  </figure>
                  <div className="card-body p-6 flex-1 flex flex-col">
                    <h3 className="card-title text-lg mb-2">{post.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3 flex-1">{post.description}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <div className="badge badge-primary gap-2">
                        <FaUsers /> {post.volunteersNeeded} needed
                      </div>
                      <div className="badge badge-secondary gap-2">
                        <FaCalendarAlt /> {formatDate(post.deadline)}
                      </div>
                    </div>
                    <div className="card-actions justify-end mt-auto">
                      <Link
                        to={`/post/${post._id}`}
                        className="btn btn-primary btn-sm"
                      >
                        See More
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
            
            {/* View All Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              className="text-center mt-12"
            >
              <Link
                to="/all-posts"
                className="btn btn-primary btn-lg gap-2 px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1"
              >
                <FaSearch />
                View All Opportunities
                <FaArrowRight />
              </Link>
            </motion.div>
          </>
        )}
      </section>

      {/* Categories Section */}
      <section className="my-24 bg-gradient-to-br from-primary/5 to-secondary/5 p-12 rounded-3xl">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Browse by Category
              </span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Find volunteer opportunities that match your interests and skills
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6"
          >
            {categories.map((category) => (
              <motion.div
                key={category.name}
                variants={cardVariants}
                whileHover={{ y: -5, scale: 1.05 }}
                className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all text-center cursor-pointer border border-gray-200 dark:border-gray-700"
              >
                <div className={`w-16 h-16 ${colorClasses[category.color].split(' ')[0]} rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <category.icon className={`text-2xl ${colorClasses[category.color].split(' ')[1]}`} />
                </div>
                <h3 className="font-bold mb-2 text-gray-800 dark:text-white">{category.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">{category.count} opportunities</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>



      {/* Special Offers Section */}
      <section className="my-24 bg-gradient-to-r from-accent/10 to-primary/10 p-12 rounded-3xl">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 dark:text-white">
              <span className="bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
                Special Offers & Rewards
              </span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Exclusive benefits and rewards for our dedicated volunteers
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {specialOffers.map((offer) => (
              <motion.div
                key={offer.id}
                whileHover={{ y: -5, scale: 1.02 }}
                className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all border-l-4 border-accent"
              >
                <div className="flex items-center justify-between mb-4">
                  <offer.icon className="text-3xl text-accent" />
                  <div className="badge badge-accent text-white">
                    <FaPercent className="mr-1" />
                    {offer.discount} OFF
                  </div>
                </div>
                <h3 className="font-bold text-xl mb-3 dark:text-white">{offer.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">{offer.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Valid until {offer.validUntil}</span>
                  <button className="btn btn-accent btn-sm">Claim Offer</button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Promotional Campaigns Section */}
      <section className="my-24">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-6xl mx-auto"
        >
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 dark:text-white">
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Current Campaigns
              </span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Join our ongoing initiatives and make a collective impact
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              whileHover={{ y: -5 }}
              className="bg-gradient-to-r from-primary to-secondary text-white p-8 rounded-2xl shadow-lg"
            >
              <h3 className="text-2xl font-bold mb-4">Spring Cleanup Drive</h3>
              <p className="mb-6">Help us beautify our communities this spring. Join thousands of volunteers in the largest cleanup initiative of the year.</p>
              <div className="flex items-center justify-between">
                <div className="text-sm">
                  <div>Progress: 75%</div>
                  <div className="w-full bg-white/20 rounded-full h-2 mt-1">
                    <div className="bg-white h-2 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                </div>
                <button className="btn btn-accent">Join Campaign</button>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ y: -5 }}
              className="bg-gradient-to-r from-secondary to-accent text-white p-8 rounded-2xl shadow-lg"
            >
              <h3 className="text-2xl font-bold mb-4">Youth Mentorship Program</h3>
              <p className="mb-6">Become a mentor and guide the next generation. Share your knowledge and experience with young minds.</p>
              <div className="flex items-center justify-between">
                <div className="text-sm">
                  <div>Mentors Needed: 50</div>
                  <div className="w-full bg-white/20 rounded-full h-2 mt-1">
                    <div className="bg-white h-2 rounded-full" style={{ width: '60%' }}></div>
                  </div>
                </div>
                <button className="btn btn-primary">Become Mentor</button>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Newsletter Subscription Section */}
      <section className="my-24 bg-gradient-to-r from-primary to-secondary text-white rounded-3xl p-12">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            Stay Connected
          </h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Subscribe to our newsletter for the latest volunteer opportunities, community updates, and inspiring stories.
          </p>
          <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 px-6 py-4 rounded-full text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 bg-white/90 backdrop-blur-sm border border-white/20"
              required
            />
            <button
              type="submit"
              className="btn btn-accent text-white px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
            >
              Subscribe
            </button>
          </form>
          <p className="text-sm mt-4 opacity-80 dark:text-gray-200">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </motion.div>
      </section>

      {/* Testimonials Section */}
      <section className="my-24">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-6xl mx-auto"
        >
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 dark:text-white">
              <span className="bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
                Community Stories
              </span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Hear from volunteers and organizations making a difference
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              whileHover={{ y: -5 }}
              className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-lg border-t-4 border-primary"
            >
              <div className="flex items-start mb-6">
                <div className="avatar">
                  <div className="w-16 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                    <span className="text-2xl font-bold">JD</span>
                  </div>
                </div>
                <div className="ml-6">
                  <h4 className="font-bold text-lg dark:text-white">John Doe</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Volunteer since 2022</p>
                  <div className="rating rating-sm mt-1">
                    {[...Array(5)].map((_, i) => (
                      <input key={i} type="radio" name="rating-1" className="mask mask-star bg-primary" checked readOnly />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-gray-700 dark:text-gray-200">
                "VolunteerHub transformed my life. I've connected with amazing organizations and found purpose through helping others. The platform makes it so easy to find meaningful opportunities."
              </p>
            </motion.div>

            <motion.div
              whileHover={{ y: -5 }}
              className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-lg border-t-4 border-secondary"
            >
              <div className="flex items-start mb-6">
                <div className="avatar">
                  <div className="w-16 rounded-full bg-secondary/10 text-secondary flex items-center justify-center">
                    <span className="text-2xl font-bold">AS</span>
                  </div>
                </div>
                <div className="ml-6">
                  <h4 className="font-bold text-lg dark:text-white">Aisha Smith</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Community Organizer</p>
                  <div className="rating rating-sm mt-1">
                    {[...Array(5)].map((_, i) => (
                      <input key={i} type="radio" name="rating-2" className="mask mask-star bg-secondary" checked readOnly />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-gray-700 dark:text-gray-200">
                "As a nonprofit, we've struggled to find volunteers. VolunteerHub solved that problem completely. We now have a steady stream of passionate, qualified volunteers."
              </p>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Partner Logos Section */}
      <section className="my-24">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-6xl mx-auto"
        >
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 dark:text-white">
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Trusted Partners
              </span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Working together with leading organizations to create positive change
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center">
            {[
              { name: 'UNICEF', icon: FaHeart, color: 'text-blue-600' },
              { name: 'Red Cross', icon: FaShieldAlt, color: 'text-red-600' },
              { name: 'World Vision', icon: FaGlobe, color: 'text-green-600' },
              { name: 'Save the Children', icon: FaHandHoldingHeart, color: 'text-purple-600' },
              { name: 'Habitat for Humanity', icon: FaHome, color: 'text-orange-600' },
              { name: 'Amnesty International', icon: FaAward, color: 'text-yellow-600' }
            ].map((partner, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.1 }}
                className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-md hover:shadow-lg transition-all flex flex-col items-center justify-center h-24"
              >
                <partner.icon className={`text-3xl ${partner.color} mb-2`} />
                <span className="text-xs font-medium text-gray-600 dark:text-gray-300 text-center">{partner.name}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Contact Information Section */}
      <section className="my-24 bg-gradient-to-br from-primary/5 to-secondary/5 p-12 rounded-3xl">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 dark:text-white">
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Get in Touch
              </span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Have questions? We're here to help you get started with volunteering
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              whileHover={{ y: -5 }}
              className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-lg text-center"
            >
              <FaPhone className="text-3xl text-primary mx-auto mb-4" />
              <h3 className="font-bold text-xl mb-2 dark:text-white">Call Us</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">Speak with our support team</p>
              <p className="text-primary font-medium">+1 (555) 123-4567</p>
            </motion.div>

            <motion.div
              whileHover={{ y: -5 }}
              className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-lg text-center"
            >
              <FaEnvelope className="text-3xl text-secondary mx-auto mb-4" />
              <h3 className="font-bold text-xl mb-2 dark:text-white">Email Us</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">Send us a message anytime</p>
              <p className="text-secondary font-medium">contact@volunteerhub.com</p>
            </motion.div>

            <motion.div
              whileHover={{ y: -5 }}
              className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-lg text-center"
            >
              <FaGlobe className="text-3xl text-accent mx-auto mb-4" />
              <h3 className="font-bold text-xl mb-2 dark:text-white">Visit Us</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">Find us on social media</p>
              <div className="flex justify-center gap-4">
                <a href="#" className="text-accent hover:text-accent/80"><FaFacebookF /></a>
                <a href="#" className="text-accent hover:text-accent/80"><FaTwitter /></a>
                <a href="#" className="text-accent hover:text-accent/80"><FaInstagram /></a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;