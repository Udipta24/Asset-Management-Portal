import { createContext, useContext, useEffect, useState } from "react";
import API from "../api/api";

const ReferenceDataContext = createContext();

export const ReferenceDataProvider = ({ children }) => {
  // Public (no auth needed)
  const [departments, setDepartments] = useState([]);
  const [designations, setDesignations] = useState([]);

  // Protected (auth needed)
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  // const [vendors, setVendors] = useState([]);

  const [loadingPublic, setLoadingPublic] = useState(true);
  const [loadingProtected, setLoadingProtected] = useState(false);

  const fetchPublicReferenceData = async () => {
    try {
      setLoadingPublic(true);

      const [deptRes, desigRes] = await Promise.all([
        API.get("/departments"),
        API.get("/designations"),
      ]);
      console.log(deptRes, desigRes);
      setDepartments(deptRes.data);
      setDesignations(desigRes.data);
    } catch (err) {
      console.error("Failed to load public reference data", err);
    } finally {
      setLoadingPublic(false);
    }
  };

  const fetchProtectedReferenceData = async () => {
    try {
      setLoadingProtected(true);

      const [catRes, subcatRes, vendorRes] = await Promise.all([
        API.get("/categories"),
        API.get("/subcategories"),
        // API.get("/vendors"),
      ]);
      
      setCategories(catRes.data);
      setSubcategories(subcatRes.data);
      // setVendors(vendorRes.data);
    } catch (err) {
      console.error("Failed to load protected reference data", err);
    } finally {
      setLoadingProtected(false);
    }
  };

  useEffect(() => {
    fetchPublicReferenceData(); // load public data on app start
  }, []);

  return (
    <ReferenceDataContext.Provider
      value={{
        // public
        departments,
        designations,
        loadingPublic,

        // protected
        categories,
        subcategories,
        // vendors,
        loadingProtected,

        // actions
        fetchProtectedReferenceData,
        refreshPublicReferenceData: fetchPublicReferenceData,
      }}
    >
      {children}
    </ReferenceDataContext.Provider>
  );
};

export const useReferenceDataContext = () =>
  useContext(ReferenceDataContext);

