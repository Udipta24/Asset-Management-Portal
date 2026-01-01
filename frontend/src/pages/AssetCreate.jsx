import React, { useEffect, useState } from "react";
import API from "../api/api";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import UploadFiles from "../components/UploadFiles";
import Swal from "sweetalert2";
import { useReferenceData } from "../hooks/useReferenceData";
import axios from "axios";
import { FaLocationDot } from "react-icons/fa6";

function MapClickHandler({ onPick }) {
  useMapEvents({
    click(e) {
      onPick(e.latlng);
    },
  });
  return null;
}

export default function AssetCreate() {
  const [showMap, setShowMap] = useState(false); //used to hide and show map
  const [form, setForm] = useState({
    asset_name: "",
    category: null,
    subcategory: null,
    serial_number: "",
    model_number: "",
    purchase_date: "",
    purchase_cost: "",
    vendor: "",
    status: "active",
    warranty_expiry: "",
    assigned_to: "",
    description: "",
  });
  const [location, setLocation] = useState({
    latitude: null,
    longitude: null,
    address: "",
    suburb: "",
    city: "",
    district: "",
    state: "",
    country: "",
  });
  const [images, setImages] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();
  const { fetchProtectedReferenceData } = useReferenceData();
  useEffect(() => {
    fetchProtectedReferenceData();
  }, []);
  const { categories, subcategories, /*vendors, */ loadingProtected } =
    useReferenceData();
  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleLocationChange = (key, value) => {
    setLocation((prev) => ({ ...prev, [key]: value }));
  };

  const reverseGeocode = async (lat, lon) => {
    try {
      const res = await axios.get(
        "https://nominatim.openstreetmap.org/reverse",
        {
          params: { format: "json", lat, lon },
        }
      );

      const data = res.data;
      const addr = data.address || {};

      return {
        latitude: lat,
        longitude: lon,
        address: data.display_name || "",
        suburb: addr.suburb || "",
        city: addr.city || addr.town || addr.village || "",
        district: addr.state_district || "",
        state: addr.state || "",
        country: addr.country || "",
      };
    } catch (err) {
      console.error("Reverse geocoding failed:", err);
      return { latitude: lat, longitude: lng };
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const body = {
        asset_name: form.asset_name,
        category: form.category || null,
        subcategory: form.subcategory || null,
        serial_number: form.serial_number || null,
        model_number: form.model_number || null,
        purchase_date: form.purchase_date || null,
        purchase_cost: form.purchase_cost || null,
        vendor: form.vendor || null,
        status: form.status || "active",
        location: location || null,
        assigned_to: form.assigned_to || null,
        warranty_expiry: form.warranty_expiry || null,
        description: form.description || null,
      };
      console.log(body);
      const res = await API.post("/assets", body);
      const public_id = res.data.asset.public_id;
      Swal.fire({
        title: "Asset created successfully",
        text: `Asset ID is : ${public_id}`,
        icon: "success",
      });
      nav(`/assets/${public_id}`);
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Sorry",
        text: err?.response?.data?.message || "Asset creation failed",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loadingProtected) {
    return (
      <div className="max-w-2xl bg-white p-6 rounded shadow flex items-center justify-center">
        <p>Loading form data...</p>
      </div>
    );
  }

  return (
    <div className="max-w-full bg-white dark:bg-slate-900 p-6 rounded shadow">
      <h2 className="text-2xl mb-4 font-bold text-orange-600 dark:text-orange-400">
        Create Asset
      </h2>

      <form
        onSubmit={submit}
        className="grid grid-cols-1 md:grid-cols-2 gap-3 space-y-3"
      >
        {/* Asset Name */}
        <div className="col-span-1 md:col-span-2 flex flex-col">
          <label className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-1">
            Asset name
          </label>
          <input
            className="border p-2 rounded
             bg-white dark:bg-slate-800
             text-black dark:text-white
             border-gray-300 dark:border-slate-700"
            value={form.asset_name}
            onChange={(e) => handleChange("asset_name", e.target.value)}
            required
          />
        </div>

        {/* Category */}
        <div className="flex flex-col">
          <label className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-1">
            Category
          </label>
          <select
            className={`border p-2 rounded
             bg-white dark:bg-slate-800
             ${
               form.category === ""
                 ? "text-slate-400"
                 : "text-black dark:text-white"
             }
             border-gray-300 dark:border-slate-700`}
            value={form.category}
            onChange={(e) => handleChange("category", e.target.value)}
            required
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat.category_id} value={cat.category_id}>
                {cat.category_name}
              </option>
            ))}
          </select>
        </div>

        {/* Subcategory */}
        <div className="flex flex-col">
          <label className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-1">
            Subcategory
          </label>
          <select
            className={`border p-2 rounded
             bg-white dark:bg-slate-800
             ${
               form.subcategory === ""
                 ? "text-slate-400"
                 : "text-black dark:text-white"
             }
             border-gray-300 dark:border-slate-700`}
            value={form.subcategory}
            onChange={(e) => handleChange("subcategory", e.target.value)}
            required
          >
            <option value="">
              Select Subcategory (after selecting category)
            </option>
            {form.category &&
              subcategories[form.category].map((subCat) => (
                <option
                  key={subCat.subcategory_id}
                  value={subCat.subcategory_id}
                >
                  {subCat.subcategory_name}
                </option>
              ))}
          </select>
        </div>

        {/* Model number */}
        <div className="flex flex-col">
          <label className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-1">
            Model number
          </label>
          <input
            className="border p-2 rounded
             bg-white dark:bg-slate-800
             text-black dark:text-white
             border-gray-300 dark:border-slate-700"
            placeholder="Model Number"
            value={form.model_number}
            onChange={(e) => handleChange("model_number", e.target.value)}
          />
        </div>

        {/* Serial number */}
        <div className="flex flex-col">
          <label className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-1">
            Serial number
          </label>
          <input
            className="border p-2 rounded
             bg-white dark:bg-slate-800
             text-black dark:text-white
             border-gray-300 dark:border-slate-700"
            placeholder="Serial Number"
            value={form.serial_number}
            onChange={(e) => handleChange("serial_number", e.target.value)}
          />
        </div>

        {/* Purchase date */}
        <div className="flex flex-col">
          <label className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-1">
            Purchase date
          </label>
          <input
            type="date"
            className={`border p-2 rounded
             bg-white dark:bg-slate-800
             ${
               form.purchase_date === ""
                 ? "text-slate-400"
                 : "text-black dark:text-white"
             }
             border-gray-300 dark:border-slate-700`}
            value={form.purchase_date}
            onChange={(e) => handleChange("purchase_date", e.target.value)}
          />
        </div>

        {/* Purchase Cost */}
        <div className="flex flex-col">
          <label className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-1">
            Purchase cost
          </label>
          <input
            type="number"
            className="border p-2 rounded
             bg-white dark:bg-slate-800
             text-black dark:text-white
             border-gray-300 dark:border-slate-700"
            placeholder="Purchase Cost"
            value={form.purchase_cost}
            onChange={(e) => handleChange("purchase_cost", e.target.value)}
          />
        </div>

        {/* Vendor */}
        {/* <div className="col-span-2 flex flex-col">
          <label className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-1">
            Vendor
          </label>
          <select
            className={`border p-2 rounded
             bg-white dark:bg-slate-800
             ${
               form.vendor === ""
                 ? "text-slate-400"
                 : "text-black dark:text-white"
             }
             border-gray-300 dark:border-slate-700`}
            value={form.vendor}
            onChange={(e) => handleChange("vendor", e.target.value)}
            required
          >
            <option value="">Select Vendor</option>
            {vendors.map((vd) => (
              <option key={vd.vendor_id} value={vd.vendor_id}>
                {vd.vendor_name}
              </option>
            ))}
          </select>
        </div> */}

        {/* Warrantry expiry */}
        <div className="flex flex-col">
          <label className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-1">
            Warranty expiry:
          </label>
          <input
            type="date"
            className={`border p-2 rounded
             bg-white dark:bg-slate-800
             ${
               form.purchase_date === ""
                 ? "text-slate-400"
                 : "text-black dark:text-white"
             }
             border-gray-300 dark:border-slate-700`}
            value={form.warranty_expiry}
            onChange={(e) => handleChange("warranty_expiry", e.target.value)}
          />
        </div>
        {/* Assigned User Id */}
        <div className="flex flex-col">
          <label className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-1">
            Assigned User ID:
          </label>
          <input
            className="border p-2 rounded
             bg-white dark:bg-slate-800
             text-black dark:text-white
             border-gray-300 dark:border-slate-700"
            placeholder="Assigned User ID"
            value={form.assigned_to}
            onChange={(e) => handleChange("assigned_to", e.target.value)}
          />
        </div>

        {/* Status */}
        <div className="flex flex-col">
          <label className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-1">
            Asset status
          </label>
          <select
            className="border p-2 rounded
             bg-white dark:bg-slate-800
             text-black dark:text-white
             border-gray-300 dark:border-slate-700"
            value={form.status}
            onChange={(e) => handleChange("status", e.target.value)}
          >
            <option value="active">Active</option>
            <option value="in-repair">In Repair</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <div
          onClick={() => setShowMap(true)}
          className="md:col-span-2 border border-blue-600 text-blue-600 bg-white dark:bg-slate-800 p-2 rounded flex justify-center items-center"
        >
          <FaLocationDot size={22} />{" "}
          <span className="ml-1">Select location on Map</span>
        </div>
        {location.latitude && location.longitude && (
          <div className="md:col-span-2 text-sm text-slate-600">
            <p>
              Selected: {location.latitude.toFixed(5)},{" "}
              {location.longitude.toFixed(5)}
            </p>
            <p>Address: {location.address}</p>
          </div>
        )}
        {showMap && (
          <div className="md:col-span-2">
            <MapContainer
              center={[23.8315, 91.2868]}
              zoom={12}
              className="h-80 w-full rounded"
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

              <MapClickHandler
                onPick={async (p) => {
                  const fullLocation = await reverseGeocode(p.lat, p.lng);
                  // console.log(fullLocation);
                  Object.entries(fullLocation).forEach(([key, value]) => {
                    handleLocationChange(key, value);
                  });
                  setShowMap(false);
                }}
              />

              {location.latitude && location.longitude && (
                <Marker position={[location.latitude, location.longitude]} />
              )}
            </MapContainer>
          </div>
        )}

        <textarea
          className="border p-2 rounded md:col-span-2 bg-white dark:bg-slate-800
             text-black dark:text-white
             border-gray-300 dark:border-slate-700"
          placeholder="Description"
          value={form.description}
          onChange={(e) => handleChange("description", e.target.value)}
        />

        <UploadFiles
          images={images}
          documents={documents}
          setImages={setImages}
          setDocuments={setDocuments}
        />

        <button className="md:col-span-2 bg-blue-600 text-white p-2 rounded mt-4 hover:bg-blue-700 hover:shadow-md
    active:scale-95">
          {loading ? "Processing..." : "Create Asset"}
        </button>
      </form>
    </div>
  );
}
