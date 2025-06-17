import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { FaHandsHelping, FaCalendarAlt, FaMapMarkerAlt, FaClock } from 'react-icons/fa';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://volunteerhub-server.vercel.app/posts?sort=deadline&limit=6')
      .then(res => res.json())
      .then(data => {
        setPosts(data);
        setLoading(false);
      });
  }, []);

  // Slider settings
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    pauseOnHover: true,
    arrows: false,
    fade: true
  };

  // Animation variants
  const cardVariants = {
    offscreen: {
      y: 50,
      opacity: 0
    },
    onscreen: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        bounce: 0.4,
        duration: 0.8
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 overflow-hidden">
      {/* Hero Slider */}
      <section className="mb-16 rounded-xl overflow-hidden shadow-xl">
        <Slider {...sliderSettings}>
          {/* Slide 1 */}
          <div className="relative h-96 md:h-[500px]">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-secondary/80 z-10"></div>
            <img 
              src="https://images.unsplash.com/photo-1521791136064-7986c2920216" 
              alt="Community Service" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 flex items-center z-20 px-8 md:px-16">
              <div className="max-w-2xl text-white">
                <motion.h1 
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                  className="text-4xl md:text-5xl font-bold mb-4 leading-tight"
                >
                  Make a Difference in Your Community
                </motion.h1>
                <motion.p 
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="text-lg md:text-xl mb-6"
                >
                  Join thousands of volunteers creating positive change
                </motion.p>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                >
                  <Link 
                    to="/all-posts" 
                    className="btn btn-accent text-white text-lg px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all"
                  >
                    Find Opportunities
                  </Link>
                </motion.div>
              </div>
            </div>
          </div>

          {/* Slide 2 */}
          <div className="relative h-96 md:h-[500px]">
            <div className="absolute inset-0 bg-gradient-to-r from-secondary/90 to-accent/80 z-10"></div>
            <img 
              src="https://images.unsplash.com/photo-1549923746-c502d488b3ea" 
              alt="Helping Hands" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 flex items-center z-20 px-8 md:px-16">
              <div className="max-w-2xl text-white">
                <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
                  Your Skills Can Change Lives
                </h1>
                <p className="text-lg md:text-xl mb-6">
                  Whether you're a teacher, builder, or just have a big heart - we need you!
                </p>
                <Link 
                  to="/add-post" 
                  className="btn btn-primary text-white text-lg px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all"
                >
                  Post a Need
                </Link>
              </div>
            </div>
          </div>

          {/* Slide 3 */}
          <div className="relative h-96 md:h-[500px]">
            <div className="absolute inset-0 bg-gradient-to-r from-accent/90 to-primary/80 z-10"></div>
            <img 
              src="https://images.unsplash.com/photo-1507679799987-c73779587ccf" 
              alt="Team Volunteering" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 flex items-center z-20 px-8 md:px-16">
              <div className="max-w-2xl text-white">
                <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
                  Build Connections While Giving Back
                </h1>
                <p className="text-lg md:text-xl mb-6">
                  Meet like-minded people while making your community stronger
                </p>
                <Link 
                  to="/register" 
                  className="btn btn-secondary text-white text-lg px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all"
                >
                  Join Now
                </Link>
              </div>
            </div>
          </div>
        </Slider>
      </section>

      {/* Volunteer Needs Now Section */}
      <section className="my-16">
        <div className="text-center mb-12">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold mb-4"
          >
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Urgent Volunteer Needs
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-gray-600 max-w-2xl mx-auto"
          >
            These opportunities need volunteers soon - be the change you want to see!
          </motion.p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="loading loading-spinner loading-lg text-primary"></div>
          </div>
        ) : (
          <motion.div 
  initial="offscreen"
  whileInView="onscreen"
  viewport={{ once: true, amount: 0.2 }}
  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
>
  {posts.map((post) => (
    <motion.div 
      key={post._id}
      variants={cardVariants}
      className="card bg-base-100 shadow-md rounded-lg"
    >
      <figure className="relative">
        <img
          src={post.thumbnail || 'https://via.placeholder.com/400x200?text=No+Image'}
          alt={post.title}
          className="h-48 w-full object-cover"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/400x200?text=No+Image';
          }}
        />
        <div className="absolute top-2 right-2 badge badge-primary text-white">
          {post.category}
        </div>
      </figure>
      <div className="card-body">
        <h2 className="card-title text-lg">{post.title}</h2>
        <p className="text-sm text-gray-500 line-clamp-2">{post.description}</p>
        <div className="flex flex-wrap gap-2 mt-2">
          <div className="badge badge-outline">🧑 {post.volunteersNeeded} needed</div>
          <div className="badge badge-outline">
            📅 {new Date(post.deadline).toLocaleDateString()}
          </div>
        </div>
        <div className="card-actions justify-end mt-4">
          <Link to={`/post/${post._id}`} className="btn btn-sm btn-primary">
            View Details
          </Link>
        </div>
      </div>
    </motion.div>
  ))}
</motion.div>

        )}

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link 
            to="/all-posts" 
            className="btn btn-outline btn-primary px-8 py-3 rounded-full hover:bg-primary hover:text-white transition-all"
          >
            See All Opportunities
          </Link>
        </motion.div>
      </section>

      {/* Extra Section 1: How It Works */}
      <section className="my-16 bg-gradient-to-r from-primary/10 to-secondary/10 p-8 md:p-12 rounded-2xl">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold mb-8"
          >
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              How VolunteerHub Works
            </span>
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="text-4xl text-primary mb-4">1</div>
              <h3 className="text-xl font-semibold mb-3">Find Opportunities</h3>
              <p className="text-gray-600">
                Browse through hundreds of verified volunteer needs in your community
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="text-4xl text-secondary mb-4">2</div>
              <h3 className="text-xl font-semibold mb-3">Apply or Contact</h3>
              <p className="text-gray-600">
                Express your interest directly with the organizers
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              viewport={{ once: true }}
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="text-4xl text-accent mb-4">3</div>
              <h3 className="text-xl font-semibold mb-3">Make an Impact</h3>
              <p className="text-gray-600">
                Show up and create meaningful change in people's lives
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Extra Section 2: Testimonials */}
      <section className="my-16">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
            <span className="bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
              Stories of Impact
            </span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-primary">
              <div className="flex items-center mb-4">
                <div className="avatar">
                  <div className="w-12 rounded-full bg-primary text-white flex items-center justify-center">
                    <span className="text-xl">JD</span>
                  </div>
                </div>
                <div className="ml-4">
                  <h4 className="font-bold">John Doe</h4>
                  <p className="text-sm text-gray-500">Volunteer since 2022</p>
                </div>
              </div>
              <p className="text-gray-700 italic">
                "VolunteerHub connected me with a local food bank that desperately needed help. I've made friends and found purpose through this platform."
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-secondary">
              <div className="flex items-center mb-4">
                <div className="avatar">
                  <div className="w-12 rounded-full bg-secondary text-white flex items-center justify-center">
                    <span className="text-xl">AS</span>
                  </div>
                </div>
                <div className="ml-4">
                  <h4 className="font-bold">Aisha Smith</h4>
                  <p className="text-sm text-gray-500">Community Organizer</p>
                </div>
              </div>
              <p className="text-gray-700 italic">
                "We've filled all our volunteer spots within days of posting on VolunteerHub. The quality of volunteers has been outstanding."
              </p>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default Home;