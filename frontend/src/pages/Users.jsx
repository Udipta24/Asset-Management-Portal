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
      text: "User can manage assets of his/her department"
    });
    fetchUsers();
  };

  return (
    <div className="max-w-full bg-white p-6 rounded shadow space-y-4">
      <h1 className="text-2xl font-bold mb-6">Users</h1>

      {/* Filters */}
      <div className="flex gap-4 mb-6 items-end">
        <div>
          <label className="text-sm text-gray-600">Department </label>
          <select
            className={`border rounded px-3 py-2 w-48 ${
              filters.department_id === "" ? "text-gray-400" : "text-black"
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
          <label className="text-sm text-gray-600">Designation </label>
          <select
            className={`border rounded px-3 py-2 w-48 ${
              filters.designation_id === "" ? "text-gray-400" : "text-black"
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
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded"
        >
          <FaFilter /> Apply
        </button>
      </div>

      <div className="bg-white rounded-lg shadow p-4 overflow-x-auto">
        <table className="w-full border border-orange-400 rounded">
          <thead className="bg-gradient-to-br from-orange-300 via-orange-200 to-orange-300 text-orange-800">
            <tr>
              <th className="border border-orange-400 px-4 py-2 text-left">
                User ID
              </th>
              <th className="border border-orange-400 px-4 py-2 text-left">
                Name
              </th>
              <th className="border border-orange-400 px-4 py-2 text-left">
                Department
              </th>
              <th className="border border-orange-400 px-4 py-2 text-left">
                Designation
              </th>
              <th className="border border-orange-400 px-4 py-2 text-center">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {users.map((u) => (
              <tr key={u.user_id} className="hover:bg-orange-50">
                <td className="border border-orange-200 px-4 py-2 font-mono">
                  {u.public_id}
                </td>
                <td className="border border-orange-200 px-4 py-2">{u.name}</td>
                <td className="border border-orange-200 px-4 py-2">
                  {u.department_name}
                </td>
                <td className="border border-orange-200 px-4 py-2">
                  {u.designation_name}
                </td>

                <td className="border border-orange-200 px-4 py-2 flex justify-center gap-3">
                  {/* View Profile */}
                  <button
                    onClick={() => navigate(`/users/profile/${u.public_id}`)}
                    className="text-blue-600 hover:text-blue-800"
                    title="View Profile"
                  >
                    <FaUserCircle size={18} />
                  </button>

                  {/* Promote */}
                  {u.role_name === "USER" && (
                    <button
                      onClick={() => promoteUser(u.public_id)}
                      className="text-green-600 hover:text-green-800"
                      title="Promote to Asset Manager"
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
                  className="border border-orange-200 px-4 py-2 text-center text-gray-500"
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
