import React, { useEffect, useState } from "react";
import API from "../api/api";
//import axios from "axios";


/*
export default function Vendors() {
  const [vendors, setVendors] = useState([]);

  useEffect(() => {
    API.get("/vendors")
      .then(res => setVendors(res.data))
      .catch(() => alert("Failed to load vendors"));
  }, []);
*/

export default function Vendors(){

  const [vendors, setVendors]=useState([]);

  useEffect(() => {
    API.get("/vendors")
      .then(res => setVendors(res.data.vendors))
      .catch(() => alert("Failed to load vendors"));
  }, []);

//   useEffect(()=> {

//     function load(){
      
//         axios.get("http://localhost:5000/api/vendors")
//         .then(res=>setVendors(res.data))
//         .catch(()=>{});

     
//   }
//   load();
// },[]);


  // useEffect(()=>{
  //   async function load(){
  //     const res=await axios.get("http://localhost:5000/api/vendors");
  //     setVendors(res.data);
  //   }
  //   load();
  // },[]);
  //overflow: hidden cuts off content if exceed size
  //overflow scroll for scroll if exceed size

  return (
    <div>
      
      <h2 className="text-blue-600 text-2xl font-extrabold drop-shadow-md mb-6">Vendors</h2>
       

      <div className="bg-blue-600 rounded-xl shadow-md">
        <table className="text-white w-full">
          <thead>
            <tr className="p-2 w-full bg-green-600">
              <th className="px-6 py-3 text-left p-2">Vendor Name</th>
              <th className="px-6 py-3 text-left p-2">Contact Person</th>
              <th className="px-6 py-3 text-left">Phone</th>
              <th className="px-6 py-3 text-center">Asset Per Vendor</th>
            </tr>
          </thead>

           <tbody>
            {vendors.map(v => (
              <tr key={v.vendor_id} className="border-b hover:bg-red-600">
                <td className="p-2 px-6 py-3 text-left">{v.vendor_name}</td>
                <td className="p-2 px-6 py-3 text-left">{v.contact_person || "-"}</td>
                <td className="p-2 px-6 py-3 text-left">{v.phone || "-"}</td>
                <td className="p-2 px-6 py-3 text-center">{v.asset_count}</td>
              </tr>
            ))}
          </tbody> 


          {/* <tbody>
            {vendors.map(v=>(
              <tr key={v.id}>
                <th>{v.vendor_name}</th>
                <th>{v.contact_person || "-"}</th>
                <th>{v.phone || "-"}</th>
              </tr>
            ))}
          </tbody> */}

        </table>
      </div>
    </div>
  );
}
