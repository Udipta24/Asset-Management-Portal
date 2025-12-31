import { useEffect, useState } from "react";
import { FaPlus, FaTrash, FaEdit, FaSave } from "react-icons/fa";
import API from "../api/api";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editDescription, setEditDescription] = useState("");

  const [newCategory, setNewCategory] = useState({
    category_name: "",
    description: "",
  });

  const fetchCategories = async () => {
    const res = await API.get("/categories");
    setCategories(res.data);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const saveDescription = async (id) => {
    await API.patch(`/categories/${id}`, { description: editDescription });

    setEditingId(null);
    setEditDescription("");
    fetchCategories();
  };

  const deleteCategory = async (id) => {
    await API.delete(`/categories/${id}`);
    fetchCategories();
  };

  const addCategory = async () => {
    if (!newCategory.category_name.trim()) return;

    const res = await API.post("/categories", newCategory);

    setNewCategory({ category_name: "", description: "" });
    fetchCategories();
  };

  return (
    <div className="p-max-w-full bg-white p-6 rounded shadow">
      <h1 className="text-2xl font-bold mb-6">Categories</h1>

      <div className="overflow-x-auto">
        <table className="w-full border border-orange-400 rounded">
          <thead className="bg-gradient-to-br from-orange-300 via-orange-200 to-orange-300 text-orange-800">
            <tr>
              <th className="border border-orange-400 px-4 py-2 text-left">
                Category Name
              </th>
              <th className="border border-orange-400 px-4 py-2 text-left">
                Category Code
              </th>
              <th className="border border-orange-400 px-4 py-2 text-left">
                Description
              </th>
              <th className="border border-orange-400 px-4 py-2 text-center"></th>
              <th className="border border-orange-400 px-4 py-2 text-center"></th>
            </tr>
          </thead>

          <tbody>
            {categories.map((cat) => (
              <tr key={cat.category_id} className="hover:bg-orange-50">
                <td className="border border-orange-200 px-4 py-2">
                  {cat.category_name}
                </td>

                <td className="border border-orange-200 px-4 py-2">
                  {cat.category_code}
                </td>

                <td className="border border-orange-200 px-4 py-2">
                  {editingId === cat.category_id ? (
                    <div className="flex gap-2">
                      <input
                        className="border border-orange-200 rounded px-2 py-1 w-full"
                        value={editDescription}
                        placeholder="Cannot be empty"
                        onChange={(e) => setEditDescription(e.target.value)}
                      />
                      <button
                        onClick={() => saveDescription(cat.category_id)}
                        className="text-green-600"
                      >
                        <FaSave />
                      </button>
                    </div>
                  ) : cat.description ? (
                    <span>{cat.description}</span>
                  ) : (
                    <span className="text-gray-400 italic">No description</span>
                  )}
                </td>

                <td className="border border-orange-200 px-4 py-2 text-center hover:bg-blue-100">
                  <button
                    onClick={() => {
                      setEditingId(cat.category_id);
                      setEditDescription(cat.description || "");
                    }}
                    className="text-blue-600"
                  >
                    <FaEdit />
                  </button>
                </td>

                <td className="border border-orange-200 px-4 py-2 text-center hover:bg-red-100">
                  <button
                    onClick={() => deleteCategory(cat.category_id)}
                    className="text-red-600"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}

            {/* ADD CATEGORY ROW */}
            <tr className="bg-gradient-to-br from-blue-950 via-blue-900 to-blue-950">
              <td colSpan={2} className="px-4 py-2">
                <input
                  className="border rounded px-2 py-1 w-full"
                  placeholder="Category Name"
                  value={newCategory.category_name}
                  onChange={(e) =>
                    setNewCategory({
                      ...newCategory,
                      category_name: e.target.value,
                    })
                  }
                />
              </td>

              <td colSpan={2} className="px-4 py-2">
                <input
                  className="border rounded px-2 py-1 w-full"
                  placeholder="Description (optional)"
                  value={newCategory.description}
                  onChange={(e) =>
                    setNewCategory({
                      ...newCategory,
                      description: e.target.value,
                    })
                  }
                />
              </td>

              <td className="px-4 py-2 text-center hover:bg-green-900">
                <button onClick={addCategory} className="text-green-400">
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
