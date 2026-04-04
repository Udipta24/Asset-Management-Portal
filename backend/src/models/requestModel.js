const db = require("../config/db");

exports.createRequest = async ({
  request_type,
  requested_by,
  department_id,
  category_id = null,
  subcategory_id = null,
  asset_id = null,
  description = null,
  assigned_to_role,
}) => {
  const query = `
      INSERT INTO requests (
        request_type,
        requested_by,
        department_id,
        category_id,
        subcategory_id,
        asset_id,
        issue_description,
        status,
        assigned_to_role
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, 'PENDING', $8)
      RETURNING *;
    `;

  const values = [
    request_type,
    requested_by,
    department_id,
    category_id,
    subcategory_id,
    asset_id,
    description,
    assigned_to_role,
  ];

  const { rows } = await db.query(query, values);
  return rows[0];
};

exports.getPendingRequestsByRole = async (role, department_id = null, sortDir) => {
  let query = ``;
  let values = [];

  if (role === "ASSET MANAGER") {
    query = `
        SELECT r.*, u.public_id, c.category_name, s.subcategory_name
        FROM requests r
        LEFT JOIN users_data u ON r.requested_by = u.public_id
        LEFT JOIN asset_categories c ON r.category_id = c.category_id
        LEFT JOIN sub_categories s ON r.subcategory_id = s.subcategory_id
        WHERE r.status = 'PENDING'
          AND r.request_type = 'NEW ASSET'
          AND r.department_id = $1 ORDER BY r.requested_at ${sortDir === "asc" ? "ASC" : "DESC"};
      `;
    values = [department_id];
  }

  if (role === "MAINTENANCE ENGINEER") {
    query = `
        SELECT r.*, u.public_id
        FROM requests r
        LEFT JOIN users_data u ON r.requested_by = u.public_id
        WHERE r.status = 'PENDING'
          AND r.request_type = 'MAINTENANCE'
          AND r.department_id = $1 ORDER BY r.requested_at ${sortDir === "asc" ? "ASC" : "DESC"};
      `;
    values = [department_id];
  }

  const { rows } = await db.query(query, values);
  return rows;
};

exports.getRequestsByUserId = async (user_id, filters) => {
  const { request_type, status, dir } = filters;
  let query = `SELECT r.*, u.public_id, c.category_name, s.subcategory_name
        FROM requests r
        LEFT JOIN users_data u ON r.requested_by = u.public_id
        LEFT JOIN asset_categories c ON r.category_id = c.category_id
        LEFT JOIN sub_categories s ON r.subcategory_id = s.subcategory_id WHERE requested_by = $1`;
  let values = [user_id];
  if (request_type) {
    query += ` AND request_type = $${values.length + 1}`;
    values.push(request_type);
  }
  if (status) {
    query += ` AND status = $${values.length + 1}`;
    values.push(status);
  }
  query += ` ORDER BY r.requested_at ${dir === "asc" ? "ASC" : "DESC"}`;
  const { rows } = await db.query(query, values);
  return rows;
};

exports.getRequestById = async (request_id) => {
  const { rows } = await db.query(
    `SELECT r.*, u.public_id, c.category_name, s.subcategory_name
        FROM requests r
        LEFT JOIN users_data u ON r.requested_by = u.public_id
        LEFT JOIN asset_categories c ON r.category_id = c.category_id
        LEFT JOIN sub_categories s ON r.subcategory_id = s.subcategory_id WHERE request_id = $1`,
    [request_id]
  );
  return rows[0];
};

exports.markFulfilled = async (request_id, msg) => {
  await db.query(
    `
      UPDATE requests
      SET status = $1,
          fulfilled_at = NOW()
      WHERE request_id = $2;
      `,
    [msg, request_id]
  );
};

exports.markRejected = async (request_id, remark) => {
  await db.query(
    `
      UPDATE requests
      SET status = 'REJECTED',
          remark = $1
      WHERE request_id = $2;
      `,
    [remark, request_id]
  );
};

exports.updateRemark = async (request_id, remark) => {
  await db.query(
    `
      UPDATE requests
      SET remark = $1
      WHERE request_id = $2;
      `,
    [remark, request_id]
  );
}

exports.cancelRequest = async (request_id) => {
  await db.query(
    `
      DELETE FROM requests
      WHERE request_id = $1;
      `,
    [request_id]
  );
};