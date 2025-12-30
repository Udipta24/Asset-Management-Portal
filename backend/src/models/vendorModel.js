// models/vendorModel.js
const db = require("../config/db");

/**
 * Create Vendor
 */
exports.createVendor = async (data) => {
  const {
    vendor_name,
    contact_person,
    phone,
    email,
    address,
  } = data;

  const result = await db.query(
    `
    INSERT INTO vendors 
      (vendor_name, contact_person, phone, email, address)
    VALUES 
      ($1, $2, $3, $4, $5)
    RETURNING *
    `,
    [vendor_name, contact_person, phone, email, address]
  );

  return result.rows[0];
};

/**
 * Get all vendors
 */
exports.getAllVendors = async () => {
  const result = await db.query(
    `
    SELECT *
    FROM vendors
    ORDER BY vendor_name ASC
    `
  );
  return result.rows;
};

/**
 * Get vendor by ID
 */
exports.getVendorById = async (vendor_id) => {
  const result = await db.query(
    `SELECT * FROM vendors WHERE vendor_id = $1`,
    [vendor_id]
  );
  return result.rows[0];
};

/**
 * Update vendor
 */
exports.updateVendor = async (vendor_id, fields) => {
  const allowedFields = [
    "vendor_name",
    "contact_person",
    "phone",
    "email",
    "address",
  ];

  const updates = [];
  const values = [];
  let index = 1;

  for (const key of allowedFields) {
    if (fields[key] !== undefined) {
      updates.push(`${key} = $${index}`);
      values.push(fields[key]);
      index++;
    }
  }

  if (updates.length === 0) {
    throw new Error("No valid fields provided");
  }

  values.push(vendor_id);

  const query = `
    UPDATE vendors
    SET ${updates.join(", ")}
    WHERE vendor_id = $${index}
    RETURNING *
  `;

  const result = await db.query(query, values);
  return result.rows[0];
};

/**
 * Delete vendor
 */
exports.deleteVendor = async (vendor_id) => {
  const result = await db.query(
    `DELETE FROM vendors WHERE vendor_id = $1 RETURNING *`,
    [vendor_id]
  );

  return result.rows[0];
};
