// src/controllers/assetController.js
const db = require("../config/db");

// create asset
exports.createAsset = async (req, res, next) => {
  try {
    const {
      asset_name,
      category_id,
      subcategory_id,
      serial_number,
      model_number,
      purchase_date,
      purchase_cost,
      vendor_id,
      warranty_expiry,
      status,
      current_location_id,
      assigned_to,
      description
    } = req.body;

    const q = await db.query(
      `INSERT INTO assets (
        asset_name, category_id, subcategory_id, serial_number, model_number,
        purchase_date, purchase_cost, vendor_id, warranty_expiry, status,
        current_location_id, assigned_to, description
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
      RETURNING *`,
      [
        asset_name,
        category_id || null,
        subcategory_id || null,
        serial_number || null,
        model_number || null,
        purchase_date || null,
        purchase_cost || null,
        vendor_id || null,
        warranty_expiry || null,
        status || "active",
        current_location_id || null,
        assigned_to || null,
        description || null
      ]
    );

    res.status(201).json(q.rows[0]);
  } catch (err) {
    next(err);
  }
};


exports.listAssets = async (req, res, next) => {
  try {
    // basic list with optional search + pagination
    const { q: search, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;
    let base = `SELECT * FROM assets`;
    const params = [];
    if (search) {
      base += ` WHERE LOWER(asset_name) LIKE $1 OR LOWER(serial_number) LIKE $1`;
      params.push(`%${search.toLowerCase()}%`);
    }
    base += ` ORDER BY created_at DESC LIMIT $${params.length+1} OFFSET $${params.length+2}`;
    params.push(limit, offset);
    const result = await db.query(base, params);
    res.json(result.rows);
  } catch (err) { next(err); }
};

exports.getAsset = async (req, res, next) => {
  try {
    const { id } = req.params;
    const q = await db.query(`SELECT * FROM assets WHERE asset_id=$1`, [id]);
    if (!q.rows.length) return res.status(404).json({ message: "Asset not found" });
    res.json(q.rows[0]);
  } catch (err) { next(err); }
};
