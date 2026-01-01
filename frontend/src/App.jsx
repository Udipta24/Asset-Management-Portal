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
import AssetAssign from "./pages/AssetAssign";
import AssetEdit from "./pages/AssetEdit";
import AssetList from "./pages/AssetList";
import AssetLocations from "./pages/AssetLocations";
import Departments from "./pages/Departments";
import Designations from "./pages/Designations";
import Categories from "./pages/Categories";
import Subcategories from "./pages/Subcategories";

import MaintenanceLayout from "./pages/maintenance/MaintenanceLayout";
import MaintenanceList from "./pages/maintenance/MaintenanceList.jsx";
import MaintenanceCreate from "./pages/maintenance/MaintenanceCreate.jsx";
import MyMaintenance from "./pages/maintenance/MyMaintenance.jsx";

import Vendors from "./pages/Vendors";
import Users from "./pages/Users";
import Profile from "./pages/Profile"

import MyRequests from "./pages/MyRequests.jsx";
import RequestAsset from "./pages/RequestAsset.jsx";
import AdminRequests from "./pages/AdminRequests.jsx";

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
          {/* Note: We aren't wrapping these inner routes individually to avoid double transition conflict with the layout,
                 but if desired, the MainLayout outlet can also be animated. 
                 For now, we just animate the main auth pages as requested. */}

          {/* Dashboard */}
          <Route index element={<Dashboard />} />

          {/* Assets */}
          <Route path="assets" element={<AssetList />} />
          <Route path="create-asset" element={<AssetCreate />} />
          <Route path="assets/:id" element={<AssetDetail />} />
          <Route path="assets/:id/edit" element={<AssetEdit />} />
          <Route path="locations" element={<AssetLocations />} />

          <Route path="departments" element={<Departments />} />
          <Route path="designations" element={<Designations />} />
          <Route path="categories" element={<Categories />} />
          <Route path="subcategories" element={<Subcategories />} />

          <Route path="/maintenance" element={<MaintenanceLayout />}>
            <Route index element={<Navigate to="all" replace />} />
            <Route path="all" element={<MaintenanceList />} />
            <Route path="issue" element={<MaintenanceCreate />} />
            <Route path="my" element={<MyMaintenance />} />
          </Route>

          <Route path="vendors" element={<Vendors />} />
          <Route path="assets/assign" element={<AssetAssign />} />
          <Route path="request/create" element={<RequestAsset />} />
          <Route path="request/my" element={<MyRequests />} />
          <Route path="request/adminReq" element={<AdminRequests />} />
          <Route path="users" element={<Users />} />
          <Route path="users/profile/:publicId" element={<Profile />} />

        </Route>
      </Routes>
    </AnimatePresence>
  );
}
