// internal modules
const db = require("../config/db");

// helper function
async function getIdByName(table, column, value) {
  let query, params;
  if (table === "departments") {
    query = `SELECT department_code FROM departments WHERE ${column} = $1`;
    params = [value];
    const result = await db.query(query, params);
    if (result.rows.length > 0) {
      return result.rows[0].department_code;
    } else {
      return null;
    }
  } else {
    // For other tables, just return id (e.g. designations_id, roles_id)
    query = `SELECT ${table.slice(
      0,
      -1
    )}_id AS id FROM ${table} WHERE ${column} = $1`;
    params = [value];
    const result = await db.query(query, params);
    if (result.rows.length > 0) {
      return result.rows[0].id;
    } else {
      return null;
    }
  }
}

// create a new user - ALWAYS registers with role 'USER' (never accepts role from client)
exports.createUser = async (
  name,
  email,
  passwordHash,
  phone,
  department_id,
  designation_id,
) => {
  // insert the user into the database
  const department_code = await getIdByName(
    "departments",
    "department_id",
    department_id
  );
  // ALWAYS set role to 'USER' - never accept role from client input
  const role_id = await getIdByName("roles", "role_name", "USER");
  try {
    await db.query("BEGIN");
    const result = await db.query(
      `INSERT INTO users_data (name, email, password_hash, department_id, designation_id, phone)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING user_id, name, email`,
      [name, email, passwordHash, Number(department_id), Number(designation_id), phone]
    );

    const newUser = result.rows[0];
    const newUserPublicId = `USR-${department_code}-${String(
      newUser.user_id
    ).padStart(6, "0")}`;

    // update db and set public_id
    await db.query(`UPDATE users_data SET public_id = $1 WHERE user_id = $2`, [
      newUserPublicId,
      newUser.user_id,
    ]);

    await db.query(
      `INSERT INTO user_roles (user_id, role_id)
            VALUES ($1, $2)`,
      [newUser.user_id, role_id]
    );

    await db.query("COMMIT");

    return {
      ...newUser,
      public_id: newUserPublicId,
    };
  } catch (error) {
    await db.query("ROLLBACK");
    throw error;
  }
};

// get a user by email
exports.getUserByEmail = async (email) => {
  // get the user from the database
  try {
    const result = await db.query(
      `SELECT 
                u.user_id,
                u.public_id,
                u.name,
                u.email,
                u.phone,
                u.department_id,
                d.department_name,
                u.designation_id,
                g.designation_name,
                ur.role_id,
                r.role_name,
                u.password_hash
             FROM users_data u
             LEFT JOIN departments d ON u.department_id = d.department_id
             LEFT JOIN designations g ON u.designation_id = g.designation_id
             LEFT JOIN user_roles ur ON u.user_id = ur.user_id
             LEFT JOIN roles r ON ur.role_id = r.role_id
             WHERE u.email = $1`,
      [email]
    );
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

// get a user by user_id (internal id)
exports.getUserById = async (user_id) => {
  try {
    const result = await db.query(
      `SELECT 
                u.user_id,
                u.public_id,
                u.name,
                u.email,
                u.department_id,
                d.department_name,
                u.designation_id,
                g.designation_name,
                ur.role_id,
                r.role_name,
                u.password_hash
             FROM users_data u
             LEFT JOIN departments d ON u.department_id = d.department_id
             LEFT JOIN designations g ON u.designation_id = g.designation_id
             LEFT JOIN user_roles ur ON u.user_id = ur.user_id
             LEFT JOIN roles r ON ur.role_id = r.role_id
             WHERE u.user_id = $1`,
      [user_id]
    );
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

// get a user by public_id
exports.getUserByPublicId = async (public_id) => {
  try {
    const result = await db.query(
      `SELECT 
                u.user_id,
                u.public_id,
                u.name,
                u.email,
                u.phone,
                u.department_id,
                d.department_name,
                u.designation_id,
                g.designation_name,
                ur.role_id,
                r.role_name,
                u.password_hash
             FROM users_data u
             LEFT JOIN departments d ON u.department_id = d.department_id
             LEFT JOIN designations g ON u.designation_id = g.designation_id
             LEFT JOIN user_roles ur ON u.user_id = ur.user_id
             LEFT JOIN roles r ON ur.role_id = r.role_id
             WHERE u.public_id = $1`,
      [public_id]
    );
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

exports.getAllUsers = async ({ department_id, designation_id }) => {
  const conditions = [];
  const values = [];
  let idx = 1;

  if (department_id) {
    conditions.push(`u.department_id = $${idx++}`);
    values.push(Number(department_id));
  }

  if (designation_id) {
    conditions.push(`u.designation_id = $${idx++}`);
    values.push(Number(designation_id));
  }

  const whereClause =
    conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

  const query = `
    SELECT 
      u.user_id,
      u.public_id,
      u.name,
      u.email,
      u.phone,
      d.department_name,
      g.designation_name,
      r.role_name
    FROM users_data u
    LEFT JOIN departments d ON u.department_id = d.department_id
    LEFT JOIN designations g ON u.designation_id = g.designation_id
    LEFT JOIN user_roles ur ON u.user_id = ur.user_id
    LEFT JOIN roles r ON ur.role_id = r.role_id
    ${whereClause}
    ORDER BY u.name;
  `;

  const result = await db.query(query, values);
  return result.rows;
};

// Update user details
exports.updateUserById = async (user_id, updateFields) => {
  // updateFields is an object with key-value pairs to be updated
  // Only allow specific fields to be updated
  const allowedFields = ["email", "phone"];
  const setParts = [];
  const values = [];
  let idx = 1;

  for (let key of allowedFields) {
    if (Object.prototype.hasOwnProperty.call(updateFields, key)) {
      setParts.push(`${key} = $${idx}`);
      values.push(updateFields[key]);
      idx++;
    }
  }

  if (setParts.length === 0) {
    throw new Error("No valid fields provided for update.");
  }

  values.push(user_id);

  const query = `
        UPDATE users_data
        SET ${setParts.join(", ")}
        WHERE public_id = $${idx}
        RETURNING *;
    `;

  try {
    const result = await db.query(query, values);
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

// Update password by email (for password reset)
exports.updatePasswordByEmail = async (email, passwordHash) => {
  try {
    const result = await db.query(
      `UPDATE users_data 
             SET password_hash = $1 
             WHERE email = $2 
             RETURNING user_id, email`,
      [passwordHash, email]
    );
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

// Promote a USER to ASSET_MANAGER
// Enforces: Only one ASSET_MANAGER per department (database constraint)
exports.promoteToAssetManager = async (user_id, department_id) => {
  try {
    await db.query("BEGIN");

    // // Get user details
    // const user = await exports.getUserByPublicId(public_id);
    // console.log(user);
    // if (!user) {
    //   throw new Error("User not found");
    // }
    // const user_id = user.rows[0].user_id;
    // // Check if user is already ASSET_MANAGER
    // if (user.role_name === "ASSET_MANAGER") {
    //   throw new Error("User is already an ASSET_MANAGER");
    // }

    // // Check if user is not USER role
    // if (user.role_name !== "USER") {
    //   throw new Error("Only USER role can be promoted to ASSET_MANAGER");
    // }

    // Check if department already has an ASSET_MANAGER
    const existingManager = await db.query(
      `SELECT u.user_id 
             FROM users_data u
             JOIN user_roles ur ON u.user_id = ur.user_id
             JOIN roles r ON ur.role_id = r.role_id
             WHERE u.department_id = $1 AND r.role_name = 'ASSET_MANAGER'`,
      [department_id]
    );

    if (
      existingManager.rows.length > 0 &&
      existingManager.rows[0].user_id !== user_id
    ) {
      throw new Error("This department already has an ASSET_MANAGER");
    }

    // Get ASSET_MANAGER role_id
    const assetManagerRoleId = await getIdByName(
      "roles",
      "role_name",
      "ASSET MANAGER"
    );
    if (!assetManagerRoleId) {
      throw new Error("ASSET MANAGER role not found in database");
    }

    // Update user role from USER to ASSET_MANAGER
    // First, get current USER role_id
    const userRoleId = await getIdByName("roles", "role_name", "USER");

    // Delete old USER role
    await db.query(
      "DELETE FROM user_roles WHERE user_id = $1 AND role_id = $2",
      [user_id, userRoleId]
    );

    // Insert new ASSET_MANAGER role
    await db.query(
      "INSERT INTO user_roles (user_id, role_id) VALUES ($1, $2)",
      [user_id, assetManagerRoleId]
    );

    await db.query("COMMIT");

    // Return updated user
    return await exports.getUserById(user_id);
  } catch (error) {
    await db.query("ROLLBACK");
    throw error;
  }
};

// Delete user by id
exports.deleteUserById = async (public_id) => {
  try {
    // Clean up related records first, if necessary, e.g., user_roles
    const res = await this.getUserByPublicId(public_id);
    let user_id;
    if(res) user_id = Number(res.user_id);
    await db.query("DELETE FROM user_roles WHERE user_id = $1", [user_id]);
    // Delete user
    const result = await db.query(
      "DELETE FROM users_data WHERE public_id = $1 RETURNING *",
      [public_id]
    );
    return result.rows[0]; // Return deleted user info
  } catch (error) {
    throw error;
  }
};
