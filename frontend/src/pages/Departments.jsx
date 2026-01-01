import { useEffect, useState } from "react";
import { FaPlus, FaTrash, FaEdit, FaSave } from "react-icons/fa";
import API from "../api/api";

export default function Departments() {
  const [departments, setDepartments] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editDescription, setEditDescription] = useState("");

  const [newDept, setNewDept] = useState({
    department_name: "",
    description: "",
  });

  const fetchDepartments = async () => {
    const res = await API.get("/departments");
    setDepartments(res.data);
    // console.log(res.data);
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const saveDescription = async (id) => {
    await API.patch(`/departments/${id}`, { description: editDescription });

    setEditingId(null);
    setEditDescription("");
    fetchDepartments();
  };

  const deleteDepartment = async (id) => {
    await API.delete(`/departments/${id}`);
    fetchDepartments();
  };

  const addDepartment = async () => {
    if (!newDept.department_name.trim()) return;

    const res = await API.post("/departments", newDept);
    setNewDept({ department_name: "", description: "" });
    fetchDepartments();
  };

  return (
    <div className="p-6 max-w-full bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm">
      <h1 className="text-2xl font-bold mb-6 text-slate-800 dark:text-white">
        Departments
      </h1>

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
                Department Name
              </th>
              <th className="px-4 py-3 text-left border-b border-slate-200 dark:border-white/10">
                Department Code
              </th>
              <th className="px-4 py-3 text-left border-b border-slate-200 dark:border-white/10">
                Description
              </th>
              <th className="px-4 py-3 text-center border-b border-slate-200 dark:border-white/10" />
              <th className="px-4 py-3 text-center border-b border-slate-200 dark:border-white/10" />
            </tr>
          </thead>

          <tbody>
            {departments.map((dept) => (
              <tr
                key={dept.department_id}
                className="transition-colors
                  hover:bg-slate-100
                  dark:hover:bg-slate-800/60
                  text-slate-800 dark:text-slate-100"
              >
                <td className="px-4 py-2 border-b border-slate-200 dark:border-white/5">
                  {dept.department_name}
                </td>

                <td className="px-4 py-2 border-b border-slate-200 dark:border-white/5">
                  {dept.department_code}
                </td>

                <td className="px-4 py-2 border-b border-slate-200 dark:border-white/5">
                  {editingId === dept.department_id ? (
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
                        onClick={() => saveDescription(dept.department_id)}
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
                  ) : dept.description ? (
                    <span>{dept.description}</span>
                  ) : (
                    <span className="italic text-slate-400 dark:text-slate-500">
                      No description
                    </span>
                  )}
                </td>

                <td className="px-4 py-2 text-center border-b border-slate-200 dark:border-white/5">
                  <button
                    onClick={() => {
                      setEditingId(dept.department_id);
                      setEditDescription(dept.description || "");
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
                    onClick={() => deleteDepartment(dept.department_id)}
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

            {/* ADD DEPARTMENT ROW */}
            <tr
              className="bg-slate-50
  dark:bg-slate-800/60"
            >
              <td colSpan={2} className="px-4 py-2">
                <input
                  className="w-full bg-transparent border-b px-2 py-1 outline-none
    text-slate-800 border-slate-300 focus:border-green-500
    dark:text-white dark:border-white/20 dark:focus:border-green-400
    transition-colors"
                  placeholder="Department Name"
                  value={newDept.department_name}
                  onChange={(e) =>
                    setNewDept({ ...newDept, department_name: e.target.value })
                  }
                />
              </td>

              <td colSpan={2} className="px-4 py-2">
                <input
                  className="w-full bg-transparent border-b px-2 py-1 outline-none
    text-slate-800 border-slate-300 focus:border-green-500
    dark:text-white dark:border-white/20 dark:focus:border-green-400
    transition-colors"
                  placeholder="Description (optional)"
                  value={newDept.description}
                  onChange={(e) =>
                    setNewDept({ ...newDept, description: e.target.value })
                  }
                />
              </td>

              <td className="px-4 py-2 text-center">
                <button
                  onClick={addDepartment}
                  className="p-2 rounded-lg
    text-green-600
    hover:bg-green-100
    dark:text-green-400 dark:hover:bg-green-500/10
    transition"
                >
                  <FaPlus />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
