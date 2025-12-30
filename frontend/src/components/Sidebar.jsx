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
import API from "../api/api";

const SidebarItem = ({ label, icon: Icon, collapsed, to }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center gap-3 px-4 py-2 cursor-pointer text-sm border-b-2 border-orange-800 rounded
       hover:bg-orange-600
       ${isActive ? "bg-orange-600" : ""}`
    }
  >
    <Icon size={22} />
    {!collapsed && <span>{label}</span>}
  </NavLink>
);

export default function Sidebar({ collapsed, setCollapsed }) {
  const [user, setUser] = useState({});

  useEffect(() => {
    const fetchMe = async () => {
      const res = await API.get("/user/me");
      console.log("res", res);
      const userData = res.data.user;
      setUser(userData);
    };
    fetchMe();
  }, []);
  console.log("Userdata", user);
  const user_role = user.role;
  console.log("User role", user_role);
  return (
    <aside className="bg-orange-700 text-white flex flex-col">
      {/* Sidebar content */}
      <div className="flex-1 space-y-1">
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
        {user_role != "USER" && (
          <>
            <SidebarItem
              label="Create asset"
              icon={FaPlus}
              collapsed={collapsed}
              to="/create-asset"
            />
            <SidebarItem
              label="Vendors"
              icon={FaIndustry}
              collapsed={collapsed}
              to="/vendors"
            />
          </>
        )}
        <SidebarItem
          label="Asset locations"
          icon={FaMapMarkerAlt}
          collapsed={collapsed}
          to="/locations"
        />
        {user_role == "ADMIN" && (
          <>
            <SidebarItem
              label="Asset categories"
              icon={MdCategory}
              collapsed={collapsed}
              to="/categories"
            />
            <SidebarItem
              label="Asset subcategories"
              icon={MdOutlineCategory}
              collapsed={collapsed}
              to="/subcategories"
            />
            <SidebarItem
              label="Users"
              icon={FaUsersRectangle}
              collapsed={collapsed}
              to="/users"
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
          </>
        )}
        <SidebarItem
          label="Maintenance records"
          icon={MdBuild}
          collapsed={collapsed}
          to="/maintenance"
        />
      </div>

      {/* Footer toggle */}
      <div className="border-t-2 border-orange-800 p-2 hover:bg-orange-600 rounded">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center gap-2 rounded"
        >
          {collapsed ? <FaChevronRight /> : <FaChevronLeft />}
          {!collapsed && <span className="text-sm">Collapse</span>}
        </button>
      </div>
    </aside>
  );
}
