import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../api/api";
import {
  FaEdit,
  FaSave,
  FaTrash,
  FaEnvelope,
  FaPhone,
  FaIdBadge,
  FaKey,
  FaUserShield,
  FaCamera
} from "react-icons/fa";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { PiOfficeChairFill } from "react-icons/pi";
import { HiMiniBuildingOffice } from "react-icons/hi2";
import { FaUserTie } from "react-icons/fa6";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { motion } from "framer-motion";
import Swal from "sweetalert2";

function InfoItem({ label, value, icon, isEditable, editValue, onChange, type = "text" }) {
  const { theme } = useTheme();

  return (
    <div className={`p-4 rounded-xl border transition-all duration-300 ${theme === 'dark'
        ? "bg-slate-800/40 border-white/5 hover:border-cyan-500/30 hover:bg-slate-800/60"
        : "bg-slate-50 border-slate-200 hover:border-blue-300 hover:bg-slate-100"
      }`}>
      <div className="flex items-center gap-3 mb-2">
        <div className={`p-2 rounded-lg ${theme === 'dark' ? "bg-cyan-500/10 text-cyan-400" : "bg-blue-100 text-blue-600"
          }`}>
          {icon}
        </div>
        <span className={`text-xs font-semibold uppercase tracking-wider ${theme === 'dark' ? "text-slate-400" : "text-slate-500"
          }`}>
          {label}
        </span>
      </div>

      {isEditable ? (
        <input
          type={type}
          value={editValue}
          onChange={onChange}
          className={`w-full bg-transparent border-b px-1 py-1 outline-none transition-colors ${theme === 'dark'
              ? "text-white border-cyan-500/50 focus:border-cyan-400"
              : "text-slate-800 border-blue-400 focus:border-blue-600"
            }`}
        />
      ) : (
        <div className={`text-lg font-medium truncate ${theme === 'dark' ? "text-white" : "text-slate-800"
          }`}>
          {value || "-"}
        </div>
      )}
    </div>
  );
}

export default function UserProfile() {
  const { publicId } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { theme } = useTheme();

  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ email: "", phone: "" });

  const fetchUser = async () => {
    try {
      const res = await API.get(`/user/${publicId}`);
      setUser(res.data.user);
      setForm({
        email: res.data.user.email,
        phone: res.data.user.phone,
      });
    } catch (err) {
      console.error("Failed to fetch user");
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const saveChanges = async () => {
    try {
      await API.patch(`/user/${publicId}`, form);
      setEditMode(false);
      fetchUser();
      Swal.fire({
        icon: "success",
        title: "Updated",
        text: "Profile updated successfully",
        background: theme === 'dark' ? '#1e293b' : '#fff',
        color: theme === 'dark' ? '#fff' : '#0f172a',
        confirmButtonColor: theme === 'dark' ? '#06b6d4' : '#2563eb'
      });
    } catch (e) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to update profile",
      });
    }
  };

  const deleteUser = async () => {
    try {
      await API.delete(`/user/${publicId}`);
      navigate("/users");
    } catch (e) { }
  };

  const handleResetPassword = () => {
    // Simulation of a reset flow
    Swal.fire({
      title: 'Reset Password?',
      text: "This will trigger a secure password reset and you will be logged out automatically.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, reset it!',
      background: theme === 'dark' ? '#1e293b' : '#fff',
      color: theme === 'dark' ? '#fff' : '#0f172a',
      confirmButtonColor: theme === 'dark' ? '#06b6d4' : '#2563eb'
    }).then((result) => {
      if (result.isConfirmed) {
        API.post("/auth/logout");
        navigate("/forget-password");
        // Swal.fire({
        //   title: 'Success!',
        //   text: 'Password reset link has been sent to the user email.',
        //   icon: 'success',
        //   background: theme === 'dark' ? '#1e293b' : '#fff',
        //   color: theme === 'dark' ? '#fff' : '#0f172a',
        //   confirmButtonColor: theme === 'dark' ? '#06b6d4' : '#2563eb'
        // });
      }
    });
  };

  if (!user) return <div className="p-10 text-center opacity-50">Loading profile...</div>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl mx-auto space-y-6"
    >
      {/* Header Card */}
      <div className={`relative px-8 py-10 rounded-3xl overflow-hidden border ${theme === 'dark'
          ? "bg-slate-900/60 border-white/10"
          : "bg-white border-slate-200 shadow-sm"
        }`}>
        {/* Background Gradient Line */}
        <div className={`absolute top-0 left-0 w-full h-2 bg-gradient-to-r ${theme === 'dark' ? "from-cyan-500 via-blue-500 to-purple-500" : "from-blue-400 via-indigo-500 to-blue-600"
          }`} />

        <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
          {/* Avatar Section */}
          <div className="relative">
            <div className={`w-32 h-32 rounded-full flex items-center justify-center text-4xl font-bold shadow-2xl ${theme === 'dark'
                ? "bg-slate-800 text-cyan-400 ring-4 ring-cyan-500/20"
                : "bg-white text-blue-600 ring-4 ring-blue-100 border border-slate-200"
              }`}>
              {user.name.charAt(0)}
            </div>
            {/* {editMode && (
              <button className="absolute bottom-0 right-0 p-2.5 rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-500 transition-colors">
                <FaCamera size={14} />
              </button>
            )} */}
          </div>

          {/* Text Info */}
          <div className="text-center md:text-left flex-1">
            <h1 className={`text-4xl font-bold tracking-tight mb-2 ${theme === 'dark' ? "text-white" : "text-slate-800"
              }`}>
              {user.name}
            </h1>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
              <span className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase border ${theme === 'dark'
                  ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/30"
                  : "bg-blue-50 text-blue-700 border-blue-200"
                }`}>
                {user.role}
              </span>
              <span className={`flex items-center gap-2 text-sm font-medium ${theme === 'dark' ? "text-slate-400" : "text-slate-500"
                }`}>
                <FaIdBadge /> {user.public_id}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 min-w-[140px]">
            {currentUser.role === "ADMIN" && (
              <>
                <button
                  onClick={() => (editMode ? saveChanges() : setEditMode(true))}
                  className={`flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-semibold transition-all shadow-lg ${editMode
                      ? "bg-green-500 hover:bg-green-600 text-white shadow-green-500/25"
                      : (theme === 'dark' ? "bg-cyan-600 hover:bg-cyan-500 text-white shadow-cyan-500/20" : "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20")
                    }`}
                >
                  {editMode ? <FaSave /> : <FaEdit />}
                  {editMode ? "Save Changes" : "Edit Profile"}
                </button>

                {!editMode && (
                  <button
                    onClick={deleteUser}
                    className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500 hover:text-white text-red-500 font-semibold border border-red-500/20 hover:border-red-500 transition-all"
                  >
                    <FaTrash size={14} />
                    Delete User
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Detailed Info Card */}
        <div className={`md:col-span-2 p-8 rounded-3xl border ${theme === 'dark'
            ? "bg-slate-900/60 border-white/10 backdrop-blur-xl"
            : "bg-white border-slate-200 shadow-sm"
          }`}>
          <h3 className={`text-xl font-bold mb-6 flex items-center gap-2 ${theme === 'dark' ? "text-white" : "text-slate-800"
            }`}>
            <IoMdInformationCircleOutline className={theme === 'dark' ? "text-cyan-400" : "text-blue-600"} size={24} />
            Account Details
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InfoItem
              label="Department"
              value={user.department_name}
              icon={<HiMiniBuildingOffice />}
            />
            <InfoItem
              label="Designation"
              value={user.designation_name}
              icon={<PiOfficeChairFill />}
            />
            <InfoItem
              label="Work Email"
              value={user.email}
              icon={<FaEnvelope />}
              isEditable={editMode}
              editValue={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <InfoItem
              label="Phone Number"
              value={user.phone}
              icon={<FaPhone />}
              isEditable={editMode}
              editValue={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
          </div>
        </div>

        {/* Security / Password Card */}
        <div className={`p-8 rounded-3xl border flex flex-col justify-between ${theme === 'dark'
            ? "bg-slate-900/60 border-white/10 backdrop-blur-xl"
            : "bg-white border-slate-200 shadow-sm"
          }`}>
          <div>
            <h3 className={`text-xl font-bold mb-6 flex items-center gap-2 ${theme === 'dark' ? "text-white" : "text-slate-800"
              }`}>
              <FaUserShield className={theme === 'dark' ? "text-cyan-400" : "text-blue-600"} size={24} />
              Security
            </h3>

            <div className="space-y-4">
              <InfoItem
                label="Current Password"
                value="••••••••"
                icon={<FaKey />}
              />
              <div className={`text-sm leading-relaxed ${theme === 'dark' ? "text-slate-400" : "text-slate-500"
                }`}>
                Password is hidden for security. You can trigger a reset link if the user has forgotten it.
              </div>
            </div>
          </div>

          <button
            onClick={handleResetPassword}
            className={`mt-8 w-full py-4 rounded-xl font-semibold border flex items-center justify-center gap-2 transition-all ${theme === 'dark'
                ? "bg-slate-800 border-white/5 text-cyan-400 hover:bg-cyan-500/10 hover:border-cyan-500/50 hover:shadow-[0_0_15px_rgba(34,211,238,0.15)]"
                : "bg-slate-50 border-slate-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300 hover:shadow-sm"
              }`}
          >
            <FaKey />
            Reset Password
          </button>
        </div>
      </div>
    </motion.div>
  );
}
