// external modules
const express = require("express");
// internal modules
const { register, login, logout, me } = require("../controllers/authController");
// middlewares
const { authenticate } = require("../middlewares/auth");

// create a router
const router = express.Router();

router.post("/register", register); // register a new user
router.post("/login", login); // login a user
router.post("/logout", authenticate, logout); // logout a user

// export the router
module.exports = router;