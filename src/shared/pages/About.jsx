import { motion } from 'framer-motion';
import { FaHandsHelping, FaUsers, FaHeart, FaChartLine } from 'react-icons/fa';

const About = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-20"
      >
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
          <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            About VolunteerHub
          </span>
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          Connecting compassionate volunteers with organizations making a difference in communities worldwide.
        </p>
      </motion.section>

      {/* Mission Section */}
      <motion.section 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="mb-20"
      >
        <div className="bg-gradient-to-r from-primary/10 to-secondary/10 dark:from-primary/20 dark:to-secondary/20 p-8 md:p-12 rounded-3xl">
          <motion.div variants={itemVariants} className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 dark:text-white">
              Our <span className="text-primary dark:text-primary-light">Mission</span>
            </h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">
              At VolunteerHub, we believe that everyone has something valuable to contribute. Our platform bridges the gap between those who want to help and organizations that need support.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <motion.div variants={itemVariants} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-3 dark:text-white">
                  <FaHandsHelping className="text-primary dark:text-primary-light" />
                  Our Vision
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  A world where volunteering is accessible to all, and every act of service creates ripple effects of positive change.
                </p>
              </motion.div>
              <motion.div variants={itemVariants} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-3 dark:text-white">
                  <FaHeart className="text-secondary dark:text-secondary-light" />
                  Our Values
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Compassion, community, transparency, and impact drive everything we do.
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Stats Section */}
      <motion.section 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="mb-20"
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center dark:text-white">
          Our <span className="text-secondary dark:text-secondary-light">Impact</span>
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { icon: FaUsers, value: "10,000+", label: "Volunteers", color: "primary" },
            { icon: FaHandsHelping, value: "500+", label: "Organizations", color: "secondary" },
            { icon: FaHeart, value: "50,000+", label: "Hours Donated", color: "accent" },
            { icon: FaChartLine, value: "100+", label: "Communities Served", color: "info" }
          ].map((stat, index) => (
            <motion.div 
              key={index}
              variants={itemVariants}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md text-center"
            >
              <stat.icon className={`text-4xl text-${stat.color} dark:text-${stat.color}-light mx-auto mb-4`} />
              <h3 className="text-3xl font-bold mb-2 dark:text-white">{stat.value}</h3>
              <p className="text-gray-600 dark:text-gray-300">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Team Section */}
      <motion.section 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="mb-20"
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center dark:text-white">
          Meet Our <span className="text-accent dark:text-accent-light">Team</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              name: "Sarah Johnson",
              role: "Founder & CEO",
              bio: "Passionate about community building and social impact.",
              img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2"
            },
            {
              name: "Michael Chen",
              role: "CTO",
              bio: "Tech enthusiast dedicated to building platforms for good.",
              img: "https://images.unsplash.com/photo-1560250097-0b93528c311a"
            },
            {
              name: "Aisha Williams",
              role: "Community Director",
              bio: "Connector of people and resources for maximum impact.",
              img: "https://images.unsplash.com/photo-1580489944761-15a19d654956"
            }
          ].map((member, index) => (
            <motion.div 
              key={index}
              variants={itemVariants}
              whileHover={{ y: -5 }}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md text-center"
            >
              <div className="avatar mb-4">
                <div className="w-24 rounded-full ring ring-primary dark:ring-primary-light ring-offset-base-100 ring-offset-2 mx-auto">
                  <img src={member.img} alt={member.name} />
                </div>
              </div>
              <h3 className="text-xl font-bold mb-1 dark:text-white">{member.name}</h3>
              <p className="text-secondary dark:text-secondary-light mb-3">{member.role}</p>
              <p className="text-gray-600 dark:text-gray-300">{member.bio}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="bg-gradient-to-r from-primary to-secondary text-white rounded-3xl p-12 text-center"
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Make a Difference?</h2>
        <p className="text-xl mb-8 max-w-2xl mx-auto">
          Join our community of changemakers today.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <a href="/register" className="btn btn-accent text-white px-8 py-4 rounded-full text-lg font-medium shadow-lg hover:shadow-xl transition-all">
            Sign Up Now
          </a>
          <a href="/contact" className="btn btn-outline btn-accent text-white border-2 px-8 py-4 rounded-full text-lg font-medium hover:bg-white/10 transition-all">
            Contact Us
          </a>
        </div>
      </motion.section>
    </div>
  );
};

export default About;