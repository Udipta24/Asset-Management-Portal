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
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB per file
  },
  fileFilter: (req, file, cb) => {
    // IMAGE validation
    if (file.fieldname === "images") {
      if (!file.mimetype.startsWith("image/")) {
        return cb(new Error("Only image files are allowed"), false);
      }
      return cb(null, true);
    }

    // DOCUMENT validation (PDF only)
    if (file.fieldname === "documents") {
      if (
        file.mimetype === "application/pdf" ||
        file.originalname.toLowerCase().endsWith(".pdf")
      ) {
        return cb(null, true);
      }
      return cb(new Error("Only PDF documents are allowed"), false);
    }

    return cb(new Error("Invalid file field"), false);
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
  upload.fields([
    { name: "images", maxCount: 5 },
    { name: "documents", maxCount: 5 },
  ]),
  assetController.create
);
// update asset (admin and asset_manager, depart. restrictions checked in controller)
router.patch(
  "/:public_id",
  authenticate,
  authorize("admin", "asset manager"),
  upload.fields([
    { name: "images", maxCount: 5 },
    { name: "documents", maxCount: 5 },
  ]),
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
