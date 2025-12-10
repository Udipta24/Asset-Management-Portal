import React, { useState } from "react";
import API from "../api/api";
import { useNavigate } from "react-router-dom";

export default function AssetCreate() {
  const [form, setForm] = useState({
    asset_name: "",
    category_id: "",
    subcategory_id: "",
    serial_number: "",
    model_number: "",
    purchase_date: "",
    purchase_cost: "",
    vendor_id: "",
    warranty_expiry: "",
    status: "active",
    current_location_id: "",
    assigned_to: "",
    description: ""
  });

  const nav = useNavigate();

  const handleChange = (key, value) => {
    setForm({ ...form, [key]: value });
  };

  const submit = async (e) => {
    e.preventDefault();
    try {
      const body = {
        ...form,
        category_id: form.category_id || null,
        subcategory_id: form.subcategory_id || null,
        serial_number: form.serial_number || null,
        model_number: form.model_number || null,
        purchase_date: form.purchase_date || null,
        purchase_cost: form.purchase_cost || null,
        vendor_id: form.vendor_id || null,
        warranty_expiry: form.warranty_expiry || null,
        current_location_id: form.current_location_id || null,
        assigned_to: form.assigned_to || null,
        description: form.description || null
      };

      const res = await API.post("/assets", body);
      nav(`/assets/${res.data.asset_id}`);
    } catch (err) {
      console.error(err);
      alert("Create failed");
    }
  };

  return (
    <div className="max-w-2xl bg-white p-6 rounded shadow">
      <h2 className="text-lg mb-4 font-semibold">Create Asset</h2>

      <form onSubmit={submit} className="grid grid-cols-2 gap-4">

        {/* Asset Name */}
        <input
          className="border p-2 rounded col-span-2"
          placeholder="Asset Name"
          value={form.asset_name}
          onChange={(e) => handleChange("asset_name", e.target.value)}
          required
        />

        {/* Category */}
        <input
          className="border p-2 rounded"
          placeholder="Category ID"
          value={form.category_id}
          onChange={(e) => handleChange("category_id", e.target.value)}
        />

        {/* Subcategory */}
        <input
          className="border p-2 rounded"
          placeholder="Subcategory ID"
          value={form.subcategory_id}
          onChange={(e) => handleChange("subcategory_id", e.target.value)}
        />

        {/* Model */}
        <input
          className="border p-2 rounded"
          placeholder="Model Number"
          value={form.model_number}
          onChange={(e) => handleChange("model_number", e.target.value)}
        />

        {/* Serial */}
        <input
          className="border p-2 rounded"
          placeholder="Serial Number"
          value={form.serial_number}
          onChange={(e) => handleChange("serial_number", e.target.value)}
        />

        {/* Purchase Date */}
        <input
          type="date"
          className="border p-2 rounded"
          value={form.purchase_date}
          onChange={(e) => handleChange("purchase_date", e.target.value)}
        />

        {/* Purchase Cost */}
        <input
          type="number"
          className="border p-2 rounded"
          placeholder="Purchase Cost"
          value={form.purchase_cost}
          onChange={(e) => handleChange("purchase_cost", e.target.value)}
        />

        {/* Vendor */}
        <input
          className="border p-2 rounded"
          placeholder="Vendor ID"
          value={form.vendor_id}
          onChange={(e) => handleChange("vendor_id", e.target.value)}
        />

        {/* Warranty */}
        <input
          type="date"
          className="border p-2 rounded"
          value={form.warranty_expiry}
          onChange={(e) => handleChange("warranty_expiry", e.target.value)}
        />

        {/* Location */}
        <input
          className="border p-2 rounded"
          placeholder="Location ID"
          value={form.current_location_id}
          onChange={(e) => handleChange("current_location_id", e.target.value)}
        />

        {/* Assigned To */}
        <input
          className="border p-2 rounded"
          placeholder="Assigned User ID"
          value={form.assigned_to}
          onChange={(e) => handleChange("assigned_to", e.target.value)}
        />

        {/* Status */}
        <select
          className="border p-2 rounded"
          value={form.status}
          onChange={(e) => handleChange("status", e.target.value)}
        >
          <option value="active">Active</option>
          <option value="in-repair">In Repair</option>
          <option value="retired">Retired</option>
        </select>

        {/* Description */}
        <textarea
          className="border p-2 rounded col-span-2"
          placeholder="Description"
          value={form.description}
          onChange={(e) => handleChange("description", e.target.value)}
        />

        <button className="col-span-2 bg-blue-600 text-white p-2 rounded mt-4">
          Create Asset
        </button>
      </form>
    </div>
  );
}


//create assets fails if not an admin or asset manager,
//go to rbac, role based access .js