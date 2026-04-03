import React, { useState } from 'react';
import API from '../api/api';
import { useNavigate, Link } from 'react-router-dom';
import Swal from 'sweetalert2';

export default function ForgetPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await API.post("/auth/forget-password", { email });
      const {message, resetToken} = res.data;
      Swal.fire({
        title: message,
        icon: 'success',
        background: '#1e293b',
        color: '#fff',
        confirmButtonColor: '#3b82f6',
      });
      nav(`/reset-password?token=${resetToken}`);
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: err?.response?.data?.message || 'Failed to generate reset token',
        background: '#1e293b',
        color: '#fff',
        confirmButtonColor: '#3b82f6',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center relative bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url('/src/assets/signup-bg.png')`,
      }}>
      {/* Dark Overlay for readability */}
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"></div>

      <div className="relative z-10 bg-white/10 backdrop-blur-2xl p-8 md:p-12 w-full max-w-[450px] rounded-3xl shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] border border-white/20 ring-1 ring-white/10">
        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2 tracking-tight drop-shadow-md">
            Asset Management Portal
          </h1>
          <p className="text-blue-100/80 text-sm font-light tracking-wide">
            Recover your account access
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
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
            </div>
            <p className="text-xs text-blue-200/60 ml-1">
              We'll generate a password reset token for this email.
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
                Processing...
              </span>
            ) : (
              'Reset Password'
            )}
          </button>
        </form>

        <div className="mt-8 text-center pt-6 border-t border-white/10">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-blue-300 hover:text-white transition-colors duration-200 group">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 transform group-hover:-translate-x-1 transition-transform"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
