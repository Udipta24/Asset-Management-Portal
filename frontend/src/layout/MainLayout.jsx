import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import TopActions from "../components/TopActions";

export default function MainLayout() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen flex bg-gray-100">
      
      {/* Sidebar */}
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      {/* Main Area */}
      <div className="flex-1 flex flex-col">

        {/* Page-specific Top Bar */}
        <TopActions pathname={location.pathname} />

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>

      </div>
    </div>
  );
}


//i will use it later, for navigation bar per page