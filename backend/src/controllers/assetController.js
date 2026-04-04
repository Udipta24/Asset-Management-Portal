// internal modules
const assetModel = require("../models/assetModel");
const { supabase } = require("../config/supabaseClient");

async function uploadFile(file, asset_id, public_id) {
  const isImage = file.mimetype.startsWith("image/");
  const bucket = isImage ? "asset-images" : "asset-documents";

  const filePath = `${public_id}/${Date.now()}-${file.originalname}`;

  const { error } = await supabase.storage
    .from(bucket)
    .upload(filePath, file.buffer, {
      contentType: file.mimetype,
    });
  
  if (error) {
    throw error;
  }

  await assetModel.saveAssetFileMeta({
    asset_id,
    public_id,
    bucket,
    file_path: filePath,
    file_type: isImage ? "image" : "document",
    mime_type: file.mimetype,
    original_name: file.originalname,
  });
}

exports.create = async (req, res, next) => {
  try {
    // Destructure assigned_to and description as optional (default to null if not provided)
    const {
      asset_name,
      category, // id
      subcategory, // id
      serial_number,
      model_number,
      purchase_date,
      purchase_cost,
      vendor, // id
      status,
      location,
      assigned_to = "NOT ASSIGNED",
      warranty_expiry,
      description = "NO DESCRIPTION",
    } = req.body;

    // Only check required fields
    if (
      !asset_name ||
      !category ||
      !subcategory ||
      !serial_number ||
      !model_number ||
      !purchase_date ||
      !purchase_cost ||
      !vendor ||
      !status ||
      !location ||
      !warranty_expiry
    ) {
      return res.status(400).json({ error: "Missing required asset details" });
    }

    // Check if assigned_to user exists (by public_id)
    if (assigned_to != "NOT ASSIGNED") {
      const userModel = require("../models/userModel");
      const assignedUser = await userModel.getUserByPublicId(assigned_to);
      if (!assignedUser) {
        return res.status(400).json({ error: "Assigned user does not exist" });
      }
    }

    // Prepare payload, passing assigned_to and description (possibly as null)
    const parsedLocation =
      typeof location === "string" ? JSON.parse(location) : location;
    const payload = {
      asset_name,
      category,
      subcategory,
      serial_number,
      model_number,
      purchase_date: purchase_date || null,
      purchase_cost: purchase_cost || null,
      vendor,
      status,
      location: parsedLocation,
      assigned_to,
      warranty_expiry: warranty_expiry || null,
      description,
    };

    const asset = await assetModel.createAsset(payload);
    const { asset_id, public_id } = asset;
    if ((req.files.images?.length || 0) > 5) {
      throw new Error("Maximum 5 images allowed");
    }
    if ((req.files.documents?.length || 0) > 5) {
      throw new Error("Maximum 5 documents allowed");
    }

    // Handle images
    if (req.files?.images?.length) {
      for (const file of req.files.images) {
        await uploadFile(file, asset_id, public_id);
      }
    }

    // Handle documents
    if (req.files?.documents?.length) {
      for (const file of req.files.documents) {
        await uploadFile(file, asset_id, public_id);
      }
    }

    res.status(201).json({
      message: "Asset created successfully",
      asset,
    });
  } catch (err) {
    next(err);
  }
};

exports.list = async (req, res, next) => {
  try {
    const filters = {
      search: req.query.search,
      category: req.query.category, // id
      subcategory: req.query.subcategory, // id
      vendor: req.query.vendor, // id array
      status: req.query.status,
      warranty_expiry_status: req.query.warranty_expiry_status,
      warranty_expiry_from: req.query.warranty_expiry_from,
      warranty_expiry_to: req.query.warranty_expiry_to,
      sort_by: req.query.sort_by,
      sort_direction: req.query.sort_direction,
      purchase_date_from: req.query.purchase_date_from,
      purchase_date_to: req.query.purchase_date_to,
      assigned_to: req.query.assigned_to,
      limit: req.query.limit,
    };

    // ASSET_MANAGER and USER can see assets from their department AND unassigned assets
    // ADMIN sees all assets (no department filter)
    const userRole = req.user.role.toUpperCase();
    if (
      (userRole === "ASSET MANAGER" || userRole === "USER") &&
      req.user.department_id &&
      req.query.assigned_to != "NOT ASSIGNED"
    ) {
      filters.department_id = req.user.department_id;
    }

    const assets = await assetModel.listAssets(filters);
    res.json(assets);
  } catch (err) {
    next(err);
  }
};

exports.getOne = async (req, res, next) => {
  try {
    const { public_id } = req.params;
    // console.log("param:", req.params);
    // console.log("type:", typeof req.params.public_id);
    const asset = await assetModel.getAssetById(public_id);
    if (!asset) return res.status(404).json({ error: "Asset not found" });
    const { asset_id } = asset;
    const files = await assetModel.getFilesByAssetId(asset_id);
    if (!files)
      return res.status(404).json({ error: "Failed to fetch asset files" });
    // ASSET_MANAGER and USER can access assets from their department AND unassigned assets
    const userRole = req.user.role.toUpperCase();
    if (userRole === "ASSET_MANAGER" || userRole === "USER") {
      const assetDepartmentId = asset.asset_department_id;
      // Allow access if asset is unassigned (null department) OR belongs to user's department
      // Block if asset belongs to a different department
      if (
        assetDepartmentId !== null &&
        assetDepartmentId !== req.user.department_id
      ) {
        return res.status(403).json({
          error: "Access denied: Asset belongs to a different department",
        });
      }
    }

    // res.json(asset);
    res.json({
      asset,
      files,
    });
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    // ASSET_MANAGER can only update assets from their department (not unassigned assets)
    if (req.user.role.toUpperCase() === "ASSET_MANAGER") {
      const assetDepartmentId = await assetModel.getAssetDepartmentId(
        req.params.id
      );
      // Block if asset is unassigned (null) OR belongs to different department
      if (!assetDepartmentId || assetDepartmentId !== req.user.department_id) {
        return res.status(403).json({
          error:
            "Access denied: Cannot update unassigned assets or assets from other departments",
        });
      }
    }
    const { public_id } = req.params;
    if (req.body.location) {
      try {
        req.body.location =
          typeof req.body.location === "string"
            ? JSON.parse(req.body.location)
            : req.body.location;
      } catch (e) {
        return res.status(400).json({
          error: "Invalid location format",
        });
      }
    }

    const updated = await assetModel.updateAsset(public_id, req.body);

    const { asset_id } = updated;
    if ((req.files.images?.length || 0) > 5) {
      throw new Error("Maximum 5 images allowed");
    }
    if ((req.files.documents?.length || 0) > 5) {
      throw new Error("Maximum 5 documents allowed");
    }

    // Handle images
    if (req.files?.images?.length) {
      for (const file of req.files.images) {
        await uploadFile(file, asset_id, public_id);
      }
    }

    // Handle documents
    if (req.files?.documents?.length) {
      for (const file of req.files.documents) {
        await uploadFile(file, asset_id, public_id);
      }
    }

    res.json(updated);
  } catch (err) {
    next(err);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const { public_id } = req.params.id;

    // ASSET_MANAGER can only delete assets from their department (not unassigned assets)
    if (req.user.role.toUpperCase() === "ASSET_MANAGER") {
      const assetDepartmentId = await assetModel.getAssetDepartmentId(
        public_id
      );
      // Block if asset is unassigned (null) OR belongs to different department
      if (!assetDepartmentId || assetDepartmentId !== req.user.department_id) {
        return res.status(403).json({
          error:
            "Access denied: Cannot delete unassigned assets or assets from other departments",
        });
      }
    }
    const { asset_id } = assetModel.getId(public_id);
    const files = await assetModel.getFilesByAssetId(asset_id);

    for (const file of files) {
      const { error } = await supabase.storage
        .from(file.bucket)
        .remove([file.file_path]);

      if (error) {
        throw new Error(`Failed to delete file: ${file.file_path}`);
      }
    }
    await assetModel.deleteAsset(asset_id);
    res.json({ success: true, message: "Asset deleted successfully" });
  } catch (err) {
    next(err);
  }
};

exports.getAssetFile = async (req, res, next) => {
  try {
    const { fileId } = req.params;
    const intent = req.query.intent || "view"; // view | download
    const isDownload = intent === "download";
    const userRole = req.user.role.toUpperCase();
    // Get file metadata by fileId
    const file = await assetModel.getFilesByFileId(fileId);
    if (!file) {
      return res.status(404).json({ error: "File not found" });
    }

    // Role-based access control for file downloads
    // ADMIN: Can download any file
    // ASSET_MANAGER / USER: Can download files from assets in their department OR unassigned assets
    if (userRole !== "ADMIN") {
      const publicId = await assetModel.getPublicId(file.asset_id);
      const assetDepartmentId = await assetModel.getAssetDepartmentId(
        publicId.public_id
      );
      if (
        assetDepartmentId !== null &&
        assetDepartmentId !== req.user.department_id
      ) {
        return res.status(403).json({
          error:
            "Access denied: Cannot download files from assets outside your department",
        });
      }
    }

    // Retrieve the file from Supabase storage
    const { data, error } = await supabase.storage
      .from(file.bucket)
      .download(file.file_path);

    if (error || !data) {
      return res.status(500).json({ error: "Failed to download file." });
    }

    // Set headers
    res.setHeader(
      "Cache-Control",
      "no-store, no-cache, must-revalidate, proxy-revalidate"
    );
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");

    // Content headers
    res.setHeader("Content-Type", file.mime_type);
    res.setHeader(
      "Content-Disposition",
      isDownload ? `attachment; filename="${file.original_name}"` : "inline"
    );

    // Pipe the readable stream or buffer to the response
    if (typeof data.pipe === "function") {
      data.pipe(res);
    } else {
      // If Supabase returns a Blob or Buffer
      res.end(Buffer.from(await data.arrayBuffer()));
    }
  } catch (err) {
    next(err);
  }
};

exports.deleteAssetFile = async (req, res, next) => {
  try {
    const { fileId } = req.params;

    const file = await assetModel.getFilesByFileId(fileId);
    if (!file) {
      return res.status(404).json({ error: "File not found" });
    }

    const { error } = await supabase.storage
      .from(file.bucket)
      .remove([file.file_path]);

    if (error) {
      console.error("Supabase delete error:", error);
      return res
        .status(500)
        .json({ error: "Failed to delete file from storage" });
    }

    await assetModel.deleteAssetFileMeta(fileId);

    res.json({ message: "File deleted successfully" });
  } catch (err) {
    next(err);
  }
};
