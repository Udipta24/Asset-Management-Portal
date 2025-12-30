import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/api";
import { FiEdit, FiDownload, FiFileText } from "react-icons/fi";

function Detail({ label, value }) {
  return (
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="font-medium">{value || "—"}</p>
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
  const downloadFile = (fileId) => {
    window.location.href = `${url}/files/${fileId}?intent=download`;
  };

  
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">
          Asset ID: <span className="font-mono">{asset.public_id}</span>
        </h1>
        <button
          onClick={() => navigate(`/assets/${asset.public_id}/edit`)}
          className="flex items-center gap-2 border px-4 py-2 rounded text-orange-600 border-orange-400 hover:bg-orange-50"
        >
          <FiEdit /> Edit Details
        </button>
      </div>

      {/* Images */}
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
                      downloadFile(img.file_id);
                    }}
                    className="text-blue-600"
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border rounded p-4">
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
        <Detail
          label="Location"
          value={asset.address}
        />
        <div className="rounded overflow-hidden border col-span-2">
          <MapContainer
            center={[Number(asset.latitude), Number(asset.longitude)]}
            zoom={15}
            className="h-full w-full rounded"
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <Marker position={[Number(asset.latitude), Number(asset.longitude)]} icon={defaultIcon}>
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
                    downloadFile(doc.file_id);
                  }}
                  className="text-xs flex items-center gap-1 text-blue-600"
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
