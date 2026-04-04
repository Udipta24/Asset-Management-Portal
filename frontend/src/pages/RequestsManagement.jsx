import { useState, useEffect } from "react";
import API from "../api/api";
import { useAuth } from "../context/AuthContext";
import { IoClose, IoCheckmarkCircle } from "react-icons/io5";
import { FiEye, FiCheck, FiX, FiSave } from "react-icons/fi";

export default function RequestsManagement() {
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [availableAssets, setAvailableAssets] = useState([]);
  const [assetFetched, setAssetFetched] = useState(false);
  const [remark, setRemark] = useState("");
  const [maintenanceData, setMaintenanceData] = useState({
    maintenance_type: "",
    cost: 0,
    maintenance_date: "",
    next_due_date: "",
  });
  const { currentUser, loading } = useAuth();
  const role = currentUser?.role;

  const fetchRequests = async () => {
    const res = await API.get("/requests/pending");
    setRequests(res.data);
  };

  const fetchAvailableAssets = async (categoryId, subcategoryId) => {
    console.log(
      "Fetching assets for category:",
      categoryId,
      "subcategory:",
      subcategoryId,
    );
    console.log(typeof categoryId, typeof subcategoryId);
    const res = await API.get("/assets", {
      params: {
        category: categoryId,
        subcategory: subcategoryId,
        assigned_to: "NOT ASSIGNED",
      },
    });
    setAvailableAssets(res.data);
    setAssetFetched(true);
  };

  const assignAsset = async (requestId, assetId) => {
    await API.post(`/requests/${requestId}/approve-asset`, {
      asset_id: assetId,
    });
    fetchRequests();
    setSelectedRequest(null);
  };

  const completeMaintenance = async (requestId) => {
    await API.post(
      `/requests/${requestId}/complete-maintenance`,
      maintenanceData,
    );
    fetchRequests();
    setMaintenanceData({
      maintenance_type: "",
      cost: 0,
      maintenance_date: "",
      next_due_date: "",
    });
    setSelectedRequest(null);
  };

  const rejectRequest = async (requestId) => {
    await API.post(`/requests/${requestId}/reject`);
    fetchRequests();
    setSelectedRequest(null);
  };

  const updateRemark = async (requestId) => {
    await API.patch(`/requests/${requestId}/update-remark`, { remark });
    fetchRequests();
    setRemark("");
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <div className="p-6 max-w-full bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm">
      <h1 className="text-2xl font-bold mb-6 text-slate-800 dark:text-white">
        {role === "ASSET MANAGER"
          ? "Asset Requests Dashboard"
          : "Maintenance Requests Dashboard"}
      </h1>

      <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-white/10">
        <table className="w-full border-collapse">
          <thead className="bg-slate-100 dark:bg-slate-800/60 text-slate-700 dark:text-slate-200">
            <tr>
              <th className="px-4 py-3 text-left border-b border-slate-200 dark:border-white/10">
                User ID
              </th>

              {role === "ASSET MANAGER" ? (
                <>
                  <th className="px-4 py-3 text-left border-b border-slate-200 dark:border-white/10">
                    Category
                  </th>
                  <th className="px-4 py-3 text-left border-b border-slate-200 dark:border-white/10">
                    Subcategory
                  </th>
                </>
              ) : (
                <>
                  <th className="px-4 py-3 text-left border-b border-slate-200 dark:border-white/10">
                    Asset ID
                  </th>
                  <th className="px-4 py-3 text-left border-b border-slate-200 dark:border-white/10">
                    Description
                  </th>
                </>
              )}

              <th className="px-4 py-3 text-left border-b border-slate-200 dark:border-white/10">
                Status
              </th>
              <th className="px-4 py-3 text-left border-b border-slate-200 dark:border-white/10">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {requests.map((req) => (
              <tr
                key={req.request_id}
                className="hover:bg-slate-100 dark:hover:bg-slate-800/60 text-slate-800 dark:text-slate-100 transition-colors"
              >
                <td className="px-4 py-2 border-b border-slate-200 dark:border-white/5">
                  {req.public_id}
                </td>

                {role === "ASSET MANAGER" ? (
                  <>
                    <td className="px-4 py-2 border-b border-slate-200 dark:border-white/5">
                      {req.category_name}
                    </td>
                    <td className="px-4 py-2 border-b border-slate-200 dark:border-white/5">
                      {req.subcategory_name}
                    </td>
                  </>
                ) : (
                  <>
                    <td className="px-4 py-2 border-b border-slate-200 dark:border-white/5">
                      {req.asset_id}
                    </td>
                    <td className="px-4 py-2 border-b border-slate-200 dark:border-white/5">
                      {req.description}
                    </td>
                  </>
                )}

                <td className="px-4 py-2 border-b border-slate-200 dark:border-white/5">
                  <span className="px-2 py-1 rounded-lg text-xs font-semibold text-yellow-700 bg-yellow-100 dark:text-yellow-300 dark:bg-yellow-500/10">
                    {req.status}
                  </span>
                </td>

                <td className="px-4 py-2 border-b border-slate-200 dark:border-white/5">
                  <button
                    onClick={() => setSelectedRequest(req)}
                    className="flex justify-center items-center gap-2 text-blue-600 hover:text-blue-500 hover:underline dark:text-cyan-400 dark:hover:text-cyan-300 dark:hover:underline"
                  >
                    <FiEye size={14} /> View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedRequest && (
        <div className="fixed inset-x-0 bottom-0 top-16 bg-black/30 flex justify-end z-50">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm opacity-100 transition-opacity duration-300"
            onClick={() => setSelectedRequest(null)}
          />
          <div className="ml-auto w-[420px] h-full bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-white/10 shadow-xl p-6 overflow-y-auto transform transition-transform duration-300 translate-x-0 animate-slideIn">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-xl font-semibold mb-4 text-slate-800 dark:text-white">
                Request Details
              </h2>
              <button
                onClick={() => setSelectedRequest(null)}
                className="p-2 rounded-xl border font-medium text-slate-700 border-slate-300 hover:bg-slate-100 dark:text-slate-300 dark:border-white/10 dark:hover:bg-slate-800 transition"
              >
                <IoClose />
              </button>
            </div>

            {role === "ASSET MANAGER" ? (
              <div className="space-y-5">
                <div className="text-sm text-slate-800 dark:text-slate-200 space-y-1">
                  <p>
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      User:
                    </span>{" "}
                    {selectedRequest.public_id}
                  </p>
                  <p>
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Category:
                    </span>{" "}
                    {selectedRequest.category_name}
                  </p>
                  <p>
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Subcategory:
                    </span>{" "}
                    {selectedRequest.subcategory_name}
                  </p>
                </div>

                {/* Assets */}
                <div className="p-4 rounded-xl border bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-white/10">
                  <button
                    onClick={() =>
                      fetchAvailableAssets(
                        selectedRequest.category_id,
                        selectedRequest.subcategory_id,
                      )
                    }
                    className="mb-3 px-4 py-2 rounded-lg border text-sm uppercase tracking-wider font-medium text-slate-700 border-slate-300 hover:bg-slate-100 dark:text-slate-300 dark:border-white/10 dark:hover:bg-slate-800 transition"
                  >
                    Load Available Assets
                  </button>

                  <div className="space-y-2">
                    {assetFetched &&
                      (availableAssets.length > 0 ? (
                        availableAssets.map((asset) => (
                          <div
                            key={asset.public_id}
                            className="flex justify-between items-center p-2 border rounded-lg border-slate-200 dark:border-white/10 transition-all duration-200 hover:shadow-md hover:-translate-y-[1px]"
                          >
                            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                              {asset.asset_name}
                            </span>
                            <button
                              onClick={() =>
                                assignAsset(
                                  selectedRequest.request_id,
                                  asset.public_id,
                                )
                              }
                              className="flex items-center gap-1 px-2 py-1 rounded-md text-xs font-normal uppercase tracking-wider text-green-700 bg-green-100 dark:text-green-300 dark:bg-green-500/10
                  transition-all duration-200 ease-in-out hover:bg-green-300 hover:text-green-900 dark:hover:bg-green-500/40 dark:hover:text-green-100
                  hover:shadow-md hover:-translate-y-[1px] active:scale-95"
                            >
                              <FiCheck size={14} /> Assign
                            </button>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-4">
                          <p className="text-sm italic text-slate-500 dark:text-slate-400">
                            No assets available
                          </p>
                          <p className="text-xs text-slate-400 mt-1">
                            Try again later or check inventory
                          </p>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-5">
                <div className="text-sm text-slate-800 dark:text-slate-200 space-y-1">
                  <p>
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Asset:
                    </span>{" "}
                    {selectedRequest.asset_id}
                  </p>
                  <p>
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Issue:
                    </span>{" "}
                    {selectedRequest.issue_description}
                  </p>
                </div>
                <div className="flex flex-col justify-center gap-2 p-4 space-y-2 rounded-xl border bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-white/10">
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Maintenance type
                    </p>
                    <input
                      type="text"
                      placeholder="Maintenance Type"
                      value={maintenanceData.maintenance_type}
                      className="w-full bg-transparent border-b px-2 py-1 outline-none text-slate-800 border-slate-300 focus:border-green-500 dark:text-white dark:border-white/20 dark:focus:border-green-400 transition-colors"
                      onChange={(e) =>
                        setMaintenanceData({
                          ...maintenanceData,
                          maintenance_type: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Maintenance cost
                    </p>
                    <input
                      type="number"
                      placeholder="Maintenance Cost"
                      className="w-full bg-transparent border-b px-2 py-1 outline-none text-slate-800 border-slate-300 focus:border-green-500 dark:text-white dark:border-white/20 dark:focus:border-green-400 transition-colors"
                      value={maintenanceData.cost}
                      onChange={(e) =>
                        setMaintenanceData({
                          ...maintenanceData,
                          cost: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Maintenance date
                    </p>
                    <input
                      type="date"
                      className="w-full bg-transparent border-b px-2 py-1 outline-none text-slate-800 border-slate-300 focus:border-green-500 dark:text-white dark:border-white/20 dark:focus:border-green-400 transition-colors"
                      value={maintenanceData.maintenance_date}
                      onChange={(e) =>
                        setMaintenanceData({
                          ...maintenanceData,
                          maintenance_date: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Next due date
                    </p>
                    <input
                      type="date"
                      className="w-full bg-transparent border-b px-2 py-1 outline-none text-slate-800 border-slate-300 focus:border-green-500 dark:text-white dark:border-white/20 dark:focus:border-green-400 transition-colors"
                      value={maintenanceData.next_due_date}
                      onChange={(e) =>
                        setMaintenanceData({
                          ...maintenanceData,
                          next_due_date: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <button
                  onClick={() =>
                    completeMaintenance(selectedRequest.request_id)
                  }
                  className="w-full flex justify-center items-center gap-1 px-2 py-1 rounded-md text-xs font-semibold uppercase tracking-wider text-green-700 bg-green-100 dark:text-green-300 dark:bg-green-500/10
                  transition-all duration-200 ease-in-out hover:bg-green-300 hover:text-green-900 dark:hover:bg-green-500/40 dark:hover:text-green-100
                  hover:shadow-md hover:-translate-y-[1px] active:scale-95"
                >
                  <IoCheckmarkCircle /> Complete
                </button>
              </div>
            )}
            <div className="mt-6 p-4 rounded-xl border bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-white/10 space-y-2">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                {" "}
                Remark
              </h3>
              <textarea
                value={remark}
                onChange={(e) => setRemark(e.target.value)}
                className="w-full border rounded-lg p-2 bg-white dark:bg-slate-800 dark:border-slate-700 outline-none text-slate-800 border-slate-300 focus:border-green-500 dark:text-white dark:border-white/20 dark:focus:border-green-400 transition-colors"
                placeholder="Type remark"
              />
              <div className="flex justify-between items-center">
                <button
                  onClick={() => updateRemark(selectedRequest.request_id)}
                  className="flex items-center gap-1 mt-2 px-3 py-1 rounded-lg text-xs font-semibold uppercase tracking-wider text-blue-700 bg-blue-100 dark:text-blue-300 dark:bg-blue-500/10
                  transition-all duration-200 ease-in-out hover:bg-blue-300 hover:text-blue-900 dark:hover:bg-blue-500/40 dark:hover:text-blue-100
                  hover:shadow-md hover:-translate-y-[1px] active:scale-95"
                >
                  <FiSave /> Save Remark
                </button>
                <button
                  onClick={() => rejectRequest(selectedRequest.request_id)}
                  className="flex items-center gap-1 mt-2 ml-4 px-3 py-1 rounded-lg text-xs font-semibold uppercase tracking-wider text-red-700 bg-red-100 dark:text-red-300 dark:bg-red-500/10
                  transition-all duration-200 ease-in-out hover:bg-red-300 hover:text-red-900 dark:hover:bg-red-500/40 dark:hover:text-red-100
                  hover:shadow-md hover:-translate-y-[1px] active:scale-95"
                >
                  <FiX /> Reject Request
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
