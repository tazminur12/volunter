import { motion } from 'framer-motion';
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock } from 'react-icons/fa';

const Contact = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
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
            Contact Us
          </span>
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          We'd love to hear from you! Reach out with questions, feedback, or partnership opportunities.
        </p>
      </motion.section>

      {/* Contact Content */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20"
      >
        {/* Contact Form */}
        <motion.div 
          variants={itemVariants}
          className="bg-white dark:bg-gray-800 p-8 md:p-10 rounded-2xl shadow-lg"
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-6 dark:text-white">Send Us a Message</h2>
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
                <input 
                  type="text" 
                  id="name" 
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                <input 
                  type="email" 
                  id="email" 
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  placeholder="your.email@example.com"
                />
              </div>
            </div>
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Subject</label>
              <input 
                type="text" 
                id="subject" 
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                placeholder="What's this about?"
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Message</label>
              <textarea 
                id="message" 
                rows="5" 
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                placeholder="Your message here..."
              ></textarea>
            </div>
            <button 
              type="submit" 
              className="btn btn-primary text-white px-8 py-4 rounded-full text-lg font-medium shadow-lg hover:shadow-xl transition-all w-full md:w-auto"
            >
              Send Message
            </button>
          </form>
        </motion.div>

        {/* Contact Info */}
        <motion.div variants={itemVariants}>
          <div className="bg-gradient-to-br from-primary/10 to-secondary/10 dark:from-primary/20 dark:to-secondary/20 p-8 md:p-10 rounded-2xl h-full">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 dark:text-white">Contact Information</h2>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="bg-primary/10 dark:bg-primary/20 p-3 rounded-full text-primary dark:text-primary-light">
                  <FaMapMarkerAlt className="text-xl" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1 dark:text-white">Our Location</h3>
                  <p className="text-gray-600 dark:text-gray-300">123 Volunteer Street, Community City, CC 12345</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-secondary/10 dark:bg-secondary/20 p-3 rounded-full text-secondary dark:text-secondary-light">
                  <FaPhone className="text-xl" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1 dark:text-white">Phone</h3>
                  <p className="text-gray-600 dark:text-gray-300">+1 (555) 123-4567</p>
                  <p className="text-gray-600 dark:text-gray-300">Mon-Fri: 9am-5pm</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-accent/10 dark:bg-accent/20 p-3 rounded-full text-accent dark:text-accent-light">
                  <FaEnvelope className="text-xl" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1 dark:text-white">Email</h3>
                  <p className="text-gray-600 dark:text-gray-300">hello@volunteerhub.org</p>
                  <p className="text-gray-600 dark:text-gray-300">support@volunteerhub.org</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-info/10 dark:bg-info/20 p-3 rounded-full text-info dark:text-info-light">
                  <FaClock className="text-xl" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1 dark:text-white">Office Hours</h3>
                  <p className="text-gray-600 dark:text-gray-300">Monday - Friday: 9:00 AM - 5:00 PM</p>
                  <p className="text-gray-600 dark:text-gray-300">Saturday: 10:00 AM - 2:00 PM</p>
                </div>
              </div>
            </div>

            <div className="mt-10">
              <h3 className="font-semibold text-lg mb-4 dark:text-white">Connect With Us</h3>
              <div className="flex gap-4">
                {['Facebook', 'Twitter', 'Instagram', 'LinkedIn'].map((social, index) => (
                  <motion.a
                    key={index}
                    whileHover={{ y: -3 }}
                    href="#"
                    className="bg-white dark:bg-gray-700 w-12 h-12 rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-all"
                    aria-label={social}
                  >
                    <span className="text-xl">
                      {social === 'Facebook' && '📘'}
                      {social === 'Twitter' && '🐦'}
                      {social === 'Instagram' && '📷'}
                      {social === 'LinkedIn' && '💼'}
                    </span>
                  </motion.a>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Map Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="mb-20 rounded-2xl overflow-hidden shadow-xl"
      >
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3651.102632183169!2d90.4245833154319!3d23.7798751934464!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c79f8a000001%3A0x72d3d1e00c1a5b0d!2sDhaka!5e0!3m2!1sen!2sbd!4v1623861247891!5m2!1sen!2sbd"
          width="100%"
          height="450"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          title="Our Location"
          className="rounded-2xl"
        ></iframe>
      </motion.section>

      {/* FAQ Section */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="mb-20"
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center dark:text-white">
          Frequently Asked <span className="text-primary dark:text-primary-light">Questions</span>
        </h2>
        <div className="max-w-4xl mx-auto space-y-4">
          {[
            {
              question: "How do I sign up as a volunteer?",
              answer: "Simply click on the 'Register' button at the top of the page and fill out our quick registration form."
            },
            {
              question: "Can organizations post volunteer needs?",
              answer: "Yes! Nonprofits and community organizations can register and post their volunteer opportunities."
            },
            {
              question: "Is there a cost to use VolunteerHub?",
              answer: "VolunteerHub is completely free for volunteers. Organizations may have subscription options."
            },
            {
              question: "How can I get in touch with support?",
              answer: "You can reach our support team through the contact form or email us at support@volunteerhub.org."
            }
          ].map((faq, index) => (
            <motion.div 
              key={index}
              variants={itemVariants}
              className="collapse collapse-plus bg-white dark:bg-gray-800 rounded-xl shadow-md"
            >
              <input type="radio" name="faq-accordion" defaultChecked={index === 0} /> 
              <div className="collapse-title text-xl font-medium dark:text-white">
                {faq.question}
              </div>
              <div className="collapse-content"> 
                <p className="text-gray-600 dark:text-gray-300">{faq.answer}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>
    </div>
  );
};

export default Contact;