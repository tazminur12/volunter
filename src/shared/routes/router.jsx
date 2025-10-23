import { createBrowserRouter } from "react-router-dom";
import { MainLayout, DashboardLayout } from "../layouts";
import { Home, About, Contact, ErrorPage } from "../pages";
import { Login, Register, Profile } from "../../features/auth";
import { AllPosts, AddPost, ManagePosts, PostDetails, UpdatePost } from "../../features/posts";
import { BeVolunteer, MyVolunteerRequests } from "../../features/volunteers";
import { Blog, BlogDetails, BlogManagement } from "../../features/blog";
import { DashboardOverview } from "../../features/dashboard";
import PrivateRoute from "./PrivateRoute";

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
      // ✅ Protected Routes (legacy direct paths)
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
      },
    ],
  },
  // ✅ Standalone Dashboard layout (no Navbar/Footer) - All users have same access
  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <DashboardLayout />
      </PrivateRoute>
    ),
    children: [
      { index: true, element: <DashboardOverview /> },
      { path: "profile", element: <Profile /> },
      { path: "add-post", element: <AddPost /> },
      { path: "my-posts", element: <ManagePosts /> },
      { path: "update-post/:id", element: <UpdatePost /> },
      { path: "blog-management", element: <BlogManagement /> },
      // Simplified dashboard - no role-based sections
    ],
  },
]);

export default router;
