import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../api/api";
import {
  FaEdit,
  FaSave,
  FaTrash,
  FaEnvelope,
  FaPhone,
  FaIdBadge,
} from "react-icons/fa";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { PiOfficeChairFill } from "react-icons/pi";
import { HiMiniBuildingOffice } from "react-icons/hi2";
import { FaUserTie } from "react-icons/fa6";
import { useAuth } from "../context/AuthContext";

function Info({ label, value, icon }) {
  return (
    <div className="flex items-center gap-3">
      {icon}
      <span className="w-32 text-gray-600">{label}</span>
      <span>{value}</span>
    </div>
  );
}

export default function UserProfile() {
  const { publicId } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ email: "", phone: "" });

  const fetchUser = async () => {
    const res = await API.get(`/user/${publicId}`);
    console.log("Fetched", res.data.user);
    setUser(res.data.user);
    setForm({
      email: res.data.user.email,
      phone: res.data.user.phone,
    });
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const saveChanges = async () => {
    await API.patch(`/user/${publicId}`, form);
    setEditMode(false);
    fetchUser();
  };

  const deleteUser = async () => {
    await API.delete(`/user/${publicId}`);
    navigate("/users");
  };

  if (!user) return null;

  return (
    <div className="mx-auto max-w-full bg-orange-50 p-6 rounded shadow space-y-4">
      <h1 className="text-2xl font-semibold mb-6">User Profile</h1>

      <div className="bg-white shadow rounded p-6 space-y-4">
        <Info label="User ID" value={user.public_id} icon={<FaIdBadge />} />
        <Info
          label="Name"
          value={user.name}
          icon={<IoMdInformationCircleOutline />}
        />
        <Info
          label="Department"
          value={user.department_name}
          icon={<HiMiniBuildingOffice />}
        />
        <Info
          label="Designation"
          value={user.designation_name}
          icon={<PiOfficeChairFill />}
        />
        <Info label="Role" value={user.role_name} icon={<FaUserTie />} />

        {/* Email */}
        <div className="flex items-center gap-3">
          <FaEnvelope />
          <span className="w-32 text-gray-600">Email</span>
          {editMode ? (
            <input
              className="border px-2 py-1 rounded w-full"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          ) : (
            <span>{user.email}</span>
          )}
        </div>

        {/* Phone */}
        <div className="flex items-center gap-3">
          <FaPhone />
          <span className="w-32 text-gray-600">Phone</span>
          {editMode ? (
            <input
              className="border px-2 py-1 rounded w-full"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
          ) : (
            <span>{user.phone || "-"}</span>
          )}
        </div>

        {/* ADMIN Buttons */}
        {currentUser.role === "ADMIN" && (
          <div className="flex justify-end gap-4 pt-4">
            <button
              onClick={() => (editMode ? saveChanges() : setEditMode(true))}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded"
            >
              {editMode ? <FaSave /> : <FaEdit />}
              {editMode ? "Save" : "Edit"}
            </button>

            <button
              onClick={deleteUser}
              className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded"
            >
              <FaTrash />
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
