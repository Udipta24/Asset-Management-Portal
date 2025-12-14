// internal modules
const assetModel = require("../models/assetModel");

exports.create = async (req, res, next) => {
  try {
    // Destructure assigned_to and description as optional (default to null if not provided)
    const {
      asset_name,
      category,
      subcategory,
      serial_number,
      model_number,
      purchase_date,
      purchase_cost,
      vendor,
      status,
      location,
      assigned_to = null,
      warranty_expiry,
      description = null
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

    // Prepare payload, passing assigned_to and description (possibly as null)
    const latitude = location?.latitude;
    const longitude = location?.longitude;

    const payload = {
      asset_name,
      category,
      subcategory,
      serial_number,
      model_number,
      purchase_date,
      purchase_cost,
      vendor,
      status,
      latitude,
      longitude,
      assigned_to,
      warranty_expiry,
      description,
    };
    
    const asset = await assetModel.createAsset(payload);
    res.status(201).json(asset);
  } catch (err) {
    next(err);
  }
};

exports.list = async (req, res, next) => {
  try {
    const filters = {
      category: req.query.category,
      subcategory: req.query.subcategory,
      assigned_to: req.query.assigned_to,
      purchase_date_from: req.query.purchase_date_from,
      purchase_date_to: req.query.purchase_date_to,
      vendor: req.query.vendor,
      status: req.query.status,
      model_number: req.query.model_number,
      search: req.query.search,
      sort_by: req.query.sort_by,
      sort_direction: req.query.sort_direction,
      warranty_expiry_status: req.query.warranty_expiry_status,
      warranty_expiry_from: req.query.warranty_expiry_from,
      warranty_expiry_to: req.query.warranty_expiry_to,
    };
    const assets = await assetModel.listAssets(filters);
    res.json(assets);
  } catch (err) {
    next(err);
  }
};

exports.getOne = async (req, res, next) => {
  try {
    const asset = await assetModel.getAssetById(req.params.id);
    if (!asset) return res.status(404).json({ error: "Asset not found" });
    res.json(asset);
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const updated = await assetModel.updateAsset(req.params.id, req.body);
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

exports.remove = async (req, res, next) => {
  try {
    await assetModel.deleteAsset(req.params.id);
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
};
