import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { TbLayoutDashboardFilled } from "react-icons/tb";
import {
  FaBox,
  FaPlus,
  FaIndustry,
  FaMapMarkerAlt,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { FaUsersRectangle } from "react-icons/fa6";
import { MdCategory, MdOutlineCategory, MdBuild } from "react-icons/md";
import { PiOfficeChairFill } from "react-icons/pi";
import { HiMiniBuildingOffice } from "react-icons/hi2";
import { IoMdAddCircle } from "react-icons/io";
import { MdFormatListBulletedAdd } from "react-icons/md";
import API from "../api/api";
import { useAuth } from "../context/AuthContext";

const SidebarItem = ({ label, icon: Icon, collapsed, to }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center gap-3 px-4 py-3 cursor-pointer text-sm font-medium transition-all duration-300
       ${
         isActive
           ? "bg-blue-50 text-blue-600 border-r-2 border-blue-600 dark:bg-cyan-500/10 dark:text-cyan-400 dark:border-cyan-400"
           : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white"
       }`
    }
  >
    <Icon
      size={20}
      className={({ isActive }) =>
        isActive
          ? "drop-shadow-sm dark:drop-shadow-[0_0_5px_rgba(34,211,238,0.8)]"
          : ""
      }
    />
    {!collapsed && <span className="tracking-wide">{label}</span>}
  </NavLink>
);

export default function Sidebar({ collapsed, setCollapsed }) {
  const { currentUser, loading } = useAuth();
  if(loading) return (
    <aside
      className={`bg-white dark:bg-slate-900/95 backdrop-blur-xl border-r border-slate-200 dark:border-white/10 text-slate-800 dark:text-white flex flex-col transition-all duration-300 z-20 ${
        collapsed ? "w-16" : "w-64"
      }`}
    >Loading...</aside>
  );
  console.log("Userdata", currentUser);
  const user_role = currentUser.role;
  console.log("User role", user_role);
  return (
    <aside
      className={`bg-white dark:bg-slate-900/95 backdrop-blur-xl border-r border-slate-200 dark:border-white/10 text-slate-800 dark:text-white flex flex-col transition-all duration-300 z-20 ${
        collapsed ? "w-16" : "w-64"
      }`}
    >
      {/* Sidebar content */}
      <div className="flex-1 overflow-y-auto py-4 space-y-1 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700 scrollbar-track-transparent">
        <SidebarItem
          label="Dashboard"
          icon={TbLayoutDashboardFilled}
          collapsed={collapsed}
          to="/"
        />
        <SidebarItem
          label="Assets"
          icon={FaBox}
          collapsed={collapsed}
          to="/assets"
        />
        {(user_role === "ADMIN" || user_role === "ASSET MANAGER") && (
          <>
            <SidebarItem
              label="Create Asset"
              icon={FaPlus}
              collapsed={collapsed}
              to="/create-asset"
            />
          </>
        )}
        <SidebarItem
          label="Vendors"
          icon={FaIndustry}
          collapsed={collapsed}
          to="/vendors"
        />
        <SidebarItem
          label="Asset Locations"
          icon={FaMapMarkerAlt}
          collapsed={collapsed}
          to="/locations"
        />
        {user_role === "ADMIN" && (
          <>
            <div className="my-2 border-t border-slate-200 dark:border-white/5 mx-4" />
            <SidebarItem
              label="Asset Categories"
              icon={MdCategory}
              collapsed={collapsed}
              to="/categories"
            />
            <SidebarItem
              label="Asset Subcategories"
              icon={MdOutlineCategory}
              collapsed={collapsed}
              to="/subcategories"
            />
            <SidebarItem
              label="Departments"
              icon={HiMiniBuildingOffice}
              collapsed={collapsed}
              to="/departments"
            />
            <SidebarItem
              label="Designations"
              icon={PiOfficeChairFill}
              collapsed={collapsed}
              to="/designations"
            />
            <div className="my-2 border-t border-slate-200 dark:border-white/5 mx-4" />
            <SidebarItem
              label="Users Management"
              icon={FaUsersRectangle}
              collapsed={collapsed}
              to="/users"
            />
          </>
        )}
        <SidebarItem
          label="Maintenance Records"
          icon={MdBuild}
          collapsed={collapsed}
          to="/maintenance"
        />
        <SidebarItem
          label="Request Service"
          icon={IoMdAddCircle}
          collapsed={collapsed}
          to="/request/create"
        />
        {(user_role === "ASSET MANAGER" || user_role === "MAINTENANCE ENGINEER") && (
          <>
            <SidebarItem
              label="Manage Requests"
              icon={MdFormatListBulletedAdd}
              collapsed={collapsed}
              to="/request/manage"
            />
          </>
        )}

      </div>

      {/* Footer toggle */}
      <div className="border-t border-slate-200 dark:border-white/10 p-4">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center gap-2 p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 hover:shadow-sm dark:hover:shadow-[0_0_10px_rgba(34,211,238,0.2)] transition-all duration-300 group border border-slate-200 dark:border-white/5"
        >
          {collapsed ? (
            <FaChevronRight className="text-blue-500 dark:text-cyan-400 group-hover:translate-x-1 transition-transform" />
          ) : (
            <FaChevronLeft className="text-blue-500 dark:text-cyan-400 group-hover:-translate-x-1 transition-transform" />
          )}
          {!collapsed && (
            <span className="text-xs font-semibold text-slate-500 dark:text-cyan-100 uppercase tracking-widest">
              Collapse
            </span>
          )}
        </button>
      </div>
    </aside>
  );
}
