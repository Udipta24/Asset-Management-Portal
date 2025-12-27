import { Link } from "react-router-dom";

export default function TopActions({ pathname }) {
  return (
    <div className="bg-white border-b px-6 py-3 flex items-center justify-between">
      <h2 className="font-semibold text-lg capitalize">
        {pathname.split("/")[1] || "Dashboard"}
      </h2>

      <div className="flex gap-2">
        {pathname.startsWith("/assets") && (
          <>
            <Link to="/assets/create" className="btn-primary">Add Asset</Link>
            <button className="btn-secondary">Assign</button>
            <button className="btn-secondary">Change Location</button>
          </>
        )}

        {pathname.startsWith("/locations") && (
          <>
            <Link to="/locations/create" className="btn-primary">Add Location</Link>
            <button className="btn-danger">Delete</button>
          </>
        )}

        {pathname.startsWith("/vendors") && (
          <>
            <Link to="/vendors/create" className="btn-primary">Add Vendor</Link>
          </>
        )}
      </div>
    </div>
  );
}


//i will use it later to create a navigation bar above per page