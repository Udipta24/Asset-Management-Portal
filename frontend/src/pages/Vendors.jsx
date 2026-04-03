import { useEffect, useState } from "react";
import { FaPlus, FaTrash, FaEdit, FaSave } from "react-icons/fa";
import API from "../api/api";
import { useAuth } from "../context/AuthContext";

export default function Vendors() {
  const { currentUser, loading } = useAuth();
  console.log("Userdata", currentUser);
  const user_role = currentUser.role;
  console.log("User role", user_role);
  const allowed = user_role === "ADMIN" || user_role === "ASSET MANAGER";

  const [vendors, setVendors] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [newVendor, setNewVendor] = useState({
    vendor_name: "",
    contact_person: "",
    phone: "",
    email: "",
    address: "",
  });

  const fetchVendors = async () => {
    const res = await API.get("/vendors");
    setVendors(res.data.vendors);
  };

  useEffect(() => {
    fetchVendors();
  }, [fetchVendors]);

  if (loading) return null;

  const saveVendor = async (id) => {
    await API.patch(`/vendors/${id}`, editData);
    setEditingId(null);
    setEditData({});
    fetchVendors();
  };

  const deleteVendor = async (id) => {
    await API.delete(`/vendors/${id}`);
    fetchVendors();
  };

  const addVendor = async () => {
    if (!newVendor.vendor_name.trim()) return;

    await API.post("/vendors", newVendor);
    setNewVendor({
      vendor_name: "",
      contact_person: "",
      phone: "",
      email: "",
      address: "",
    });

    fetchVendors();
  };

  if (loading) {
    return (
      <div className="p-6 max-w-full bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm">
        Loading...
      </div>
    );
  }

  return (
    <div className="p-6 max-w-full bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm">
      <h1 className="text-2xl font-bold mb-6 text-slate-800 dark:text-white">
        Vendors
      </h1>

      {allowed && (
        <div className="bg-slate-50 dark:bg-slate-800/60 p-4 overflow-x-auto rounded-xl border border-slate-200 dark:border-white/10 grid grid-cols-6 gap-4 items-end mb-4">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-white col-span-6">
            Add Vendor
          </h2>
          <input
            className="w-full bg-transparent border-b px-2 py-1 outline-none
      text-slate-800 border-slate-300 focus:border-green-500
      dark:text-white dark:border-white/20 dark:focus:border-green-400
      transition-colors col-span-3"
            placeholder="Vendor name"
            value={newVendor.vendor_name}
            onChange={(e) =>
              setNewVendor({
                ...newVendor,
                vendor_name: e.target.value,
              })
            }
          />

          <input
            className="w-full bg-transparent border-b px-2 py-1 outline-none
                text-slate-800 border-slate-300 focus:border-green-500
                dark:text-white dark:border-white/20 dark:focus:border-green-400
                transition-colors col-span-3"
            placeholder="Contact person"
            value={newVendor.contact_person}
            onChange={(e) =>
              setNewVendor({
                ...newVendor,
                contact_person: e.target.value,
              })
            }
          />

          <input
            className="w-full bg-transparent border-b px-2 py-1 outline-none
                text-slate-800 border-slate-300 focus:border-green-500
                dark:text-white dark:border-white/20 dark:focus:border-green-400
                transition-colors col-span-3"
            placeholder="Phone"
            value={newVendor.phone}
            onChange={(e) =>
              setNewVendor({
                ...newVendor,
                phone: e.target.value,
              })
            }
          />

          <input
            className="w-full bg-transparent border-b px-2 py-1 outline-none
                text-slate-800 border-slate-300 focus:border-green-500
                dark:text-white dark:border-white/20 dark:focus:border-green-400
                transition-colors col-span-3"
            placeholder="Email"
            value={newVendor.email}
            onChange={(e) =>
              setNewVendor({
                ...newVendor,
                email: e.target.value,
              })
            }
          />

          <input
            className="w-full bg-transparent border-b px-2 py-1 outline-none
                text-slate-800 border-slate-300 focus:border-green-500
                dark:text-white dark:border-white/20 dark:focus:border-green-400
                transition-colors col-span-5"
            placeholder="Address"
            value={newVendor.address}
            onChange={(e) =>
              setNewVendor({
                ...newVendor,
                address: e.target.value,
              })
            }
          />

          <div className="flex justify-center">
            <button
              onClick={addVendor}
              className="p-2 rounded-lg text-green-600 hover:bg-green-100
                  dark:text-green-400 dark:hover:bg-green-500/10 transition"
            >
              <FaPlus />
            </button>
          </div>
        </div>
      )}
      <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-white/10 ">
        <table className="w-full border-collapse">
          <thead
            className="
    bg-slate-100 text-slate-700
    dark:bg-slate-800/60 dark:text-slate-200
  "
          >
            <tr>
              <th className="px-4 py-3 text-left border-b border-slate-200 dark:border-white/10">
                Vendor Name
              </th>
              <th className="px-4 py-3 text-left border-b border-slate-200 dark:border-white/10">
                Contact Person
              </th>
              <th className="px-4 py-3 text-left border-b border-slate-200 dark:border-white/10">
                Phone
              </th>
              <th className="px-4 py-3 text-left border-b border-slate-200 dark:border-white/10">
                Email
              </th>
              <th className="px-4 py-3 text-left border-b border-slate-200 dark:border-white/10">
                Address
              </th>
              {allowed && (
                <>
                  <th className="px-4 py-3 text-center border-b border-slate-200 dark:border-white/10" />
                  <th className="px-4 py-3 text-center border-b border-slate-200 dark:border-white/10" />
                </>
              )}
            </tr>
          </thead>

          <tbody>
            {vendors.map((vendor) => (
              <tr
                key={vendor.vendor_id}
                className="transition-colors hover:bg-slate-100 dark:hover:bg-slate-800/60 text-slate-800 dark:text-slate-100"
              >
                <td className="px-4 py-2 border-b border-slate-200 dark:border-white/5">
                  {vendor.vendor_name}
                </td>

                <td className="px-4 py-2 border-b border-slate-200 dark:border-white/5">
                  {editingId === vendor.vendor_id ? (
                    <div className="flex gap-2 items-center">
                      <input
                        className="w-full bg-transparent border-b px-1 py-1 outline-none
          text-slate-800 border-blue-400 focus:border-blue-600
          dark:text-white dark:border-cyan-500/40 dark:focus:border-cyan-400
          transition-colors"
                        value={editData.contact_person || ""}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            contact_person: e.target.value,
                          })
                        }
                      />
                      <button
                        onClick={() => saveVendor(vendor.vendor_id)}
                        className="
          p-2 rounded-lg
          text-green-600
          hover:bg-green-100
          dark:text-green-400 dark:hover:bg-green-500/10
          transition
        "
                      >
                        <FaSave />
                      </button>
                    </div>
                  ) : (
                    vendor.contact_person || "—"
                  )}
                </td>

                <td className="px-4 py-2 border-b border-slate-200 dark:border-white/5">
                  {editingId === vendor.vendor_id ? (
                    <div className="flex gap-2 items-center">
                      <input
                        className="w-full bg-transparent border-b px-1 py-1 outline-none
          text-slate-800 border-blue-400 focus:border-blue-600
          dark:text-white dark:border-cyan-500/40 dark:focus:border-cyan-400
          transition-colors"
                        value={editData.phone || ""}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            phone: e.target.value,
                          })
                        }
                      />
                      <button
                        onClick={() => saveVendor(vendor.vendor_id)}
                        className="
          p-2 rounded-lg
          text-green-600
          hover:bg-green-100
          dark:text-green-400 dark:hover:bg-green-500/10
          transition
        "
                      >
                        <FaSave />
                      </button>
                    </div>
                  ) : (
                    vendor.phone || "—"
                  )}
                </td>

                <td className="px-4 py-2 border-b border-slate-200 dark:border-white/5">
                  {editingId === vendor.vendor_id ? (
                    <div className="flex gap-2 items-center">
                      <input
                        className="w-full bg-transparent border-b px-1 py-1 outline-none
          text-slate-800 border-blue-400 focus:border-blue-600
          dark:text-white dark:border-cyan-500/40 dark:focus:border-cyan-400
          transition-colors"
                        value={editData.email || ""}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            email: e.target.value,
                          })
                        }
                      />
                      <button
                        onClick={() => saveVendor(vendor.vendor_id)}
                        className="
          p-2 rounded-lg
          text-green-600
          hover:bg-green-100
          dark:text-green-400 dark:hover:bg-green-500/10
          transition
        "
                      >
                        <FaSave />
                      </button>
                    </div>
                  ) : (
                    vendor.email || "—"
                  )}
                </td>

                <td className="px-4 py-2 border-b border-slate-200 dark:border-white/5">
                  {editingId === vendor.vendor_id ? (
                    <div className="flex gap-2 items-center">
                      <input
                        className="w-full bg-transparent border-b px-1 py-1 outline-none
          text-slate-800 border-blue-400 focus:border-blue-600
          dark:text-white dark:border-cyan-500/40 dark:focus:border-cyan-400
          transition-colors"
                        value={editData.address || ""}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            address: e.target.value,
                          })
                        }
                      />
                      <button
                        onClick={() => saveVendor(vendor.vendor_id)}
                        className="
          p-2 rounded-lg
          text-green-600
          hover:bg-green-100
          dark:text-green-400 dark:hover:bg-green-500/10
          transition
        "
                      >
                        <FaSave />
                      </button>
                    </div>
                  ) : (
                    vendor.address || "—"
                  )}
                </td>

                {allowed && (
                  <>
                    <td className="px-4 py-2 text-center border-b border-slate-200 dark:border-white/5">
                      <button
                        onClick={() => {
                          setEditingId(vendor.vendor_id);
                          setEditData(vendor);
                        }}
                        className="p-2 rounded-lg text-blue-600 hover:bg-blue-100 dark:text-cyan-400 dark:hover:bg-cyan-500/10 transition"
                      >
                        <FaEdit />
                      </button>
                    </td>

                    <td className="px-4 py-2 text-center border-b border-slate-200 dark:border-white/5">
                      <button
                        onClick={() => deleteVendor(vendor.vendor_id)}
                        className="p-2 rounded-lg text-red-600 hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-500/10 transition"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
