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
    <div className="p-max-w-full bg-white p-6 rounded shadow">
      <h1 className="text-2xl font-bold mb-6">Designations</h1>

      <div className="overflow-x-auto">
        <table className="w-full border border-orange-400 rounded">
          <thead className="bg-gradient-to-br from-orange-300 via-orange-200 to-orange-300 text-orange-800">
            <tr>
              <th className="border border-orange-400 px-4 py-2 text-left">Designation Name</th>
              <th className="border border-orange-400 px-4 py-2 text-left">Designation Code</th>
              <th className="border border-orange-400 px-4 py-2 text-left">Description</th>
              <th className="border border-orange-400 px-4 py-2 text-center"></th>
              <th className="border border-orange-400 px-4 py-2 text-center"></th>
            </tr>
          </thead>

          <tbody>
            {designations.map((desig) => (
              <tr key={desig.designation_id} className="hover:bg-orange-50">
                <td className="border border-orange-200 px-4 py-2">{desig.designation_name}</td>

                <td className="border border-orange-200 px-4 py-2">{desig.designation_code}</td>

                <td className="border border-orange-200 px-4 py-2">
                  {editingId === desig.designation_id ? (
                    <div className="flex gap-2">
                      <input
                        className="border border-orange-200 rounded px-2 py-1 w-full"
                        value={editDescription}
                        placeholder="Cannot be empty"
                        onChange={(e) => setEditDescription(e.target.value)}
                      />
                      <button
                        onClick={() => saveDescription(desig.designation_id)}
                        className="text-green-600"
                      >
                        <FaSave />
                      </button>
                    </div>
                  ) : desig.description ? (
                    <span>{desig.description}</span>
                  ) : (
                    <span className="text-gray-400 italic">No description</span>
                  )}
                </td>

                <td className="border border-orange-200 px-4 py-2 text-center hover:bg-blue-100">
                  <button
                    onClick={() => {
                      setEditingId(desig.designation_id);
                      setEditDescription(desig.description || "");
                    }}
                    className="text-blue-600"
                  >
                    <FaEdit />
                  </button>
                </td>

                <td className="border border-orange-200 px-4 py-2 text-center hover:bg-red-100">
                  <button
                    onClick={() => deleteDesignation(desig.designation_id)}
                    className="text-red-600"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}

            {/* ADD DESIGNATION ROW */}
            <tr className="bg-gradient-to-br from-blue-950 via-blue-900 to-blue-950">
              <td colSpan={2} className="px-4 py-2">
                <input
                  className="border rounded px-2 py-1 w-full"
                  placeholder="Designation Name"
                  value={newDesignation.designation_name}
                  onChange={(e) =>
                    setNewDesignation({
                      ...newDesignation,
                      designation_name: e.target.value,
                    })
                  }
                />
              </td>

              <td colSpan={2} className="px-4 py-2">
                <input
                  className="border rounded px-2 py-1 w-full"
                  placeholder="Description (optional)"
                  value={newDesignation.description}
                  onChange={(e) =>
                    setNewDesignation({
                      ...newDesignation,
                      description: e.target.value,
                    })
                  }
                />
              </td>

              <td className="px-4 py-2 text-center hover:bg-green-900">
                <button onClick={addDesignation} className="text-green-400">
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
