import React, { useState } from "react";
import API from "../api/api";
import { useNavigate, useSearchParams } from "react-router-dom";
import Swal from "sweetalert2";
import loginBg from '../assets/login-bg.png';

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await API.post(`/auth/reset-password?token=${token}`, {
        password,
      });
      Swal.fire({
        title: res.data.message,
        text: "Login with new password",
        icon: "success",
        background: '#1e293b',
        color: '#fff',
        confirmButtonColor: '#3b82f6'
      });
      nav(`/login`);
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Sorry",
        text: err?.response?.data?.message || "Password Reset Failed",
        background: '#1e293b',
        color: '#fff',
        confirmButtonColor: '#3b82f6'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center relative bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${loginBg})` }}>
      {/* Dark Overlay for readability */}
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"></div>

      <div className="relative z-10 bg-white/10 backdrop-blur-2xl p-8 md:p-12 w-full max-w-[450px] rounded-3xl shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] border border-white/20 ring-1 ring-white/10">
        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2 tracking-tight drop-shadow-md">
            Asset Management Portal
          </h1>
          <p className="text-blue-100/80 text-sm font-light tracking-wide">
            Set your new secure password
          </p>
        </div>

        <form onSubmit={submit} className="space-y-6">
          <div className="space-y-2 group">
            <label className="text-xs font-semibold text-blue-100 ml-1 uppercase tracking-wider opacity-80 group-focus-within:opacity-100 transition-opacity">
              New Password
            </label>
            <div className="relative">
              <input
                type="password"
                className="w-full bg-slate-900/40 border border-white/10 text-white p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-transparent placeholder-gray-400/70 transition-all duration-300 hover:bg-slate-900/60 shadow-inner backdrop-blur-sm"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <p className="text-xs text-blue-200/60 ml-1">
              Must be at least 8 characters long.
            </p>
          </div>

          <button className="w-full bg-gradient-to-r from-blue-700 to-indigo-700 hover:from-blue-600 hover:to-indigo-600 text-white font-bold py-4 rounded-xl shadow-[0_4px_14px_0_rgba(0,118,255,0.39)] transform transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] mt-2 border border-white/10">
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Updating Password...
              </span>
            ) : (
              'Confirm New Password'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
