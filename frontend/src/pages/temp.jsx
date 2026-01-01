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

/* ---------------- MAIN COMPONENT ---------------- */
export default function AssetEdit() {
  const { id } = useParams(); // public_id
  const navigate = useNavigate();
  const url = import.meta.env.VITE_API_URL;

  /* ---------------- STATE ---------------- */
  const [asset, setAsset] = useState(null);
  const [files, setFiles] = useState([]);
  const [imageUrls, setImageUrls] = useState({});
  const [loading, setLoading] = useState(true);
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

  /* ---------------- HANDLERS ---------------- */
  const handleChange = (key, value) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleLocationChange = (key, value) =>
    setLocation((prev) => ({ ...prev, [key]: value }));

  /* ---------------- REVERSE GEOCODE ---------------- */
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

  /* ---------------- SUBMIT ---------------- */
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
        icon: "success",
        title: "Asset updated successfully",
        text: `Asset ID: ${asset.public_id}`,
      });

      navigate(`/assets/${asset.public_id}`);
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Update failed",
        text: err?.response?.data?.message || "Something went wrong",
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
      <h2 className="text-2xl font-bold text-orange-600 mb-4">
        Edit Asset Details
      </h2>

      <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* READ ONLY INFO */}
        {[
          ["Asset Name", asset.asset_name],
          ["Category", asset.category_name],
          ["Subcategory", asset.subcategory_name],
          ["Model Number", asset.model_number],
          ["Serial Number", asset.serial_number],
        ].map(([label, value]) => (
          <div key={label} className="flex flex-col">
            <label className="text-sm font-semibold mb-1">{label}</label>
            <input disabled value={value} className="border p-2 rounded" />
          </div>
        ))}

        {/* EDITABLE */}
        <input
          type="date"
          value={form.warranty_expiry}
          onChange={(e) => handleChange("warranty_expiry", e.target.value)}
          className="border p-2 rounded"
        />

        <input
          placeholder="Assigned User ID"
          value={form.assigned_to}
          onChange={(e) => handleChange("assigned_to", e.target.value)}
          className="border p-2 rounded"
        />

        <select
          value={form.status}
          onChange={(e) => handleChange("status", e.target.value)}
          className="border p-2 rounded"
        >
          <option value="active">Active</option>
          <option value="in-repair">In Repair</option>
          <option value="retired">Retired</option>
        </select>

        {/* MAP */}
        <div
          onClick={() => setShowMap(true)}
          className="md:col-span-2 border border-blue-600 text-blue-600 p-2 rounded flex justify-center items-center cursor-pointer"
        >
          <FaLocationDot className="mr-2" />
          Select location on map
        </div>

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
                  const loc = await reverseGeocode(p.lat, p.lng);
                  Object.entries(loc).forEach(([k, v]) =>
                    handleLocationChange(k, v)
                  );
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
          className="md:col-span-2 border p-2 rounded"
          placeholder="Description"
          value={form.description}
          onChange={(e) => handleChange("description", e.target.value)}
        />

        {/* FILES */}
        {imageFiles.length > 0 && (
          <div className="md:col-span-2 grid grid-cols-2 md:grid-cols-4 gap-4">
            {imageFiles.map((img) => (
              <div key={img.file_id} onClick={() => previewFile(img.file_id)}>
                <img
                  src={imageUrls[img.file_id]}
                  className="h-40 w-40 object-cover rounded"
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteFile(img.file_id);
                  }}
                >
                  <ImBin />
                </button>
              </div>
            ))}
          </div>
        )}

        <UploadFiles
          images={images}
          documents={documents}
          setImages={setImages}
          setDocuments={setDocuments}
        />

        <button className="md:col-span-2 bg-blue-600 text-white p-2 rounded">
          {loading ? "Processing..." : "Update Asset"}
        </button>
      </form>
    </div>
  );
}
