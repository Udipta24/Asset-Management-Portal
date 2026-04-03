import { useEffect, useState } from "react";
import { FaPlus, FaTrash, FaEdit, FaSave } from "react-icons/fa";
import API from "../api/api";

export default function Categories() {
  const [subcategories, setSubcategories] = useState({});
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editDescription, setEditDescription] = useState("");

  const [newSubcategory, setNewSubcategory] = useState({
    subcategory_name: "",
    description: "",
  });
  const fetchCategories = async () => {
    const res = await API.get("/categories");
    setCategories(res.data);
  };
  const fetchSubcategories = async () => {
    const res = await API.get("/subcategories/by-category");
    setSubcategories(res.data);
  };
  const fetchSubcategoryByCategory = async (category_id) => {
    if (!category_id) return;
    const res = await API.get(`/subcategories/${category_id}`);
    setSubcategories((prev) => ({ ...prev, [category_id]: res.data }));
  };

  useEffect(() => {
    fetchCategories();
    fetchSubcategories();
  }, []);
  //   console.log("Cat",categories);
  //   console.log("SubCat",subcategories);

  const saveDescription = async (id) => {
    await API.patch(`/subcategories/${id}`, { description: editDescription });

    setEditingId(null);
    setEditDescription("");
    fetchSubcategoryByCategory(selectedCategory);
  };

  const deleteSubcategory = async (id) => {
    await API.delete(`/subcategories/${id}`);
    fetchSubcategoryByCategory(selectedCategory);
  };

  const addSubcategory = async () => {
    if (!selectedCategory || !newSubcategory.subcategory_name.trim()) return;

    await API.post("/subcategories", {
      ...newSubcategory,
      category_id: selectedCategory,
    });

    setNewSubcategory({ subcategory_name: "", description: "" });
    fetchSubcategoryByCategory(selectedCategory);
  };

  return (
    <div className="p-6 max-w-full bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm">
      <div className="flex justify-between items-start">
        <h1 className="text-2xl font-bold mb-6 text-slate-800 dark:text-white">
          Asset Subcategories
        </h1>
        <select
          className="border rounded px-3 py-2 bg-slate-100 text-slate-700
    dark:bg-slate-800/60 dark:text-slate-200 border-slate-200 dark:border-white/10 shadow-sm"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="" disabled>
            Select Category
          </option>

          {categories &&
            categories.map((category) => (
              <option key={category.category_id} value={category.category_id}>
                {category.category_name}
              </option>
            ))}
        </select>
      </div>

      <div className="bg-slate-50 dark:bg-slate-800/60 p-4 overflow-x-auto rounded-xl border border-slate-200 dark:border-white/10 grid grid-cols-8 gap-4 items-end mb-4">
        <h2 className="text-lg font-semibold text-slate-800 dark:text-white col-span-8">
          Add Subcategory
        </h2>
        <input
          className="w-full bg-transparent border-b px-2 py-1 outline-none
    text-slate-800 border-slate-300 focus:border-green-500
    dark:text-white dark:border-white/20 dark:focus:border-green-400
    transition-colors col-span-3"
          placeholder="Subcategory Name"
          value={newSubcategory.subcategory_name}
          onChange={(e) =>
            setNewSubcategory({
              ...newSubcategory,
              subcategory_name: e.target.value,
            })
          }
        />

        <input
          className="w-full bg-transparent border-b px-2 py-1 outline-none
    text-slate-800 border-slate-300 focus:border-green-500
    dark:text-white dark:border-white/20 dark:focus:border-green-400
    transition-colors col-span-4"
          placeholder="Description (optional)"
          value={newSubcategory.description}
          onChange={(e) =>
            setNewSubcategory({
              ...newSubcategory,
              description: e.target.value,
            })
          }
        />

        <div className="flex justify-center">
          <button
            onClick={addSubcategory}
            className="p-2 rounded-lg text-green-600 hover:bg-green-100
                  dark:text-green-400 dark:hover:bg-green-500/10 transition"
          >
            <FaPlus />
          </button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-white/10">
        <table className="w-full border-collapse">
          <thead
            className="bg-slate-100 text-slate-700
    dark:bg-slate-800/60 dark:text-slate-200"
          >
            <tr>
              <th className="px-4 py-3 text-left border-b border-slate-200 dark:border-white/10">
                Subcategory Name
              </th>
              <th className="px-4 py-3 text-left border-b border-slate-200 dark:border-white/10">
                Subcategory Code
              </th>
              <th className="px-4 py-3 text-left border-b border-slate-200 dark:border-white/10">
                Description
              </th>
              <th className="px-4 py-3 text-center border-b border-slate-200 dark:border-white/10"></th>
              <th className="px-4 py-3 text-center border-b border-slate-200 dark:border-white/10"></th>
            </tr>
          </thead>

          <tbody>
            {selectedCategory &&
              subcategories[Number(selectedCategory)]?.map((cat) => (
                <tr
                  key={cat.subcategory_id}
                  className="transition-colors
                  hover:bg-slate-100
                  dark:hover:bg-slate-800/60
                  text-slate-800 dark:text-slate-100"
                >
                  <td className="px-4 py-2 border-b border-slate-200 dark:border-white/5">
                    {cat.subcategory_name}
                  </td>

                  <td className="px-4 py-2 border-b border-slate-200 dark:border-white/5">
                    {cat.subcategory_code}
                  </td>

                  <td className="px-4 py-2 border-b border-slate-200 dark:border-white/5">
                    {editingId === cat.subcategory_id ? (
                      <div className="flex gap-2">
                        <input
                          className="w-full bg-transparent border-b px-1 py-1 outline-none
          text-slate-800 border-blue-400 focus:border-blue-600
          dark:text-white dark:border-cyan-500/40 dark:focus:border-cyan-400
          transition-colors"
                          value={editDescription}
                          placeholder="Cannot be empty"
                          onChange={(e) => setEditDescription(e.target.value)}
                        />
                        <button
                          onClick={() => saveDescription(cat.subcategory_id)}
                          className="p-2 rounded-lg
          text-green-600
          hover:bg-green-100
          dark:text-green-400 dark:hover:bg-green-500/10
          transition"
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
                        setEditingId(cat.subcategory_id);
                        setEditDescription(cat.description || "");
                      }}
                      className="p-2 rounded-lg
      text-blue-600
      hover:bg-blue-100
      dark:text-cyan-400 dark:hover:bg-cyan-500/10
      transition"
                    >
                      <FaEdit />
                    </button>
                  </td>

                  <td className="px-4 py-2 text-center border-b border-slate-200 dark:border-white/5">
                    <button
                      onClick={() => deleteSubcategory(cat.subcategory_id)}
                      className="p-2 rounded-lg
      text-red-600
      hover:bg-red-100
      dark:text-red-400 dark:hover:bg-red-500/10
      transition"
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
