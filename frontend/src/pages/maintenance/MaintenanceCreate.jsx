import { useState } from "react";
import API from "../../api/api";

export default function MaintenanceCreate() {
  const [form, setForm] = useState({
    asset_id: "",
    maintenance_type: "",
    description: "",
    next_due_date: ""
  });

  const submit = async (e) => {
    e.preventDefault();
    await API.post("/maintenance", form);
    alert("Maintenance issued");
    setForm({ asset_id: "", maintenance_type: "", description: "", next_due_date: "" });//re render form
  };

  return (
    <div className="bg-white p-4 rounded shadow max-w-lg">
      <h2 className="text-lg font-semibold mb-3">Issue Maintenance</h2>

      <form onSubmit={submit} className="space-y-3">
        <input
          placeholder="Asset ID"
          className="border p-2 w-full"
          value={form.asset_Name}
          onChange={e => setForm({ ...form, asset_id: e.target.value })}
        />

        <input
          placeholder="Maintenance Type"
          className="border p-2 w-full"
          value={form.maintenance_type}
          onChange={e => setForm({ ...form, maintenance_type: e.target.value })}
        />

        <textarea
          placeholder="Description"
          className="border p-2 w-full"
          value={form.description}
          onChange={e => setForm({ ...form, description: e.target.value })}
        />

        <input
          type="date"
          className="border p-2 w-full"
          value={form.next_due_date}
          onChange={e => setForm({ ...form, next_due_date: e.target.value })}
        />

        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          Issue
        </button>
      </form>
    </div>
  );
}
