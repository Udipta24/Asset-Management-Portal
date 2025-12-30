import React, { useEffect, useState, createContext, useContext } from "react";
import { Navigate } from "react-router-dom";
import API from "../api/api";



export default function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [ok, setOk] = useState(false);

  // useEffect(() => {
  //   API.get("/auth/me").then(() => {
  //     setOk(true);      //returns ok when verified
  //     setLoading(false);
  //   }).catch(() => {
  //     setOk(false);
  //     setLoading(false);
  //   });
  // }, []);
  //with async and await, equivalent both
  
  useEffect(()=>{
    const checkauth = async ()=>{
      try{
        const res=await API.get("/user/me");
        console.log("Auth OK",res.data);
        setOk(true);
      }catch(err){
        console.log(err?.response?.status);
        setOk(false);
      }finally{
        setLoading(false);
      }
    };
    checkauth();
    
  },[]);

//yoou will see this run at first of starting this server, as it runs .get

  if (loading) return <div className="container py-8">Loading...</div>;
  return ok ? children : <Navigate to="/login" replace />;
}

