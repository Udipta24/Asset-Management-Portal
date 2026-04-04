import AssetManagementView from "./AssetManagementView.jsx";
import MaintenanceView from "./MaintenanceView.jsx";
import { IoClose } from "react-icons/io5";

const RequestDrawer = ({ request, role, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/30 flex justify-end z-50">
      <div className="w-[420px] h-full bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-white/10 shadow-xl p-6 overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4 text-slate-800 dark:text-white">
          Request Details
        </h2>

        {role === "ASSET MANAGER" ? (
          <AssetManagementView request={request} />
        ) : (
          <MaintenanceView request={request} />
        )}
        <div>
          <h3 className="font-medium mb-1"> Remark</h3>
          <textarea
            className="w-full border rounded-lg p-2 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700"
            placeholder="Type remark..."
          />
          <button className="mt-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">
            Save Remark
          </button>
          <button
            onClick={onClose}
            className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500 hover:text-white text-red-500 font-semibold border border-red-500/20 hover:border-red-500 transition-all"
          >
            Close <IoClose className="inline-block ml-1" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default RequestDrawer;
