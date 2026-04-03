import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { IoSend } from "react-icons/io5";
import { HiMiniArrowTopRightOnSquare } from "react-icons/hi2";
import API from "../api/api";
import { useReferenceData } from "../hooks/useReferenceData";

export default function RequestPage() {
  const [form, setForm] = useState({
    request_type: "NEW ASSET",
    category_id: "",
    subcategory_id: "",
    asset_id: "",
    description: "",
  });
  const navigate = useNavigate();

  const { fetchProtectedReferenceData } = useReferenceData();
  useEffect(() => {
    fetchProtectedReferenceData();
  }, []);
  const { categories, subcategories, loadingProtected } = useReferenceData();

  const handleSubmit = async () => {
    await API.post("/requests", form);

    setForm({
      request_type: "NEW ASSET",
      category_id: "",
      subcategory_id: "",
      asset_id: "",
      description: "",
    });
  };

  return (
    <div className="p-6 max-w-full bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
          Request Service
        </h1>
        <button
          onClick={() => navigate("/request/my")}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border text-sm
text-cyan-600 border-cyan-300 bg-white
hover:bg-cyan-50 hover:border-cyan-400 hover:text-cyan-700
dark:bg-slate-900 dark:text-cyan-400 dark:border-cyan-500
dark:hover:bg-cyan-500/10 dark:hover:border-cyan-400 dark:hover:text-cyan-300 transition-all duration-300 group"
        >
          My Requests<HiMiniArrowTopRightOnSquare className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
        </button>
      </div>

      <div className="bg-slate-50 dark:bg-slate-800/60 p-4 mb-4 rounded-xl border border-slate-200 dark:border-white/10">
        {/* Request Type */}
        <div className="flex flex-col mb-4">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">
            Select Request Type
          </h2>
          <select
            className="border p-2 rounded outline-none bg-white dark:bg-slate-800 text-black dark:text-white border-gray-300 dark:border-slate-700 focus:border-green-500 dark:focus:border-green-400 transition-colors"
            value={form.request_type}
            onChange={(e) => setForm({ ...form, request_type: e.target.value })}
          >
            <option value="NEW ASSET">New Asset</option>
            <option value="MAINTENANCE">Maintenance</option>
          </select>
        </div>
      </div>

      <div className="bg-slate-50 dark:bg-slate-800/60 p-4 flex flex-col gap-4 rounded-xl border border-slate-200 dark:border-white/10">
        {/* NEW ASSET */}
        {form.request_type === "NEW ASSET" && (
          <>
            <h2 className="text-lg font-semibold text-slate-800 dark:text-white">
              Put New Asset Request
            </h2>
            <select
              className={`border p-2 rounded outline-none
             bg-white dark:bg-slate-800
             ${
               form.category_id === ""
                 ? "text-slate-400"
                 : "text-black dark:text-white"
             }
             border-gray-300 dark:border-slate-700 focus:border-green-500 dark:focus:border-green-400 transition-colors`}
              value={form.category_id}
              onChange={(e) =>
                setForm({ ...form, category_id: e.target.value })
              }
              required
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat.category_id} value={cat.category_id}>
                  {cat.category_name}
                </option>
              ))}
            </select>

            <select
              className={`border p-2 rounded outline-none
             bg-white dark:bg-slate-800
             ${
               form.subcategory_id === ""
                 ? "text-slate-400"
                 : "text-black dark:text-white"
             }
             border-gray-300 dark:border-slate-700 focus:border-green-500 dark:focus:border-green-400 transition-colors`}
              value={form.subcategory_id}
              onChange={(e) =>
                setForm({ ...form, subcategory_id: e.target.value })
              }
              required
            >
              <option value="">
                Select Subcategory (after selecting category)
              </option>
              {form.category_id &&
                subcategories[form.category_id].map((subCat) => (
                  <option
                    key={subCat.subcategory_id}
                    value={subCat.subcategory_id}
                  >
                    {subCat.subcategory_name}
                  </option>
                ))}
            </select>
          </>
        )}

        {/* MAINTENANCE */}
        {form.request_type === "MAINTENANCE" && (
          <>
            <h2 className="text-lg font-semibold text-slate-800 dark:text-white">
              Put Maintenance Request
            </h2>
            <input
              className="border p-2 rounded outline-none bg-white dark:bg-slate-800 text-black dark:text-white border-gray-300 dark:border-slate-700 focus:border-green-500 dark:focus:border-green-400 transition-colors"
              placeholder="Asset ID"
              value={form.asset_id}
              onChange={(e) => setForm({ ...form, asset_id: e.target.value })}
            />

            <input
              className="border p-2 rounded outline-none bg-white dark:bg-slate-800 text-black dark:text-white border-gray-300 dark:border-slate-700 focus:border-green-500 dark:focus:border-green-400 transition-colors"
              placeholder="Issue Description"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
          </>
        )}

        {/* Submit */}
        <div className="flex justify-end">
          <button
            onClick={handleSubmit}
            className="p-2 rounded-lg text-lg text-green-600 hover:bg-green-100 dark:text-green-400 dark:hover:bg-green-500/10 transition"
          >
            <IoSend />
          </button>
        </div>
      </div>
    </div>
  );
}
