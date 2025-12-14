// external modules
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
// internal modules
const { createUser, getUserByEmail } = require("../models/userModel");

dotenv.config();

// register a new user
exports.register = async (req, res, next) => {
  try {
    const { full_name, email, password, phone, designation, department } = req.body;
    // check if all fields are provided
    if (
      !full_name ||
      !email ||
      !password ||
      !phone ||
      !designation ||
      !department
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }
    // check if user already exists
    const user = await getUserByEmail(email);
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }
    // hash password
    const passwordHash = await bcrypt.hash(
      password,
      process.env.BCRYPT_SALT_ROUNDS
    );
    // create the new user
    const newUser = await createUser(
      full_name,
      email,
      passwordHash,
      phone,
      designation,
      department,
      role
    );
    // return the new user
    res.status(201).json({
      message: "User created successfully",
      user: newUser,
    });
  } catch (err) {
    next(err);
  }
};
// login a user
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    // check if all fields are provided
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }
    // check is token is already present
    const cookieName = process.env.COOKIE_NAME;
    const existingToken = req.cookies && req.cookies[cookieName];
    // if token is present, check if it is valid
    if (existingToken) {
      try {
        // decode the token
        const decoded = jwt.verify(existingToken, process.env.JWT_SECRET);
        // If token is valid and matches the email being logged in, user is already logged in
        if (decoded.email === email) {
          return res.status(200).json({
            message: "Already logged in",
            user: {
              user_id: decoded.user_id,
              email: decoded.email,
              role: decoded.role,
            },
          });
        }
      } catch (err) {
        // Token is invalid/expired, proceed with normal login
      }
    }
    // check if user exists
    const user = await getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    // check if password is valid
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    // create a payload for the token
    const payload = { user_id: user.user_id, email: user.email, role: user.role };
    // sign the token
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });
    // set the cookie
    const cookieSecure = process.env.COOKIE_SECURE === "true";
    res.cookie(process.env.COOKIE_NAME, token, {
      httpOnly: true,
      secure: cookieSecure,
      sameSite: cookieSecure ? "none" : "lax",
      maxAge: 86400000,
    });
    // return the user
    res.json({
      message: "Login successful",
      user: {
        user_id: user.public_id,
        full_name: user.full_name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    next(err);
  }
};
// logout a user
exports.logout = (req, res) => {
  // clear the cookie
  res.clearCookie(process.env.COOKIE_NAME, { path: "/" });
  // return the message
  res.json({ message: "Logout successful" });
};

// Verify current session - returns user info if logged in
exports.me = async (req, res, next) => {
  try {
    // This endpoint requires authenticate middleware, so req.user is already set
    // Fetch full user details from database to get full_name
    const user = await getUserByEmail(req.user.email);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({
      user: {
        user_id: user.public_id,
        full_name: user.full_name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    next(err);
  }
};
