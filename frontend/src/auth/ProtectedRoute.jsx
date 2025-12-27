import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import API from "../api/api";


//it takes the JSX wrapped inside it.
//higher order wrapper component
//it gets the user data,if the promise is fulfilled or resolved then .then() works ie reisters a callback
//if any any error then it set ok to false and we get to login screen again 
//
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

