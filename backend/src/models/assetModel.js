const db = require("../config/db");

async function getCatIdCode(catName) {
  const catRes = await db.query(
    `SELECT category_id, category_code FROM asset_categories WHERE category_name = $1`,
    [catName]
  );
  if (catRes.rowCount === 0) {
    throw new Error("Category not found");
  }
  return catRes.rows[0];
}

async function getSubcatIdCode(subcatName, catId) {
  const subcatRes = await db.query(
    `SELECT subcategory_id, subcategory_code FROM sub_categories WHERE subcategory_name = $1 AND category_id = $2`,
    [subcatName, catId]
  );
  if (subcatRes.rowCount === 0) {
    throw new Error("Subcategory not found");
  }
  return subcatRes.rows[0];
}

exports.createAsset = async (data) => {
  try {
    await db.query("BEGIN");

    // --- Get category (id/code) ---
    const catRes = await getCatIdCode(data.category);
    const { category_id, category_code } = catRes.rows[0];

    // --- Get subcategory (id/code, under same category) ---
    const subcatRes = await getSubcatIdCode(data.subcategory, category_id);
    const { subcategory_id, subcategory_code } = subcatRes.rows[0];

    //--- Get vendor (id) ---
    const vendor_id = await db.query("SELECT vendor_id FROM vendors WHERE vendor_name = $1", [data.vendor]);

    // --- Insert asset, get id ---
    // Basic fields, if more may be present in database, adjust as needed.
    const insertRes = await client.query(
      `INSERT INTO assets (
                asset_name, category_id, subcategory_id, serial_number, model_number,
                purchase_date, purchase_cost, vendor, status, assigned_to,
                warranty_expiry, description
            ) VALUES
            ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
            RETURNING asset_id`,
      [
        data.asset_name,
        category_id,
        subcategory_id,
        data.serial_number,
        data.model_number,
        data.purchase_date,
        data.purchase_cost,
        vendor_id,
        data.status,
        data.assigned_to || "NOT ASSIGNED",
        data.warranty_expiry,
        data.description || "NO DESCRIPTION",
      ]
    );
    const asset_id = insertRes.rows[0].asset_id;
    // Insert into locations table asset_id, latitude, longitude from data, returning location_id
    let location_id = null;
    if (data.location) {
      const {latitude, longitude, suburb, city, district, state, country} = data.location;
      const locRes = await client.query(
        `INSERT INTO locations (asset_id, latitude, longitude, suburb, city, district, state, country)
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                 RETURNING location_id`,
        [asset_id, latitude, longitude, suburb, city, district, state, country]
      );
      location_id = locRes.rows[0].location_id;
    }
    // --- Generate public_id: AST-{category_code}-{subcategory_code}-{000001} ---
    const padded = String(asset_id).padStart(6, "0");
    const public_id = `AST-${category_code}-${subcategory_code}-${padded}`;

    // --- Update asset with public_id ---
    await client.query(
      `UPDATE assets SET public_id = $1, location_id = $2 WHERE asset_id = $3`,
      [public_id, location_id, asset_id]
    );

    await client.query("COMMIT");

    // fetch the full row
    const assetRes = await client.query(
      `SELECT * FROM assets WHERE asset_id = $1`,
      [asset_id]
    );
    return assetRes.rows[0];
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  }
};

exports.listAssets = async (filters = {}) => {
  const {
    category,
    subcategory,
    assigned_to,
    purchase_date_from,
    purchase_date_to,
    vendor,
    status,
    model_number,
    search,
    sort_by,
    sort_direction,
    warranty_expiry_status, // can be 'expired', 'expiring_soon', 'valid'
    warranty_expiry_from, // custom date filters
    warranty_expiry_to,
    department_id, // For ASSET_MANAGER: filter by department
  } = filters;

  let whereClauses = [];
  let values = [];
  let idx = 1;

  let categoryIdForWhere = null,
    subcategoryIdForWhere = null;
  if (category) {
    const catDbRes = await getCatIdCode(filters.category);
    categoryIdForWhere = catDbRes.category_id;
    whereClauses.push(`category_id = $${idx++}`);
    values.push(categoryIdForWhere);

    if (subcategory) {
      const subcatDbRes = await getSubcatIdCode(
        filters.subcategory,
        categoryIdForWhere
      );
      subcategoryIdForWhere = subcatDbRes.subcategory_id;
      whereClauses.push(`subcategory_id = $${idx++}`);
      values.push(subcategoryIdForWhere);
    }
  }
  if (assigned_to) {
    whereClauses.push(`assigned_to = $${idx++}`);
    values.push(assigned_to);
  }
  if (purchase_date_from) {
    whereClauses.push(`purchase_date >= $${idx++}`);
    values.push(purchase_date_from);
  }
  if (purchase_date_to) {
    whereClauses.push(`purchase_date <= $${idx++}`);
    values.push(purchase_date_to);
  }
  if (vendor) {
    // Get vendor id based on vendor name
    const vendorRes = await db.query(
      "SELECT vendor_id FROM vendor WHERE name = $1",
      [vendor]
    );
    const foundVendorId = vendorRes.rows[0].vendor_id;
    whereClauses.push(`vendor_id = $${idx++}`);
    values.push(foundVendorId);
  }
  if (status) {
    whereClauses.push(`status = $${idx++}`);
    values.push(status);
  }
  if (model_number) {
    whereClauses.push(`model_number = $${idx++}`);
    values.push(model_number);
  }
  if (search) {
    // search against asset_name, serial_number, model_number
    whereClauses.push(
      `(asset_name ILIKE $${idx} OR serial_number ILIKE $${idx} OR model_number ILIKE $${idx})`
    );
    values.push(`%${search}%`);
    idx++;
  }
  if (warranty_expiry_status) {
    if (warranty_expiry_status === "expired") {
      whereClauses.push(`warranty_expiry < CURRENT_DATE`);
    } else if (warranty_expiry_status === "expiring_soon") {
      whereClauses.push(
        `warranty_expiry >= CURRENT_DATE AND warranty_expiry <= (CURRENT_DATE + INTERVAL '30 days')`
      );
    } else if (warranty_expiry_status === "valid") {
      whereClauses.push(`warranty_expiry >= CURRENT_DATE`);
    }
  }
  // Custom range for warranty expiry
  if (warranty_expiry_from) {
    whereClauses.push(`warranty_expiry >= $${idx++}`);
    values.push(warranty_expiry_from);
  }
  if (warranty_expiry_to) {
    whereClauses.push(`warranty_expiry <= $${idx++}`);
    values.push(warranty_expiry_to);
  }
  
  // Filter by department for ASSET_MANAGER
  // Assets are linked to departments through assigned_to user's department
  if (department_id) {
    whereClauses.push(`
      EXISTS (
        SELECT 1 FROM users_data u 
        WHERE u.user_id = assets.assigned_to 
        AND u.department_id = $${idx}
      )
    `);
    values.push(department_id);
    idx++;
  }

  let query = `SELECT * FROM assets`;
  if (whereClauses.length) {
    query += " WHERE " + whereClauses.join(" AND ");
  }

  // Sort handling
  let orderBy = "";
  let allowedSort = {
    purchase_cost: "purchase_cost",
    warranty_expiry: "warranty_expiry",
  };
  if (sort_by && allowedSort[sort_by]) {
    const dir =
      sort_direction && String(sort_direction).toLowerCase() === "desc"
        ? "DESC"
        : "ASC";
    orderBy = ` ORDER BY ${allowedSort[sort_by]} ${dir}`;
  }
  query += orderBy;

  // Execute
  const res = await db.query(query, values);
  return res.rows;
};

exports.getAssetDepartmentId = async (asset_id) => {
  try {
    const result = await db.query(
      `SELECT u.department_id 
       FROM assets a
       LEFT JOIN users_data u ON a.assigned_to = u.user_id
       WHERE a.asset_id = $1 OR a.public_id = $1`,
      [asset_id]
    );
    return result.rows[0]?.department_id || null;
  } catch (error) {
    throw error;
  }
};

exports.getAssetById = async (public_id) => {
  if (!public_id) {
    throw new Error("Asset ID required");
  }
  try {
    const query = `
          SELECT 
              a.*,
              c.categoryname AS category_name,
              sc.subcategoryname AS subcategory_name,
              v.vendorname AS vendor_name,
              l.long AS longitude,
              l.lat AS latitude,
              u.department_id AS asset_department_id
          FROM assets a
          LEFT JOIN asset_categories c ON a.category_id = c.id
          LEFT JOIN sub_categories sc ON a.subcategory_id = sc.id
          LEFT JOIN vendors v ON a.vendor_id = v.id
          LEFT JOIN locations l ON a.location_id = l.id
          LEFT JOIN users u ON a.assigned_to = u.user_id
          WHERE a.public_id = $1
      `;
    const values = [public_id];
    const res = await db.query(query, values);
    if (res.rows.length === 0) {
      return null;
    }
    return res.rows[0];
  } catch (error) {
    throw error;
  }
};

exports.updateAsset = async (public_id, updateFields = {}) => {
  if (!public_id) {
    throw new Error("Missing ID");
  }
  if (
    !updateFields ||
    typeof updateFields !== "object" ||
    Object.keys(updateFields).length === 0
  ) {
    throw new Error("Missing or invalid update fields");
  }
  try {
    const setClauses = [];
    const values = [];
    let idx = 1;

    // SET part of the query
    const refFieldMap = {
      category_name: {
        table: "asset_categories",
        id_field: "category_id",
        name_field: "category_name",
        asset_field: "category_id",
      },
      subcategory_name: {
        table: "sub_categories",
        id_field: "subcategory_id",
        name_field: "subcategory_name",
        asset_field: "subcategory_id",
      },
      vendor_name: {
        table: "vendors",
        id_field: "vendor_id",
        name_field: "vendor_name",
        asset_field: "vendor_id",
      },
      user_public_id: {
        table: "users_data",
        id_field: "user_id",
        name_field: "public_id",
        asset_field: "assigned_to",
      },
    };

    for (const [key, value] of Object.entries(updateFields)) {
      if (key === "longitude" || key === "latitude") {
        continue;
      }
      if (refFieldMap.hasOwnProperty(key)) {
        const { table, id_field, name_field, asset_field } = refFieldMap[key];
        let refId;
        const refRes = await db.query(
          `SELECT ${id_field} FROM ${table} WHERE ${name_field} = $1`,
          [value]
        );
        if (refRes.rows.length > 0) {
          refId = refRes.rows[0][id_field];
          setClauses.push(`${asset_field} = $${idx++}`);
          values.push(refId);
        } else {
          throw new Error(
            `No such ${key.replace(
              "_name",
              ""
            )} exists. Please create it first.`
          );
        }
      } else {
        setClauses.push(`${key} = $${idx++}`);
        values.push(value);
      }
    }

    // handling for longitude and latitude update
    if ("longitude" in updateFields && "latitude" in updateFields) {
      // asset's current location_id
      const locRes = await db.query(
        `SELECT location_id FROM assets WHERE public_id = $1`,
        [public_id]
      );
      if (locRes.rows.length > 0 && locRes.rows[0].location_id) {
        const locationId = locRes.rows[0].location_id;
        await db.query(
          `UPDATE locations SET longitude = $1, latitude = $2 WHERE id = $3`,
          [updateFields.longitude, updateFields.latitude, locationId]
        );
      }
    }

    values.push(public_id); // For WHERE clause

    const query = `
          UPDATE assets
          SET ${setClauses.join(", ")}
          WHERE public_id = $${idx}
          RETURNING *;
      `;

    const res = await db.query(query, values);
    if (res.rows.length === 0) {
      return null; // Nothing found to update
    }
    return res.rows[0];
  } catch (error) {
    throw error;
  }
};

exports.deleteAsset = async (public_id) => {
  try {
    await db.query("BEGIN");

    // Get asset_id with public_id
    const assetRes = await db.query(
      `SELECT asset_id FROM assets WHERE public_id = $1`,
      [public_id]
    );
    if (assetRes.rows.length === 0) {
      await db.query("ROLLBACK");
      return null; // Asset not found
    }
    const asset_id = assetRes.rows[0].asset_id;

    // Delete locations rows with asset_id, if exist
    await db.query(`DELETE FROM locations WHERE asset_id = $1`, [asset_id]);
    // Delete files rows with asset_id, if exist
    await db.query(`DELETE FROM asset_files WHERE asset_id = $1`, [asset_id]);
    // Delete asset from assets table
    const delRes = await db.query(
      `DELETE FROM assets WHERE asset_id = $1 RETURNING public_id`,
      [asset_id]
    );

    await db.query("COMMIT");
    return delRes.rows[0] || null;
  } catch (err) {
    await db.query("ROLLBACK");
    throw err;
  }
};

exports.saveAssetFileMeta = async (data) => {
  try {
    const result = await db.query(
      `INSERT INTO asset_files
       (asset_id, public_id, bucket, file_path, file_type, mime_type, original_name)
       VALUES ($1,$2,$3,$4,$5,$6,$7)`,
      [
        data.asset_id,
        data.public_id,
        data.bucket,
        data.file_path,
        data.file_type,
        data.mime_type,
        data.original_name,
      ]
    );
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

exports.getFilesByFileId = async (fileId) => {
  const res = await db.query(
    `SELECT id, asset_id, bucket, file_path, original_name, mime_type
     FROM asset_files
     WHERE id = $1`,
    [fileId]
  );
  return res.rows[0];
};

exports.deleteAssetFileMeta = async (fileId) => {
  await db.query(
    `DELETE FROM asset_files WHERE id = $1`,
    [fileId]
  );
};

exports.getFilesByAssetId = async (public_id) => {
  const res = await db.query(
    `SELECT bucket, file_path
     FROM asset_files
     WHERE public_id = $1`,
    [public_id]
  );
  return res.rows;
};
