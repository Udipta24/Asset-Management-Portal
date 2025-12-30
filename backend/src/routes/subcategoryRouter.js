// external modules
const express = require("express");
const router = express.Router();
// internal modules
const subcategoryController = require("../controllers/subcategoryController");
const { authenticate } = require("../middlewares/auth");
const { authorize } = require("../middlewares/rbac");

router.get("/by-category", authenticate, subcategoryController.listByCategory);
router.get("/:cat", authenticate, subcategoryController.list);
router.post("/", authenticate, authorize("admin"), subcategoryController.create);
router.patch("/:id", authenticate, authorize("admin"), subcategoryController.updateDesc);
router.delete("/:id", authenticate, authorize("admin"), subcategoryController.delete);

module.exports = router;