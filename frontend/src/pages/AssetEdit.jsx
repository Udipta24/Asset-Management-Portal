import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/api";
import { FiFileText } from "react-icons/fi";
import { ImBin } from "react-icons/im";
import Swal from "sweetalert2";
export default function AssetEdit() {
  const url = import.meta.env.VITE_API_URL;
  const { id } = useParams(); // public_id
  const navigate = useNavigate();

  const [asset, setAsset] = useState(null);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imageUrls, setImageUrls] = useState({});
  const [showMap, setShowMap] = useState(false); //used to hide and show map
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
  const [form, setForm] = useState({
    status: asset.status,
    warranty_expiry: asset.warranty_expiry,
    assigned_to: asset.assigned_to,
    description: asset.description,
  });
  const [location, setLocation] = useState({
    latitude: Number(asset.latitude),
    longitude: Number(asset.longitude),
    address: asset.address,
    suburb: asset.suburb,
    city: asset.city,
    district: asset.district,
    state: asset.state,
    country: asset.country,
  });
  const [images, setImages] = useState([]);
  const [documents, setDocuments] = useState([]);

  if (loading) {
    return <div className="p-6">Loading asset details...</div>;
  }

  if (!asset) {
    return <div className="p-6">Asset not found</div>;
  }

  const imageFiles = files.filter((f) => f.file_type === "image");
  const docFiles = files.filter((f) => f.file_type === "document");
  const loadImageBlob = async (fileId) => {
    const res = await API.get(`assets/files/${fileId}?intent=view`, {
      credentials: "include",
    });

    const blob = await res.blob();
    return URL.createObjectURL(blob);
  };

  useEffect(() => {
    const loadImages = async () => {
      const urls = {};

      for (const img of imageFiles) {
        try {
          const blobUrl = await loadImageBlob(img.file_id);
          urls[img.file_id] = blobUrl;
        } catch (err) {
          console.error("Failed to load image", err);
        }
      }

      setImageUrls(urls);
    };

    if (files.length && imageFiles.length) {
      loadImages();
    }

    return () => {
      // cleanup blob URLs
      Object.values(imageUrls).forEach(URL.revokeObjectURL);
    };
  }, [files]);

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
      console.error("Reverse geocoding failed:", err);
      return { latitude: lat, longitude: lng };
    }
  };
  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const body = {
        status: form.status || "active",
        assigned_to: form.assigned_username || undefined,
        warranty_expiry: form.warranty_expiry || undefined,
        description: form.description || undefined,
        latitude: location.latitude || undefined,
        longitude: location.longitude || undefined,
        address: location.address || undefined,
        suburb: location.suburb || undefined,
        city: location.city || undefined,
        district: location.district || undefined,
        state: location.state || undefined,
        country: location.country || undefined,
      };

      await API.patch(`/assets/${asset.public_id}`, body);
      Swal.fire({
        title: "Asset details updated successfully",
        text: `Asset ID is : ${asset.public_id}`,
        icon: "success",
      });
      nav(`/assets/${asset.public_id}`);
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
  return (
    <div className="max-w-full bg-white p-6 rounded shadow">
      <h2 className="text-2xl mb-4 font-bold text-orange-600">Create Asset</h2>

      <form
        onSubmit={submit}
        className="grid grid-cols-1 md:grid-cols-2 gap-3 space-y-3"
      >
        <div className="col-span-2 flex flex-col">
          <label className="text-sm font-semibold text-gray-600 mb-1">
            Asset name:
          </label>
          <input
            className="border p-2 rounded"
            placeholder="Asset Name"
            value={asset.asset_name}
            required
            disabled
          />
        </div>

        <div className="col-span-2 flex flex-col">
          <label className="text-sm font-semibold text-gray-600 mb-1">
            Category:
          </label>
          <input
            className="border p-2 rounded"
            placeholder="Asset Name"
            value={asset.category_name}
            required
          />
        </div>

        <div className="col-span-2 flex flex-col">
          <label className="text-sm font-semibold text-gray-600 mb-1">
            Subcategory:
          </label>
          <input
            className="border p-2 rounded"
            placeholder="Asset Name"
            value={asset.subcategory_name}
            required
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-semibold text-gray-600 mb-1">
            Model number:
          </label>
          <input
            className="border p-2 rounded"
            placeholder="Model Number"
            value={asset.model_number}
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-semibold text-gray-600 mb-1">
            Serial number:
          </label>
          <input
            className="border p-2 rounded"
            placeholder="Serial Number"
            value={asset.serial_number}
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-semibold text-gray-600 mb-1">
            Purchase date:
          </label>
          <input
            type="date"
            className={`border p-2 rounded ${
              form.vendor === "" ? "text-gray-400" : "text-black"
            } focus:ring focus:ring-blue-200`}
            value={asset.purchase_date}
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-semibold text-gray-600 mb-1">
            Purchase cost:
          </label>
          <input
            type="number"
            className="border p-2 rounded"
            placeholder="Purchase Cost"
            value={asset.purchase_cost}
          />
        </div>

        {/* <div className="flex flex-col">
          <label className="text-sm font-semibold text-gray-600 mb-1">
            Vendor:
          </label>
          <input
            className="border p-2 rounded"
            placeholder="Vendor"
            value={asset.vendor_name}
          />
        </div> */}

        <div className="flex flex-col">
          <label className="text-sm font-semibold text-gray-600 mb-1">
            Warranty expiry:
          </label>
          <input
            type="date"
            className={`border p-2 rounded ${
              form.warranty_expiry === "" ? "text-gray-400" : "text-black"
            } focus:ring focus:ring-blue-200`}
            value={form.warranty_expiry}
            onChange={(e) => handleChange("warranty_expiry", e.target.value)}
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-semibold text-gray-600 mb-1">
            Assigned User ID:
          </label>
          <input
            className="border p-2 rounded"
            placeholder="Assigned User ID"
            value={form.assigned_to}
            onChange={(e) => handleChange("assigned_to", e.target.value)}
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-semibold text-gray-600 mb-1">
            Asset status:
          </label>
          <select
            className="border p-2 rounded"
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
          className="col-span-2 border border-blue-600 text-blue-600 p-2 rounded flex justify-center items-center"
        >
          <FaLocationDot size={22} />{" "}
          <span className="ml-1">Select location on Map</span>
        </div>
        {location.latitude && location.longitude && (
          <div className="col-span-2 text-sm text-gray-600">
            <p>
              Selected: {location.latitude.toFixed(5)},{" "}
              {location.longitude.toFixed(5)}
            </p>
            <p>Address: {location.address}</p>
          </div>
        )}
        {showMap && (
          <div className="col-span-2">
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
          className="border p-2 rounded col-span-2"
          placeholder="Description"
          value={form.description}
          onChange={(e) => handleChange("description", e.target.value)}
        />

        {imageFiles.length > 0 && (
          <div>
            <h2 className="text-lg font-medium mb-2">Asset Images</h2>
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
                    className="h-40 w-full object-cover"
                  />
                  <div className="flex justify-between items-center p-2 text-xs">
                    <span className="truncate">{img.original_name}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteFile(img.file_id);
                      }}
                      className="text-red-600"
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
          <div>
            <h2 className="text-lg font-medium mb-2">Documents</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {docFiles.map((doc) => (
                <div
                  key={doc.file_id}
                  className="border rounded p-4 flex flex-col items-center gap-2 cursor-pointer hover:bg-gray-50"
                  onClick={() => previewFile(doc.file_id)}
                >
                  <FiFileText size={32} className="text-red-600" />
                  <span className="text-xs text-center break-all">
                    {doc.original_name}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteFile(doc.file_id);
                    }}
                    className="text-xs flex items-center gap-1 text-red-600"
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
