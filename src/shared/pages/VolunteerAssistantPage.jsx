import React, { useState } from 'react';
import { GoogleGenAI } from '@google/genai';
import { 
  FiUser, 
  FiBriefcase, 
  FiTarget, 
  FiHeart, 
  FiZap, 
  FiBookOpen, 
  FiUsers, 
  FiCalendar, 
  FiArrowRight,
  FiCheck,
  FiStar,
  FiTrendingUp,
  FiAward
} from 'react-icons/fi';
import { motion } from 'framer-motion';

const VolunteerAssistantPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    currentRole: '',
    skills: '',
    volunteerGoals: '',
    experience: '',
    interests: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [advice, setAdvice] = useState('');
  const [showAdvice, setShowAdvice] = useState(false);

  const ai = new GoogleGenAI({
    apiKey: import.meta.env.VITE_GEMINI_API_KEY
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const getVolunteerContext = () => {
    return `
    You are a comprehensive Volunteer Career Advisor for a volunteer platform. Your role is to provide personalized volunteer advice based on user information.
    
    **User Information:**
    - Name: ${formData.name}
    - Current Role: ${formData.currentRole}
    - Skills: ${formData.skills}
    - Volunteer Goals: ${formData.volunteerGoals}
    - Experience Level: ${formData.experience}
    - Interests: ${formData.interests}
    
    **Provide personalized advice including:**
    1. **Volunteer Opportunities**: Suggest specific volunteer roles that match their skills and interests
    2. **Skill Development**: Recommend skills to develop for their volunteer goals
    3. **Career Integration**: How volunteering can enhance their current career
    4. **Action Steps**: 3-5 specific, actionable steps they can take
    5. **Motivation**: Encouraging and inspiring message
    
    **Response Style:**
    - Use emojis appropriately
    - Structure with clear headings
    - Be personal and encouraging
    - Provide specific, actionable advice
    - Keep it comprehensive but readable
    - End with an inspiring call-to-action
    
    Always be encouraging, professional, and provide value-added personalized information.
    `;
  };

  const handleGetAdvice = async () => {
    if (!formData.name || !formData.volunteerGoals) {
      alert('Please fill in at least your name and volunteer goals');
      return;
    }

    setIsLoading(true);
    setShowAdvice(false);

    try {
      const context = getVolunteerContext();
      const prompt = `${context}\n\nPlease provide personalized volunteer career advice for this user.`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });

      setAdvice(response.text || "I'm sorry, I couldn't process your request. Please try again.");
      setShowAdvice(true);
    } catch (error) {
      console.error('Error generating advice:', error);
      setAdvice("I'm sorry, I'm having trouble connecting right now. Please try again later. You can also try refreshing the page or checking your internet connection.");
      setShowAdvice(true);
    } finally {
      setIsLoading(false);
    }
  };

  const quickTips = [
    { icon: FiCalendar, text: "Find Events", color: "blue", description: "Discover opportunities" },
    { icon: FiZap, text: "Get Started", color: "emerald", description: "Beginner friendly" },
    { icon: FiBookOpen, text: "Set Goals", color: "indigo", description: "Plan your journey" },
    { icon: FiUsers, text: "Build Skills", color: "purple", description: "Grow professionally" }
  ];

  const features = [
    { icon: FiStar, title: "Personalized Recommendations", description: "AI-powered volunteer role matching" },
    { icon: FiTrendingUp, title: "Skill Development", description: "Tailored learning pathways" },
    { icon: FiUsers, title: "Community Building", description: "Connect with like-minded volunteers" },
    { icon: FiAward, title: "Achievement Tracking", description: "Monitor your volunteer journey" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-7">
      {/* Professional Header Section */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mb-6">
              <FiZap className="text-white text-2xl" />
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight">
              AI-Powered Volunteer
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                Career Assistant
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Get personalized guidance, discover opportunities, and accelerate your volunteer journey with intelligent insights tailored just for you.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">

        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Form Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2"
          >
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
                <h2 className="text-xl font-semibold text-white flex items-center">
                  <FiUser className="mr-3" />
                  Personal Information
                </h2>
                <p className="text-blue-100 text-sm mt-1">Help us understand your background and goals</p>
              </div>
              <div className="p-6 sm:p-8 space-y-6">
              {/* Name */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                    <FiUser className="mr-2 text-blue-600" />
                    Your Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                    <FiBriefcase className="mr-2 text-blue-600" />
                    Current Role
                  </label>
                  <input
                    type="text"
                    name="currentRole"
                    value={formData.currentRole}
                    onChange={handleInputChange}
                    placeholder="e.g., Software Developer, Teacher"
                    className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                  />
                </div>
              </div>

              {/* Skills and Experience */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                    <FiZap className="mr-2 text-blue-600" />
                    Skills & Expertise
                  </label>
                  <input
                    type="text"
                    name="skills"
                    value={formData.skills}
                    onChange={handleInputChange}
                    placeholder="e.g., Teaching, Coding, Design"
                    className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                    <FiHeart className="mr-2 text-blue-600" />
                    Volunteer Experience
                  </label>
                  <select
                    name="experience"
                    value={formData.experience}
                    onChange={handleInputChange}
                    className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                  >
                    <option value="">Select experience level</option>
                    <option value="beginner">Beginner (0-1 years)</option>
                    <option value="intermediate">Intermediate (1-3 years)</option>
                    <option value="experienced">Experienced (3+ years)</option>
                    <option value="expert">Expert (5+ years)</option>
                  </select>
                </div>
              </div>

              {/* Interests */}
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                  <FiTarget className="mr-2 text-blue-600" />
                  Volunteer Interests
                </label>
                <input
                  type="text"
                  name="interests"
                  value={formData.interests}
                  onChange={handleInputChange}
                  placeholder="e.g., Education, Environment, Healthcare, Community"
                  className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                />
              </div>

              {/* Volunteer Goals */}
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                  <FiTarget className="mr-2 text-blue-600" />
                  Your Volunteer Goals *
                </label>
                <textarea
                  name="volunteerGoals"
                  value={formData.volunteerGoals}
                  onChange={handleInputChange}
                  placeholder="Describe what you want to achieve through volunteering... (This helps us provide better personalized advice)"
                  rows={4}
                  className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none bg-gray-50 focus:bg-white"
                />
              </div>

              {/* Submit Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleGetAdvice}
                disabled={isLoading || !formData.name || !formData.volunteerGoals}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-400 text-white font-bold py-4 px-6 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl disabled:shadow-none"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Generating Your Advice...</span>
                  </>
                ) : (
                  <>
                    <FiZap className="mr-2" />
                    <span>Get Personalized Advice</span>
                    <FiArrowRight className="ml-2" />
                  </>
                )}
              </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Sidebar Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Quick Tips */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-emerald-500 to-teal-600 px-6 py-4">
                <h3 className="text-lg font-semibold text-white flex items-center">
                  <FiZap className="mr-2" />
                  Quick Tips
                </h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {quickTips.map((tip, index) => (
                    <div
                      key={index}
                      className="flex flex-col p-4 rounded-lg bg-gray-50 border border-gray-200 hover:shadow-md transition-all duration-200"
                    >
                      <div className="flex items-center space-x-2 mb-2">
                        <div className={`w-8 h-8 rounded-full bg-${tip.color}-100 flex items-center justify-center`}>
                          <tip.icon size={16} className={`text-${tip.color}-600`} />
                        </div>
                        <span className="text-sm font-semibold text-gray-800">{tip.text}</span>
                      </div>
                      <p className="text-xs text-gray-600">{tip.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* AI Advice */}
            {showAdvice && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden"
              >
                <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                      <FiZap className="text-white" size={16} />
                    </div>
                    <h3 className="text-lg font-semibold text-white">Your Personalized Advice</h3>
                  </div>
                </div>
                <div className="p-6">
                  <div className="prose prose-sm max-w-none">
                    <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                      {advice}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Features */}
            <div className="bg-gradient-to-r from-slate-800 to-gray-900 rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 bg-gradient-to-r from-slate-700 to-gray-800">
                <h3 className="text-lg font-semibold text-white flex items-center">
                  <FiStar className="mr-2 text-yellow-400" />
                  Why Choose Our AI Assistant?
                </h3>
              </div>
              <div className="p-6 space-y-4">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <feature.icon size={14} className="text-blue-600" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 mb-1">{feature.title}</h4>
                      <p className="text-xs text-gray-600">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default VolunteerAssistantPage;
