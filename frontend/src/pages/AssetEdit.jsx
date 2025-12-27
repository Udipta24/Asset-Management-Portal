import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/api";

export default function AssetEdit() {
  const { id } = useParams();
  const nav = useNavigate();
  const [form, setForm] = useState(null);

  useEffect(() => {
    API.get(`/assets/${id}`).then(res => {
      setForm(res.data);
    });
  }, [id]);

  if (!form) return <div>Loading...</div>;

  const update = async (e) => {
    e.preventDefault();

    await API.patch(`/assets/${id}`, {
      asset_name: form.asset_name,
      model_number: form.model_number,
      serial_number: form.serial_number,
      status: form.status,
      description: form.description
    });

    nav(`/assets/${id}`);
  };


  //for deleting assets
  const deleteAsset = async () => {
    const ok = window.confirm("Are you sure you want to delete this asset?");
    if (!ok) return;

    try {
      await API.delete(`/assets/${id}`);
      nav("/assets"); // go back to list
    } catch (err) {
      alert(err?.response?.data?.message || "Delete failed");
    }
  };



  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-xl shadow">
      <h2 className="text-xl font-semibold mb-4">Edit Asset</h2>

      <form onSubmit={update} className="grid gap-4">
        <input
          value={form.asset_name}
          onChange={e => setForm({ ...form, asset_name: e.target.value })}
          className="border p-2 rounded"
        />

        <input
          value={form.model_number || ""}
          onChange={e => setForm({ ...form, model_number: e.target.value })}
          className="border p-2 rounded"
          placeholder="Model Number"
        />

        <select
          value={form.status}
          onChange={e => setForm({ ...form, status: e.target.value })}
          className="border p-2 rounded"
        >
          <option value="active">Active</option>
          <option value="in-repair">In Repair</option>
          <option value="retired">Retired</option>
        </select>

        <textarea
          value={form.description || ""}
          onChange={e => setForm({ ...form, description: e.target.value })}
          className="border p-2 rounded"
        />

        <button className="bg-green-600 text-white p-2 rounded">
          Save Changes
        </button>
        <button type="button"
        className="bg-red-700 text-white p-2 rounded"
        onClick={deleteAsset}
        >
          Delete Asset
        </button>
        {/* <div className="flex justify-between mt-6">
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Save Changes
          </button>

          <button
            type="button"
            onClick={deleteAsset}
            className="bg-red-600 text-white px-4 py-2 rounded"
          >
            Delete Asset
          </button>
        </div> */}

      </form>
    </div>
  );
}
