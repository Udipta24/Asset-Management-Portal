// internal modules
const db = require("../config/db");

// helper function
async function getIdByName(table, column, value){
    const id = await db.query(`SELECT ${table.slice(0, -1)}_id AS id 
        FROM ${table} 
        WHERE ${column} = $1`,
    [value]);
    const row = await id;
    if (row.rows.length > 0) {
        return row.rows[0].id;
    } else {
        return null;
    }
}

// create a new user
exports.createUser = async (name, email, passwordHash, phone, designationName, departmentName, roleName = "user") => {
    // insert the user into the database
    const department_id = await getIdByName("departments", "department_name", departmentName);
    const designation_id = await getIdByName("designations", "designation_name", designationName);
    const role_id = await getIdByName("roles", "role_name", roleName);
    try {
        await db.query("BEGIN");
        const result = await db.query(
            `INSERT INTO users (name, email, password_hash, department_id, designation_id, phone)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING user_id, name, email`,
            [name, email, passwordHash, department_id, designation_id, phone]
        );
    
        const newUser = result.rows[0];
        const newUserPublicId = `USR-${String(newUser.user_id).padStart(6, '0')}`;
    
        // update db and set public_id
        await db.query(
            `UPDATE users SET public_id = $1 WHERE user_id = $2`,
            [newUserPublicId, newUser.user_id]
        );
        
        await db.query(
            `INSERT INTO user_roles (user_id, role_id)
            VALUES ($1, $2)`,
            [newUser.user_id, role_id]
        );

        await db.query("COMMIT");
    
        return {
            ...newUser,
            public_id : newUserPublicId,
        };
    } catch (error) {
        await db.query("ROLLBACK");
        throw error;
    }
}

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
                d.department_name,
                g.designation_name,
                r.role_name,
                u.password_hash
             FROM users u
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
}
