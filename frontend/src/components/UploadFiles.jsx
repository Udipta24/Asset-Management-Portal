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
        text: "You can upload a maximum of 5 images"
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
        text: "You can upload a maximum of 5 documents"
      });
      return;
    }

    setDocuments(files);
  };

  return (
    <div className="space-y-4 col-span-2">
      {/* Upload Images */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Upload asset images (max 5)
        </label>

        <button
          type="button"
          onClick={() => imageRef.current.click()}
          className="px-4 py-2 border rounded bg-gray-100 hover:bg-gray-200"
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
          <p className="text-sm text-gray-600 mt-1">
            {images.length} image(s) selected
          </p>
        )}
      </div>

      {/* Upload Documents */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Upload asset documents (max 5)
        </label>

        <button
          type="button"
          onClick={() => docRef.current.click()}
          className="px-4 py-2 border rounded bg-gray-100 hover:bg-gray-200"
        >
          Upload Documents
        </button>

        <input
          ref={docRef}
          type="file"
          accept=".pdf,.doc,.docx"
          multiple
          hidden
          onChange={handleDocumentsChange}
        />

        {documents.length > 0 && (
          <p className="text-sm text-gray-600 mt-1">
            {documents.length} document(s) selected
          </p>
        )}
      </div>
    </div>
  );
};

export default UploadFiles;
