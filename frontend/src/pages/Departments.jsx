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
    <div className="p-6 max-w-full bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-6">Departments</h1>

      <div className="overflow-x-auto">
        <table className="w-full border border-orange-400 rounded">
          <thead className="bg-gradient-to-br from-orange-300 via-orange-200 to-orange-300 text-orange-800">
            <tr>
              <th className="border border-orange-400 px-4 py-2 text-left">Department Name</th>
              <th className="border border-orange-400 px-4 py-2 text-left">Department Code</th>
              <th className="border border-orange-400 px-4 py-2 text-left">Description</th>
              <th className="border border-orange-400 px-4 py-2 text-center"></th>
              <th className="border border-orange-400 px-4 py-2 text-center"></th>
            </tr>
          </thead>

          <tbody>
            {departments.map((dept) => (
              <tr key={dept.department_id} className="hover:bg-orange-50">
                <td className="border border-orange-200 px-4 py-2">{dept.department_name}</td>

                <td className="border border-orange-200 px-4 py-2">{dept.department_code}</td>

                <td className="border border-orange-200 px-4 py-2">
                  {editingId === dept.department_id ? (
                    <div className="flex gap-2">
                      <input
                        className="border border-orange-200 rounded px-2 py-1 w-full"
                        value={editDescription}
                        placeholder="Cannot be empty"
                        onChange={(e) => setEditDescription(e.target.value)}
                      />
                      <button
                        onClick={() => saveDescription(dept.department_id)}
                        className="text-green-600"
                      >
                        <FaSave />
                      </button>
                    </div>
                  ) : dept.description ? (
                    <span>{dept.description}</span>
                  ) : (
                    <span className="text-gray-400 italic">No description</span>
                  )}
                </td>

                <td className="border border-orange-200 px-4 py-2 text-center hover:bg-blue-100">
                  <button
                    onClick={() => {
                      setEditingId(dept.department_id);
                      setEditDescription(dept.description || "");
                    }}
                    className="text-blue-600"
                  >
                    <FaEdit />
                  </button>
                </td>

                <td className="border border-orange-200 px-4 py-2 text-center hover:bg-red-100">
                  <button
                    onClick={() => deleteDepartment(dept.department_id)}
                    className="text-red-600"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}

            {/* ADD DEPARTMENT ROW */}
            <tr className="bg-gradient-to-br from-blue-950 via-blue-900 to-blue-950">
              <td colSpan={2} className="px-4 py-2">
                <input
                  className="border rounded px-2 py-1 w-full"
                  placeholder="Department Name"
                  value={newDept.department_name}
                  onChange={(e) =>
                    setNewDept({ ...newDept, department_name: e.target.value })
                  }
                />
              </td>

              <td colSpan={2} className="px-4 py-2">
                <input
                  className="border rounded px-2 py-1 w-full"
                  placeholder="Description (optional)"
                  value={newDept.description}
                  onChange={(e) =>
                    setNewDept({ ...newDept, description: e.target.value })
                  }
                />
              </td>

              <td className="px-4 py-2 text-center hover:bg-green-900">
                <button onClick={addDepartment} className="text-green-400">
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
