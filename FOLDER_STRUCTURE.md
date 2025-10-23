# Project Folder Structure

This document explains the organized folder structure of the Volunteer Management System.

## 📁 Root Structure

```
volunter/
├── backend/                    # Backend models and API
│   └── models/
│       └── Rating.js
├── public/                     # Static assets
│   ├── _redirects
│   └── vite.svg
├── src/                        # Source code
│   ├── features/               # Feature-based modules
│   ├── shared/                 # Shared components and utilities
│   ├── core/                   # Core configuration
│   ├── assets/                 # Static assets
│   ├── App.css
│   ├── index.css
│   └── main.jsx
├── package.json
├── vite.config.js
└── eslint.config.js
```

## 🎯 Features Directory (`src/features/`)

Each feature is self-contained with its own components, pages, and logic:

### 🔐 Auth (`src/features/auth/`)
- **Login.jsx** - User login page
- **Register.jsx** - User registration page  
- **Profile.jsx** - User profile management
- **index.js** - Exports all auth components

### 📝 Posts (`src/features/posts/`)
- **AddPost.jsx** - Create new volunteer posts
- **AllPosts.jsx** - Display all available posts
- **PostDetails.jsx** - Individual post details
- **UpdatePost.jsx** - Edit existing posts
- **ManagePosts.jsx** - Manage user's posts
- **index.js** - Exports all post components

### 🤝 Volunteers (`src/features/volunteers/`)
- **BeVolunteer.jsx** - Apply to volunteer for posts
- **MyVolunteerRequests.jsx** - View volunteer applications
- **index.js** - Exports all volunteer components

### ⭐ Ratings (`src/features/ratings/`)
- **AdminRatingManagement.jsx** - Admin rating management
- **RatingManagement.jsx** - General rating management
- **RatingSystem.jsx** - Rating system component
- **index.js** - Exports all rating components

### 📰 Blog (`src/features/blog/`)
- **Blog.jsx** - Blog listing page
- **BlogDetails.jsx** - Individual blog post details
- **BlogManagement.jsx** - Admin blog management
- **index.js** - Exports all blog components

### 📊 Dashboard (`src/features/dashboard/`)
- **DashboardOverview.jsx** - Main dashboard page
- **pages/** - Additional dashboard pages
- **index.js** - Exports all dashboard components

## 🔧 Shared Directory (`src/shared/`)

Reusable components and utilities used across features:

### 🧩 Components (`src/shared/components/`)
- **Footer.jsx** - Site footer
- **LoadingSpinner.jsx** - Loading indicator
- **Navbar.jsx** - Navigation bar
- **index.js** - Exports all shared components

### 📄 Pages (`src/shared/pages/`)
- **About.jsx** - About page
- **Contact.jsx** - Contact page
- **Home.jsx** - Homepage
- **ErrorPage.jsx** - Error handling page
- **index.js** - Exports all shared pages

### 🎣 Hooks (`src/shared/hooks/`)
- **useAuth.jsx** - Authentication hook
- **useAxios.jsx** - HTTP client hook
- **useAxiosSecure.jsx** - Secure HTTP client hook
- **useUserRole.jsx** - User role management hook
- **index.js** - Exports all hooks

### 🏗️ Layouts (`src/shared/layouts/`)
- **DashboardLayout.jsx** - Dashboard page layout
- **MainLayout.jsx** - Main site layout
- **index.js** - Exports all layouts

### 🔐 Context (`src/shared/context/`)
- **AuthProvider.jsx** - Authentication context provider

### 🛣️ Routes (`src/shared/routes/`)
- **router.jsx** - Application routing configuration
- **PrivateRoute.jsx** - Protected route component

## ⚙️ Core Directory (`src/core/`)

Core application configuration and API setup:

### 🔧 Config (`src/core/config/`)
- **firebase/** - Firebase configuration
  - **firebase.config.js** - Firebase setup

## 📦 Benefits of This Structure

### ✅ **Feature-Based Organization**
- Each feature is self-contained
- Easy to locate related files
- Clear separation of concerns

### ✅ **Scalability**
- Easy to add new features
- Minimal impact when modifying existing features
- Clear boundaries between modules

### ✅ **Maintainability**
- Intuitive file organization
- Reduced cognitive load
- Easier code reviews

### ✅ **Reusability**
- Shared components in dedicated folder
- Common utilities easily accessible
- Consistent import patterns

### ✅ **Team Collaboration**
- Clear ownership of features
- Reduced merge conflicts
- Better code organization

## 🔄 Import Patterns

### Feature Imports
```javascript
// Import from features
import { Login, Register } from '../features/auth';
import { AllPosts, AddPost } from '../features/posts';
```

### Shared Imports
```javascript
// Import shared components
import { Navbar, Footer } from '../shared/components';
import { useAuth, useAxios } from '../shared/hooks';
```

### Relative Imports
```javascript
// Within the same feature
import { BeVolunteer } from './BeVolunteer';
import { MyVolunteerRequests } from './MyVolunteerRequests';
```

## 🚀 Getting Started

1. **Navigate to features** - Each feature is in its own folder
2. **Use shared components** - Import from `shared/` for reusable components
3. **Follow naming conventions** - Use descriptive names and consistent patterns
4. **Keep features independent** - Minimize cross-feature dependencies

This structure promotes clean, maintainable, and scalable code organization! 🎉
