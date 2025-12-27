import { useEffect, useState } from "react";
import API from "../../api/api";

export default function MyMaintenance() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    API.get("maintenance/mechanic/OwnTasks")
      .then(res => setItems(res.data))
      .catch(() => alert("Failed to load"));
  }, []);

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-lg font-semibold mb-3">My Maintenance Tasks</h2>

      <table className="w-full text-sm">
        <thead>
          <tr className="border-b">
            <th>Asset</th>
            <th>Type</th>
            <th>Status</th>
            <th>Next Due</th>
          </tr>
        </thead>

        <tbody>
          {items.map(m => (
            <tr key={m.maintenance_id} className="border-b">
              <td>{m.asset_name}</td>
              <td>{m.maintenance_type}</td>
              <td>{m.completed_at ? "Done" : "Pending"}</td>
              <td>{m.next_due_date || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
