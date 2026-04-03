import { useEffect, useState } from "react";
import API from "../api/api";
import Swal from "sweetalert2";
import { MdOutlineCancel } from "react-icons/md";

export default function MyRequests() {
  const [requests, setRequests] = useState([]);
  const [filters, setFilters] = useState({
    request_type: "NEW ASSET",
    status: "",
    dir: "desc",
  });

  const fetchRequests = async () => {
    const res = await API.get("/requests/my", { params: filters } );
    setRequests(res.data);
  };

  useEffect(() => {
    fetchRequests();
  }, [filters]);

  const cancelRequest = async(requestId) => {
    Swal.fire({
      title: "Do you want to cancel this request?",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try{
          await API.delete(`/requests/${requestId}`);
          Swal.fire("Request cancelled", "", "success");
          fetchRequests();
        } catch (err) {
          Swal.fire("Failed to cancel request", err.response?.data?.error || err.message, "error");
        }
      }
    });
  }

  const getStatusBadge = (status) => {
    const base =
      "px-2 py-1 rounded-lg text-xs font-semibold";

    switch (status) {
      case "PENDING":
        return `${base} text-yellow-700 bg-yellow-100 dark:text-yellow-300 dark:bg-yellow-500/10`;
      case "APPROVED":
        return `${base} text-green-700 bg-green-100 dark:text-green-300 dark:bg-green-500/10`;
      case "REJECTED":
        return `${base} text-red-700 bg-red-100 dark:text-red-300 dark:bg-red-500/10`;
      case "FULFILLED":
        return `${base} text-blue-700 bg-blue-100 dark:text-blue-300 dark:bg-blue-500/10`;
      default:
        return `${base} text-slate-600 bg-slate-100 dark:text-slate-300 dark:bg-slate-700`;
    }
  };

  return (
    <div className="p-6 max-w-full bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm">
      
      <h1 className="text-2xl font-bold mb-6 text-slate-800 dark:text-white">
        My Requests
      </h1>

      <div className="mb-4 p-4 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-800/60 grid grid-cols-6 gap-4">

        <select
          className="col-span-2 border p-2 rounded outline-none bg-white dark:bg-slate-800 text-black dark:text-white border-gray-300 dark:border-slate-700 focus:border-green-500 dark:focus:border-green-400 transition-colors"
          value={filters.request_type}
          onChange={(e) =>
            setFilters({ ...filters, request_type: e.target.value })
          }
        >
          <option value="NEW ASSET">New Asset</option>
          <option value="MAINTENANCE">Maintenance</option>
        </select>

        <select
          className="col-span-2 border p-2 rounded outline-none bg-white dark:bg-slate-800 text-black dark:text-white border-gray-300 dark:border-slate-700 focus:border-green-500 dark:focus:border-green-400 transition-colors"
          value={filters.status}
          onChange={(e) =>
            setFilters({ ...filters, status: e.target.value })
          }
        >
          <option value="">All Status</option>
          <option value="PENDING">Pending</option>
          <option value="APPROVED">Approved</option>
          <option value="REJECTED">Rejected</option>
          <option value="FULFILLED">Fulfilled</option>
        </select>

        <select
          className="col-span-2 border p-2 rounded outline-none bg-white dark:bg-slate-800 text-black dark:text-white border-gray-300 dark:border-slate-700 focus:border-green-500 dark:focus:border-green-400 transition-colors"
          value={filters.dir}
          onChange={(e) =>
            setFilters({ ...filters, dir: e.target.value })
          }
        >
          <option value="desc">Newest First</option>
          <option value="asc">Oldest First</option>
        </select>

      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-white/10">
        <table className="w-full border-collapse">
          <thead className="bg-slate-100 dark:bg-slate-800/60 text-slate-700 dark:text-slate-200">
            <tr>
              <th className="px-4 py-3 text-left border-b border-slate-200 dark:border-white/10">Type</th>
              <th className="px-4 py-3 text-left border-b border-slate-200 dark:border-white/10">{filters.request_type === "NEW ASSET" ?"Category" : "Asset ID"}</th>
              <th className="px-4 py-3 text-left border-b border-slate-200 dark:border-white/10">{filters.request_type === "NEW ASSET" ?"Subcategory" : "Description"}</th>
              <th className="px-4 py-3 text-left border-b border-slate-200 dark:border-white/10">Status</th>
              <th className="px-4 py-3 text-left border-b border-slate-200 dark:border-white/10">Remark</th>
              <th className="px-4 py-3 text-left border-b border-slate-200 dark:border-white/10">Date</th>
              <th className="px-4 py-3 text-left border-b border-slate-200 dark:border-white/10">Actions</th>
            </tr>
          </thead>

          <tbody>
            {requests.map((req) => (
              <tr
                key={req.request_id}
                className="hover:bg-slate-100 dark:hover:bg-slate-800/60 text-slate-800 dark:text-slate-100 transition-colors"
              >
                <td className="px-4 py-2 border-b border-slate-200 dark:border-white/5">
                  {req.request_type}
                </td>

                <td className="px-4 py-2 border-b border-slate-200 dark:border-white/5">
                  {filters.request_type === "NEW ASSET" ? req.category_name : req.asset_id || "-"}
                </td>

                <td className="px-4 py-2 border-b border-slate-200 dark:border-white/5">
                  {filters.request_type === "NEW ASSET" ? req.subcategory_name : req.description || "-"}
                </td>

                <td className="px-4 py-2 border-b border-slate-200 dark:border-white/5">
                  <span className={getStatusBadge(req.status)}>
                    {req.status}
                  </span>
                </td>

                <td className="px-4 py-2 border-b border-slate-200 dark:border-white/5">
                  {req.remark ? (
                    req.remark
                  ) : (
                    <span className="italic text-slate-400">
                      No remark
                    </span>
                  )}
                </td>

                <td className="px-4 py-2 border-b border-slate-200 dark:border-white/5">
                  {new Date(req.requested_at).toLocaleDateString()}
                </td>

                <td className="px-4 py-2 text-center border-b border-slate-200 dark:border-white/5">
                  <button
                    onClick={() => cancelRequest(req.request_id)}
                    className="p-2 rounded-lg text-red-600 hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-500/10 transition"
                  >
                    <MdOutlineCancel />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}