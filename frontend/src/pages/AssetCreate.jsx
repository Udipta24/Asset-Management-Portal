// src/pages/AssetCreate.jsx
import React, { useState } from "react";
import API from "../api/api";
import { useNavigate } from "react-router-dom";
import AutocompleteInput from "../components/AutocompleteInput";

export default function AssetCreate() {
  const [form, setForm] = useState({
    asset_name: "",
    category_name: "",
    subcategory_name: "",
    serial_number: "",
    model_number: "",
    purchase_date: "",
    purchase_cost: "",
    vendor_name: "",
    warranty_expiry: "",
    status: "active",
    location_name: "",
    assigned_username: "", // full name of user
    description: ""
  });


  // fetch helpers
  const fetchCategories = async (q) => {
    const res = await API.get("/meta/categories");
    return res.data.map((c) => c.category_name).filter((n) => n.toLowerCase().includes(q.toLowerCase()));
  };

  const fetchSubcategories = async (q, category) => {
    if (!category) return [];
    const res = await API.get("/meta/subcategories", { params: { category_name: category } });
    return res.data.map((s) => s.subcategory_name).filter((n) => n.toLowerCase().includes(q.toLowerCase()));
  };

  const fetchVendors = async (q) => {
    const res = await API.get("/meta/vendors");
    return res.data.map((v) => v.vendor_name).filter((n) => n.toLowerCase().includes(q.toLowerCase()));
  };

  const fetchLocations = async (q) => {
    const res = await API.get("/meta/locations");
    return res.data.map((l) => l.location_name).filter((n) => n.toLowerCase().includes(q.toLowerCase()));
  };

  const fetchUsers = async (q) => {
    const res = await API.get("/meta/users");
    return res.data.map((u) => u.full_name).filter((n) => n.toLowerCase().includes(q.toLowerCase()));
  };


  const nav = useNavigate();

  const handleChange = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const submit = async (e) => {
    e.preventDefault();
    try {
      const body = {
        asset_name: form.asset_name,
        category_name: form.category_name || null,
        subcategory_name: form.subcategory_name || null,
        serial_number: form.serial_number || null,
        model_number: form.model_number || null,
        purchase_date: form.purchase_date || null,
        purchase_cost: form.purchase_cost || null,
        vendor_name: form.vendor_name || null,
        warranty_expiry: form.warranty_expiry || null,
        status: form.status || "active",
        location_name: form.location_name || null,
        assigned_username: form.assigned_username || null,
        description: form.description || null
      };

      const res = await API.post("/assets", body);
      nav(`/assets/${res.data.asset_id}`);
    } catch (err) {
      console.error(err);
      const msg = err?.response?.data?.message || "Create failed";
      alert(msg);
    }
  };

  return (
    <div className="max-w-2xl bg-white p-6 rounded shadow">
      <h2 className="text-lg mb-4 font-semibold">Create Asset</h2>

      <form onSubmit={submit} className="grid grid-cols-2 gap-4">

        <input
          className="border p-2 rounded col-span-2"
          placeholder="Asset Name"
          value={form.asset_name}
          onChange={(e) => handleChange("asset_name", e.target.value)}
          required
        />

        {/* <input
          className="border p-2 rounded"
          placeholder="Category (e.g. Laptops)"
          value={form.category_name}
          onChange={(e) => handleChange("category_name", e.target.value)}
        /> */}

        <AutocompleteInput
          value={form.category_name}
          onChange={(v) => handleChange("category_name", v)}
          fetcher={fetchCategories}
          placeholder="Category (e.g., Laptops)"
        />




        {/* <input
          className="border p-2 rounded"
          placeholder="Subcategory (e.g. Ultrabooks)"
          value={form.subcategory_name}
          onChange={(e) => handleChange("subcategory_name", e.target.value)}
        /> */}

        <AutocompleteInput
          value={form.subcategory_name}
          onChange={(v) => handleChange("subcategory_name", v)}
          fetcher={(q) => fetchSubcategories(q, form.category_name)}
          placeholder="Subcategory"
        />




        <input
          className="border p-2 rounded"
          placeholder="Model Number"
          value={form.model_number}
          onChange={(e) => handleChange("model_number", e.target.value)}
        />





        <input
          className="border p-2 rounded"
          placeholder="Serial Number"
          value={form.serial_number}
          onChange={(e) => handleChange("serial_number", e.target.value)}
        />

        <input
          type="date"
          className="border p-2 rounded"
          value={form.purchase_date}
          onChange={(e) => handleChange("purchase_date", e.target.value)}
        />

        <input
          type="number"
          className="border p-2 rounded"
          placeholder="Purchase Cost"
          value={form.purchase_cost}
          onChange={(e) => handleChange("purchase_cost", e.target.value)}
        />

        {/* <input
          className="border p-2 rounded"
          placeholder="Vendor (company name)"
          value={form.vendor_name}
          onChange={(e) => handleChange("vendor_name", e.target.value)}
        /> */}

        <AutocompleteInput
          value={form.vendor_name}
          onChange={(v) => handleChange("vendor_name", v)}
          fetcher={fetchVendors}
          placeholder="Vendor (e.g., Dell, Lenovo)"
        />



        <input
          type="date"
          className="border p-2 rounded"
          value={form.warranty_expiry}
          onChange={(e) => handleChange("warranty_expiry", e.target.value)}
        />

        {/* <input
          className="border p-2 rounded"
          placeholder="Location (e.g. Head Office)"
          value={form.location_name}
          onChange={(e) => handleChange("location_name", e.target.value)}
        /> */}

        <AutocompleteInput
          value={form.location_name}
          onChange={(v) => handleChange("location_name", v)}
          fetcher={fetchLocations}
          placeholder="Location (e.g., HQ, Store Room)"
        />




        {/* <input
          className="border p-2 rounded"
          placeholder="Assign to (full name of user)"
          value={form.assigned_username}
          onChange={(e) => handleChange("assigned_username", e.target.value)}
        /> */}

        <AutocompleteInput
          value={form.assigned_username}
          onChange={(v) => handleChange("assigned_username", v)}
          fetcher={fetchUsers}
          placeholder="Assign to user (full name)"
        />


        <select
          className="border p-2 rounded"
          value={form.status}
          onChange={(e) => handleChange("status", e.target.value)}
        >
          <option value="active">Active</option>
          <option value="in-repair">In Repair</option>
          <option value="retired">Retired</option>
        </select>

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
