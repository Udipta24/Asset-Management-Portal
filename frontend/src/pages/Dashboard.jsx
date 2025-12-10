import React, { useEffect, useState } from "react";
import API from "../api/api";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [recent, setRecent] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await API.get("/assets");
        const list = res.data;

        // --- REAL DB VALUES ---
        const total = list.length;
        const inUse = list.filter(a => a.status === "active").length;
        const maintenance = list.filter(a => a.status === "in-repair").length;

        setStats({ total, inUse, maintenance });

        setRecent(list.slice(0, 5));
      } catch (err) {
        console.error(err);
        setStats({ total: 0, inUse: 0, maintenance: 0 });
      }
    })();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Dashboard</h1>

      {/* STATS SECTION */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-5 rounded-xl shadow">
          <div className="text-sm opacity-90">Total Assets</div>
          <div className="text-3xl font-bold mt-2">
            {stats ? stats.total : "—"}
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-5 rounded-xl shadow">
          <div className="text-sm opacity-90">In Use</div>
          <div className="text-3xl font-bold mt-2">
            {stats ? stats.inUse : "—"}
          </div>
        </div>

        <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-5 rounded-xl shadow">
          <div className="text-sm opacity-90">Maintenance</div>
          <div className="text-3xl font-bold mt-2">
            {stats ? stats.maintenance : "—"}
          </div>
        </div>
      </div>

      {/* RECENT ASSETS SECTION */}
      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Recent Assets</h2>
          <Link to="/assets" className="text-blue-600">
            View all →
          </Link>
        </div>

        {recent.length === 0 ? (
          <div className="text-gray-500">No assets found.</div>
        ) : (
          <div className="space-y-3">
            {recent.map((asset) => (
              <div
                key={asset.asset_id}
                className="flex justify-between items-center border p-3 rounded-lg hover:bg-gray-50"
              >
                <div>
                  <div className="font-semibold">{asset.asset_name}</div>
                  <div className="text-sm text-gray-500">
                    Status: {asset.status}
                  </div>
                </div>
                <Link
                  to={`/assets/${asset.asset_id}`}
                  className="text-blue-600 text-sm"
                >
                  View →
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
