
# 🌟 VolunteerHub - Comprehensive Volunteer Management Platform

[![Netlify Status](https://img.shields.io/netlify/your-deploy-id)](https://volunteerhub2.netlify.app/)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-blue.svg)](https://github.com/tazminur12/volunter)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

> A modern, full-stack volunteer management platform built with React, Node.js, and MongoDB to facilitate humanitarian activities and community service.

## 🚀 Live Demo

- **Frontend:** [https://volunteerhub2.netlify.app/](https://volunteerhub2.netlify.app/)
- **Client Repository:** [https://github.com/tazminur12/volunter](https://github.com/tazminur12/volunter)
- **Server Repository:** [https://github.com/tazminur12/volunteerhub-server](https://github.com/tazminur12/volunteerhub-server)

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Getting Started](#getting-started)
- [Environment Setup](#environment-setup)
- [API Documentation](#api-documentation)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## 🎯 Overview

VolunteerHub is a comprehensive volunteer management platform designed to bridge the gap between organizations seeking volunteers and individuals looking to contribute to meaningful causes. The platform provides an intuitive interface for creating, managing, and applying to volunteer opportunities, making community service more accessible and organized.

### 🎯 Key Objectives

- **Streamline Volunteer Coordination:** Simplify the process of matching volunteers with opportunities
- **Enhance User Experience:** Provide an intuitive, responsive interface for all users
- **Secure Authentication:** Implement robust user authentication and authorization
- **Real-time Updates:** Ensure accurate volunteer count and status tracking

## ✨ Features

### 🔐 **Authentication & Security**
- **Multi-Provider Login:** Email/password and Google OAuth integration
- **JWT Token Management:** Secure, stateless authentication
- **Protected Routes:** Role-based access control with role persistence
- **Firebase Integration:** Enterprise-grade authentication services
- **Role Persistence:** Smart role caching with automatic refresh

### 📝 **Post Management System**
- **Create Posts:** Intuitive form for volunteer opportunity creation
- **Edit & Update:** Seamless post modification capabilities
- **Delete with Confirmation:** Safe deletion with user confirmation
- **Search & Filter:** Advanced search functionality by title and category
- **Responsive Design:** Optimized for all device sizes

### 🙋 **Volunteer Application System**
- **Smart Application Forms:** Pre-filled with relevant post and user information
- **Real-time Count Updates:** Automatic volunteer count management
- **Request Tracking:** Comprehensive volunteer request management
- **Status Updates:** Real-time application status tracking

### 🎉 **Impact Feed (Community Wall)**
- **Share Impact Stories:** Volunteers can post about their experiences
- **Photo Sharing:** Upload up to 5 photos per post
- **Category System:** Organize posts by categories (Environment, Education, Health, Community)
- **Event Linking:** Connect posts to specific volunteer events
- **Social Features:** Like, comment, and share posts
- **Real-time Engagement:** Live updates and interactions

### 🗓️ **Event Management System**
- **Event Creation:** Comprehensive event creation with date, time, and location
- **Event Calendar:** Visual calendar view of all events
- **Event Analytics:** Track event performance and volunteer engagement
- **Check-in System:** Digital check-in for event attendance
- **Event Details:** Rich event information with volunteer requirements
- **My Events:** Personal event dashboard for organizers

### 💬 **Live Chat & AI Assistant**
- **AI-Powered Chat:** Gemini 2.5 Flash model for intelligent responses
- **Volunteer-Specific Context:** Trained for volunteer platform queries
- **Real-time Chat:** Instant responses with loading indicators
- **Chat History:** Maintains conversation context
- **Quick Actions:** Pre-defined responses for common queries

### 📰 **Blog Management System**
- **Blog Creation:** Rich text editor for creating blog posts
- **Blog Categories:** Organize content by categories
- **Blog Details:** Individual blog post pages with comments
- **Admin Management:** Complete blog management for administrators
- **Search & Filter:** Find blog posts by title and category

### ⭐ **Rating & Review System**
- **Volunteer Ratings:** Rate volunteers based on performance
- **Admin Management:** Comprehensive rating management system
- **Rating Analytics:** Track and analyze volunteer performance
- **Review System:** Detailed feedback and comments

### 👤 **User Management**
- **Profile Dashboard:** Centralized user information management
- **Post History:** Complete overview of user's volunteer posts
- **Application Tracking:** Monitor volunteer application status
- **Role-based Access:** Different dashboards for volunteers and organizers

### 🎨 **User Interface & Experience**
- **Responsive Design:** Mobile-first approach with cross-device compatibility
- **Theme Toggle:** Light and dark mode support
- **Smooth Animations:** Framer Motion integration for enhanced UX
- **Loading States:** Professional loading indicators and spinners
- **Error Handling:** Comprehensive error pages and user feedback
- **Modern UI:** Clean, intuitive interface with social media elements

## 🛠️ Technology Stack

### **Frontend Technologies**
| Technology | Version | Purpose |
|------------|---------|---------|
| React.js | 19.x | Modern UI framework with hooks |
| Tailwind CSS | 4.x | Utility-first CSS framework |
| DaisyUI | 5.x | Component library for Tailwind |
| React Router DOM | 7.x | Client-side routing |
| Framer Motion | 12.x | Animation library |
| React Query | 5.x | Server state management |
| React Icons | 5.x | Icon library |
| React Hot Toast | 2.x | Toast notifications |
| SweetAlert2 | 11.x | Beautiful alerts and modals |

### **AI & Chat Technologies**
| Technology | Version | Purpose |
|------------|---------|---------|
| Google Gemini AI | 1.26.x | AI-powered chat assistant |
| @google/genai | Latest | Gemini AI integration |

### **Date & Time Management**
| Technology | Version | Purpose |
|------------|---------|---------|
| date-fns | 4.x | Date utility library |
| React DatePicker | 8.x | Date picker component |

### **UI/UX Enhancements**
| Technology | Version | Purpose |
|------------|---------|---------|
| React Slick | 0.30.x | Carousel component |
| Slick Carousel | 1.8.x | Carousel functionality |
| React Helmet Async | 2.x | Document head management |
| Lodash | 4.x | Utility functions |

### **Backend Technologies**
| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | 18.x | JavaScript runtime environment |
| Express.js | 4.x | Web application framework |
| MongoDB | 6.x | NoSQL database |
| Mongoose | 7.x | MongoDB object modeling |

### **Authentication & Security**
| Technology | Purpose |
|------------|---------|
| Firebase Auth | User authentication service |
| JWT | Stateless authentication tokens |
| bcrypt | Password hashing |
| Role Persistence | Smart role caching system |

### **Development & Deployment**
| Technology | Purpose |
|------------|---------|
| Vite | Build tool and dev server |
| ESLint | Code linting and formatting |
| Vercel | Frontend and backend hosting |
| Netlify | Alternative hosting platform |

## 🎉 Impact Feed (Community Wall)

The Impact Feed is a social media-style community wall where volunteers can share their experiences, photos, and stories after participating in volunteer events. It's designed to inspire others and create a sense of community among volunteers.

### Key Features
- **Share Impact Stories**: Volunteers can post about their volunteer experiences
- **Photo Sharing**: Upload up to 5 photos per post with captions
- **Category System**: Organize posts by categories (Environment, Education, Health, Community)
- **Event Linking**: Connect posts to specific volunteer events
- **Social Features**: Like, comment, and share posts with real-time updates
- **Modern UI**: Instagram/Facebook-like interface with smooth animations

### Technical Implementation
- **React Query**: Server state management with optimistic updates
- **Image Upload**: Secure image handling with validation
- **Real-time Updates**: Live engagement tracking
- **Responsive Design**: Mobile-first approach with grid layouts

## 💬 Live Chat & AI Assistant

An intelligent chat system powered by Google's Gemini 2.5 Flash model, specifically trained for volunteer platform queries.

### Key Features
- **AI-Powered Responses**: Intelligent responses using Gemini 2.5 Flash
- **Volunteer-Specific Context**: Trained for volunteer platform queries
- **Real-time Chat**: Instant responses with loading indicators
- **Chat History**: Maintains conversation context
- **Quick Actions**: Pre-defined responses for common queries
- **Floating Interface**: Non-intrusive chat button

### Technical Implementation
- **Google Gemini AI**: Advanced language model integration
- **Context Management**: Maintains conversation state
- **Error Handling**: Graceful error handling with retry options
- **Responsive Design**: Works on all device sizes

## 🗓️ Event Management System

A comprehensive event management system for creating, managing, and tracking volunteer events.

### Key Features
- **Event Creation**: Rich event creation with date, time, location, and requirements
- **Event Calendar**: Visual calendar view of all events
- **Event Analytics**: Track event performance and volunteer engagement
- **Check-in System**: Digital check-in for event attendance
- **Event Details**: Comprehensive event information
- **My Events**: Personal event dashboard for organizers

### Technical Implementation
- **Date Management**: Advanced date handling with date-fns
- **Calendar Integration**: Visual calendar with event display
- **Analytics Dashboard**: Performance tracking and metrics
- **Real-time Updates**: Live event status updates

## 📰 Blog Management System

A complete blog management system for creating and managing content.

### Key Features
- **Blog Creation**: Rich text editor for creating blog posts
- **Blog Categories**: Organize content by categories
- **Blog Details**: Individual blog post pages with comments
- **Admin Management**: Complete blog management for administrators
- **Search & Filter**: Find blog posts by title and category

### Technical Implementation
- **Rich Text Editor**: Advanced text editing capabilities
- **Category Management**: Dynamic category system
- **Comment System**: Interactive comment functionality
- **Admin Controls**: Comprehensive management interface

## ⭐ Rating & Review System

A comprehensive rating and review system for tracking volunteer performance.

### Key Features
- **Volunteer Ratings**: Rate volunteers based on performance
- **Admin Management**: Comprehensive rating management system
- **Rating Analytics**: Track and analyze volunteer performance
- **Review System**: Detailed feedback and comments

### Technical Implementation
- **Rating Models**: Structured rating data models
- **Analytics Dashboard**: Performance tracking and visualization
- **Admin Interface**: Complete management system
- **Data Validation**: Secure rating data handling

## 🚀 Getting Started

### **Prerequisites**
- Node.js (v18 or higher)
- MongoDB (v6 or higher)
- Git
- Modern web browser

### **Installation Steps**

1. **Clone the Repository**
   ```bash
   git clone https://github.com/tazminur12/volunter.git
   cd volunter
   ```

2. **Install Dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment Configuration**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

## 🔧 Feature Setup

### **Impact Feed Setup**
The Impact Feed is ready to use with the following features:
- Social media-style community wall
- Photo sharing (up to 5 images per post)
- Like, comment, and share functionality
- Category-based organization
- Real-time updates

### **Live Chat Setup**
1. Get your Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Add `VITE_GEMINI_API_KEY=your_api_key` to your `.env` file
3. The chat will appear as a floating button in the bottom-right corner

### **Event Management Setup**
- Event creation with date, time, and location
- Calendar view for all events
- Analytics dashboard for event performance
- Digital check-in system
- Event linking with Impact Feed

### **Blog System Setup**
- Rich text editor for blog creation
- Category management
- Comment system
- Admin management interface
- Search and filter functionality

### **Rating System Setup**
- Volunteer performance rating
- Admin rating management
- Rating analytics
- Review system with detailed feedback

## 🔧 Environment Setup

### **Frontend Environment Variables**
Create a `.env` file in the root directory:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# Image Upload Service
VITE_IMGBB_API_KEY=your_imgbb_api_key_here

# AI Chat Service
VITE_GEMINI_API_KEY=your_gemini_api_key_here

# API Base URL
VITE_API_BASE_URL=http://localhost:3000/api
```

### **Backend Environment Variables**
Create a `.env` file in the server directory:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database
MONGODB_URI=your_mongodb_connection_string

# Authentication
JWT_SECRET=your_jwt_secret_key

# AI Services
GEMINI_API_KEY=your_gemini_api_key_here

# Image Upload
IMGBB_API_KEY=your_imgbb_api_key_here

# CORS Configuration
CLIENT_URL=http://localhost:5173
```

## 📚 API Documentation

### **Authentication Endpoints**
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/profile` - Get user profile
- `GET /api/auth/role` - Get user role with persistence

### **Post Management Endpoints**
- `GET /api/posts` - Retrieve all posts
- `POST /api/posts` - Create new post
- `PUT /api/posts/:id` - Update existing post
- `DELETE /api/posts/:id` - Delete post
- `GET /api/posts/:id` - Get post details

### **Volunteer Management Endpoints**
- `POST /api/volunteers/apply` - Apply for volunteer position
- `GET /api/volunteers/requests` - Get volunteer requests
- `PUT /api/volunteers/requests/:id` - Update request status

### **Event Management Endpoints**
- `GET /api/events` - Retrieve all events
- `POST /api/events` - Create new event
- `PUT /api/events/:id` - Update existing event
- `DELETE /api/events/:id` - Delete event
- `GET /api/events/:id` - Get event details
- `POST /api/events/:id/checkin` - Event check-in
- `GET /api/events/analytics` - Get event analytics

### **Impact Feed Endpoints**
- `GET /api/impact-feed` - Retrieve all impact posts
- `POST /api/impact-feed` - Create new impact post
- `PUT /api/impact-feed/:id` - Update impact post
- `DELETE /api/impact-feed/:id` - Delete impact post
- `POST /api/impact-feed/:id/like` - Like/unlike post
- `POST /api/impact-feed/:id/comment` - Add comment
- `GET /api/impact-feed/:id/comments` - Get post comments

### **Blog Management Endpoints**
- `GET /api/blog` - Retrieve all blog posts
- `POST /api/blog` - Create new blog post
- `PUT /api/blog/:id` - Update blog post
- `DELETE /api/blog/:id` - Delete blog post
- `GET /api/blog/:id` - Get blog post details
- `GET /api/blog/categories` - Get blog categories

### **Rating System Endpoints**
- `GET /api/ratings` - Get all ratings
- `POST /api/ratings` - Create new rating
- `PUT /api/ratings/:id` - Update rating
- `DELETE /api/ratings/:id` - Delete rating
- `GET /api/ratings/user/:userId` - Get user ratings
- `GET /api/ratings/analytics` - Get rating analytics

### **Chat & AI Endpoints**
- `POST /api/chat/message` - Send chat message to AI
- `GET /api/chat/history` - Get chat history
- `DELETE /api/chat/history` - Clear chat history

## 🚀 Deployment

### **Frontend Deployment (Vercel)**
1. Connect your GitHub repository to Vercel
2. Configure build settings:
   - Build Command: `npm run build`
   - Output Directory: `dist`
3. Set environment variables
4. Deploy

### **Backend Deployment (Vercel)**
1. Configure serverless functions
2. Set environment variables
3. Deploy API endpoints

### **Database Setup (MongoDB Atlas)**
1. Create MongoDB Atlas cluster
2. Configure network access
3. Create database user
4. Get connection string

## 📁 Project Structure

```
volunter/
├── src/
│   ├── features/           # Feature-based modules
│   │   ├── auth/           # Authentication system
│   │   ├── blog/           # Blog management
│   │   ├── chat/           # Live chat & AI assistant
│   │   ├── dashboard/      # Dashboard components
│   │   ├── events/         # Event management
│   │   ├── impact-feed/    # Community wall
│   │   ├── posts/          # Post management
│   │   ├── ratings/        # Rating system
│   │   └── volunteers/     # Volunteer management
│   ├── shared/             # Shared components and utilities
│   │   ├── components/     # Reusable UI components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── layouts/        # Layout components
│   │   ├── pages/          # Shared pages
│   │   ├── routes/         # Routing configuration
│   │   ├── context/        # React context providers
│   │   └── utils/          # Utility functions
│   ├── core/               # Core configuration
│   │   ├── api/            # API configuration
│   │   └── config/         # App configuration
│   │       └── firebase/   # Firebase setup
│   ├── assets/            # Static assets
│   ├── App.css            # Global styles
│   ├── index.css          # Base styles
│   └── main.jsx           # Application entry point
├── backend/                # Server-side code
│   └── models/             # Database models
├── public/                 # Public assets
├── dist/                   # Build output
├── package.json           # Dependencies
├── vite.config.js         # Vite configuration
└── eslint.config.js       # ESLint configuration
```

### 🎯 Feature-Based Architecture

Each feature is self-contained with its own components, pages, and logic:

#### 🔐 **Authentication (`src/features/auth/`)**
- **Login.jsx** - User login page
- **Register.jsx** - User registration page  
- **Profile.jsx** - User profile management
- **index.js** - Exports all auth components

#### 📝 **Posts (`src/features/posts/`)**
- **AddPost.jsx** - Create new volunteer posts
- **AllPosts.jsx** - Display all available posts
- **PostDetails.jsx** - Individual post details
- **UpdatePost.jsx** - Edit existing posts
- **ManagePosts.jsx** - Manage user's posts
- **usePostQueries.js** - React Query hooks

#### 🎉 **Impact Feed (`src/features/impact-feed/`)**
- **ImpactFeed.jsx** - Main feed component
- **ImpactPost.jsx** - Individual post component
- **CreateImpactPost.jsx** - Post creation modal
- **useImpactFeedQueries.js** - React Query hooks

#### 🗓️ **Events (`src/features/events/`)**
- **EventCreation.jsx** - Create new events
- **EventList.jsx** - Display all events
- **EventDetails.jsx** - Individual event details
- **EventCalendar.jsx** - Calendar view
- **EventManagement.jsx** - Event management
- **EventAnalytics.jsx** - Analytics dashboard
- **useEventQueries.js** - React Query hooks

#### 💬 **Chat (`src/features/chat/`)**
- **LiveChat.jsx** - Main chat component
- **SimpleChat.jsx** - Simplified chat
- **VolunteerChatBot.jsx** - AI chatbot
- **useChat.js** - Chat functionality hook
- **chatService.js** - AI service integration

#### 📰 **Blog (`src/features/blog/`)**
- **Blog.jsx** - Blog listing page
- **BlogDetails.jsx** - Individual blog post
- **BlogManagement.jsx** - Admin blog management
- **useBlogQueries.js** - React Query hooks

#### ⭐ **Ratings (`src/features/ratings/`)**
- **RatingSystem.jsx** - Rating component
- **RatingManagement.jsx** - Rating management
- **AdminRatingManagement.jsx** - Admin rating management
- **useRatingQueries.js** - React Query hooks

#### 🤝 **Volunteers (`src/features/volunteers/`)**
- **BeVolunteer.jsx** - Apply to volunteer
- **MyVolunteerRequests.jsx** - View applications
- **useVolunteerQueries.js** - React Query hooks

### 🔧 **Shared Components (`src/shared/`)**

Reusable components and utilities used across features:

#### 🧩 **Components (`src/shared/components/`)**
- **Footer.jsx** - Site footer
- **LoadingSpinner.jsx** - Loading indicator
- **Navbar.jsx** - Navigation bar

#### 🎣 **Hooks (`src/shared/hooks/`)**
- **useAuth.jsx** - Authentication hook
- **useAxios.jsx** - HTTP client hook
- **useAxiosSecure.jsx** - Secure HTTP client hook
- **useUserRole.jsx** - User role management hook

#### 🏗️ **Layouts (`src/shared/layouts/`)**
- **DashboardLayout.jsx** - Dashboard page layout
- **MainLayout.jsx** - Main site layout

#### 🔐 **Context (`src/shared/context/`)**
- **AuthProvider.jsx** - Authentication context provider

#### 🛣️ **Routes (`src/shared/routes/`)**
- **router.jsx** - Application routing configuration
- **PrivateRoute.jsx** - Protected route component

## 🤝 Contributing

We welcome contributions to improve VolunteerHub! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### **Development Guidelines**
- Follow the existing code style
- Write meaningful commit messages
- Test your changes thoroughly
- Update documentation as needed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Tazminur Rahman Tanim**
- 📧 Email: [tanimkhalifa55@gmail.com](mailto:tanimkhalifa55@gmail.com)
- 🌐 Portfolio: [Your Portfolio URL]
- 🔗 LinkedIn: [Your LinkedIn Profile]
- 🐦 Twitter: [@YourTwitterHandle]

## 🙏 Acknowledgments

- **Programming Hero** - For providing the educational foundation
- **Open Source Community** - For the amazing tools and libraries
- **Contributors** - Everyone who has helped improve this project

## 📞 Support

If you have any questions or need support:

- 📧 Email: [tanimkhalifa55@gmail.com](mailto:tanimkhalifa55@gmail.com)
- 🐛 Issues: [GitHub Issues](https://github.com/tazminur12/volunter/issues)
- 📖 Documentation: [Project Wiki](https://github.com/tazminur12/volunter/wiki)

---

<div align="center">

**⭐ Star this repository if you find it helpful! ⭐**

*Built with ❤️ for the community*

</div>
