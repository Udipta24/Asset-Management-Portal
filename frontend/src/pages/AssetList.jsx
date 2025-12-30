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
    category: "",
    subcategory: "",
    vendor: "",
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
  const {categories, subcategories, vendors, loadingProtected} = useReferenceData();

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
        return "text-green-700 border-green-400 bg-green-50";
      case "inactive":
        return "text-red-700 border-red-400 bg-red-50";
      case "maintenance":
        return "text-yellow-700 border-yellow-400 bg-yellow-50";
      default:
        return "text-gray-700 border-gray-400 bg-gray-50";
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
    <div className="max-w-full bg-white p-6 rounded shadow space-y-4">
      {/* Top bar */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Assets</h1>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 border px-4 py-2 rounded hover:bg-gray-100"
        >
          <FiFilter /> Filters
        </button>
      </div>
      {/* Search + Sort */}
      <div className="flex gap-4 items-center">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-3 text-gray-400" />
          <input
            className="w-full pl-10 p-2 border rounded"
            placeholder="Search by asset name, serial, model or assigned user ID"
            value={filters.search}
            onChange={(e) => handleChange("search", e.target.value)}
          />
        </div>
        <select
          className="border p-2 rounded"
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
          className="border p-2 rounded"
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 border p-4 rounded bg-orange-50">
          {/* Category */}
          <div className="border rounded p-2">
            <label className="font-medium">Category</label>
            {categories.map((cat) => (
              <div key={cat} className="flex items-center gap-2">
                <input
                  type="radio"
                  name="category"
                  checked={filters.category === cat}
                  onChange={() => handleChange("category", cat)}
                />
                <span>{cat}</span>
              </div>
            ))}
          </div>

          {/* Subcategory */}
          <div className="border rounded p-2">
            <label className="font-medium">Subcategory</label>
            {!filters.category && (
              <span className="text-sm block"> (Select Category first)</span>
            )}
            {(subcategories[filters.category] || []).map((sub) => (
              <div key={sub} className="flex items-center gap-2">
                <input
                  type="radio"
                  name="subcategory"
                  checked={filters.subcategory === sub}
                  onChange={() => handleChange("subcategory", sub)}
                />
                <span>{sub}</span>
              </div>
            ))}
          </div>

          {/* Vendor */}
          <div className="border rounded p-2">
            <label className="font-medium">Vendor</label>
            {vendors.map((v) => (
              <div key={v} className="flex items-center gap-2">
                <input
                  type="radio"
                  checked={filters.vendor === v}
                  onChange={() => handleChange("vendor", v)}
                />
                <span>{v}</span>
              </div>
            ))}
          </div>

          {/* Warranty */}
          <div className="border rounded p-2">
            <label className="font-medium">Warranty Status</label>
            {["expired", "expiring soon", "valid"].map((w) => (
              <div key={w} className="flex items-center gap-2">
                <input
                  type="radio"
                  name="warranty"
                  checked={filters.warranty_expiry_status === w}
                  onChange={() => handleChange("warranty_expiry_status", w)}
                />
                <span>{w}</span>
              </div>
            ))}
          </div>

          {/* Status */}
          <div className="border rounded p-2">
            <label className="font-medium">Asset Status</label>
            {["active", "inactive", "under maintenance"].map((s) => (
              <div key={s} className="flex items-center gap-2">
                <input
                  type="radio"
                  name="status"
                  checked={filters.status === s}
                  onChange={() => handleChange("status", s)}
                />
                <span>{s}</span>
              </div>
            ))}
          </div>

          {/* Purchase Date */}
          <div className="border rounded p-2">
            <label className="font-medium">Purchase Date</label>

            <div className="flex flex-col gap-2 mt-2 p-2">
              <label className="text-sm">From</label>
              <input
                type="date"
                className="border p-2 rounded"
                value={filters.purchase_date_from}
                onChange={(e) =>
                  handleChange("purchase_date_from", e.target.value)
                }
              />
              <label className="text-sm">To</label>
              <input
                type="date"
                className="border p-2 rounded"
                value={filters.purchase_date_to}
                onChange={(e) =>
                  handleChange("purchase_date_to", e.target.value)
                }
              />
            </div>
          </div>

          {/* Warranty Date */}
          <div className="border rounded p-2">
            <label className="font-medium">Warranty Date</label>

            <div className="flex flex-col gap-2 mt-2 p-2">
              <label className="text-sm">From</label>
              <input
                type="date"
                className="border p-2 rounded"
                value={filters.warranty_expiry_from}
                onChange={(e) =>
                  handleChange("warranty_expiry_from", e.target.value)
                }
              />
              <label className="text-sm">To</label>
              <input
                type="date"
                className="border p-2 rounded"
                value={filters.warranty_expiry_to}
                onChange={(e) =>
                  handleChange("warranty_expiry_to", e.target.value)
                }
              />
            </div>
          </div>

          {/* clear button */}
          <div className="flex flex-col justify-end align-bottom">
            <button
              className="px-4 py-2 rounded text-sm font-semibold text-white bg-orange-400"
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
      <div className="border rounded overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-orange-200">
            <tr>
              <th className="p-2 text-left">Asset ID</th>
              <th className="p-2 text-left">Asset Name</th>
              <th className="p-2 text-left">Assigned To</th>
              <th className="p-2 text-center">Status</th>
              <th className="p-2 text-center">View</th>
              <th className="p-2 text-center">Update</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="p-4 text-center">
                  Loading...
                </td>
              </tr>
            ) : assets.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-4 text-center">
                  No assets found
                </td>
              </tr>
            ) : (
              assets.map((asset) => (
                <tr key={asset.public_id} className="border-t hover:bg-gray-50">
                  {/* Asset ID */}
                  <td className="p-2 font-mono text-sm">{asset.public_id}</td>

                  {/* Asset Name */}
                  <td className="p-2">{asset.asset_name}</td>

                  {/* Assigned To */}
                  <td className="p-2">
                    {asset.assigned_to || "NOT ASSIGNED"}
                  </td>

                  {/* Status */}
                  <td className="p-2 text-center">
                    <span
                      className={`px-3 py-1 text-xs font-medium border rounded-full ${getStatusStyles(
                        asset.status
                      )}`}
                    >
                      {asset.status}
                    </span>
                  </td>

                  {/* View */}
                  <td className="p-2 text-center">
                    <button
                      onClick={() => navigate(`/assets/${asset.public_id}`)}
                      className="text-blue-600 hover:underline"
                    >
                      View
                    </button>
                  </td>

                  {/* Update */}
                  <td className="p-2 text-center">
                    <button
                      onClick={() =>
                        navigate(`/assets/${asset.public_id}/edit`)
                      }
                      className="px-3 py-1 text-sm border rounded text-orange-600 border-orange-400 hover:bg-orange-50"
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
