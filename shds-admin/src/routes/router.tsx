import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import { ProtectedRoute } from "@/routes/protected-route";
import { AdminLayout } from "@/components/layout/admin-layout";

import LoginPage from "@/pages/auth/login";
import ForgotPasswordPage from "@/pages/auth/forgot-password";
import ResetPasswordPage from "@/pages/auth/reset-password";
import SignupPage from "@/pages/auth/signup";
import DashboardPage from "@/pages/dashboard";
import HomepageCmsPage from "@/pages/homepage-cms";
import AboutCmsPage from "@/pages/about-cms";
import ProgramsPage from "@/pages/programs";
import ProjectsPage from "@/pages/projects";
import GalleryPage from "@/pages/gallery";
import TeamMembersPage from "@/pages/team";
import PartnersPage from "@/pages/partners";
import ReportsPage from "@/pages/reports";
import ContactMessagesPage from "@/pages/messages";
import VolunteersPage from "@/pages/volunteers";
import DonationsPage from "@/pages/donations";
import WebsiteSettingsPage from "@/pages/settings";
import SeoSettingsPage from "@/pages/seo";
import MediaLibraryPage from "@/pages/media-library";
import UsersPage from "@/pages/users";
import NotFoundPage from "@/pages/not-found";

const router = createBrowserRouter([
  { path: "/login", element: <LoginPage /> },
  { path: "/forgot-password", element: <ForgotPasswordPage /> },
  { path: "/reset-password", element: <ResetPasswordPage /> },
  { path: "/signup", element: <SignupPage /> },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          { path: "/", element: <DashboardPage /> },
          { path: "/homepage-cms", element: <HomepageCmsPage /> },
          { path: "/about-cms", element: <AboutCmsPage /> },
          { path: "/programs", element: <ProgramsPage /> },
          { path: "/projects", element: <ProjectsPage /> },
          { path: "/gallery", element: <GalleryPage /> },
          { path: "/team", element: <TeamMembersPage /> },
          { path: "/partners", element: <PartnersPage /> },
          { path: "/reports", element: <ReportsPage /> },
          { path: "/messages", element: <ContactMessagesPage /> },
          { path: "/volunteers", element: <VolunteersPage /> },
          { path: "/donations", element: <DonationsPage /> },
          { path: "/media-library", element: <MediaLibraryPage /> },
          { path: "/settings", element: <WebsiteSettingsPage /> },
          { path: "/seo", element: <SeoSettingsPage /> },
          { path: "/users", element: <UsersPage /> },
        ],
      },
    ],
  },
  { path: "*", element: <NotFoundPage /> },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}

// Re-export used by main.tsx for a clean default-navigate fallback if needed.
export { Navigate };
