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
    if(!category_id) return;
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
    <div className="p-max-w-full bg-white p-6 rounded shadow">
      <div className="flex justify-between items-start">
        <h1 className="text-2xl font-bold mb-6">Subcategories</h1>

        <select
          className="border rounded px-3 py-2 text-gray-700"
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

      <div className="overflow-x-auto">
        <table className="w-full border border-orange-400 rounded">
          <thead className="bg-gradient-to-br from-orange-300 via-orange-200 to-orange-300 text-orange-800">
            <tr>
              <th className="border border-orange-400 px-4 py-2 text-left">Subcategory Name</th>
              <th className="border border-orange-400 px-4 py-2 text-left">Subcategory Code</th>
              <th className="border border-orange-400 px-4 py-2 text-left">Description</th>
              <th className="border border-orange-400 px-4 py-2 text-center"></th>
              <th className="border border-orange-400 px-4 py-2 text-center"></th>
            </tr>
          </thead>

          <tbody>
            {selectedCategory &&
              subcategories[Number(selectedCategory)]?.map((cat) => (
                <tr key={cat.subcategory_id} className="hover:bg-orange-50">
                  <td className="border border-orange-200 px-4 py-2">{cat.subcategory_name}</td>

                  <td className="border border-orange-200 px-4 py-2">{cat.subcategory_code}</td>

                  <td className="border border-orange-200 px-4 py-2">
                    {editingId === cat.subcategory_id ? (
                      <div className="flex gap-2">
                        <input
                          className="border border-orange-200 rounded px-2 py-1 w-full"
                          value={editDescription}
                          placeholder="Cannot be empty"
                          onChange={(e) => setEditDescription(e.target.value)}
                        />
                        <button
                          onClick={() => saveDescription(cat.subcategory_id)}
                          className="text-green-600"
                        >
                          <FaSave />
                        </button>
                      </div>
                    ) : cat.description ? (
                      <span>{cat.description}</span>
                    ) : (
                      <span className="text-gray-400 italic">
                        No description
                      </span>
                    )}
                  </td>

                  <td className="border border-orange-200 px-4 py-2 text-center hover:bg-blue-100">
                    <button
                      onClick={() => {
                        setEditingId(cat.subcategory_id);
                        setEditDescription(cat.description || "");
                      }}
                      className="text-blue-600"
                    >
                      <FaEdit />
                    </button>
                  </td>

                  <td className="border border-orange-200 px-4 py-2 text-center hover:bg-red-100">
                    <button
                      onClick={() => deleteSubcategory(cat.subcategory_id)}
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
                  value={newSubcategory.subcategory_name}
                  onChange={(e) =>
                    setNewSubcategory({
                      ...newSubcategory,
                      subcategory_name: e.target.value,
                    })
                  }
                />
              </td>

              <td colSpan={2} className="px-4 py-2">
                <input
                  className="border rounded px-2 py-1 w-full"
                  placeholder="Description (optional)"
                  value={newSubcategory.description}
                  onChange={(e) =>
                    setNewSubcategory({
                      ...newSubcategory,
                      description: e.target.value,
                    })
                  }
                />
              </td>

              <td className="px-4 py-2 text-center hover:bg-green-900">
                <button onClick={addSubcategory} className="text-green-400">
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
