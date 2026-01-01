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
    <div className="p-6 max-w-full bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm">
      <h1 className="text-2xl font-bold mb-6 text-slate-800 dark:text-white">
        Categories
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
                Category Name
              </th>
              <th className="px-4 py-3 text-left border-b border-slate-200 dark:border-white/10">
                Category Code
              </th>
              <th className="px-4 py-3 text-left border-b border-slate-200 dark:border-white/10">
                Description
              </th>
              <th className="px-4 py-3 text-center border-b border-slate-200 dark:border-white/10" />
              <th className="px-4 py-3 text-center border-b border-slate-200 dark:border-white/10" />
            </tr>
          </thead>

          <tbody>
            {categories.map((cat) => (
              <tr
                key={cat.category_id}
                className="transition-colors
                  hover:bg-slate-100
                  dark:hover:bg-slate-800/60
                  text-slate-800 dark:text-slate-100"
              >
                <td className="px-4 py-2 border-b border-slate-200 dark:border-white/5">
                  {cat.category_name}
                </td>

                <td className="px-4 py-2 border-b border-slate-200 dark:border-white/5">
                  {cat.category_code}
                </td>

                <td className="px-4 py-2 border-b border-slate-200 dark:border-white/5">
                  {editingId === cat.category_id ? (
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
                        onClick={() => saveDescription(cat.category_id)}
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
                  ) : cat.description ? (
                    <span>{cat.description}</span>
                  ) : (
                    <span className="italic text-slate-400 dark:text-slate-500">
                      No description
                    </span>
                  )}
                </td>

                <td className="px-4 py-2 text-center border-b border-slate-200 dark:border-white/5">
                  <button
                    onClick={() => {
                      setEditingId(cat.category_id);
                      setEditDescription(cat.description || "");
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
                    onClick={() => deleteCategory(cat.category_id)}
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

            {/* ADD CATEGORY ROW */}
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
                  className="w-full bg-transparent border-b px-2 py-1 outline-none
    text-slate-800 border-slate-300 focus:border-green-500
    dark:text-white dark:border-white/20 dark:focus:border-green-400
    transition-colors"
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

              <td className="px-4 py-2 text-center">
                <button
                  onClick={addCategory}
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
