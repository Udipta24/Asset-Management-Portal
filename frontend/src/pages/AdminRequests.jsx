import React, { useState, useEffect } from "react";
import API from "../api/api";

export default function AdminRequests() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actingId, setActingId] = useState(null);

  const load = async () => {
    setLoading(true);
    const res = await API.get("/requests");
    setList(res.data);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const act = async (id, status) => {
    try {
      setActingId(id);
      await API.patch(`/requests/${id}`, {
        status,
        admin_comment: status === "rejected" ? "Not available" : null
      });
      load();
    } finally {
      setActingId(null);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-10 text-gray-500">
        Loading requests...
      </div>
    );
  }

  if (list.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500">
        No pending requests 🎉
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      <h2 className="text-xl font-semibold mb-4">
        Asset Assignment Requests
      </h2>

      {list.map(r => (
        <div
          key={r.request_id}
          className="bg-white border rounded-lg p-4 shadow-sm"
        >
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium text-lg">
                {r.full_name}
              </p>
              <p className="text-sm text-gray-600">
                Requested: {r.requested_asset_type}
              </p>
            </div>

            <span className="text-xs px-2 py-1 rounded-full bg-yellow-100 text-yellow-700 font-medium">
              PENDING
            </span>
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-4">
            <button
              disabled={actingId === r.request_id}
              onClick={() => act(r.request_id, "approved")}
              className="px-4 py-1.5 rounded bg-green-600 text-white text-sm hover:bg-green-700 disabled:opacity-50"
            >
              Approve
            </button>

            <button
              disabled={actingId === r.request_id}
              onClick={() => act(r.request_id, "rejected")}
              className="px-4 py-1.5 rounded bg-red-600 text-white text-sm hover:bg-red-700 disabled:opacity-50"
            >
              Reject
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
