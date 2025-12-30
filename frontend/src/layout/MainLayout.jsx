import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

export default function MainLayout() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="h-screen grid grid-rows-[56px_1fr]">
      <Topbar />
      <div className="grid grid-cols-[auto_1fr] overflow-hidden">
        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
        <main className="overflow-auto bg-gradient-to-br from-blue-950 via-blue-900 to-blue-950 p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
}


//i will use it later, for navigation bar per page