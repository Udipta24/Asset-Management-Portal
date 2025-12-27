import React, { useState } from "react";
import API from "../api/api";

export default function FileUpload({ assetId, onUploaded }) {
  const [file, setFile] = useState(null);
  const [docType, setDocType] = useState("manual");

  const submit = async (e) => {
    e.preventDefault();
    if (!file) return alert("Choose file");
    //prevents empty upload
    const fd = new FormData(); //as normal json cannot send files, multipart/form-data request created
    fd.append("file", file);
    //we sent files in request
    //"filename" must match backend field name,
    // example--multer.single("filename") ,file is a browser file object
    fd.append("document_type", docType);
    //it takes document type we want manual, receipt, .. can be used for sorting

    try {
      await API.post(`/documents/${assetId}`, fd, { headers: { "Content-Type": "multipart/form-data" }});
      //we send axios post request, browser builds multipart body,
      //backend parses, multer does
      alert("Uploaded");
      setFile(null);
      //clears the selected file which we choosed in input file, which triggers an re render
      onUploaded && onUploaded();  //if function exist then call it, here it loads the details about files, bascially refreshes the component,
      //as load , we put new data in setAsset which changes asset state, so re render.
    } catch (err) {
        console.error(err);
      alert("Upload failed");
    }
  };

  return (
    <form
      onSubmit={submit}
      className="flex flex-col md:flex-row md:items-end gap-4 w-full"
    >

      {/* Document Type */}
      <div className="flex flex-col w-full md:w-40">
        <label className="text-sm font-medium text-gray-600 mb-1">
          Document Type
        </label>



        <select
          value={docType}
          onChange={(e) => setDocType(e.target.value)}
          className="border p-2 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500"
        >
          <option value="manual">Manual</option>
          <option value="receipt">Receipt</option>
          <option value="warranty">Warranty</option>
        </select>
      </div>



      {/* File Input */}
      <div className="flex flex-col flex-1 min-w-0">
        <label className="text-sm font-medium text-gray-600 mb-1">Choose File</label>

        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          className="border p-2 rounded-lg bg-gray-50 w-full min-w-0"
        />
      </div>

      {/* Upload Button */}
      <div className="w-full md:w-auto flex-shrink-0">
        <button
          className="bg-blue-600 text-white px-5 py-2 rounded-lg w-full md:w-auto shadow hover:bg-blue-700"
        >
          Upload
        </button>
      </div>

    </form>



  );
}
{/*files[0] if u choose many files from a list of files only 1 selected
  <input type="file" multiple /> later
*/}
// ❌ min-w-0 is missing in the RIGHT place
// ❌ The file input is naturally wide and pushes outside the container
// ❌ The button has w-auto, so when the container shrinks, it overflows


// ✅ The REAL FIX: Wrap the whole upload form in a full-width container

// We must apply responsive layout to the outer box, not just the form.

// Here is the 100% correct version that WILL fix the issue






//button default type inside form is submit


{/* <input type="file" multiple />
backend
upload.array("files", 10) // accept up to 10 files

fd.append("files", file1);
fd.append("files", file2);
fd.append("files", file3); */}
