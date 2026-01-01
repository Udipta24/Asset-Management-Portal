import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

export default function MainLayout() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="h-screen grid grid-rows-[64px_1fr] bg-slate-50 dark:bg-slate-950 overflow-hidden transition-colors duration-300">
      <Topbar />
      <div className="grid grid-cols-[auto_1fr] overflow-hidden relative">
        {/* Background Image Layer (Dark Mode Only) */}
        <div
          className="absolute inset-0 z-0 opacity-0 dark:opacity-20 pointer-events-none transition-opacity duration-500"
          style={{
            backgroundImage: `url('/src/assets/login-bg.png')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />

        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

        <main className="relative z-10 overflow-auto p-6 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-cyan-900 scrollbar-track-transparent">
          <Outlet />
        </main>
      </div>
    </div>
  );
}


