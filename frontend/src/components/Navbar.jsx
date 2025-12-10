import React from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/api";
import { logout } from "../auth/auth";

export default function Navbar() {
  const nav = useNavigate();

  const doLogout = async () => {
    await logout(API);
    nav("/login");
  };

  return (
    <nav className="bg-white shadow">
      <div className="container mx-auto px-4 flex items-center gap-4 py-3">
        <Link to="/" className="font-semibold">Asset Portal</Link>
        <Link to="/assets" className="text-sm text-gray-600">Assets</Link>
        <div className="ml-auto">
          <button onClick={doLogout} className="bg-red-500 text-white px-3 py-1 rounded text-sm">Logout</button>
        </div>
      </div>
    </nav>
  );
}

//without mx-auto it was going far left, so added it