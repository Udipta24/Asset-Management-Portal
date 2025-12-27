import { NavLink, Outlet } from "react-router-dom";

export default function MaintenanceLayout() {
  const linkClass = ({ isActive }) =>
    `px-4 py-2 rounded ${
      isActive ? "bg-blue-600 text-white" : "bg-gray-100"
    }`;

  return (
    <div>
      {/* Top Action Bar */}
      <div className="flex gap-2 mb-4 bg-white p-3 rounded shadow">
        <NavLink to="all" className={linkClass}>All</NavLink>
        <NavLink to="issue" className={linkClass}>Issue</NavLink>
        <NavLink to="my" className={linkClass}>My Tasks</NavLink>
      </div>

      <Outlet />
    </div>
  );
}


//navlink is a component, 
//usenavigate is a hook, used in js logic 
