// src/controllers/assetController.js
const db = require("../config/db");

// create asset
async function upsertCategory(client, category_name) {
  if (!category_name) return null;
  // try insert with on conflict return id, otherwise select
  const insert = await client.query(
    `INSERT INTO asset_categories (category_name)
     VALUES ($1)
     ON CONFLICT (category_name) DO UPDATE SET category_name = EXCLUDED.category_name
     RETURNING category_id`,
    [category_name]
  );
  return insert.rows[0].category_id;
}

async function upsertSubcategory(client, category_id, subcategory_name) {
  if (!subcategory_name) return null;
  // Requires composite unique (category_id, subcategory_name)
  const insert = await client.query(
    `INSERT INTO sub_categories (category_id, subcategory_name)
     VALUES ($1,$2)
     ON CONFLICT (category_id, subcategory_name) DO UPDATE SET subcategory_name = EXCLUDED.subcategory_name
     RETURNING subcategory_id`,
    [category_id, subcategory_name]
  );
  return insert.rows[0].subcategory_id;
}

async function upsertVendor(client, vendor_name) {
  if (!vendor_name) return null;
  const insert = await client.query(
    `INSERT INTO vendors (vendor_name)
     VALUES ($1)
     ON CONFLICT (vendor_name) DO UPDATE SET vendor_name = EXCLUDED.vendor_name
     RETURNING vendor_id`,
    [vendor_name]
  );
  return insert.rows[0].vendor_id;
}

async function upsertLocation(client, location_name) {
  if (!location_name) return null;
  const insert = await client.query(
    `INSERT INTO locations (location_name)
     VALUES ($1)
     ON CONFLICT (location_name) DO UPDATE SET location_name = EXCLUDED.location_name
     RETURNING location_id`,
    [location_name]
  );
  return insert.rows[0].location_id;
}

exports.createAsset = async (req, res, next) => {
  const client = await db.pool.connect();
  try {
    const {
      asset_name,
      // accept names from frontend (not internal ids)
      category_name,
      subcategory_name,
      vendor_name,
      location_name,
      assigned_username,   // optional: full_name of user
      serial_number,
      model_number,
      purchase_date,
      purchase_cost,
      warranty_expiry,
      status,
      description
    } = req.body;

    if (!asset_name) {
      return res.status(400).json({ message: "asset_name is required" });
    }

    await client.query("BEGIN");

    // upsert category -> get category_id or null
    const category_id = category_name ? await upsertCategory(client, category_name) : null;

    // upsert subcategory (if provided) under resolved category_id
    const subcategory_id = subcategory_name
      ? await upsertSubcategory(client, category_id, subcategory_name)
      : null;

    // upsert vendor
    const vendor_id = vendor_name ? await upsertVendor(client, vendor_name) : null;

    // upsert location
    const current_location_id = location_name ? await upsertLocation(client, location_name) : null;

    // resolve assigned_to by username (full_name) if provided
    let assigned_to = null;
    if (assigned_username) {
      const u = await client.query(`SELECT user_id FROM users WHERE full_name = $1`, [assigned_username]);
      if (u.rows.length === 0) {
        // optional: create user automatically? here we reject to keep things explicit
        await client.query("ROLLBACK");
        return res.status(400).json({ message: `assigned_username '${assigned_username}' not found` });
      }
      assigned_to = u.rows[0].user_id;
    }

    const q = await client.query(
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

    await client.query("COMMIT");
    res.status(201).json(q.rows[0]);
  } catch (err) {
    await client.query("ROLLBACK").catch(() => {});
    next(err);
  } finally {
    client.release();
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
