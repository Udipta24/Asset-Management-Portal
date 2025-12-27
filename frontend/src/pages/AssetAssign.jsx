// src/pages/AssetAssign.jsx
import React, { useEffect, useState } from "react";
import API from "../api/api";
import AutocompleteInput from "../components/AutocompleteInput";

export default function AssetAssign() {
  const [assetName, setAssetName] = useState("");
  const [username, setUsername] = useState("");
  const [assets, setAssets] = useState([]);

  // Load assets list for suggestions
  useEffect(() => {
    API.get("/assets")
      .then(res => setAssets(res.data))
      .catch(() => alert("Failed to load assets"));
  }, []);

  const fetchAssets = async (q) => {
    return assets
      .map(a => a.asset_name)
      .filter(name => name.toLowerCase().includes(q.toLowerCase()));
  };

  const fetchUsers = async (q) => {
    const res = await API.get("/meta/users");
    return res.data
      .map(u => u.full_name)
      .filter(n => n.toLowerCase().includes(q.toLowerCase()));
  };

  const assign = async () => {
    if (!assetName || !username) return alert("Fill all fields");

    try {
      const selected = assets.find(a => a.asset_name === assetName);
      if (!selected) return alert("Asset not found");

      await API.post(`/assets/${selected.asset_id}/assign`, {
        assigned_username: username,
      });

      alert("Asset assigned successfully!");
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || "Assignment failed");
    }
  };

  return (
    <div className="max-w-xl bg-white p-6 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Assign Asset to User</h2>

      <div className="grid gap-4">

        <div>
          <label className="font-medium">Select Asset</label>
          <AutocompleteInput
            value={assetName}
            onChange={setAssetName}
            fetcher={fetchAssets}
            placeholder="Search asset..."
          />
        </div>

        <div>
          <label className="font-medium">Assign To (User)</label>
          <AutocompleteInput
            value={username}
            onChange={setUsername}
            fetcher={fetchUsers}
            placeholder="Search user..."
          />
        </div>

        <button
          onClick={assign}
          className="bg-blue-600 text-white p-2 rounded mt-2 hover:bg-blue-700"
        >
          Assign Asset
        </button>
      </div>
    </div>
  );
}
