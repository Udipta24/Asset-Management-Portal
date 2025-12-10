import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api/api";
import FileUpload from "../components/FileUpload";

export default function AssetDetail(){
  const { id } = useParams();
  const [asset, setAsset] = useState(null);

  const load = async () => {
    try {
      const res = await API.get(`/assets/${id}`);
      setAsset(res.data);
    } catch (err) {
        console.error(err);
      alert("Failed to load");
    }
  };

  //useEffect(()=>{ load(); }, [id]);
  //above react thinks synchronous

  useEffect(() => {
    async function fetchAsset() {
        try {
        const res = await API.get(`/assets/${id}`);
        setAsset(res.data);
        } catch (err) {
        console.error(err);
        alert("Failed to load");
        }
    }

    fetchAsset();
    }, [id]);


  if (!asset) return <div>Loading...</div>;

  return (
    <div className="bg-white p-6 rounded shadow">
      <h2 className="text-xl">{asset.asset_name}</h2>
      <div className="mt-3">
        <div><strong>Model:</strong> {asset.model_number || "-"}</div>
        <div><strong>Serial:</strong> {asset.serial_number || "-"}</div>
        <div><strong>Status:</strong> {asset.status}</div>
      </div>

      <div className="mt-6">
        <h3 className="font-semibold mb-2">Upload document</h3>
        <FileUpload assetId={asset.asset_id} onUploaded={load} />
      </div>
    </div>
  );
}
