import { useEffect, useState } from "react";
import API from "../../api/api";

export default function MaintenanceList() {
  const [items, setItems] = useState([]);

  const load = async () => {
    const res = await API.get("/maintenance");
    setItems(res.data);
  };

  useEffect(() => { 
    const fun = async ()=> {
        await load(); 
    }
    fun();
    }, []);

  const complete = async (id) => {
    await API.post(`/maintenance/${id}/complete`);
    load();
  };

  const cancel = async (id) => {
    if (!window.confirm("Cancel maintenance?")) return;
    await API.delete(`/maintenance/${id}`);
    load();
  };

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-lg font-semibold mb-3">All Maintenance</h2>

      <table className="w-full text-sm">
        <thead>
          <tr className="border-b">
            <th>Asset</th>
            <th>Type</th>
            <th>Mechanic</th>
            <th>Status</th>
            <th />
          </tr>
        </thead>

        <tbody>
          {items.map(m => (
            <tr key={m.maintenance_id} className="border-b">
              <td>{m.asset_name}</td>
              <td>{m.maintenance_type}</td>
              <td>{m.mechanic || "-"}</td>
              <td>{m.completed_at ? "Done" : "Pending"}</td>
              <td className="space-x-2">
                {!m.completed_at && (
                  <>
                    <button
                      onClick={() => complete(m.maintenance_id)}
                      className="text-green-600"
                    >
                      Complete
                    </button>
                    <button
                      onClick={() => cancel(m.maintenance_id)}
                      className="text-red-600"
                    >
                      Cancel
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
