
# 🌍 VolunteerHub - Volunteer Management Platform

**Live Site:** [https://volunteerhub-client.vercel.app](https://volunteerhub2.netlify.app/)  
**Client GitHub Repo:** [GitHub - Client](https://github.com/tazminur/volunter)  
**Server GitHub Repo:** [GitHub - Server](https://github.com/tazminur12/volunteerhub-server)

---

## 📌 Project Purpose

VolunteerHub is a full-stack volunteer management platform that enables users to create and manage volunteer need posts, and others can apply to become volunteers for those posts. This platform makes it easier to organize and participate in humanitarian activities.

---

## ✨ Key Features

### 🔐 Authentication
- Email & Password authentication
- Google Sign-in
- JWT-based protected routes
- Auth state management via Firebase

### 📝 Post Management
- Add Volunteer Need Post (private)
- Edit / Update Post
- Delete Post with confirmation
- View all posts with search by title
- View post details (private)
- Responsive modal to apply as volunteer

### 🙋 Be a Volunteer
- Users can apply to be a volunteer for a post
- Application form is pre-filled with read-only post and user data
- Volunteers count auto-decreases after each successful request
- Requests stored in a separate collection

### 👤 User Profile Panel
- Manage My Posts (table view with update/delete)
- Manage My Volunteer Requests (with cancel option)

### 💡 UI/UX Features
- Fully responsive (mobile, tablet, desktop)
- Light/Dark theme toggle
- 404 Not Found Page
- Loading Spinner component
- Framer Motion animation
- SweetAlert2 for confirmation & success alerts

---

## 🛠️ Tech Stack

| Category     | Technologies Used                          |
|--------------|---------------------------------------------|
| Frontend     | React.js, Tailwind CSS, DaisyUI             |
| Routing      | React Router DOM                           |
| Auth         | Firebase Authentication, JWT                |
| Backend      | Node.js, Express.js                         |
| Database     | MongoDB                                     |
| State / UI   | Context API, Framer Motion, React Icons     |
| Hosting      | Vercel (client & server)                    |

---

## 🌐 Environment Variables

### 🔑 Client `.env`

```bash
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
````

### 🔑 Server `.env`

```bash
PORT=3000
MONGODB_URI=your_mongo_db_connection_uri
JWT_SECRET=your_jwt_secret_key
```

---

## 🚀 Deployment Checklist

* [x] Firebase config stored in `.env`
* [x] MongoDB credentials secured via environment variables
* [x] JWT token implemented & verified on backend
* [x] Vercel domain added to Firebase Authentication whitelist
* [x] Live site properly deployed on Vercel
* [x] No 404/CORS errors on reload or routing
* [x] Spinner component used during data loading
* [x] 404 Page implemented
* [x] Mobile, Tablet, Desktop responsive tested

---

## 📁 Folder Structure (Client)

```
/src
  /components
  /context
  /hooks
  /layouts
  /pages
  /router
  /utils
  App.jsx
  main.jsx
```

---

## 💡 Optional Features (Implemented)

* Dark/Light Mode Toggle
* Volunteer count control using MongoDB `$inc` operator
* Modal-based application form
* Framer Motion animation on home page

---

## 🙋‍♂️ Author

**Tazminur Rahman Tanim**
📧 tanimkhalifa55@gmail.com
🌐 [Portfolio](https://yourportfolio.com)

---

> 📝 This project was built as part of the Volunteer Management System Assignment (Assignment-11) from Programming Hero's Web Development Course.

```

---

### 🧠 Tips:
- Replace all placeholder links like `yourusername`, `tanim@example.com`, and `yourportfolio.com` with your own details.
- You can also add badges (`![Netlify Status](https://img.shields.io/...`) if you want.
- Include screenshots if time permits.

Let me know if you want:
- `.env.example` file
- GitHub descriptions
- Deployment command list  
I'm happy to help! ✅
```
