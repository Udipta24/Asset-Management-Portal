import { useEffect, useState } from "react";
import { FaPlus, FaEdit, FaTrash, FaSave } from "react-icons/fa";
import API from "../api/api";
import { useAuth } from "../context/AuthContext";

export default function Maintenance() {
  const { currentUser, loading } = useAuth();
  // console.log("Userdata", currentUser);
  const role = currentUser.role;
  //   console.log("Role:", role);
  const canEdit = role === "ADMIN" || role === "ASSET MANAGER";

  const [records, setRecords] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [newRecord, setNewRecord] = useState({
    asset_id: "",
    maintenance_type: "",
    performed_by: currentUser.public_id,
    description: "",
    cost: "",
    maintenance_date: "",
    next_due_date: "",
  });

  const fetchMaintenance = async () => {
    try {
      const res = await API.get("/maintenance");
      setRecords(res?.data?.maintenance || []);
    } catch (err) {
      console.error("Failed to fetch maintenance:", err);
    }
  };

  useEffect(() => {
    fetchMaintenance();
  }, [fetchMaintenance]);

  if (loading) return null;

  const saveRecord = async (id) => {
    await API.put(`/maintenance/${id}`, editData);
    setEditingId(null);
    setEditData({});
    fetchMaintenance();
  };

  const deleteRecord = async (id) => {
    await API.delete(`/maintenance/${id}`);
    fetchMaintenance();
  };

  const addRecord = async () => {
    if (!newRecord.asset_id || !newRecord.maintenance_type) return;

    await API.post("/maintenance", newRecord);

    setNewRecord({
      asset_id: "",
      maintenance_type: "",
      performed_by: currentUser.public_id,
      description: "",
      cost: "",
      maintenance_date: "",
      next_due_date: "",
    });

    fetchMaintenance();
  };

  return (
    <div className="p-6 max-w-full bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm">
      <h1 className="text-2xl font-bold mb-6 text-slate-800 dark:text-white">
        Maintenance Records
      </h1>
      {canEdit && (
        <div className="bg-slate-50 dark:bg-slate-800/60 p-4 overflow-x-auto rounded-xl border border-slate-200 dark:border-white/10 grid grid-cols-6 gap-4 items-end mb-4">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-white col-span-6">
            Add Maintenance Record
          </h2>
          <input
            className="w-full bg-transparent border-b px-2 py-1 outline-none
      text-slate-800 border-slate-300 focus:border-green-500
      dark:text-white dark:border-white/20 dark:focus:border-green-400
      transition-colors col-span-6"
            placeholder="Asset ID"
            value={newRecord.asset_id}
            onChange={(e) =>
              setNewRecord({
                ...newRecord,
                asset_id: e.target.value,
              })
            }
          />

          <input
            className="w-full bg-transparent border-b px-2 py-1 outline-none
                text-slate-800 border-slate-300 focus:border-green-500
                dark:text-white dark:border-white/20 dark:focus:border-green-400
                transition-colors col-span-3"
            placeholder="Maintenance Type"
            value={newRecord.maintenance_type}
            onChange={(e) =>
              setNewRecord({
                ...newRecord,
                maintenance_type: e.target.value,
              })
            }
          />

          <input
            className="w-full bg-transparent border-b px-2 py-1 outline-none
                text-slate-800 border-slate-300 focus:border-green-500
                dark:text-white dark:border-white/20 dark:focus:border-green-400
                transition-colors col-span-3"
            placeholder="Cost"
            value={newRecord.cost}
            onChange={(e) =>
              setNewRecord({
                ...newRecord,
                cost: e.target.value,
              })
            }
          />

          <input
            type="date"
            className="w-full bg-transparent border-b px-2 py-1 outline-none
                text-slate-800 border-slate-300 focus:border-green-500
                dark:text-white dark:border-white/20 dark:focus:border-green-400
                transition-colors col-span-3"
            placeholder="Maintenance Date"
            value={newRecord.maintenance_date}
            onChange={(e) =>
              setNewRecord({
                ...newRecord,
                maintenance_date: e.target.value,
              })
            }
          />

          <input
            type="date"
            className="w-full bg-transparent border-b px-2 py-1 outline-none
                text-slate-800 border-slate-300 focus:border-green-500
                dark:text-white dark:border-white/20 dark:focus:border-green-400
                transition-colors col-span-3"
            placeholder="Next Due Date"
            value={newRecord.next_due_date}
            onChange={(e) =>
              setNewRecord({
                ...newRecord,
                next_due_date: e.target.value,
              })
            }
          />

          <input
            className="w-full bg-transparent border-b px-2 py-1 outline-none
                text-slate-800 border-slate-300 focus:border-green-500
                dark:text-white dark:border-white/20 dark:focus:border-green-400
                transition-colors col-span-5"
            placeholder="Description"
            value={newRecord.description}
            onChange={(e) =>
              setNewRecord({
                ...newRecord,
                description: e.target.value,
              })
            }
          />

          <div className="flex justify-center">
            <button
              onClick={addRecord}
              className="p-2 rounded-lg text-green-600 hover:bg-green-100
                  dark:text-green-400 dark:hover:bg-green-500/10 transition"
            >
              <FaPlus />
            </button>
          </div>
        </div>
      )}

      <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-white/10">
        <table className="w-full border-collapse">
          <thead className="bg-slate-100 dark:bg-slate-800/60 text-slate-700 dark:text-slate-200">
            <tr>
              <th className="px-4 py-3 text-left border-b border-slate-200 dark:border-white/10">
                Asset ID
              </th>
              <th className="px-4 py-3 text-left border-b border-slate-200 dark:border-white/10">
                Maintenance Type
              </th>
              <th className="px-4 py-3 text-left border-b border-slate-200 dark:border-white/10">
                Performed By
              </th>
              <th className="px-4 py-3 text-left border-b border-slate-200 dark:border-white/10">
                Maintenance Cost
              </th>
              <th className="px-4 py-3 text-left border-b border-slate-200 dark:border-white/10">
                Maintenance Date
              </th>
              <th className="px-4 py-3 text-left border-b border-slate-200 dark:border-white/10">
                Next Due
              </th>
              <th className="px-4 py-3 text-left border-b border-slate-200 dark:border-white/10">
                Description
              </th>
              {canEdit && (
                <>
                  <th className="px-4 py-3 text-center border-b border-slate-200 dark:border-white/10" />
                  <th className="px-4 py-3 text-center border-b border-slate-200 dark:border-white/10" />
                </>
              )}
            </tr>
          </thead>

          <tbody>
            {records.length === 0 && (
              <tr>
                <td colSpan={8} className="text-center py-6 text-slate-500">
                  No maintenance records found
                </td>
              </tr>
            )}

            {records.map((row) => (
              <tr
                key={row.maintenance_id}
                className="transition-colors hover:bg-slate-100 dark:hover:bg-slate-800/60 text-slate-800 dark:text-slate-100"
              >
                <td className="px-4 py-2 border-b border-slate-200 dark:border-white/5">
                  {row.asset_name}
                </td>
                <td className="px-4 py-2 border-b border-slate-200 dark:border-white/5">
                  {editingId === row.maintenance_id ? (
                    <div className="flex gap-2 items-center">
                      <input
                        className="w-full bg-transparent border-b px-1 py-1 outline-none
                          text-slate-800 border-blue-400 focus:border-blue-600
                          dark:text-white dark:border-cyan-500/40 dark:focus:border-cyan-400
                          transition-colors"
                        value={editData.maintenance_type || ""}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            maintenance_type: e.target.value,
                          })
                        }
                      />
                      <button
                        onClick={() => saveRecord(row.maintenance_id)}
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
                    row.maintenance_type || "—"
                  )}
                </td>
                <td className="px-4 py-2 border-b border-slate-200 dark:border-white/5">
                  {row.performed_by_name}
                </td>
                <td className="px-4 py-2 border-b border-slate-200 dark:border-white/5">
                  {editingId === row.maintenance_id ? (
                    <div className="flex gap-2 items-center">
                      <input
                        className="w-full bg-transparent border-b px-1 py-1 outline-none
                          text-slate-800 border-blue-400 focus:border-blue-600
                          dark:text-white dark:border-cyan-500/40 dark:focus:border-cyan-400
                          transition-colors"
                        value={editData.cost || ""}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            cost: e.target.value,
                          })
                        }
                      />
                      <button
                        onClick={() => saveRecord(row.maintenance_id)}
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
                    row.cost || "—"
                  )}
                </td>
                <td className="px-4 py-2 border-b border-slate-200 dark:border-white/5">
                  {editingId === row.maintenance_id ? (
                    <div className="flex gap-2 items-center">
                      <input
                        type="date"
                        className="w-full bg-transparent border-b px-1 py-1 outline-none
                          text-slate-800 border-blue-400 focus:border-blue-600
                          dark:text-white dark:border-cyan-500/40 dark:focus:border-cyan-400
                          transition-colors"
                        value={editData.maintenance_date || ""}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            maintenance_date: e.target.value,
                          })
                        }
                      />
                      <button
                        onClick={() => saveRecord(row.maintenance_id)}
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
                    row.maintenance_date || "—"
                  )}
                </td>
                <td className="px-4 py-2 border-b border-slate-200 dark:border-white/5">
                  {editingId === row.maintenance_id ? (
                    <div className="flex gap-2 items-center">
                      <input
                        type="date"
                        className="w-full bg-transparent border-b px-1 py-1 outline-none
                          text-slate-800 border-blue-400 focus:border-blue-600
                          dark:text-white dark:border-cyan-500/40 dark:focus:border-cyan-400
                          transition-colors"
                        value={editData.next_due_date || ""}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            next_due_date: e.target.value,
                          })
                        }
                      />
                      <button
                        onClick={() => saveRecord(row.maintenance_id)}
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
                    row.next_due_date || "—"
                  )}
                </td>
                <td className="px-4 py-2 border-b border-slate-200 dark:border-white/5">
                  {editingId === row.maintenance_id ? (
                    <div className="flex gap-2 items-center">
                      <input
                        className="w-full bg-transparent border-b px-1 py-1 outline-none
                          text-slate-800 border-blue-400 focus:border-blue-600
                          dark:text-white dark:border-cyan-500/40 dark:focus:border-cyan-400
                          transition-colors"
                        value={editData.description || ""}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            description: e.target.value,
                          })
                        }
                      />
                      <button
                        onClick={() => saveRecord(row.maintenance_id)}
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
                    row.description || "—"
                  )}
                </td>

                {canEdit && (
                  <>
                    <td className="px-4 py-2 text-center border-b border-slate-200 dark:border-white/5">
                      <button
                        onClick={() => {
                          setEditingId(row.maintenance_id);
                          setEditData(row);
                        }}
                        className="p-2 rounded-lg text-blue-600 hover:bg-blue-100 dark:text-cyan-400 dark:hover:bg-cyan-500/10 transition"
                      >
                        <FaEdit />
                      </button>
                    </td>

                    <td className="px-4 py-2 text-center border-b border-slate-200 dark:border-white/5">
                      <button
                        onClick={() => deleteRecord(row.maintenance_id)}
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
