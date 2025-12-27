import React, { useState, useEffect } from "react";
import API from "../api/api";

export default function MyRequests() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/requests/my")
      .then(res => setList(res.data))
      .finally(() => setLoading(false));
  }, []);

  const statusStyle = {
    pending: "bg-yellow-100 text-yellow-700",
    approved: "bg-green-100 text-green-700",
    rejected: "bg-red-100 text-red-700"
  };

  if (loading) {
    return (
      <div className="text-center py-10 text-gray-500">
        Loading your requests...
      </div>
    );
  }

  if (list.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500">
        You have not requested any assets yet.
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <h2 className="text-xl font-semibold mb-4">My Asset Requests</h2>

      {list.map(r => (
        <div
          key={r.request_id}
          className="bg-white border rounded-lg p-4 shadow-sm"
        >
          <div className="flex justify-between items-center">
            <h3 className="font-medium text-lg">
              {r.requested_asset_type}
            </h3>

            <span
              className={`text-xs px-2 py-1 rounded-full font-medium ${
                statusStyle[r.status]
              }`}
            >
              {r.status.toUpperCase()}
            </span>
          </div>

          {r.reason && (
            <p className="text-sm text-gray-600 mt-2">
              <strong>Reason:</strong> {r.reason}
            </p>
          )}

          {r.admin_comment && (
            <p className="text-sm text-gray-600 mt-1">
              <strong>Admin:</strong> {r.admin_comment}
            </p>
          )}

          <p className="text-xs text-gray-400 mt-2">
            Requested on{" "}
            {new Date(r.created_at).toLocaleDateString()}
          </p>
        </div>
      ))}
    </div>
  );
}
