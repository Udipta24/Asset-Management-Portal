// Topbar Component
import { useNavigate } from 'react-router-dom';
import API from '../api/api';
import { MdLogout, MdLightMode, MdDarkMode } from 'react-icons/md';
import { FaUserCircle } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import logo from "../assets/bg1.png";

export default function Topbar() {
  const navigate = useNavigate();

  const { currentUser: user, loading } = useAuth();

  const { theme, toggleTheme } = useTheme();

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

  const handleProfileClick = () => {
    if (loading || !user?.public_id) return;

    navigate(`/users/profile/${user.public_id}`);
  };

  return (
    <header className="h-16 bg-white/80 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-white/10 text-slate-800 dark:text-white flex items-center justify-between px-6 z-30 shadow-sm dark:shadow-lg relative transition-colors duration-300">
      <div className="absolute inset-0 bg-transparent dark:bg-gradient-to-r dark:from-cyan-900/20 dark:to-transparent pointer-events-none transition-colors duration-300" />

      {/* Left */}
      <div className="relative z-10 flex items-center gap-3">
        {/* <div className="p-1.5 bg-blue-100 dark:bg-cyan-500/10 rounded-lg border border-blue-200 dark:border-cyan-500/30 transition-colors duration-300">
          <FaUserCircle
            className="text-blue-600 dark:text-cyan-400 transition-colors duration-300"
            size={20}
          />
        </div> */}
        <img src={logo} alt="Logo" className="h-10 w-auto rounded-lg" />
        <h1 className="text-lg font-bold tracking-wider">
          ASSET MANAGEMENT{' '}
          <span className="text-blue-600 dark:text-cyan-400">PORTAL</span>
      </h1>
      </div>

      {/* Right */}
      <div className="relative z-10 flex items-center gap-6">
        <div className="flex items-center gap-3 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-white/5">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_#22c55e]" />
          <span className="text-xs font-mono text-slate-500 dark:text-slate-300">
            SYSTEM ONLINE
          </span>
        </div>

        <div className="h-6 w-px bg-slate-200 dark:bg-white/10" />

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          title={
            theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'
          }
          className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-cyan-400 border border-slate-200 dark:border-white/5 transition-all">
          {theme === 'dark' ? (
            <MdLightMode size={20} />
          ) : (
            <MdDarkMode size={20} />
          )}
        </button>

        {/* Profile + Logout */}
        <div className="flex items-center gap-4">
          <button
            onClick={handleProfileClick}
            disabled={loading || !user}
            title={loading ? 'Loading profile...' : 'Profile'}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all
              ${
                loading || !user
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:bg-slate-100 dark:hover:bg-white/5 group'
              }
            `}>
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-blue-700 dark:from-cyan-600 dark:to-blue-600 flex items-center justify-center shadow-lg transition-all">
              <span className="font-bold text-xs text-white">
                {user?.name?.charAt(0) || 'U'}
              </span>
            </div>

            <div className="text-right hidden sm:block">
              <p className="text-xs font-semibold">{user?.name || 'User'}</p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">
                {user?.role || 'Role'}
              </p>
            </div>
          </button>

          {/* Logout */}
        <button
          onClick={handleLogout}
          title="Logout"
            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-all">
            <MdLogout size={22} />
        </button>
        </div>
      </div>
    </header>
  );
}
