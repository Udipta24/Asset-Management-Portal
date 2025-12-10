// src/routes/assets.js
const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/assetController");
const { authenticate } = require("../middlewares/auth");
const { authorize } = require("../middlewares/rbac");

// create asset (admin or asset_manager)
router.post("/", authenticate, authorize("admin", "asset_manager"), ctrl.createAsset);
router.get("/", authenticate, ctrl.listAssets);
router.get("/:id", authenticate, ctrl.getAsset);

module.exports = router;
