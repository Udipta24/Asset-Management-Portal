// external modules
const express = require("express");
// internal modules
const userController = require("../controllers/userController");
const { authenticate } = require("../middlewares/auth");
const { authorize } = require("../middlewares/rbac");

const router = express.Router();
// Route to get info about current logged-in user
router.get("/me", authenticate, userController.me);

// Promote USER to ASSET_MANAGER (admin only)
router.post("/:userId/promote", authenticate, authorize("admin"), userController.promoteToAssetManager);

module.exports = router;
