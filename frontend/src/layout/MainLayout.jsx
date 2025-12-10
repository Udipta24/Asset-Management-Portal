import React from "react";
import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";

export default function MainLayout() {
  return (
    <>
      <Navbar />
      <main className="container mx-auto px-4 py-6 ">
        <Outlet />
      </main>
    </>
  );
}


//added mx-auto or else defaults to left alignement