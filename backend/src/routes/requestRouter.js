const express = require("express");
const requestController = require("../controllers/requestController");
const { authenticate } = require("../middlewares/auth");
const { authorize } = require("../middlewares/rbac");

const router = express.Router();

router.post(
  "/",
  authenticate,
  requestController.createRequest
);

router.get(
  "/",
  authenticate,
  requestController.getRequests
);

router.get(
  "/pending",
  authenticate,
  authorize(["ASSET MANAGER", "MAINTENANCE ENGINEER"]),
  requestController.getPendingRequests
);

router.post(
  "/:requestId/approve-asset",
  authenticate,
  authorize(["ASSET MANAGER"]),
  requestController.approveAssetRequest
);

router.post(
  "/:requestId/complete-maintenance",
  authenticate,
  authorize(["MAINTENANCE ENGINEER"]),
  requestController.completeMaintenanceRequest
);

router.post(
  "/:requestId/reject",
  authenticate,
  authorize(["ASSET MANAGER", "MAINTENANCE ENGINEER"]),
  requestController.rejectRequest
);

router.patch(
  "/:requestId/update-remark",
  authenticate,
  authorize(["ASSET MANAGER", "MAINTENANCE ENGINEER"]),
  requestController.updateRemark
);

router.delete(
  "/:requestId",
  authenticate,
  requestController.cancelRequest
);

module.exports = router;
