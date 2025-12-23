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
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.fieldname === "images") {
      return file.mimetype.startsWith("image/")
        ? cb(null, true)
        : cb(new Error("Only images allowed"));
    }

    if (file.fieldname === "documents") {
      return file.mimetype === "application/pdf"
        ? cb(null, true)
        : cb(new Error("Only PDFs allowed"));
    }

    cb(new Error("Unknown file field"));
  },
});

// create asset (admin or asset_manager)
router.post(
  "/",
  authenticate,
  authorize("admin", "asset_manager"),
  upload.fields([
    { name: "images", maxCount: 5 },
    { name: "documents", maxCount: 5 },
  ]),
  assetController.create
);
// list all assets (accessible by authenticated users)
router.get("/", authenticate, assetController.list);
// get one asset (admin and asset_manager depart. restrictions checked in controller)
router.get("/:id", authenticate, assetController.getOne);
// update asset (admin and asset_manager, depart. restrictions checked in controller)
router.patch(
  "/:id",
  authenticate,
  authorize("admin", "asset_manager"),
  assetController.update
);
// delete asset (admin and asset_manager, depart. restrictions checked in controller)
router.delete(
  "/:id",
  authenticate,
  authorize("admin", "asset_manager"),
  assetController.remove
);
// delete asset file (admin and asset_manager, department restrictions handled in controller)
router.delete(
  "/assets/files/:fileId",
  authenticate,
  authorize("admin", "asset_manager"),
  assetController.deleteAssetFile
);

// download asset file (all authenticated users, role-based restrictions handled in controller)
router.get(
  "/assets/files/:fileId/download",
  authenticate,
  assetController.downloadAssetFile
);

module.exports = router;
