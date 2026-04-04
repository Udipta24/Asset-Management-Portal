const MaintenanceView = ({ request }) => {
  return (
    <div className="space-y-5">

      <div className="text-sm text-slate-700 dark:text-slate-300 space-y-1">
        <p><b>Asset:</b> {request.asset_name}</p>
        <p><b>Issue:</b> {request.description}</p>
      </div>

      <div className="space-y-2">
        <select className="w-full border p-2 rounded bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700">
          <option>Maintenance Type</option>
          <option>Repair</option>
          <option>Replacement</option>
        </select>

        <input
          type="number"
          placeholder="Cost"
          className="w-full border p-2 rounded bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700"
        />

        <input
          type="date"
          className="w-full border p-2 rounded bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700"
        />
      </div>

      <button className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">
        Complete ✅
      </button>

      <div>
        <h3 className="font-medium mb-1">💬 Remark</h3>
        <textarea className="w-full border rounded-lg p-2 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700" />
      </div>
    </div>
  );
}

export default MaintenanceView;