import { createBrowserRouter } from "react-router-dom";
import { MainLayout, DashboardLayout } from "../layouts";
import { Home, About, Contact, ErrorPage } from "../pages";
import { Login, Register, Profile } from "../../features/auth";
import { AllPosts, AddPost, ManagePosts, PostDetails, UpdatePost } from "../../features/posts";
import { BeVolunteer, MyVolunteerRequests } from "../../features/volunteers";
import { Blog, BlogDetails, BlogManagement } from "../../features/blog";
import { DashboardOverview } from "../../features/dashboard";
import { 
  EventCalendar, 
  EventCreation, 
  EventDetails, 
  EventManagement, 
  EventList, 
  MyEvents, 
  EventCheckIn, 
  EventAnalytics 
} from "../../features/events";
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
      { path: "events", element: <EventList /> },
      { path: "events/calendar", element: <EventCalendar /> },
      { path: "events/:id", element: <EventDetails /> },
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
      // ✅ Event Management Routes
      {
        path: "events/create",
        element: (
          <PrivateRoute>
            <EventCreation />
          </PrivateRoute>
        ),
      },
      {
        path: "events/edit/:id",
        element: (
          <PrivateRoute>
            <EventCreation />
          </PrivateRoute>
        ),
      },
      {
        path: "my-events",
        element: (
          <PrivateRoute>
            <MyEvents />
          </PrivateRoute>
        ),
      },
      {
        path: "events/checkin/:id",
        element: (
          <PrivateRoute>
            <EventCheckIn />
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
      // ✅ Event Management Dashboard Routes
      { path: "events", element: <EventManagement /> },
      { path: "events/create", element: <EventCreation /> },
      { path: "events/edit/:id", element: <EventCreation /> },
      { path: "events/calendar", element: <EventCalendar /> },
      { path: "events/:id", element: <EventDetails /> },
      { path: "my-events", element: <MyEvents /> },
      { path: "events/checkin/:id", element: <EventCheckIn /> },
      { path: "events/analytics", element: <EventAnalytics /> },
      // Simplified dashboard - no role-based sections
    ],
  },
]);

export default router;
