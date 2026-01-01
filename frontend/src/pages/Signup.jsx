import React, { useState } from "react";
import API from "../api/api";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useReferenceData } from "../hooks/useReferenceData";
import signupBg from '../assets/signup-bg.png';


export default function Signup() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [departmentSelected, setDepartmentSelected] = useState("");
  const [designationSelected, setDesignationSelected] = useState("");

  const { departments, designations, loading: refLoading } = useReferenceData();
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await API.post("/auth/register", {
        full_name: fullName,
        email,
        password,
        phone,
        department_id: departmentSelected,
        designation_id: designationSelected,
      });
      const { user } = res.data;
      const { public_id } = user;

      Swal.fire({
        title: "Account Created Successfully!",
        html: `Your User ID is: <b style="color: #4ade80; font-size: 1.2em;">${public_id}</b><br/><br/>Please note this ID for future reference.`,
        icon: "success",
        background: '#1e293b',
        color: '#fff',
        confirmButtonColor: '#3b82f6'
      });
      nav("/login");
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Registration Failed",
        text: err?.response?.data?.message || "Please check your details and try again.",
        background: '#1e293b',
        color: '#fff',
        confirmButtonColor: '#3b82f6'
      });
    } finally {
      setLoading(false);
    }
  };

  if (refLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-blue-400">
        <div className="flex flex-col items-center gap-4">
          <svg className="animate-spin h-10 w-10" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="animate-pulse tracking-widest text-sm uppercase">Initializing System Assets...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center relative bg-cover bg-center bg-no-repeat p-4"
      style={{ backgroundImage: `url(${signupBg})` }}>
      {/* Dark Overlay with a hint of tech-blue */}
      <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-sm"></div>

      <div className="relative z-10 bg-slate-900/60 backdrop-blur-3xl p-8 md:p-10 w-full max-w-4xl rounded-3xl shadow-[0_0_40px_rgba(0,0,0,0.5)] border border-white/10 ring-1 ring-white/5">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 tracking-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
            Asset Management Portal
          </h1>
          <p className="text-cyan-200/80 text-sm font-light tracking-widest uppercase">
            New User Registration
          </p>
        </div>

        <form onSubmit={submit} className="space-y-6">
          <div className="grid grid-rows-3 grid-cols-1 md:grid-cols-2 gap-6">
            {/* Full Name */}
            <div className="space-y-1 group">
              <label className="text-xs font-semibold text-cyan-100/70 ml-1 uppercase tracking-wider group-focus-within:text-cyan-400 transition-colors">
                Full Name
              </label>
              <input
                className="w-full bg-slate-800/50 border border-white/10 text-white p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-transparent placeholder-gray-500 transition-all hover:bg-slate-800/70"
                placeholder="John Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>

            {/* Email */}
            <div className="space-y-1 group">
              <label className="text-xs font-semibold text-cyan-100/70 ml-1 uppercase tracking-wider group-focus-within:text-cyan-400 transition-colors">
                Email Address
              </label>
              <input
                className="w-full bg-slate-800/50 border border-white/10 text-white p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-transparent placeholder-gray-500 transition-all hover:bg-slate-800/70"
                placeholder="name@ongc.co.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Password */}
            <div className="space-y-1 group">
              <label className="text-xs font-semibold text-cyan-100/70 ml-1 uppercase tracking-wider group-focus-within:text-cyan-400 transition-colors">
                Setup Password
              </label>
              <input
                type="password"
                className="w-full bg-slate-800/50 border border-white/10 text-white p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-transparent placeholder-gray-500 transition-all hover:bg-slate-800/70"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {/* Contact Number */}
            <div className="space-y-1 group">
              <label className="text-xs font-semibold text-cyan-100/70 ml-1 uppercase tracking-wider group-focus-within:text-cyan-400 transition-colors">
                Phone Number
              </label>
              <input
                type="tel"
                className="w-full bg-slate-800/50 border border-white/10 text-white p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-transparent placeholder-gray-500 transition-all hover:bg-slate-800/70"
                placeholder="+91 XXXXX XXXXX"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>

            {/* Department */}
            <div className="space-y-1 group">
              <label className="text-xs font-semibold text-cyan-100/70 ml-1 uppercase tracking-wider group-focus-within:text-cyan-400 transition-colors">
                Department
              </label>
              <div className="relative">
                <select
                  className={`w-full bg-slate-800/50 border border-white/10 text-white p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-transparent transition-all hover:bg-slate-800/70 appearance-none ${
                    departmentSelected === '' ? 'text-gray-500' : 'text-white'
                  }`}
                  value={departmentSelected}
                  onChange={(e) => setDepartmentSelected(e.target.value)}
                  required>
                  <option value="" className="bg-slate-800 text-gray-400">
                    Select Department
                  </option>
                  {departments.map((dep) => (
                    <option
                      key={dep.department_id}
                      value={dep.department_id}
                      className="bg-slate-800 text-white">
                      {dep.department_name}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-cyan-200">
                  <svg
                    className="h-4 w-4 fill-current"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20">
                    <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Designation */}
            <div className="space-y-1 group">
              <label className="text-xs font-semibold text-cyan-100/70 ml-1 uppercase tracking-wider group-focus-within:text-cyan-400 transition-colors">
                Designation
              </label>
              <div className="relative">
                <select
                  className={`w-full bg-slate-800/50 border border-white/10 text-white p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-transparent transition-all hover:bg-slate-800/70 appearance-none ${
                    designationSelected === '' ? 'text-gray-500' : 'text-white'
                  }`}
                  value={designationSelected}
                  onChange={(e) => setDesignationSelected(e.target.value)}
                  required>
                  <option value="" className="bg-slate-800 text-gray-400">
                    Select Designation
                  </option>
                  {designations.map((des) => (
                    <option
                      key={des.designation_id}
                      value={des.designation_id}
                      className="bg-slate-800 text-white">
                      {des.designation_name}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-cyan-200">
                  <svg
                    className="h-4 w-4 fill-current"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20">
                    <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 flex flex-col items-center gap-4">
            <button className="w-full md:w-2/3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold py-4 rounded-xl shadow-[0_0_20px_rgba(6,182,212,0.4)] transform transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] border border-cyan-400/20">
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
                  Processing Registration...
                </span>
              ) : (
                'Create Account'
              )}
            </button>

            <div className="text-center text-slate-400 text-sm">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors underline-offset-4 hover:underline">
                Log In
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
