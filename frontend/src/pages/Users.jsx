import React, { useEffect, useState, useRef } from "react";
import API from "../api/api";
import { useNavigate } from "react-router-dom";

export default function Users() {
  const [users, setUsers] = useState([]);
  const navigate=useNavigate();
  const alertRef=useRef(false);
  //if we change users then re render
  //if we change useref.current no re-render,

  //to prevent infinite alert during an error
  //below problem,react strictmode runs useeffect twice so multiple alerts
  //or there can be no history ,then it will cause loops
  // useEffect(() => {
  //   API.get("/users")
  //     .then(res => setUsers(res.data))
  //     .catch(() => {
  //         alert("You do not have permission to view users");
  //         navigate(-1);
  //       }
  //     )
  // }, []);
  //we cant use variable, as componeents re render, that variable will be false aggain,as code runs again
  //useRef here is an object with .current property that persists across renders without causing re render
  useEffect(() => {
    API.get("/users")
      .then(res => setUsers(res.data))
      .catch(err => {
        if(!alertRef.current){

          alertRef.current=true;
          alert("You do not have permission to view users");
          console.error(err);

          if(window.history.length>1){
            navigate(-1);
          }else{
            navigate("/");
          }
          
        }
      }
      )
  }, [navigate]);
  //navigate inside dependency dont do much , runs only once


  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Users (Admin Only)</h2>

      <div className="bg-white rounded-lg shadow p-4">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left p-2">Name</th>
              <th className="text-left p-2">Email</th>
              <th className="text-left p-2">Department</th>
              <th className="text-left p-2">Roles</th>
            </tr>
          </thead>

          <tbody>
            {users.map(u => (
              <tr key={u.user_id} className="border-b">
                <td className="p-2">{u.full_name}</td>
                <td className="p-2">{u.email}</td>
                <td className="p-2">{u.department || "-"}</td>
                <td className="p-2">{u.roles.join(", ")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// if u.roles=["str1","str2"] then on .join(", *gap* ") we get "str1, str2" 
//tables have gaps on left and right due to paddign on both sides usign p-4