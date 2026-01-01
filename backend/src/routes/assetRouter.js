// external modules
const express = require("express");
const router = express.Router();
const multer = require("multer");
// internal modules
const assetController = require("../controllers/assetController");
const { authenticate } = require("../middlewares/auth");
const { authorize } = require("../middlewares/rbac");

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
  fileFilter: (req, file, cb) => {
    if (file.fieldname === "images") {
      return file.mimetype.startsWith("image/")
        ? cb(null, true)
        : cb(new Error("Only image files allowed"), false);
    }

    if (file.fieldname === "documents") {
      return file.mimetype.includes("pdf")
        ? cb(null, true)
        : cb(new Error("Only PDF documents allowed"), false);
    }

    cb(new Error("Invalid file field"), false);
  },
});

// list all assets (accessible by authenticated users)
router.get("/", authenticate, assetController.list);
// get one asset (admin and asset_manager depart. restrictions checked in controller)
router.get("/:public_id", authenticate, assetController.getOne);

// get file view or download (all authenticated users, role-based restrictions handled in controller)
router.get("/files/:fileId/", authenticate, assetController.getAssetFile);

// create asset (admin or asset_manager)
router.post(
  "/",
  authenticate,
  authorize("admin", "asset manager"),
  upload.any(),
  assetController.create
);
// update asset (admin and asset_manager, depart. restrictions checked in controller)
router.patch(
  "/:public_id",
  authenticate,
  authorize("admin", "asset manager"),
  upload.any(),
  assetController.update
);
// delete asset (admin and asset_manager, depart. restrictions checked in controller)
router.delete(
  "/:public_id",
  authenticate,
  authorize("admin", "asset manager"),
  assetController.remove
);
// delete asset file (admin and asset_manager, department restrictions handled in controller)
router.delete(
  "/files/:fileId",
  authenticate,
  authorize("admin", "asset manager"),
  assetController.deleteAssetFile
);

module.exports = router;
