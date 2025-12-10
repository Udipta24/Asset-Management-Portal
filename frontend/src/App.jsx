import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Assets from "./pages/Assets";
import AssetCreate from "./pages/AssetCreate";
import AssetDetail from "./pages/AssetDetail";
import ProtectedRoute from "./auth/ProtectedRoute";
import MainLayout from "./layout/MainLayout";
import Signup from "./pages/Signup"

export default function App() {
  
  return (
    //<div className="min-h-screen bg-gray-100">
      //<div className="container mx-auto px-4 py-6">

        
          <Routes>
            {/* Public Route (NO Navbar) */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Protected Routes (WITH Navbar) */}
            <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/assets" element={<Assets />} />
              <Route path="/assets/create" element={<AssetCreate />} />
              <Route path="/assets/:id" element={<AssetDetail />} />
            </Route>
          </Routes>
        

    //  </div>
   // </div>
  );
}

  

