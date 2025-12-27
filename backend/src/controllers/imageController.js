// internal modules
const assetModel = require("../models/assetModel");
const { supabase } = require("../config/supabaseClient");

// Helper function to upload image file
async function uploadImage(file, asset_id, public_id) {
  const bucket = "asset-images";
  const filePath = `${public_id}/${file.originalname}`;

  const { error } = await supabase.storage
    .from(bucket)
    .upload(filePath, file.buffer, {
      contentType: file.mimetype,
    });

  if (error) throw error;

  await assetModel.saveAssetFileMeta({
    asset_id,
    public_id,
    bucket,
    file_path: filePath,
    file_type: "image",
    mime_type: file.mimetype,
    original_name: file.originalname,
  });
}

// Upload image(s) for an asset
exports.upload = async (req, res, next) => {
  try {
    const { assetId } = req.params;
    
    // Get asset to verify it exists and check permissions
    const asset = await assetModel.getAssetById(assetId);
    if (!asset) {
      return res.status(404).json({ error: "Asset not found" });
    }

    // Check department access for ASSET_MANAGER
    const userRole = req.user.role.toUpperCase();
    if (userRole === "ASSET_MANAGER") {
      const assetDepartmentId = asset.asset_department_id;
      if (!assetDepartmentId || assetDepartmentId !== req.user.department_id) {
        return res.status(403).json({
          error: "Access denied: Cannot upload images to assets outside your department",
        });
      }
    }

    if (!req.files || !req.files.length) {
      return res.status(400).json({ error: "No image files provided" });
    }

    const { asset_id, public_id } = asset;

    for (const file of req.files) {
      if (!file.mimetype.startsWith("image/")) {
        return res.status(400).json({ error: "Only image files are allowed" });
      }
      await uploadImage(file, asset_id, public_id);
    }

    res.status(201).json({ message: "Images uploaded successfully" });
  } catch (err) {
    next(err);
  }
};

// Get image preview (signed URL)
exports.getPreview = async (req, res, next) => {
  try {
    const { fileId } = req.params;

    const file = await assetModel.getFilesByFileId(fileId);
    if (!file || file.file_type !== "image") {
      return res.status(404).json({ error: "Image not found" });
    }

    const { data, error } = await supabase.storage
      .from(file.bucket)
      .createSignedUrl(file.file_path, 60); // 60 seconds

    if (error) throw error;

    res.json({ previewUrl: data.signedUrl });
  } catch (err) {
    next(err);
  }
};

// Download/view image
exports.getImage = async (req, res, next) => {
  try {
    const { fileId } = req.params;
    const userRole = req.user.role.toUpperCase();
    const purpose = req.query.intent || "view"; // "download" or "view"

    const file = await assetModel.getFilesByFileId(fileId);
    if (!file || file.file_type !== "image") {
      return res.status(404).json({ error: "Image not found" });
    }

    // Role-based access control
    if (userRole !== "ADMIN") {
      const assetDepartmentId = await assetModel.getAssetDepartmentId(file.asset_id);
      if (assetDepartmentId !== null && assetDepartmentId !== req.user.department_id) {
        return res.status(403).json({
          error: "Access denied: Cannot access images from assets outside your department",
        });
      }
    }

    // Retrieve the file from Supabase storage
    const { data, error } = await supabase.storage
      .from(file.bucket)
      .download(file.file_path);

    if (error || !data) {
      return res.status(500).json({ error: "Failed to retrieve image." });
    }

    // Set headers
    if (purpose === "download") {
      res.setHeader("Content-Disposition", `attachment; filename="${file.original_name}"`);
    } else {
      res.setHeader("Content-Disposition", "inline");
    }
    res.setHeader("Content-Type", file.mime_type);

    // Pipe the readable stream or buffer to the response
    if (typeof data.pipe === 'function') {
      data.pipe(res);
    } else {
      res.end(Buffer.from(await data.arrayBuffer()));
    }
  } catch (err) {
    next(err);
  }
};

// Delete image
exports.delete = async (req, res, next) => {
  try {
    const { fileId } = req.params;
    const userRole = req.user.role.toUpperCase();

    const file = await assetModel.getFilesByFileId(fileId);
    if (!file || file.file_type !== "image") {
      return res.status(404).json({ error: "Image not found" });
    }

    // Role-based access control - only ADMIN and ASSET_MANAGER can delete
    if (userRole === "ASSET_MANAGER") {
      const assetDepartmentId = await assetModel.getAssetDepartmentId(file.asset_id);
      if (!assetDepartmentId || assetDepartmentId !== req.user.department_id) {
        return res.status(403).json({
          error: "Access denied: Cannot delete images from assets outside your department",
        });
      }
    }

    const { error } = await supabase.storage
      .from(file.bucket)
      .remove([file.file_path]);

    if (error) throw error;

    await assetModel.deleteAssetFileMeta(fileId);

    res.json({ message: "Image deleted successfully" });
  } catch (err) {
    next(err);
  }
};

