import React, { useState } from "react";
import API from "../api/api";

export default function FileUpload({ assetId, onUploaded }) {
  const [file, setFile] = useState(null);
  const [docType, setDocType] = useState("manual");

  const submit = async (e) => {
    e.preventDefault();
    if (!file) return alert("Choose file");
    const fd = new FormData();
    fd.append("file", file);
    fd.append("document_type", docType);
    try {
      await API.post(`/documents/${assetId}`, fd, { headers: { "Content-Type": "multipart/form-data" }});
      alert("Uploaded");
      setFile(null);
      onUploaded && onUploaded();
    } catch (err) {
        console.error(err);
      alert("Upload failed");
    }
  };

  return (
    <form onSubmit={submit} className="flex gap-2 items-center">
      <select value={docType} onChange={e=>setDocType(e.target.value)} className="border p-2 rounded">
        <option value="manual">Manual</option>
        <option value="receipt">Receipt</option>
        <option value="warranty">Warranty</option>
      </select>
      <input type="file" onChange={e=>setFile(e.target.files[0])} />
      <button className="bg-blue-600 text-white px-3 py-1 rounded">Upload</button>
    </form>
  );
}
