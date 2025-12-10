import React, { useEffect, useState } from "react";
import API from "../api/api";
import { Link } from "react-router-dom";

export default function Assets() {
  const [assets, setAssets] = useState([]);
  const [q, setQ] = useState("");

  const load = async () => {
    try {
      const res = await API.get("/assets", { params: { q } });
      setAssets(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load assets");
    }
  };

  useEffect(() => {
    // async wrapper to avoid synchronous state updates
    const fetchAssets = async () => {
      await load(); // safe: async inside effect
    };

    fetchAssets();
  }, []); // only run once

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl">Assets</h2>
        <Link
          to="/assets/create"
          className="bg-green-600 text-white px-3 py-1 rounded"
        >
          + New
        </Link>
      </div>

      <div className="mb-3">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search"
          className="border p-2 rounded w-64"
        />
        <button
          onClick={load}
          className="ml-2 px-3 py-1 bg-blue-600 text-white rounded"
        >
          Search
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {assets.map((a) => (
          <div key={a.asset_id} className="bg-white p-3 rounded shadow">
            <div className="font-semibold">{a.asset_name}</div>
            <div className="text-sm text-gray-500">Status: {a.status}</div>
            <div className="mt-3">
              <Link className="text-blue-600" to={`/assets/${a.asset_id}`}>
                View
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
