import React, { useEffect, useState, useRef } from "react";
import API from "../api/api";
import { useNavigate } from "react-router-dom";
import { FaUserCircle, FaArrowUp, FaFilter } from "react-icons/fa";
import { useReferenceData } from "../hooks/useReferenceData";
import Swal from "sweetalert2";

export default function Users() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [filters, setFilters] = useState({
    department_id: "",
    designation_id: "",
  });
  const { refreshPublicReferenceData } = useReferenceData();
  useEffect(() => {
    refreshPublicReferenceData();
  }, []);
  const { departments, designations } = useReferenceData();
  const fetchUsers = async () => {
    const res = await API.get("/user", { params: filters });
    setUsers(res.data.users);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const promoteUser = async (publicId) => {
    await API.post(`/user/${publicId}/promote`);
    Swal.fire({
      icon: "success",
      title: `User ${publicId} promoted to ASSET MANAGER`,
      text: "User can manage assets of his/her department",
    });
    fetchUsers();
  };

  return (
    <div
      className="max-w-full p-6 rounded-2xl space-y-4
  bg-white dark:bg-slate-900
  border border-slate-200 dark:border-white/10
  shadow-sm"
    >
      <h1 className="text-2xl font-semibold text-slate-800 dark:text-slate-100">
        Users
      </h1>

      {/* Filters */}
      <div className="flex gap-4 mb-6 items-end">
        <div>
          <label className="text-sm text-gray-600 dark:text-gray-300 mr-1">
            Department{" "}
          </label>
          <select
            className={`p-2 rounded-xl border
      bg-white  border-slate-300
      dark:bg-slate-800  dark:border-white/10 ${
        filters.department_id === ""
          ? "  text-slate-400"
          : "text-slate-700 dark:text-slate-200"
      }`}
            value={filters.department_id}
            onChange={(e) =>
              setFilters({ ...filters, department_id: e.target.value })
            }
          >
            <option value="">All Departments</option>
            {departments.map((dep) => (
              <option key={dep.department_id} value={dep.department_id}>
                {dep.department_name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm text-gray-600 dark:text-gray-300 mr-1">
            Designation{" "}
          </label>
          <select
            className={`p-2 rounded-xl border
      bg-white  border-slate-300
      dark:bg-slate-800  dark:border-white/10 ${
        filters.department_id === ""
          ? "  text-slate-400"
          : "text-slate-700 dark:text-slate-200"
      }`}
            value={filters.designation_id}
            onChange={(e) =>
              setFilters({ ...filters, designation_id: e.target.value })
            }
          >
            <option value="">All Designations</option>
            {designations.map((des) => (
              <option key={des.designation_id} value={des.designation_id}>
                {des.designation_name}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={fetchUsers}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border font-medium
      text-slate-700 border-slate-300 hover:bg-slate-100
      dark:text-slate-300 dark:border-white/10 dark:hover:bg-slate-800
      transition"
        >
          <FaFilter /> Apply
        </button>
      </div>

      <div
        className="
  bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10
  rounded-xl shadow
  overflow-x-auto
"
      >
        <table className="w-full border border-slate-200 dark:border-white/10 rounded-lg">
          <thead
            className="
        bg-slate-100 dark:bg-slate-800
        text-slate-700 dark:text-slate-200
      "
          >
            <tr>
              <th className="border border-slate-200 dark:border-white/10 px-4 py-2 text-left">
                User ID
              </th>
              <th className="border border-slate-200 dark:border-white/10 px-4 py-2 text-left">
                Name
              </th>
              <th className="border border-slate-200 dark:border-white/10 px-4 py-2 text-left">
                Department
              </th>
              <th className="border border-slate-200 dark:border-white/10 px-4 py-2 text-left">
                Designation
              </th>
              <th className="border border-slate-200 dark:border-white/10 px-4 py-2 text-center">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {users.map((u) => (
              <tr
                key={u.user_id}
                className="
            transition
            hover:bg-slate-50 dark:hover:bg-slate-800/60
          "
              >
                <td
                  className="
            border border-slate-200 dark:border-white/10
            px-4 py-2 font-mono text-sm
            text-slate-700 dark:text-slate-300
          "
                >
                  {u.public_id}
                </td>

                <td
                  className="
            border border-slate-200 dark:border-white/10
            px-4 py-2
            text-slate-800 dark:text-slate-100
          "
                >
                  {u.name}
                </td>

                <td
                  className="
            border border-slate-200 dark:border-white/10
            px-4 py-2
            text-slate-700 dark:text-slate-300
          "
                >
                  {u.department_name}
                </td>

                <td
                  className="
            border border-slate-200 dark:border-white/10
            px-4 py-2
            text-slate-700 dark:text-slate-300
          "
                >
                  {u.designation_name}
                </td>

                <td
                  className="
            border border-slate-200 dark:border-white/10
            px-4 py-2
            flex justify-center gap-3
          "
                >
                  {/* View Profile */}
                  <button
                    onClick={() => navigate(`/users/profile/${u.public_id}`)}
                    title="View Profile"
                    className="
                p-2 rounded-lg transition
                text-blue-600 hover:bg-blue-100 hover:text-blue-700

                dark:text-cyan-400
                dark:hover:bg-cyan-500/10
                dark:hover:text-cyan-300
              "
                  >
                    <FaUserCircle size={18} />
                  </button>

                  {/* Promote */}
                  {u.role_name === "USER" && (
                    <button
                      onClick={() => promoteUser(u.public_id)}
                      title="Promote to Asset Manager"
                      className="
                  p-2 rounded-lg transition
                  text-green-600 hover:bg-green-100 hover:text-green-700

                  dark:text-green-400
                  dark:hover:bg-green-500/10
                  dark:hover:text-green-300
                "
                    >
                      <FaArrowUp size={18} />
                    </button>
                  )}
                </td>
              </tr>
            ))}

            {users.length === 0 && (
              <tr>
                <td
                  colSpan="5"
                  className="
              border border-slate-200 dark:border-white/10
              px-4 py-6 text-center italic
              text-slate-500 dark:text-slate-400
            "
                >
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
