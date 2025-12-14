// external modules
const express = require("express");
// internal modules
const userController = require("../controllers/userController");
const { authenticate } = require("../middleware/authenticate");

const router = express.Router();
// Route to get info about current logged-in user
router.get("/me", authenticate, userController.me);

module.exports = router;
