import { useState, useEffect } from "react";
import { TbLayoutDashboardFilled } from "react-icons/tb";
import {
  FaBox,
  FaPlus,
  FaIndustry,
  FaMapMarkerAlt,
  FaUsersRectangle,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { MdCategory, MdOutlineCategory, MdBuild } from "react-icons/md";
import { PiOfficeChairFill } from "react-icons/pi";
import { HiMiniBuildingOffice } from "react-icons/hi2";
import API from "../api/api";

const SidebarItem = ({ label, icon: Icon, collapsed, to }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center gap-3 px-4 py-2 cursor-pointer
       hover:bg-gray-700
       ${isActive ? "bg-gray-700" : ""}`
    }
  >
    <Icon className="text-lg" />
    {!collapsed && <span>{label}</span>}
  </NavLink>
);

export default function Sidebar({ collapsed, setCollapsed }) {
  const [user, setUser] = useState(null);
  useEffect(() => {
    API.get("/user/me")
      .then((res) => setUser(res.data))
      .catch(() => {});
  }, []);

  const user_role = user.role;

  return (
    <aside className="bg-orange-500 text-white flex flex-col transition-all duration-300">
      {/* Sidebar content */}
      <div className="flex-1 mt-4 space-y-2">
        <SidebarItem
          label="Dashboard"
          icon={TbLayoutDashboardFilled}
          collapsed={collapsed}
          to="/dashboard"
        />
        <SidebarItem
          label="Assets"
          icon={FaBox}
          collapsed={collapsed}
          to="/assets"
        />
        {user_role != "USER" && (
            <SidebarItem
              label="Create asset"
              icon={FaPlus}
              collapsed={collapsed}
              to="/assets/create"
            />
          ) && (
            <SidebarItem
              label="Vendors"
              icon={FaIndustry}
              collapsed={collapsed}
              to="/vendors"
            />
          )}
        <SidebarItem
          label="Asset locations"
          icon={FaMapMarkerAlt}
          collapsed={collapsed}
          to="/locations"
        />
        {user_role == "ADMIN" && (
            <SidebarItem
              label="Asset categories"
              icon={MdCategory}
              collapsed={collapsed}
              to="/categories"
            />
          ) && (
            <SidebarItem
              label="Asset subcategories"
              icon={MdOutlineCategory}
              collapsed={collapsed}
              to="/subcategories"
            />
          ) && (
            <SidebarItem
              label="Users"
              icon={FaUsersRectangle}
              collapsed={collapsed}
              to="/users"
            />
          ) && (
            <SidebarItem
              label="Departments"
              icon={HiMiniBuildingOffice}
              collapsed={collapsed}
              to="/departments"
            />
          ) && (
            <SidebarItem
              label="Designations"
              icon={PiOfficeChairFill}
              collapsed={collapsed}
              to="/designations"
            />
          )}
        <SidebarItem
          label="Maintenance records"
          icon={MdBuild}
          collapsed={collapsed}
          to="/maintenance"
        />
      </div>

      {/* Footer toggle */}
      <div className="border-t border-gray-700 p-2">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center gap-2 p-2 rounded hover:bg-gray-700"
        >
          {collapsed ? <FaChevronRight /> : <FaChevronLeft />}
          {!collapsed && <span>Collapse</span>}
        </button>
      </div>
    </aside>
  );
}
