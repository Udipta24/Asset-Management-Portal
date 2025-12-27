import React, { useEffect, useState } from "react";
import API from "../api/api";
import { Link } from "react-router-dom";

export default function Assets( { region }) {
  const [assets, setAssets] = useState([]);
  const [q, setQ] = useState("");

  //we change value of q , by using onchange in input and that changes q value
  //now when button pressed onclick the load function runs and as it takes "q" as a params (meaning in the url) and passes to backend,
  //so asset array value changed and so is the mapped elements we see
  const load = async () => {
    try {
      let res;
      //if region is undefined mean normal view , show all the assets
      //but i reused same component also for finding assets in each regions 
      //so if region is not null, it will load all asset in that region into asset array then it is mapped to screen
      if(region){
        res= await API.get(`/assets/by-region/${region}`);
      }else{
        res = await API.get("/assets", { params: { q } });
      }
      
      setAssets(res.data);  
    } catch (err) {
      console.error(err);
      alert("Failed to load assets");
    }
  };

  useEffect(() => {
    // async wrapper to avoid synchronous state updates
    const fetchAssets = async () => {
      await load(); // safe: async inside effect
    };

    fetchAssets();
  }, []); // only run once

  return (
    <div className="animate-fadeIn">
      {/*below== flex makes children line up horizontally, vertically center them 
      and justify betweem - pushes first element to left and next to right*/}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Assets</h2>
        <Link
          to="/assets/create"
          className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-lg shadow hover:scale-105 transition-transform duration-200"
        >
          + Add Asset
        </Link>
      </div>

      <div className="mb-6 flex items-center gap-2">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search"
          className="border p-2 pl-10 rounded-lg w-72 shadow-sm focus:ring-2 focus:ring-blue-400 outline-none"
        />
        
        <button
          onClick={load}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Search <span className="">🔍</span>
        </button>
      </div>
      

      {/* the hover -translate make it seems that items pop up  */}
{/* from asset array, each asset a, we get its id, we pass them to paths, just wrote incase */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {assets.map((a) => (
          <div key={a.asset_id} className="bg-white p-5 rounded-xl shadow-md hover:shadow-xl hover:-translate-y-2 transition-all duration-300 border border-gray-100 bg-gradient-to-r from-cyan-200 to-yellow-300">
            <div className="font-semibold text-lg text-gray-800">{a.asset_name}</div>

             <div className="mt-2">
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium 
                ${
                  a.status === "active"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {a.status}
              </span>
            </div>

            <div className="flex justify-between mt-4">
              <Link className="text-blue-600 hover:underline font-medium" to={`/assets/${a.asset_id}`}>
                View
              </Link>
              <Link className="text-red-500 hover:underline font-medium"  to={`/assets/${a.asset_id}/edit`}>
              Update Asset 
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
