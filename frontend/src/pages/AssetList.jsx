import { useEffect, useState } from "react";
import API from "../api/api";
import { useReferenceData } from "../hooks/useReferenceData";
import { FiFilter, FiSearch } from "react-icons/fi";
import { FaSortAmountDown, FaSortAmountUp } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function AssetsList() {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Filters state
  const [filters, setFilters] = useState({
    search: "",
    category: null,
    subcategory: null,
    vendor: null,
    status: "",
    warranty_expiry_status: "",
    warranty_expiry_from: "",
    warranty_expiry_to: "",
    sort_by: "asset_name",
    sort_direction: "asc",
    purchase_date_from: "",
    purchase_date_to: "",
  });
  const navigate = useNavigate();

  // Example static data – ideally fetch from backend
  // const categories = ["Electronics", "Furniture", "Networking"];
  // const subcategories = {
  //   Electronics: ["Laptop", "Desktop", "Monitor"],
  //   Furniture: ["Chair", "Table"],
  //   Networking: ["Router", "Switch"],
  // };
  // const vendors = ["Dell", "HP", "Lenovo", "Cisco"];
  const { fetchProtectedReferenceData } = useReferenceData();
  useEffect(() => {
    fetchProtectedReferenceData();
  }, []);
  const { categories, subcategories, /*vendors, */ loadingProtected } =
    useReferenceData();

  const fetchAssets = async () => {
    setLoading(true);
    try {
      const res = await API.get("/assets", {
        params: filters,
      });
      setAssets(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssets();
  }, [filters]);

  const handleChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const getStatusStyles = (status) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "text-green-600 border-green-400 bg-green-100 dark:bg-green-500/10 dark:text-green-400";

      case "inactive":
        return "text-red-600 border-red-400 bg-red-100 dark:bg-red-500/10 dark:text-red-400";

      case "in-repair":
        return "text-amber-600 border-amber-400 bg-amber-100 dark:bg-amber-500/10 dark:text-amber-400";
    }
  };

  if (loadingProtected) {
    return (
      <div className="max-w-2xl bg-white p-6 rounded shadow flex items-center justify-center">
        <p>Loading form data...</p>
      </div>
    );
  }

  return (
    <div
      className="max-w-full p-6 rounded-2xl space-y-4
  bg-white dark:bg-slate-900
  border border-slate-200 dark:border-white/10
  shadow-sm"
    >
      {/* Top bar */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-slate-800 dark:text-slate-100">
          Assets
        </h1>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border font-medium
      text-slate-700 border-slate-300 hover:bg-slate-100
      dark:text-slate-300 dark:border-white/10 dark:hover:bg-slate-800
      transition"
        >
          <FiFilter /> Filters
        </button>
      </div>
      {/* Search + Sort */}
      <div className="flex gap-4 items-center">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-3 text-slate-400" />
          <input
            className="w-full pl-10 p-2 rounded-xl outline-none
        bg-slate-50 border border-slate-300
        focus:border-blue-500 focus:ring-1 focus:ring-blue-500
        dark:bg-slate-800 dark:border-white/10
        dark:text-slate-200 dark:focus:border-cyan-400 dark:focus:ring-cyan-400"
            placeholder="Search by asset name, serial, model or assigned user ID"
            value={filters.search}
            onChange={(e) => handleChange("search", e.target.value)}
          />
        </div>
        <select
          className="p-2 rounded-xl border
      bg-white text-slate-700 border-slate-300
      dark:bg-slate-800 dark:text-slate-200 dark:border-white/10"
          value={filters.sort_by}
          onChange={(e) => handleChange("sort_by", e.target.value)}
        >
          <option value="">Sort By</option>
          <option value="asset_name">Asset Name</option>
          <option value="asset_id">Asset ID</option>
          <option value="purchase_cost">Purchase Cost</option>
          <option value="warranty_expiry">Warranty Expiry</option>
        </select>

        <button
          className="p-2 rounded-xl border
    text-slate-600 hover:bg-slate-100
    dark:text-slate-300 dark:border-white/10 dark:hover:bg-slate-800
    transition"
          onClick={() =>
            handleChange(
              "sort_direction",
              filters.sort_direction === "asc" ? "desc" : "asc"
            )
          }
        >
          {filters.sort_direction === "asc" ? (
            <FaSortAmountDown />
          ) : (
            <FaSortAmountUp />
          )}
        </button>
      </div>
      {/* Filters panel */}
      {showFilters && (
        <div
          className="grid grid-cols-1 md:grid-cols-4 gap-4 p-6 rounded-2xl
  bg-slate-50 border border-slate-200
  dark:bg-slate-800/60 dark:border-white/10"
        >
          {/* Category */}
          <div
            className="p-4 rounded-xl border space-y-2
  bg-white border-slate-200
  dark:bg-slate-900 dark:border-white/10"
          >
            <label className="font-semibold text-slate-700 dark:text-slate-200">
              Category
            </label>
            {categories.map((cat) => (
              <label
                key={cat.category_id}
                className={`
                  flex items-center gap-2 px-2 py-1 rounded cursor-pointer transition
                  ${
                    filters.category === cat.category_id
                      ? "bg-blue-100 text-blue-700 dark:bg-cyan-500/10 dark:text-cyan-400"
                      : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400"
                  }
                `}
              >
                <input
                  type="radio"
                  checked={filters.category === cat.category_id}
                  onChange={() => handleChange("category", cat.category_id)}
                />
                <span className="text-sm">{cat.category_name}</span>
              </label>
            ))}
          </div>

          {/* Subcategory */}
          <div
            className="p-4 rounded-xl border space-y-2
  bg-white border-slate-200
  dark:bg-slate-900 dark:border-white/10"
          >
            <label className="font-semibold text-slate-700 dark:text-slate-200">
              Subcategory
            </label>
            {!filters.category && (
              <span className="text-sm block text-slate-700 dark:text-slate-200">
                {" "}
                (Select Category first)
              </span>
            )}
            {(subcategories[filters.category] || []).map((sub) => (
              <label
                key={sub.subcategory_id}
                className={`
                  flex items-center gap-2 px-2 py-1 rounded cursor-pointer transition
                  ${
                    filters.subcategory === sub.subcategory_id
                      ? "bg-blue-100 text-blue-700 dark:bg-cyan-500/10 dark:text-cyan-400"
                      : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 "
                  }
                `}
              >
                <input
                  type="radio"
                  checked={filters.subcategory === sub.subcategory_id}
                  onChange={() =>
                    handleChange("subcategory", sub.subcategory_id)
                  }
                />
                <span className="text-sm">{sub.subcategory_name}</span>
              </label>
            ))}
          </div>

          {/* Vendor */}
          {/* <div className="p-4 rounded-xl border space-y-2
  bg-white border-slate-200
  dark:bg-slate-900 dark:border-white/10">
            <label className="font-semibold text-slate-700 dark:text-slate-200">Vendor</label>
            {vendors.map((vendor) => (
              <label
                key={vendor.vendor_id}
                className={`
                  flex items-center gap-2 px-2 py-1 rounded cursor-pointer transition
                  ${
                    filters.vendor === vendor.vendor_id
                      ? "bg-blue-100 text-blue-700 dark:bg-cyan-500/10 dark:text-cyan-400"
                      : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400"
                  }
                `}
              >
                <input
                  type="radio"
                  checked={filters.vendor === vendor.vendor_id}
                  onChange={() => handleChange("vendor", vendor.vendor_id)}
                />
                <span className="text-sm">{vendor.vendor_name}</span>
              </label>
            ))}
          </div> */}

          {/* Warranty */}
          <div
            className="p-4 rounded-xl border space-y-2
  bg-white border-slate-200
  dark:bg-slate-900 dark:border-white/10"
          >
            <label className="font-semibold text-slate-700 dark:text-slate-200">
              Warranty Status
            </label>
            {["expired", "expiring soon", "valid"].map((w) => (
              <label
                key={w}
                className={`
                  flex items-center gap-2 px-2 py-1 rounded cursor-pointer transition
                  ${
                    filters.warranty_expiry_status === w
                      ? "bg-blue-100 text-blue-700 dark:bg-cyan-500/10 dark:text-cyan-400"
                      : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400"
                  }
                `}
              >
                <input
                  type="radio"
                  checked={filters.warranty_expiry_status === w}
                  onChange={() => handleChange("warranty_expiry_status", w)}
                />
                <span>{w}</span>
              </label>
            ))}
          </div>

          {/* Status */}
          <div
            className="p-4 rounded-xl border space-y-2
  bg-white border-slate-200
  dark:bg-slate-900 dark:border-white/10"
          >
            <label className="font-semibold text-slate-700 dark:text-slate-200">
              Asset Status
            </label>
            {["active", "inactive", "in-repair"].map((s) => (
              <label
                key={s}
                className={`
                  flex items-center gap-2 px-2 py-1 rounded cursor-pointer transition
                  ${
                    filters.status === s
                      ? "bg-blue-100 text-blue-700 dark:bg-cyan-500/10 dark:text-cyan-400"
                      : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400"
                  }
                `}
              >
                <input
                  type="radio"
                  checked={filters.status === s}
                  onChange={() => handleChange("status", s)}
                />
                <span>{s}</span>
              </label>
            ))}
          </div>

          {/* Purchase Date */}
          <div
            className="p-4 rounded-xl border space-y-2
  bg-white border-slate-200
  dark:bg-slate-900 dark:border-white/10 md:col-start-2"
          >
            <label className="font-semibold text-slate-700 dark:text-slate-200">
              Purchase Date
            </label>

            <div className="flex flex-col gap-2 mt-2 p-2">
              <label className="text-sm text-slate-700 dark:text-slate-200">
                From
              </label>
              <input
                type="date"
                className={`border p-2 rounded
             bg-white dark:bg-slate-800
             ${
               filters.purchase_date_from === ""
                 ? "text-slate-400"
                 : "text-black dark:text-white"
             }
             border-gray-300 dark:border-slate-700`}
                value={filters.purchase_date_from}
                onChange={(e) =>
                  handleChange("purchase_date_from", e.target.value)
                }
              />
              <label className="text-sm text-slate-700 dark:text-slate-200">
                To
              </label>
              <input
                type="date"
                className={`border p-2 rounded
             bg-white dark:bg-slate-800
             ${
               filters.purchase_date_from === ""
                 ? "text-slate-400"
                 : "text-black dark:text-white"
             }
             border-gray-300 dark:border-slate-700`}
                value={filters.purchase_date_to}
                onChange={(e) =>
                  handleChange("purchase_date_to", e.target.value)
                }
              />
            </div>
          </div>

          {/* Warranty Date */}
          <div
            className="p-4 rounded-xl border space-y-2
  bg-white border-slate-200
  dark:bg-slate-900 dark:border-white/10"
          >
            <label className="font-semibold text-slate-700 dark:text-slate-200">
              Warranty Date
            </label>

            <div className="flex flex-col gap-2 mt-2 p-2">
              <label className="text-sm text-slate-700 dark:text-slate-200">
                From
              </label>
              <input
                type="date"
                className={`border p-2 rounded bg-white dark:bg-slate-800 ${
                  filters.warranty_expiry_from === ""
                    ? "text-slate-400"
                    : "text-black dark:text-white"
                }
             border-gray-300 dark:border-slate-700`}
                value={filters.warranty_expiry_from}
                onChange={(e) =>
                  handleChange("warranty_expiry_from", e.target.value)
                }
              />
              <label className="text-sm text-slate-700 dark:text-slate-200">
                To
              </label>
              <input
                type="date"
                className={`border p-2 rounded
             bg-white dark:bg-slate-800
             ${
               filters.warranty_expiry_to === ""
                 ? "text-slate-400"
                 : "text-black dark:text-white"
             }
             border-gray-300 dark:border-slate-700`}
                value={filters.warranty_expiry_to}
                onChange={(e) =>
                  handleChange("warranty_expiry_to", e.target.value)
                }
              />
            </div>
          </div>
          {/* flex flex-col justify-end align-bottom */}
          {/* clear button */}
          <div className="md:col-span-4">
            <button
              className="w-full px-4 py-2 rounded-xl font-semibold
    bg-red-500/10 text-red-600
    hover:bg-red-500 hover:text-white
    dark:text-red-400 dark:hover:bg-red-500 dark:hover:text-red-100
    transition"
              onClick={() =>
                setFilters({
                  search: "",
                  category: "",
                  subcategory: "",
                  vendor: "",
                  status: "",
                  warranty_expiry_status: "",
                  warranty_expiry_from: "",
                  warranty_expiry_to: "",
                  sort_by: "",
                  sort_direction: "asc",
                  purchase_date_from: "",
                  purchase_date_to: "",
                })
              }
            >
              Clear Filters
            </button>
          </div>
        </div>
      )}
      {/* Assets table */}
      <div className="border rounded-xl overflow-x-auto border-slate-200 dark:border-white/10">
        <table className="w-full text-sm">
          <thead
            className="bg-slate-100 text-slate-700
    dark:bg-slate-800 dark:text-slate-200"
          >
            <tr>
              <th className="p-3 text-left border-b border-slate-200 dark:border-white/10">
                Asset ID
              </th>
              <th className="p-3 text-left border-b border-slate-200 dark:border-white/10">
                Asset Name
              </th>
              <th className="p-3 text-left border-b border-slate-200 dark:border-white/10">
                Assigned To
              </th>
              <th className="p-3 text-center border-b border-slate-200 dark:border-white/10">
                Status
              </th>
              <th className="p-3 text-center border-b border-slate-200 dark:border-white/10">
                View
              </th>
              <th className="p-3 text-center border-b border-slate-200 dark:border-white/10">
                Update
              </th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan="6"
                  className="p-4 text-center text-slate-700 dark:text-slate-200"
                >
                  Loading...
                </td>
              </tr>
            ) : assets.length === 0 ? (
              <tr>
                <td
                  colSpan="6"
                  className="p-4 text-center text-slate-700 dark:text-slate-200"
                >
                  No assets found
                </td>
              </tr>
            ) : (
              assets.map((asset) => (
                <tr
                  key={asset.public_id}
                  className="transition-colors
    hover:bg-slate-100
    dark:hover:bg-slate-800/60"
                >
                  {/* Asset ID */}
                  <td className="p-3 border-b border-slate-200 dark:border-white/5 text-slate-700 dark:text-slate-300 font-mono text-sm">
                    {asset.public_id}
                  </td>

                  {/* Asset Name */}
                  <td className="p-3 border-b border-slate-200 dark:border-white/5 text-slate-700 dark:text-slate-300">
                    {asset.asset_name}
                  </td>

                  {/* Assigned To */}
                  <td className="p-3 border-b border-slate-200 dark:border-white/5 text-slate-700 dark:text-slate-300">
                    {asset.assigned_to || "NOT ASSIGNED"}
                  </td>

                  {/* Status */}
                  <td className="p-3 border-b border-slate-200 dark:border-white/5 text-slate-700 dark:text-slate-300 text-center">
                    <span
                      className={`px-3 py-1 text-xs font-medium border rounded-full ${getStatusStyles(
                        asset.status
                      )}`}
                    >
                      {asset.status}
                    </span>
                  </td>

                  {/* View */}
                  <td className="p-3 border-b border-slate-200 dark:border-white/5 text-slate-700 dark:text-slate-300 text-center">
                    <button
                      onClick={() => navigate(`/assets/${asset.public_id}`)}
                      className="text-blue-600 hover:text-blue-500 hover:underline
    dark:text-cyan-400 dark:hover:text-cyan-300 dark:hover:underline"
                    >
                      View
                    </button>
                  </td>

                  {/* Update */}
                  <td className="p-3 border-b border-slate-200 dark:border-white/5 text-slate-700 dark:text-slate-300 text-center">
                    <button
                      onClick={() =>
                        navigate(`/assets/${asset.public_id}/edit`)
                      }
                      className="px-3 py-1 rounded-lg border text-sm font-medium
    text-blue-600 border-blue-400 hover:bg-blue-100
    dark:text-cyan-400 dark:border-cyan-500/40 dark:hover:bg-cyan-500/10
    transition"
                    >
                      Update
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
