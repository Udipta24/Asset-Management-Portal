import { useState, useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import PageTransition from "./components/PageTransition.jsx";
import GlobalLoader from "./components/GlobalLoader.jsx";

// ContextProviders
import { ReferenceDataProvider } from "./context/ReferenceDataContext.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";

// Layout
import MainLayout from "./layout/MainLayout.jsx";

// Auth
import ProtectedRoute from "./auth/ProtectedRoute";

// Pages
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgetPassword from "./pages/ForgetPassword";
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./pages/Dashboard";
import AssetCreate from "./pages/AssetCreate";
import AssetDetail from "./pages/AssetDetail";
import AssetEdit from "./pages/AssetEdit";
import AssetList from "./pages/AssetList";
import AssetLocations from "./pages/AssetLocations";
import Departments from "./pages/Departments";
import Designations from "./pages/Designations";
import Categories from "./pages/Categories";
import Subcategories from "./pages/Subcategories";

import Maintenance from "./pages/Maintenance";

import Vendors from "./pages/Vendors";
import Users from "./pages/Users";
import Profile from "./pages/Profile"

import RequestPage from "./pages/RequestPage";
import MyRequests from "./pages/MyRequests";
import RequestsManagement from "./pages/RequestsManagement";

import { ThemeProvider } from "./context/ThemeContext";

export default function App() {
  const [loading, setLoading] = useState(false);

  return (
    <ThemeProvider>
      <AuthProvider>
        <ReferenceDataProvider>
          {loading && <GlobalLoader />}
          <AnimatedRoutes setLoading={setLoading} />
        </ReferenceDataProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

function AnimatedRoutes({ setLoading }) {
  const location = useLocation();

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000); // 1 second visible loader
    return () => clearTimeout(timer);
  }, [location.pathname, setLoading]);

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public Route */}
        <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
        <Route path="/signup" element={<PageTransition><Signup /></PageTransition>} />
        <Route path="/forget-password" element={<PageTransition><ForgetPassword /></PageTransition>} />
        <Route path="/reset-password" element={<PageTransition><ResetPassword /></PageTransition>} />

        {/* Protected Routes (sidebar layout) */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />

          <Route path="assets" element={<AssetList />} />
          <Route path="create-asset" element={<AssetCreate />} />
          <Route path="assets/:id" element={<AssetDetail />} />
          <Route path="assets/:id/edit" element={<AssetEdit />} />
          <Route path="locations" element={<AssetLocations />} />

          <Route path="departments" element={<Departments />} />
          <Route path="designations" element={<Designations />} />
          <Route path="categories" element={<Categories />} />
          <Route path="subcategories" element={<Subcategories />} />

          <Route path="maintenance" element={<Maintenance />} />

          <Route path="vendors" element={<Vendors />} />
          <Route path="users" element={<Users />} />
          <Route path="users/profile/:publicId" element={<Profile />} />

          <Route path="request/manage" element={<RequestsManagement />} />
          <Route path="request/create" element={<RequestPage />} />
          <Route path="request/my" element={<MyRequests />} />

        </Route>
      </Routes>
    </AnimatePresence>
  );
}
