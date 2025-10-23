
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
- **Protected Routes:** Role-based access control
- **Firebase Integration:** Enterprise-grade authentication services

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

### 👤 **User Management**
- **Profile Dashboard:** Centralized user information management
- **Post History:** Complete overview of user's volunteer posts
- **Application Tracking:** Monitor volunteer application status


### 🎨 **User Interface & Experience**
- **Responsive Design:** Mobile-first approach with cross-device compatibility
- **Theme Toggle:** Light and dark mode support
- **Smooth Animations:** Framer Motion integration for enhanced UX
- **Loading States:** Professional loading indicators and spinners
- **Error Handling:** Comprehensive error pages and user feedback

## 🛠️ Technology Stack

### **Frontend Technologies**
| Technology | Version | Purpose |
|------------|---------|---------|
| React.js | 18.x | Modern UI framework with hooks |
| Tailwind CSS | 3.x | Utility-first CSS framework |
| DaisyUI | Latest | Component library for Tailwind |
| React Router DOM | 6.x | Client-side routing |
| Framer Motion | Latest | Animation library |

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

### **Development & Deployment**
| Technology | Purpose |
|------------|---------|
| Vite | Build tool and dev server |
| Vercel | Frontend and backend hosting |
| Netlify | Alternative hosting platform |

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

## 🔧 Environment Setup

### **Frontend Environment Variables**
Create a `.env` file in the root directory:

```env
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_IMGBB_API_KEY=your_imgbb_api_key_here
```

### **Backend Environment Variables**
Create a `.env` file in the server directory:

```env
PORT=3000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
```

## 📚 API Documentation

### **Authentication Endpoints**
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/profile` - Get user profile

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
volunteer/
├── src/
│   ├── components/          # Reusable UI components
│   ├── context/            # React context providers
│   ├── hooks/              # Custom React hooks
│   ├── layouts/            # Layout components
│   ├── pages/              # Page components
│   ├── routes/             # Routing configuration
│   ├── firebase/           # Firebase configuration
│   └── assets/             # Static assets
├── public/                 # Public assets
├── backend/                # Server-side code
└── docs/                   # Documentation
```

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
