import React, { useState } from "react";
import API from "../api/api";

export default function RequestAsset() {
  const [type, setType] = useState("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const submit = async () => {
    if (!type.trim()) {
      setMessage({ type: "error", text: "Asset type is required" });
      return;
    }

    try {
      setLoading(true);
      setMessage(null);

      await API.post("/requests", {
        requested_asset_type: type.trim(),
        reason: reason.trim()
      });

      setMessage({ type: "success", text: "Request submitted successfully" });
      setType("");
      setReason("");
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Failed to submit request"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-xl shadow border">
      <h2 className="text-lg font-semibold mb-4">Request Asset</h2>

      {/* Message */}
      {message && (
        <div
          className={`mb-3 text-sm p-2 rounded ${
            message.type === "success"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Asset Type */}
      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-700">
          Asset Type
        </label>
        <input
          className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Laptop, Monitor, Phone..."
          value={type}
          onChange={(e) => setType(e.target.value)}
        />
      </div>

      {/* Reason */}
      <div className="space-y-1 mt-3">
        <label className="text-sm font-medium text-gray-700">
          Reason (optional)
        </label>
        <textarea
          rows={3}
          className="w-full border p-2 rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Why do you need this asset?"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />
      </div>

      {/* Submit */}
      <button
        onClick={submit}
        disabled={loading}
        className={`w-full mt-4 py-2 rounded text-white transition ${
          loading
            ? "bg-blue-300 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {loading ? "Submitting..." : "Submit Request"}
      </button>
    </div>
  );
}
