import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/api";
import axios from "axios";

import { FiFileText } from "react-icons/fi";
import { ImBin } from "react-icons/im";
import { FaLocationDot } from "react-icons/fa6";

import Swal from "sweetalert2";

import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";

import UploadFiles from "../components/UploadFiles";

/* ---------------- MAP CLICK HANDLER ---------------- */
function MapClickHandler({ onPick }) {
  useMapEvents({
    click(e) {
      onPick(e.latlng);
    },
  });
  return null;
}
export default function AssetEdit() {
  const url = import.meta.env.VITE_API_URL;
  const { id } = useParams(); // public_id
  console.log(id);
  const navigate = useNavigate();

  const [asset, setAsset] = useState(null);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imageUrls, setImageUrls] = useState({});
  const [showMap, setShowMap] = useState(false);

  const [form, setForm] = useState({
    status: "",
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

  /* ---------------- FETCH ASSET ---------------- */
  useEffect(() => {
    const fetchAsset = async () => {
      try {
        const res = await API.get(`/assets/${id}`);
        console.log(res.data);
        setAsset(res.data.asset);
        setFiles(res.data.files || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAsset();
  }, [id]);

  /* ---------------- SYNC FORM AFTER LOAD ---------------- */
  useEffect(() => {
    if (!asset) return;

    setForm({
      status: asset.status || "active",
      warranty_expiry: asset.warranty_expiry || "",
      assigned_to: asset.assigned_to || "",
      description: asset.description || "",
    });

    setLocation({
      latitude: asset.latitude ? Number(asset.latitude) : null,
      longitude: asset.longitude ? Number(asset.longitude) : null,
      address: asset.address || "",
      suburb: asset.suburb || "",
      city: asset.city || "",
      district: asset.district || "",
      state: asset.state || "",
      country: asset.country || "",
    });
  }, [asset]);

  /* ---------------- FILE HELPERS ---------------- */
  const imageFiles = files.filter((f) => f.file_type === "image");
  const docFiles = files.filter((f) => f.file_type === "document");
  const loadImageBlob = async (fileId) => {
    const res = await API.get(`/assets/files/${fileId}?intent=view`, {
      responseType: "blob",
    });
    return URL.createObjectURL(res.data);
  };

  useEffect(() => {
    const loadImages = async () => {
      const urls = {};

      for (const img of imageFiles) {
        try {
          urls[img.file_id] = await loadImageBlob(img.file_id);
        } catch (err) {
          console.error("Image load failed", err);
        }
      }

      setImageUrls(urls);
    };

    if (imageFiles.length) loadImages();

    return () => {
      // cleanup blob URLs
      Object.values(imageUrls).forEach(URL.revokeObjectURL);
    };
  }, [imageFiles]);

  const previewFile = (fileId) => {
    window.open(
      `${url}/files/${fileId}?intent=view`,
      "_blank",
      "noopener,noreferrer"
    );
  };
  const deleteFile = async (fileId) => {
    try {
      const res = await API.delete(`/files/${fileId}`);
      setFiles((prev) => prev.filter((f) => f.file_id !== fileId));

      Swal.fire({
        icon: "success",
        text: res.data.message,
      });
    } catch (error) {
      console.error(error);
    }
  };
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
      console.error("Reverse geocoding failed", err);
      return { latitude: lat, longitude: lon };
    }
  };
  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const body = {
        status: form.status,
        assigned_to: form.assigned_to || undefined,
        warranty_expiry: form.warranty_expiry || undefined,
        description: form.description || undefined,
        ...location,
      };

      await API.patch(`/assets/${asset.public_id}`, body);
      Swal.fire({
        title: "Asset details updated successfully",
        text: `Asset ID is : ${asset.public_id}`,
        icon: "success",
      });

      navigate(`/assets/${asset.public_id}`);
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Sorry",
        text: err?.response?.data?.message || "Asset updation failed",
      });
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- RENDER ---------------- */
  if (loading) return <div className="p-6">Loading asset details...</div>;
  if (!asset) return <div className="p-6">Asset not found</div>;

  return (
    <div className="max-w-full bg-white dark:bg-slate-900 p-6 rounded shadow">
      <h2 className="text-2xl mb-4 font-bold text-orange-600 dark:text-orange-400">
        Edit Asset Details
      </h2>

      <form
        onSubmit={submit}
        className="grid grid-cols-1 md:grid-cols-2 gap-3 space-y-3"
      >
        <div className="col-span-1 md:col-span-2 flex flex-col">
          <label className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-1">
            Asset name:
          </label>
          <input
            className="border p-2 rounded
             bg-white dark:bg-slate-800
             text-black dark:text-white
             border-gray-300 dark:border-slate-700"
            placeholder="Asset Name"
            value={asset.asset_name}
            disabled
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-1">
            Category:
          </label>
          <input
            className="border p-2 rounded
             bg-white dark:bg-slate-800
             text-black dark:text-white
             border-gray-300 dark:border-slate-700"
            value={asset.category_name}
            disabled
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-1">
            Subcategory:
          </label>
          <input
            className="border p-2 rounded
             bg-white dark:bg-slate-800
             text-black dark:text-white
             border-gray-300 dark:border-slate-700"
            value={asset.subcategory_name}
            disabled
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-1">
            Model number:
          </label>
          <input
            className="border p-2 rounded
             bg-white dark:bg-slate-800
             text-black dark:text-white
             border-gray-300 dark:border-slate-700"
            placeholder="Model Number"
            value={asset.model_number}
            disabled
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-1">
            Serial number:
          </label>
          <input
            className="border p-2 rounded
             bg-white dark:bg-slate-800
             text-black dark:text-white
             border-gray-300 dark:border-slate-700"
            placeholder="Serial Number"
            value={asset.serial_number}
            disabled
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-1">
            Purchase date:
          </label>
          <input
            type="date"
            className="border p-2 rounded
             bg-white dark:bg-slate-800
             text-black dark:text-white
             border-gray-300 dark:border-slate-700"
            value={asset.purchase_date}
            disabled
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-1">
            Purchase cost:
          </label>
          <input
            type="number"
            className="border p-2 rounded
             bg-white dark:bg-slate-800
             text-black dark:text-white
             border-gray-300 dark:border-slate-700"
            placeholder="Purchase Cost"
            value={asset.purchase_cost}
            disabled
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-1">
            Vendor:
          </label>
          <input
            className="border p-2 rounded
             bg-white dark:bg-slate-800
             text-black dark:text-white
             border-gray-300 dark:border-slate-700"
            placeholder="Vendor"
            value={asset.vendor_name}
            disabled
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-1">
            Warranty expiry:
          </label>
          <input
            type="date"
            className={`border p-2 rounded bg-white dark:bg-slate-800
             text-black dark:text-white
             border-gray-300 dark:border-slate-700 ${
               form.warranty_expiry === "" ? "text-gray-400" : "text-black"
             } focus:ring focus:ring-blue-200`}
            value={form.warranty_expiry}
            onChange={(e) => handleChange("warranty_expiry", e.target.value)}
          />
        </div>

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

        <div className="flex flex-col">
          <label className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-1">
            Asset status:
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
            <option value="retired">Retired</option>
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

        {imageFiles.length > 0 && (
          <div
            className="border p-2 rounded md:col-span-2 bg-white dark:bg-slate-800
             text-black dark:text-white
             border-gray-300 dark:border-slate-700"
          >
            <h2 className="text-lg font-medium mb-2 text-black dark:text-white">
              Asset Images
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {imageFiles.map((img) => (
                <div
                  key={img.file_id}
                  className="border rounded overflow-hidden cursor-pointer hover:shadow"
                  onClick={() => previewFile(img.file_id)}
                >
                  <img
                    src={imageUrls[img.file_id]}
                    alt={img.original_name}
                    className="h-40 w-40 object-cover rounded"
                  />
                  <div className="flex justify-between items-center p-2 text-xs">
                    <span className="truncate text-black dark:text-white">
                      {img.original_name}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteFile(img.file_id);
                      }}
                      className=" text-red-600
      hover:bg-red-100
      dark:text-red-400 dark:hover:bg-red-500/10
      transition"
                    >
                      <ImBin />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {docFiles.length > 0 && (
          <div
            className="border p-2 rounded md:col-span-2 bg-white dark:bg-slate-800
             text-black dark:text-white
             border-gray-300 dark:border-slate-700"
          >
            <h2 className="text-lg font-medium mb-2 text-black dark:text-white">
              Documents
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {docFiles.map((doc) => (
                <div
                  key={doc.file_id}
                  className="border rounded p-4 flex flex-col items-center gap-2 cursor-pointer hover:bg-gray-50"
                  onClick={() => previewFile(doc.file_id)}
                >
                  <FiFileText size={32} className="text-red-600" />
                  <span className="text-xs text-center break-all text-black dark:text-white">
                    {doc.original_name}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteFile(doc.file_id);
                    }}
                    className="text-xs flex items-center gap-1  text-red-600
      hover:bg-red-100
      dark:text-red-400 dark:hover:bg-red-500/10
      transition"
                  >
                    <Imbin /> Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
        <UploadFiles
          images={images}
          documents={documents}
          setImages={setImages}
          setDocuments={setDocuments}
        />

        <button className="col-span-2 bg-blue-600 text-white p-2 rounded mt-4">
          {loading ? "Processing..." : "Edit Asset Details"}
        </button>
      </form>
    </div>
  );
}
