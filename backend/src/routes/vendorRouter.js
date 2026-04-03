const express = require("express");
const router = express.Router();

const vendorController = require("../controllers/vendorController");
const { authenticate } = require("../middlewares/auth");
const { authorize } = require("../middlewares/rbac");

// Everyone logged in can view vendors
router.get("/", authenticate, vendorController.getVendors);
router.get("/:vendorId", authenticate, vendorController.getVendorById);

// Only ADMIN & ASSET_MANAGER can create/update
router.post(
  "/",
  authenticate,
  authorize("admin", "asset manager"),
  vendorController.createVendor
);

router.patch(
  "/:vendorId",
  authenticate,
  authorize("admin", "asset manager"),
  vendorController.updateVendor
);

// Only ADMIN can delete
router.delete(
  "/:vendorId",
  authenticate,
  authorize("admin"),
  vendorController.deleteVendor
);

module.exports = router;
