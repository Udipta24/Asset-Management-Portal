import React, { useEffect, useState } from "react";
import API from "../api/api";

export default function Locations() {
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    API.get("/locations")
      .then(res => setLocations(res.data))
      .catch(() => alert("Failed to load locations"));
  }, []);      //we need to manually refresh 



  //border-b --only horizontal lines
  //border -- whole table, eepends on where u put
  //focus --element selecteed
  //ring --outline drawn outside border
  //for me... p-4 was adding padding thats why div was bigger..
  return (
    <div>
      <h2 className="text-black-600 text-2xl font-extrabold drop-shadow-md mb-6">Locations</h2>

      <div className="bg-white shadow rounded-xl">
        <table className="bg-green-500 w-full rounded-xl shadow-lg focus:ring-8 focus:ring-blue-500">
          <thead>
            <tr className="border-b text-white bg-indigo-600">
              <th className="text-left p-2 px-6">Location Name</th>
              <th className="text-left p-2">Region</th>
              <th className="text-left p-2">Address</th>
              <th className="text-left p-2">Latitude</th>
              <th className="text-left p-2">Longitude</th>
              <th className="text-center p-2">Asset Per Location</th>

            </tr>
          </thead>

{/* just for me..  {} creates function body and without return it shows nothing on screen
so use () implicit return */}

          <tbody>
            {locations.map(loc => (
              <tr key={loc.location_id} className="border-b border-emerald-600 hover:bg-red-600">
                <td className="p-2 px-6">{loc.location_name}</td>
                <td className="p-2">{loc.region || ""}</td>
                <td className="p-2">{loc.address || ""}</td>
                <td className="p-2">{loc.latitude || ""}</td>
                <td className="p-2">{loc.longitude || ""}</td>
                <td className="p-2 px-5 text-lg text-black-500 text-center">{loc.asset_count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
