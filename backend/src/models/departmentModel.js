const db = require("../config/db");

async function generateUniqueDeptCode(departmentName) {
  // Generate base code
  const words = departmentName.trim().toUpperCase().split(/\s+/);

  let baseCode;
  if (words.length > 1) {
    baseCode = words
      .map((w) => w[0])
      .join("")
      .slice(0, 3);
  } else {
    baseCode = words[0].slice(0, 3);
  }

  // Fetch existing codes
  const { rows } = await db.query(
    `SELECT department_code FROM departments WHERE department_code LIKE $1`,
    [`${baseCode}%`]
  );

  // If no conflict → return baseCode
  if (rows.length === 0) {
    return baseCode;
  }
  // If conflict
  // Find max numeric suffix
  let maxSuffix = 1;
  const regex = new RegExp(`^${baseCode}(\\d+)?$`); // RegExp to match baseCode and find max suffix

  for (const row of rows) {
    const match = row.department_code.match(regex);
    if (match && match[1]) {
      maxSuffix = Math.max(maxSuffix, parseInt(match[1], 10));
    }
  }
  return `${baseCode}${maxSuffix + 1}`;
}
exports.createDepartment = async (department_name, description) => {
  try {
    // Insert new department
    const deptCode = await generateUniqueDeptCode(department_name);
    const result = await db.query(
      "INSERT INTO departments (department_name, department_code, description) VALUES ($1, $2, $3) RETURNING *",
      [department_name, deptCode, description]
    );
    return result.rows[0];
  } catch (err) {
    throw err;
  }
};

exports.updateDepartmentDescription = async (department_id, newDescription) => {
  try {
    const result = await db.query(
      "UPDATE departments SET description = $1 WHERE department_id = $2 RETURNING *",
      [newDescription, department_id]
    );
    if (result.rows.length === 0) {
      return null;
    }
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

exports.deleteDepartment = async (department_id) => {
  try {
    // Check for users assigned to this department
    const userCheck = await db.query(
      "SELECT COUNT(*) AS cnt FROM users_data WHERE department_id = $1",
      [department_id]
    );
    if (userCheck.rows[0].cnt > 0) {
      // Cannot delete, users exist
      return {
        message: "Can't delete the department as users are present under it",
      };
    }
    // Delete the department
    const deleteResult = await db.query(
      "DELETE FROM departments WHERE department_id = $1 RETURNING *",
      [department_id]
    );
    if (deleteResult.rows.length === 0) {
      return null;
    }
    return deleteResult.rows[0];
  } catch (err) {
    throw err;
  }
};
// List all departments
exports.listAllDepartments = async () => {
  try {
    const { rows } = await db.query(
      "SELECT * FROM departments ORDER BY department_name"
    );
    return rows;
  } catch (err) {
    throw err;
  }
};

// Get department by name (case-insensitive)
exports.findByName = async (department_name) => {
  try {
    const { rows } = await db.query(
      "SELECT * FROM departments WHERE LOWER(department_name) = LOWER($1) LIMIT 1",
      [department_name]
    );
    return rows[0] || null;
  } catch (err) {
    throw err;
  }
};
