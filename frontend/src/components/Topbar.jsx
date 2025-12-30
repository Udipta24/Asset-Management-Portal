import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import { MdLogout } from "react-icons/md";
import { FaUserCircle } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

export default function Topbar() {
  const navigate = useNavigate();
  const{currentUser : user} = useAuth();

  const handleLogout = async () => {
    try {
      await API.post("/auth/logout");
    } catch (error) {
      // Do nothing
    } finally {
      localStorage.removeItem("accessToken");
      navigate("/login");
    }
  };

  return (
    <header className="h-14 bg-orange-500 text-white flex items-center justify-between px-6">
      {/* Left */}
      <h1 className="text-lg font-semibold tracking-wide">
        ASSET MANAGEMENT PORTAL
      </h1>

      {/* Right */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(`/users/profile/${user.public_id}`)}
          title="Profile"
          className="hover:text-gray-200 transition"
        >
          <FaUserCircle size={22} />
        </button>

        <button
          onClick={handleLogout}
          title="Logout"
          className="hover:text-gray-200 transition"
        >
          <MdLogout size={20} />
        </button>
      </div>
    </header>
  );
}
