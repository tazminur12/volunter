import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import AllPosts from "../pages/AllPosts";
import AddPost from "../pages/AddPost";
import ManagePosts from "../pages/ManagePosts";
import PostDetails from "../pages/PostDetails"; import BeVolunteer from "../pages/BeVolunteer"; // If implemented
import ErrorPage from "../pages/ErrorPage";
import PrivateRoute from "./PrivateRoute";
import MyVolunteerRequests from "../pages/MyVolunteerRequests"; // If implemented
import Contact from "../pages/Contact";
import About from "../pages/About";
import Blog from "../pages/Blog";
import BlogDetails from "../pages/BlogDetails";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <ErrorPage />,
    children: [
      { path: "/", element: <Home /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      { path: "all-posts", element: <AllPosts /> },
      { path: "blog", element: <Blog /> },
      { path: "blog/:id", element: <BlogDetails /> },
      { path: "about", element: <About></About>},
      { path: "contact", element: <Contact></Contact>},
      // ✅ Protected Routes
      {
        path: "add-post",
        element: (
          <PrivateRoute>
            <AddPost />
          </PrivateRoute>
        ),
      },
      {
        path: "update-post/:id",
        element: (
          <PrivateRoute>
            <AddPost /> {/* You can reuse AddPost with edit mode */}
          </PrivateRoute>
        ),
      },
      {
        path: "manage-posts",
        element: (
          <PrivateRoute>
            <ManagePosts />
          </PrivateRoute>
        ),
      },
      {
        path: "post/:id", // ✅ single version
        element: (
          <PrivateRoute>
            <PostDetails />
          </PrivateRoute>
        ),
      },
      {
        path: "/apply/:id",
        element: (
          <PrivateRoute>
            <BeVolunteer />
          </PrivateRoute>
        ),
      },
      {
        path: "my-requests/:id", // ✅ single version
        element: (
          <PrivateRoute>
            <MyVolunteerRequests />
          </PrivateRoute>
        ),
      }
      
    ],
  },
]);

export default router;
