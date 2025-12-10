// src/controllers/authController.js
const db = require("../config/db");
const bcrypt = require("bcrypt");
const { sign } = require("../utils/jwt");

// helper to find roles (simple approach: pick first role)
const getUserRoles = async (user_id) => {
  const r = await db.query(
    `SELECT r.role_name FROM roles r JOIN user_roles ur ON r.role_id = ur.role_id WHERE ur.user_id=$1`,
    [user_id]
  );
  return r.rows.map(row => row.role_name);
};

exports.register = async (req, res, next) => {
  try {
    const { full_name, email, password, phone, designation, department, role_id } = req.body;

    if (!full_name || !email || !password) {
      return res.status(400).json({ message: "Full name, email, and password are required" });
    }

    // Check email, as username and password can be same
    const existing = await db.query(
      "SELECT 1 FROM users WHERE email = $1",
      [email.toLowerCase()]
    );
    if (existing.rows.length) {
      return res.status(409).json({ message: "Email already registered" });
    }

    // Hash password
    const password_hash = await bcrypt.hash(password, 10);

    // Insert user
    const insertUser = await db.query(
      `INSERT INTO users (full_name, email, password_hash, phone, designation, department)
       VALUES ($1,$2,$3,$4,$5,$6)
       RETURNING user_id, full_name, email`,
      [
        full_name,
        email,
        password_hash,
        phone || null,
        designation || null,
        department || null
      ]
    );

    const userId = insertUser.rows[0].user_id;

    // Assign role if provided
    if (role_id) {
      await db.query(
        "INSERT INTO user_roles (user_id, role_id) VALUES ($1,$2)",
        [userId, role_id]
      );
    }

    res.status(201).json({
      message: "User created successfully",
      user: insertUser.rows[0]
    });

  } catch (err) {
    next(err);
  }
};


exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username || !password)
      return res.status(400).json({ message: "Missing fields" });

    // lookup by full_name
    const q = await db.query(
      "SELECT * FROM users WHERE full_name = $1",
      [username]
    );

    if (q.rows.length === 0)
      return res.status(401).json({ message: "Invalid credentials" });

    const user = q.rows[0];

    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });

    const roles = await getUserRoles(user.user_id);
    const role = roles[0] || "viewer";

    const payload = { user_id: user.user_id, full_name: user.full_name, role };
    const token = sign(payload);

    const cookieName = process.env.COOKIE_NAME || "asset_token";
    const cookieSecure = process.env.COOKIE_SECURE === "true";

    res.cookie(cookieName, token, {
      httpOnly: true,
      secure: cookieSecure,
      sameSite: cookieSecure ? "none" : "lax",
      maxAge: 86400000, 
      path: "/"
    });

    res.json({
      user: {
        user_id: user.user_id,
        full_name: user.full_name,
        role
      }
    });

  } catch (err) {
    next(err);
  }
};


exports.logout = (req, res) => {
  const cookieName = process.env.COOKIE_NAME || "asset_token";
  res.clearCookie(cookieName, { path: "/" });
  res.json({ message: "Logged out" });
};

exports.me = async (req, res, next) => {
  try {
    const userId = req.user.user_id;
    const q = await db.query(`SELECT user_id, full_name, email, designation, department FROM users WHERE user_id=$1`, [userId]);
    if (q.rows.length === 0) return res.status(404).json({ message: "User not found" });
    const rolesQ = await db.query(`SELECT r.role_name FROM roles r JOIN user_roles ur ON r.role_id = ur.role_id WHERE ur.user_id=$1`, [userId]);
    const roles = rolesQ.rows.map(r => r.role_name);
    res.json({ user: q.rows[0], roles });
  } catch (err) { next(err); }
};
