const AdminView = ({ request }) => {
  return (
    <div className="space-y-5">

      <div className="text-sm text-slate-700 dark:text-slate-300 space-y-1">
        <p><b>Category:</b> {request.category_name}</p>
        <p><b>Subcategory:</b> {request.subcategory_name}</p>
        <p><b>User:</b> {request.user_name}</p>
      </div>

      {/* Assets */}
      <div>
        <h3 className="font-medium mb-2">🔍 Available Assets</h3>

        <div className="space-y-2">
          {request.availableAssets?.map((asset) => (
            <div
              key={asset.id}
              className="flex justify-between items-center p-2 border rounded-lg border-slate-200 dark:border-white/10"
            >
              <span>{asset.name}</span>
              <button className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600">
                Assign
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Remark */}
      <div>
        <h3 className="font-medium mb-1">💬 Remark</h3>
        <textarea
          className="w-full border rounded-lg p-2 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700"
          placeholder="Type remark..."
        />
        <button className="mt-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">
          Save Remark
        </button>
      </div>
    </div>
  );
}

export default AdminView;