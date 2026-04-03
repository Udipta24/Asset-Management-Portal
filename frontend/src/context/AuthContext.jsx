import { createContext, useContext, useEffect, useState, useCallback } from "react";
import API from "../api/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = useCallback(async () => {
    try {
      const res = await API.get("/user/me");
      setCurrentUser(res.data.user);
      return res.data.user;
    } catch {
      setCurrentUser(null);
      return null;
    }
  }, []);

  useEffect(() => {
    checkAuth().finally(() => setLoading(false));
  }, [checkAuth]);


  return (
    <AuthContext.Provider
      value={{ currentUser, loading, checkAuth, setCurrentUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
