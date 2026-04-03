// external modules
const express = require("express");
// internal modules
const userController = require("../controllers/userController");
const { authenticate } = require("../middlewares/auth");
const { authorize } = require("../middlewares/rbac");

const router = express.Router();

router.get("/", authenticate, authorize("admin"), userController.listUsers);
router.get("/me", authenticate, userController.me);
router.get(
  "/:publicId",
  authenticate,
  authorize("admin"),
  userController.userByPublicId
);
router.post(
  "/:userId/promote",
  authenticate,
  authorize("admin"),
  userController.promoteUser
);
router.patch(
  "/:userId",
  authenticate,
  authorize("admin"),
  userController.updateUser
);
router.delete(
  "/:userId",
  authenticate,
  authorize("admin"),
  userController.deleteUser
);

module.exports = router;
