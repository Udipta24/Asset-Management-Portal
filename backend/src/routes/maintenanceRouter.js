const express = require("express");
const router = express.Router();

const maintenanceController = require("../controllers/maintenanceController");
const { authenticate } = require("../middlewares/auth");
const { authorize } = require("../middlewares/rbac");

/**
 * Everyone logged in can view
 */
router.get("/", authenticate, maintenanceController.getAllMaintenance);
router.get("/:maintenanceId", authenticate, maintenanceController.getMaintenanceById);
router.get("/:assetId", authenticate, maintenanceController.getMaintenanceByAssetId);

/**
 * Create & update — ADMIN & ASSET_MANAGER
 */
router.post(
  "/",
  authenticate,
  authorize("admin", "asset manager"),
  maintenanceController.createMaintenance
);

router.put(
  "/:maintenanceId",
  authenticate,
  authorize("admin", "asset manager"),
  maintenanceController.updateMaintenance
);

/**
 * Delete — ADMIN only
 */
router.delete(
  "/:maintenanceId",
  authenticate,
  authorize("admin"),
  maintenanceController.deleteMaintenance
);

module.exports = router;