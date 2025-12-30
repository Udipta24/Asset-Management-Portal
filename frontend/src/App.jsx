import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// ContextProviders
import { ReferenceDataProvider } from "./context/ReferenceDataContext.jsx";

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
import Assets from "./pages/Assets";
import AssetCreate from "./pages/AssetCreate";
import AssetDetail from "./pages/AssetDetail";
import AssetAssign from "./pages/AssetAssign";
import AssetEdit from "./pages/AssetEdit";
import AssetList from "./pages/AssetList";
import AssetLocations from "./pages/AssetLocations"
import Departments from "./pages/Departments";
import Designations from "./pages/Designations";
import Categories from "./pages/Categories";
import Subcategories from "./pages/Subcategories"

import MaintenanceLayout from "./pages/maintenance/MaintenanceLayout";
import MaintenanceList from "./pages/maintenance/MaintenanceList.jsx";
import MaintenanceCreate from "./pages/maintenance/MaintenanceCreate.jsx";
import MyMaintenance from "./pages/maintenance/MyMaintenance.jsx";

import Vendors from "./pages/Vendors";
import Locations from "./pages/Locations";
import Users from "./pages/Users";

import RegSelect from "./pages/regions/RegionSelect.jsx";
import RegAssets from "./pages/regions/RegionAssets.jsx";
//import RegMapPick from "./RegionMapPicker.jsx";

import MyRequests from "./pages/MyRequests.jsx";
import RequestAsset from "./pages/RequestAsset.jsx";
import AdminRequests from "./pages/AdminRequests.jsx";

export default function App() {
  return (
    <ReferenceDataProvider>
      <Routes>
        {/* Public Route */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forget-password" element={<ForgetPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/*outlet is the page inside the layout that changes,
      the main content is (sidebar + main content) , protected route prevents logged out user to see them,
      in sidebar layout, we used outlet, the below children nodes appear using that. so we dont see them in login page*/}

        {/* Protected Routes (sidebar layout) */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
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
            {/* to make the "all" path as default on nav bar when clicking, we use index element,replace helps fix back button loop
        it replaces current history entry instead of adding a new one */}

            <Route index element={<Navigate to="all" replace />} />

            <Route path="all" element={<MaintenanceList />} />
            <Route path="issue" element={<MaintenanceCreate />} />
            <Route path="my" element={<MyMaintenance />} />
          </Route>

          <Route path="/regions/select" element={<RegSelect />} />
          <Route path="/regions/:regionName/assets" element={<RegAssets />} />

          {/* Vendors */}
          <Route path="vendors" element={<Vendors />} />

          {/* Locations */}
          <Route path="locations" element={<Locations />} />

          {/*Asset assignment*/}
          <Route path="assets/assign" element={<AssetAssign />} />

          <Route path="request/create" element={<RequestAsset />} />
          <Route path="request/my" element={<MyRequests />} />
          <Route path="request/adminReq" element={<AdminRequests />} />

          {/* Users (admin only) */}
          <Route path="users" element={<Users />} />
        </Route>
        {/*protected ends here*/}
      </Routes>
    </ReferenceDataProvider>
  );
}

// just saying ...this are only frontend Routes, we can use them in sidebars, they dont map to backend
