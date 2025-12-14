// external modules
const express = require("express");
const router = express.Router();
// internal modules
const assetController = require("../controllers/assetController");
const { authenticate } = require("../middlewares/auth");
const { authorize } = require("../middlewares/rbac");

// create asset (admin)
router.post("/", authenticate, authorize("admin"), assetController.create);
router.get("/", authenticate, assetController.list);
router.get("/:id", authenticate, assetController.getOne);
router.patch("/:id", authenticate, authorize("admin"), assetController.update);
router.delete("/:id", authenticate, authorize("admin"), assetController.delete);

module.exports = router;