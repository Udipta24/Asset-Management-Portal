import React, { useState } from 'react';
import API from '../api/api';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import loginBg from '../assets/login-bg.png';
import { useAuth } from '../context/AuthContext';
//trim the username or else it will try to compare "jit   " with "jit" , one has gaps and another has no gaps

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);
  const { checkAuth } = useAuth();

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post('/auth/login', { email, password });
      await checkAuth(); // Sync user state
      nav('/');
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Sorry",
        text: err?.response?.data?.message || "Login failed",
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
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3 tracking-tight drop-shadow-md">
            Asset Management Portal
          </h1>
          <p className="text-blue-100/80 text-sm md:text-base font-light tracking-wide">
            Industrial Equipment & Resource Management
          </p>
        </div>

        <form onSubmit={submit} className="space-y-6">
          <div className="space-y-2 group">
            <label className="text-xs font-semibold text-blue-100 ml-1 uppercase tracking-wider opacity-80 group-focus-within:opacity-100 transition-opacity">
              Email Address
            </label>
            <div className="relative">
              <input
                className="w-full bg-slate-900/40 border border-white/10 text-white p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-transparent placeholder-gray-400/70 transition-all duration-300 hover:bg-slate-900/60 shadow-inner backdrop-blur-sm"
                placeholder="name@ongc.co.in"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2 group">
            <label className="text-xs font-semibold text-blue-100 ml-1 uppercase tracking-wider opacity-80 group-focus-within:opacity-100 transition-opacity">
              Password
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
          </div>

          <div className="flex justify-between items-center pt-2">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="remember"
                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 bg-gray-700/50 border-white/10"
              />
              <label
                htmlFor="remember"
                className="ml-2 text-xs text-blue-100/80 cursor-pointer">
                Remember me
              </label>
            </div>
            <Link
              to="/forget-password"
              className="text-blue-300 hover:text-white text-xs font-medium transition-colors duration-200">
              Forgot Password?
            </Link>
          </div>

          <button className="w-full bg-gradient-to-r from-blue-700 to-indigo-700 hover:from-blue-600 hover:to-indigo-600 text-white font-bold py-4 rounded-xl shadow-[0_4px_14px_0_rgba(0,118,255,0.39)] transform transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] mt-4 border border-white/10">
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
                Authenticating...
              </span>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <div className="mt-8 text-center pt-6 border-t border-white/10">
          <p className="text-gray-400 text-sm">Access Restricted Area</p>
          <div className="mt-2 text-xs text-slate-500">
            Don’t have an account?{' '}
            <Link
              to="/signup"
              className="text-blue-400 hover:text-white font-medium transition-colors">
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
