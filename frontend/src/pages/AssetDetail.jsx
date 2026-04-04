import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/api";
import { FiEdit, FiDownload, FiFileText } from "react-icons/fi";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "../config/leafletConfig";

function Detail({ label, value }) {
  return (
    <div>
      <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
      <p className="font-medium text-slate-800 dark:text-slate-100">
        {value || "—"}
      </p>
    </div>
  );
}

export default function AssetDetail() {
  const url = import.meta.env.VITE_API_URL;
  const { id } = useParams(); // public_id
  const navigate = useNavigate();

  const [asset, setAsset] = useState(null);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imageUrls, setImageUrls] = useState({});

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
  console.log(asset);

  const imageFiles = files.filter((f) => f.file_type === "image");
  const docFiles = files.filter((f) => f.file_type === "document");
  const loadImageBlob = async (fileId) => {
    const res = await API.get(`assets/files/${fileId}?intent=view`, {
      credentials: "include",
      responseType: "blob",
    });

    return URL.createObjectURL(res.data);
  };

  useEffect(() => {
    let urls = {};
    const loadImages = async () => {

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

    if (imageFiles.length) {
      loadImages();
    }

    return () => {
      // cleanup blob URLs
      Object.values(urls).forEach(URL.revokeObjectURL);
    };
  }, [files]);

  const previewFile = (fileId) => {
    window.open(
      `${url}/assets/files/${fileId}?intent=view`,
      "_blank",
      "noopener,noreferrer"
    );
  };
  const downloadFile = (fileId) => {
    window.location.href = `${url}/assets/files/${fileId}?intent=download`;
  };

  if (loading) {
    return <div className="p-6">Loading asset details...</div>;
  }

  if (!asset) {
    return <div className="p-6">Asset not found</div>;
  }
  return (
    <div
      className="max-w-full p-6 rounded-2xl space-y-4
  bg-white dark:bg-slate-900
  border border-slate-200 dark:border-white/10
  shadow-sm"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-slate-800 dark:text-slate-100">
          Asset ID:
          <span className="ml-2 font-mono text-blue-600 dark:text-cyan-400">
            {asset.public_id}
          </span>
        </h1>

        <button
          onClick={() => navigate(`/assets/${asset.public_id}/edit`)}
          className="
        flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition
        border border-slate-300 text-slate-700
        hover:bg-slate-100

        dark:border-white/10 dark:text-slate-300
        dark:hover:bg-slate-800
      "
        >
          <FiEdit /> Edit Details
        </button>
      </div>

      {/* Images */}
      {imageFiles.length > 0 && (
        <div>
          <h2 className="text-lg font-medium text-slate-800 dark:text-slate-100 mb-2">
            Asset Images
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {imageFiles.map((img) => (
              <div
                key={img.file_id}
                onClick={() => previewFile(img.file_id)}
                className="
            border border-slate-200 dark:border-white/10
            rounded-xl overflow-hidden cursor-pointer
            transition hover:shadow-md hover:-translate-y-0.5
          "
              >
                <img
                  src={imageUrls[img.file_id]}
                  alt={img.original_name}
                  className="h-40 w-full object-cover"
                />

                <div
                  className="
              flex justify-between items-center p-2 text-xs
              bg-slate-50 dark:bg-slate-800
              text-slate-600 dark:text-slate-300
            "
                >
                  <span className="truncate">{img.original_name}</span>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      downloadFile(img.file_id);
                    }}
                    className="
                p-1 rounded transition
                text-blue-600 hover:bg-blue-100

                dark:text-cyan-400
                dark:hover:bg-cyan-500/10
              "
                  >
                    <FiDownload />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Asset Details */}
      <div
        className="
    grid grid-cols-1 md:grid-cols-2 gap-6
    border border-slate-200 dark:border-white/10
    rounded-xl p-4
  "
      >
        <Detail label="Asset Name" value={asset.asset_name} />
        <Detail label="Category" value={asset.category_name} />
        <Detail label="Subcategory" value={asset.subcategory_name} />
        <Detail label="Model Number" value={asset.model_number} />
        <Detail label="Serial Number" value={asset.serial_number} />
        <Detail label="Vendor" value={asset.vendor_name} />
        <Detail label="Purchase Date" value={asset.purchase_date} />
        <Detail label="Purchase Cost" value={asset.purchase_cost} />
        <Detail label="Status" value={asset.status} />
        <Detail
          label="Assigned To"
          value={asset.assigned_to || "Not Assigned"}
        />
        <Detail label="Warranty Expiry" value={asset.warranty_expiry} />
        <Detail label="Location" value={asset.address} />

        <div className="col-span-2 rounded-xl overflow-hidden border border-slate-200 dark:border-white/10">
          <MapContainer
            center={[Number(asset.latitude), Number(asset.longitude)]}
            zoom={15}
            className="h-80 w-full"
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Marker
              position={[Number(asset.latitude), Number(asset.longitude)]}
            >
              <Popup>
                {asset.public_id}
                <br />
                Lat: {asset.latitude}, Lng: {asset.longitude}
              </Popup>
            </Marker>
          </MapContainer>
        </div>
      </div>

      {/* Documents */}
      {docFiles.length > 0 && (
        <div>
          <h2 className="text-lg font-medium text-slate-800 dark:text-slate-100 mb-2">
            Documents
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {docFiles.map((doc) => (
              <div
                key={doc.file_id}
                onClick={() => previewFile(doc.file_id)}
                className="
            border border-slate-200 dark:border-white/10
            rounded-xl p-4
            flex flex-col items-center gap-2
            cursor-pointer transition
            hover:bg-slate-50 dark:hover:bg-slate-800
          "
              >
                <FiFileText
                  size={32}
                  className="text-red-600 dark:text-red-400"
                />

                <span className="text-xs text-center break-all text-slate-700 dark:text-slate-300">
                  {doc.original_name}
                </span>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    downloadFile(doc.file_id);
                  }}
                  className="
              text-xs flex items-center gap-1 transition
              text-blue-600 hover:underline

              dark:text-cyan-400
            "
                >
                  <FiDownload /> Download
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
