import { useRef } from "react";
import Swal from "sweetalert2";

const UploadFiles = ({ images, documents, setImages, setDocuments }) => {
  const imageRef = useRef(null);
  const docRef = useRef(null);

  const handleImagesChange = (e) => {
    const files = Array.from(e.target.files);

    if (files.length > 5) {
      Swal.fire({
        icon: "warning",
        text: "You can upload a maximum of 5 images",
      });
      return;
    }

    setImages(files);
  };

  const handleDocumentsChange = (e) => {
    const files = Array.from(e.target.files);

    if (files.length > 5) {
      Swal.fire({
        icon: "warning",
        text: "You can upload a maximum of 5 documents",
      });
      return;
    }

    setDocuments(files);
  };

  return (
    <div className="space-y-4">
      {/* Upload Images */}
      <div
        className="border p-2 rounded  bg-white dark:bg-slate-800
             text-black dark:text-white
             border-gray-300 dark:border-slate-700"
      >
        <label className="block text-sm mb-2">
          Upload asset images (max 5)
        </label>

        <button
          type="button"
          onClick={() => imageRef.current.click()}
          className="px-4 py-2 rounded-xl font-semibold transition-all
    bg-blue-600 text-white
    hover:bg-blue-700 hover:shadow-md
    active:scale-95

    dark:bg-cyan-500 dark:text-slate-900
    dark:hover:bg-cyan-400"
        >
          Upload Images
        </button>

        <input
          ref={imageRef}
          type="file"
          accept="image/*"
          multiple
          hidden
          onChange={handleImagesChange}
        />

        {images.length > 0 && (
          <p className="text-sm text-gray-400 mt-1">
            {images.length} image(s) selected
          </p>
        )}
      </div>

      {/* Upload Documents */}
      <div
        className="border p-2 rounded bg-white dark:bg-slate-800
             text-black dark:text-white
             border-gray-300 dark:border-slate-700"
      >
        <label className="block text-sm mb-2">
          Upload asset documents (max 5)
        </label>

        <button
          type="button"
          onClick={() => docRef.current.click()}
          className="px-4 py-2 rounded-xl font-semibold transition-all
    bg-blue-600 text-white
    hover:bg-blue-700 hover:shadow-md
    active:scale-95

    dark:bg-cyan-500 dark:text-slate-900
    dark:hover:bg-cyan-400"
        >
          Upload Documents
        </button>

        <input
          ref={docRef}
          type="file"
          accept="application/pdf"
          multiple
          hidden
          onChange={handleDocumentsChange}
        />

        {documents.length > 0 && (
          <p className="text-sm text-gray-400 mt-1">
            {documents.length} document(s) selected
          </p>
        )}
      </div>
    </div>
  );
};

export default UploadFiles;
