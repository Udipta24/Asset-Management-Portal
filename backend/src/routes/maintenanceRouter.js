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

/**
 * Create & update — ADMIN & ASSET_MANAGER
 */
router.post(
  "/",
  authenticate,
  authorize("admin", "asset_manager"),
  maintenanceController.createMaintenance
);

router.put(
  "/:maintenanceId",
  authenticate,
  authorize("admin", "asset_manager"),
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

/**
 * Attachments
 */
router.post(
  "/:maintenanceId/attachments",
  authenticate,
  authorize("admin", "asset_manager"),
  maintenanceController.addAttachment
);

router.get(
  "/:maintenanceId/attachments",
  authenticate,
  maintenanceController.getAttachments
);

module.exports = router;
