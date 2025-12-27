import React, { useEffect, useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import API from "../../api/api";
import { logout } from "../../auth/auth";

export default function SidebarLayout() {
  const [user, setUser] = useState(null);
  const [sidebarWidth, setSidebarWidth]=useState(240);

//if valid cookie , backend gives user info  
//if not valid cookie, catch do nothing, no crash 
//happens once when it loads first time
  useEffect(() => {
    API.get("/auth/me")
      .then((res) => setUser(res.data))
      .catch(() => {});
  }, []);

  //resize function, resizing is werid because its fighting text selection, scrolling and other default browser events
  //on dragging divider, elemetns on both sides resizes smmothly because browser layout engine recalculates layout
  //we are not moving elements , we are changing layout and another reason
  //is due to flex, as other element uses remaining space
  const startResize = () => {
    const onMouseMove = (e) => {
      // limit min & max width
      // const newWidth = Math.min(
      //   400,Math.max(180, e.clientX)
      // );
      // setSidebarWidth(newWidth);
      setSidebarWidth(Math.max(180,e.clientX));   //width of sidebar changes as we set style of div to have width = sidebarWidth
    };

    const onMouseUp = () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };
//this function is called usually  on mouse down means user starts dragging, 
//this function , runs everytime the mouse moves, e.clientX is horizontal mouse position , sidebar width set to mouse x position, then after 180 px, the mouse position below 180 ignored as math.max so sidebar is fixed upto 180px
//on mouse up , means when mouse is released , stop resizing, we run the cleanup fucntion to remove eventlisteners 


  const admin = user?.roles?.includes("admin");

  const menu = [
    { name: "Dashboard", path: "/", icon: "🏠" },
    { name: "Assets", path: "/assets", icon: "📦" },
    { name: "Create Asset", path: "/assets/create", icon: "➕" },
    { name: "Vendors", path: "/vendors", icon: "🏭" },
    { name: "Locations", path: "/locations", icon: "📍" },
    // { name: "Assign Asset", path: "/assets/assign", icon: "🔄" },
    //{ name: "Maintenance", path: "/maintenance"},
    { name: "Regions", path: "/regions/select"},
    { name: "Issue Requests", path: "/request/create"},
    { name: "My Request", path: "/request/my"},
    
  ];

  if (admin) {
    menu.push({ name: "Users", path: "/users", icon: "👥" });
    menu.push({ name: "Admin REQ", path: "/request/adminReq"});
  }

  const handleLogout = async () => {
    await logout(API);
  };


  
  return (
    // background colour here
    <div className="flex h-screen bg-gray-100 bg-gradient-to-br from-blue-500 via-pink-500 to-purple-700">
      {/*flex on parent makes a side by side layout- above line
      below line sidebar width is 64 or 256 px fixed, main content covers rest of space as we used
      flex-1. 
      sidebar h-screen ie full height of screen
      uses flex flex-col so items stack vertically
      outlet is given by react router and it changes only when link changed, renders other routes
      
      i added overflow-scroll on sidebar -- aside tag*/}
      {/* Sidebar */}
      <aside
        className="
        w-64 bg-white shadow-xl border-r  flex flex-col transition-all duration-300 overflow-scroll bg-gradient-to-tl from-yellow-500 via-yellow-400 to-red-500" 
        style={{ width: sidebarWidth }}>
        {/* Brand header */}
        <div className="h-20 bg-gradient-to-tr from-blue-500 to-blue-800 flex items-center justify-center text-white shadow-md">
          <h1 className="text-2xl font-extrabold tracking-wide">ASSET PORTAL</h1>
        </div>


{/*without "end", it will match all starting "/" only,not exact path, and all url starts with / */}
{/*isactive is special value react router gives to navlink so if current link path matches the link path in menu then its true
, we can use this to label buttons blue when clicked , scale makes it look pop up on hover*/}

        <nav className="flex-1 p-4 space-y-2 mt-2">
          <p className="text-black-400 text-xs font-semibold tracking-wider ml-2">
            MAIN MENU
          </p>

          {menu.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end             
              className={({ isActive }) =>
                ` flex items-center gap-3 px-4 py-2 rounded-lg cursor-pointer font-medium transition-all duration-300 border border-indigo-900
                
                ${isActive ? "bg-blue-600 text-white shadow-lg scale-[1.02]" : "text-gray-700 hover:bg-blue-100 hover:scale-[1.06]"}`
              }
            >
              <span className="text-lg">{item.icon}</span>
              {item.name}
            </NavLink>
          ))}
        </nav>

        {/* User and log out button */}
        <div className="p-4 border-t bg-green-500 shadow-inner bg-gradient-to-br from-blue-500 via-blue-700 to-blue-800">
          <div className="text-sm font-medium text-neutral-100">{user?.user?.full_name}</div>
          <button
            onClick={handleLogout}
            className="mt-3 w-full py-2 bg-red-500 text-white rounded-lg shadow hover:bg-red-600 transition-all duration-300 active:scale-95"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* resize bar, in between sidebar above and contents below */}
      <div
        className="w-2 bg-gray-300 cursor-ew-resize bg-gradient-to-l from-red-700-500 via-yellow-500 to-fuchsia-500"
        onMouseDown={startResize}
      />  
      
      {/* side bar ends and main content or dash board here, */}
      {/* here the gap between sidebar and other routes pages is due to p-6 */}
      <main className="flex-1 overflow-y-auto p-6">
        <Outlet />
      </main>
    </div>
  );
}


//gradient degrees tailwind css not direct--- 
//l--270 degree
//br--135 degree 
//r--90 degree
//tr--45 deg  etc.