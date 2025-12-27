import React, { useState } from "react";
import API from "../api/api";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useReferenceData } from "../hooks/useReferenceData";

export default function Signup() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [departmentSelected, setDepartmentSelected] = useState("");
  const [designationSelected, setDesignationSelected] = useState("");

  const { departments, designations, loading: refLoading } = useReferenceData();
  // console.log(departments, designations);

  const nav = useNavigate();
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await API.post("/auth/register", {
        full_name: fullName,
        email,
        password,
        phone,
        department_id: departmentSelected,
        designation_id: designationSelected,
      });
      const { user } = res.data;
      const { public_id } = user;
      // alert("Account created! Please log in.");
      Swal.fire({
        title: "Account created! Please log in.",
        text: `User ID is : ${public_id}`,
        icon: "success",
      });
      nav("/login");
    } catch (err) {
      // alert(err?.response?.data?.message || "Signup failed");
      Swal.fire({
        icon: "error",
        title: "Sorry",
        text: err?.response?.data?.message || "Signup failed",
      });
    } finally {
      setLoading(false);
    }
  };

  if (refLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p>Loading form data...</p>
      </div>
    );
  }
// bg-gradient-to-r from-green-500 to-green-700
// from-[#28623a] from-40% to-[#0f2027]
  return (
    <div className="h-screen bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center ">
      <div className="bg-white p-8 w-1/2 rounded-xl shadow-xl border border-gray-100">
        <h2 className="text-2xl font-bold text-center text-blue-800 mb-4">
          Create Account
        </h2>

        <form onSubmit={submit} className="space-y-3">
          <div className="grid grid-rows-3 grid-cols-1 md:grid-cols-2 gap-4">
            <input
              className="border p-2 rounded focus:ring focus:ring-blue-200"
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />

            <input
              className="border p-2 rounded focus:ring focus:ring-blue-200"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <input
              type="password"
              className="border p-2 rounded focus:ring focus:ring-blue-200"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <input
              type="tel"
              className="border p-2 rounded focus:ring focus:ring-blue-200"
              placeholder="Contact number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />

            <select
              className={`border p-2 rounded ${departmentSelected === "" ? "text-gray-400" : "text-black"} focus:ring focus:ring-blue-200`}
              value={departmentSelected}
              onChange={(e) => setDepartmentSelected(e.target.value)}
              required
            >
              <option value="">Select Department</option>
              {departments.map((dep) => (
                <option key={dep.department_id} value={dep.department_id}>
                  {dep.department_name}
                </option>
              ))}
            </select>

            <select
              className={`border p-2 rounded ${designationSelected === "" ? "text-gray-400" : "text-black"} focus:ring focus:ring-blue-200`}
              value={designationSelected}
              onChange={(e) => setDesignationSelected(e.target.value)}
              required
            >
              <option value="">Select Designation</option>
              {designations.map((des) => (
                <option key={des.designation_id} value={des.designation_id}>
                  {des.designation_name}
                </option>
              ))}
            </select>
          </div>

          <button className="mx-auto block bg-green-600 text-white px-20 py-2 rounded justify-self-center">
            {loading ? "Creating..." : "Sign up"}
          </button>
        </form>

        <div className="mt-4 text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}
