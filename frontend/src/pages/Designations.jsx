import { useEffect, useState } from "react";
import { FaPlus, FaTrash, FaEdit, FaSave } from "react-icons/fa";
import API from "../api/api";

export default function Designations() {
  const [designations, setDesignations] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editDescription, setEditDescription] = useState("");

  const [newDesignation, setNewDesignation] = useState({
    designation_name: "",
    description: "",
  });

  const fetchDesignations = async () => {
    const res = await API.get("/designations");
    setDesignations(res.data);
  };

  useEffect(() => {
    fetchDesignations();
  }, []);

  const saveDescription = async (id) => {
    await API.patch(`/designations/${id}`, { description: editDescription });

    setEditingId(null);
    setEditDescription("");
    fetchDesignations();
  };

  const deleteDesignation = async (id) => {
    await API.delete(`/designations/${id}`);
    fetchDesignations();
  };

  const addDesignation = async () => {
    if (!newDesignation.designation_name.trim()) return;

    const res = await API.post("/designations", newDesignation);

    setNewDesignation({ designation_name: "", description: "" });
    fetchDesignations();
  };

  return (
    <div className="p-6 max-w-full bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm">
      <h1 className="text-2xl font-bold mb-6 text-slate-800 dark:text-white">
        Designations
      </h1>
      <div className="bg-slate-50 dark:bg-slate-800/60 p-4 overflow-x-auto rounded-xl border border-slate-200 dark:border-white/10 grid grid-cols-8 gap-4 items-end mb-4">
        <h2 className="text-lg font-semibold text-slate-800 dark:text-white col-span-8">
          Add Designation
        </h2>
        <input
          className="w-full bg-transparent border-b px-2 py-1 outline-none
    text-slate-800 border-slate-300 focus:border-green-500
    dark:text-white dark:border-white/20 dark:focus:border-green-400
    transition-colors col-span-3"
          placeholder="Designation Name"
          value={newDesignation.designation_name}
          onChange={(e) =>
            setNewDesignation({ ...newDesignation, designation_name: e.target.value })
          }
        />

        <input
          className="w-full bg-transparent border-b px-2 py-1 outline-none
    text-slate-800 border-slate-300 focus:border-green-500
    dark:text-white dark:border-white/20 dark:focus:border-green-400
    transition-colors col-span-4"
          placeholder="Description (optional)"
          value={newDesignation.description}
          onChange={(e) =>
            setNewDesignation({ ...newDesignation, description: e.target.value })
          }
        />

        <div className="flex justify-center">
          <button
            onClick={addDesignation}
            className="p-2 rounded-lg text-green-600 hover:bg-green-100
                  dark:text-green-400 dark:hover:bg-green-500/10 transition"
          >
            <FaPlus />
          </button>
        </div>
      </div>

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
                Designation Name
              </th>
              <th className="px-4 py-3 text-left border-b border-slate-200 dark:border-white/10">
                Designation Code
              </th>
              <th className="px-4 py-3 text-left border-b border-slate-200 dark:border-white/10">
                Description
              </th>
              <th className="px-4 py-3 text-center border-b border-slate-200 dark:border-white/10" />
              <th className="px-4 py-3 text-center border-b border-slate-200 dark:border-white/10" />
            </tr>
          </thead>

          <tbody>
            {designations.map((desig) => (
              <tr
                key={desig.designation_id}
                className="transition-colors
                  hover:bg-slate-100
                  dark:hover:bg-slate-800/60
                  text-slate-800 dark:text-slate-100"
              >
                <td className="px-4 py-2 border-b border-slate-200 dark:border-white/5">
                  {desig.designation_name}
                </td>

                <td className="px-4 py-2 border-b border-slate-200 dark:border-white/5">
                  {desig.designation_code}
                </td>

                <td className="px-4 py-2 border-b border-slate-200 dark:border-white/5">
                  {editingId === desig.designation_id ? (
                    <div className="flex gap-2 items-center">
                      <input
                        className="
          w-full bg-transparent border-b px-1 py-1 outline-none
          text-slate-800 border-blue-400 focus:border-blue-600
          dark:text-white dark:border-cyan-500/40 dark:focus:border-cyan-400
          transition-colors
        "
                        value={editDescription}
                        placeholder="Cannot be empty"
                        onChange={(e) => setEditDescription(e.target.value)}
                      />
                      <button
                        onClick={() => saveDescription(desig.designation_id)}
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
                  ) : desig.description ? (
                    <span>{desig.description}</span>
                  ) : (
                    <span className="italic text-slate-400 dark:text-slate-500">
                      No description
                    </span>
                  )}
                </td>

                <td className="px-4 py-2 text-center border-b border-slate-200 dark:border-white/5">
                  <button
                    onClick={() => {
                      setEditingId(desig.designation_id);
                      setEditDescription(desig.description || "");
                    }}
                    className="
      p-2 rounded-lg
      text-blue-600
      hover:bg-blue-100
      dark:text-cyan-400 dark:hover:bg-cyan-500/10
      transition
    "
                  >
                    <FaEdit />
                  </button>
                </td>

                <td className="px-4 py-2 text-center border-b border-slate-200 dark:border-white/5">
                  <button
                    onClick={() => deleteDesignation(desig.designation_id)}
                    className="
      p-2 rounded-lg
      text-red-600
      hover:bg-red-100
      dark:text-red-400 dark:hover:bg-red-500/10
      transition
    "
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
