import { useNavigate } from "react-router-dom";
import API from "../api/api";
import { MdLogout } from "react-icons/md";
import { FaUserCircle } from "react-icons/fa";

export default function Topbar() {
  const nav = useNavigate();

  const handleLogout = async () => {
    try {
      await API.post("/auth/logout")
    } catch (error) {
      // Do nothing
    } finally {
      localStorage.removeItem("accessToken");
      nav("/login");
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
          onClick={() => navigate("/profile")}
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