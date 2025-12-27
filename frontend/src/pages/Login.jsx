import React, { useState } from "react";
import API from "../api/api";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useReferenceData } from "../hooks/useReferenceData";
//trim the username or else it will try to compare "jit   " with "jit" , one has gaps and another has no gaps

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);

  const { fetchProtectedReferenceData } = useReferenceData();

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post("/auth/login", { email, password });
      fetchProtectedReferenceData();
      nav("/");
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Sorry",
        text: err?.response?.data?.message || "Login failed",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-red-500">
      <div className="bg-white p-8 w-96 rounded-xl shadow-xl border border-gray-100">
        <h2 className="text-2xl font-bold text-center text-blue-600 mb-4">
          Login
        </h2>

        <form onSubmit={submit} className="space-y-4">
          <input
            className="w-full border p-3 rounded-lg focus:ring focus:ring-blue-200"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {/* "required" so that browser pops warning when empty field */}
          <input
            type="password"
            className="w-full border p-3 rounded-lg focus:ring focus:ring-blue-200"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Link to="/forget-password" className="text-blue-600 mt-1 text-xs">
            Forgot Password?
          </Link>

          <button className="w-full bg-blue-600 text-white p-2 rounded">
            {loading ? "Signing in..." : "Log in"}
          </button>
        </form>

        <div className="mt-4 text-center  text-red-500">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-blue-600">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}
