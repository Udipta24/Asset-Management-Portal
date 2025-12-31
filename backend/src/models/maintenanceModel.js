const db = require("../config/db");

/**
 * Create maintenance record
 */
exports.createMaintenance = async (data) => {
  const {
    asset_id,
    maintenance_type,
    performed_by,
    description,
    cost,
    maintenance_date,
    next_due_date,
  } = data;

  const result = await db.query(
    `
    INSERT INTO maintenance_records (
      asset_id,
      maintenance_type,
      performed_by,
      description,
      cost,
      maintenance_date,
      next_due_date
    )
    VALUES ($1,$2,$3,$4,$5,$6,$7)
    RETURNING *
    `,
    [
      asset_id,
      maintenance_type,
      performed_by,
      description,
      cost,
      maintenance_date,
      next_due_date,
    ]
  );

  return result.rows[0];
};

/**
 * Get all maintenance records
 */
exports.getAllMaintenance = async () => {
  const result = await db.query(`
    SELECT 
      m.*,
      a.asset_name,
      u.name AS performed_by_name
    FROM maintenance_records m
    LEFT JOIN assets a ON m.asset_id = a.public_id
    LEFT JOIN users u ON m.performed_by = u.public_id
    ORDER BY m.maintenance_date DESC
  `);

  return result.rows;
};

/**
 * Get maintenance by ID
 */
exports.getMaintenanceById = async (maintenance_id) => {
  const result = await db.query(
    `
    SELECT 
      m.*,
      a.asset_name,
      u.name AS performed_by_name
    FROM maintenance_records m
    LEFT JOIN assets a ON m.asset_id = a.public_id
    LEFT JOIN users u ON m.performed_by = u.public_id
    WHERE m.maintenance_id = $1
    `,
    [maintenance_id]
  );

  return result.rows[0];
};

/**
 * Get maintenance by Asset ID
 */
exports.getMaintenanceByAssetId = async (asset_id) => {
  const result = await db.query(
    `
    SELECT 
      m.*,
      a.asset_name,
      u.name AS performed_by_name
    FROM maintenance_records m
    LEFT JOIN assets a ON m.asset_id = a.public_id
    LEFT JOIN users u ON m.performed_by = u.public_id
    WHERE m.asset_id = $1
    `,
    [asset_id]
  );

  return result.rows[0];
};

/**
 * Update maintenance record
 */
exports.updateMaintenance = async (maintenance_id, fields) => {
  const allowed = [
    "maintenance_type",
    "description",
    "cost",
    "maintenance_date",
    "next_due_date",
  ];

  const updates = [];
  const values = [];
  let index = 1;

  for (const key of allowed) {
    if (fields[key] !== undefined) {
      updates.push(`${key} = $${index}`);
      values.push(fields[key]);
      index++;
    }
  }

  if (!updates.length) {
    throw new Error("No valid fields provided");
  }

  values.push(maintenance_id);

  const query = `
    UPDATE maintenance_records
    SET ${updates.join(", ")}
    WHERE maintenance_id = $${index}
    RETURNING *
  `;

  const result = await db.query(query, values);
  return result.rows[0];
};

/**
 * Delete maintenance record
 */
exports.deleteMaintenance = async (maintenance_id) => {
  const result = await db.query(
    `DELETE FROM maintenance_records WHERE maintenance_id = $1 RETURNING *`,
    [maintenance_id]
  );

  return result.rows[0];
};
