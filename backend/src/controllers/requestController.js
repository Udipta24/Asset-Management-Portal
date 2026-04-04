const db = require("../config/db");
const requestModel = require("../models/requestModel");
const assetModel = require("../models/assetModel");
const maintenanceModel = require("../models/maintenanceModel");

exports.createRequest = async (req, res) => {
  try {
    const {request_type, category_id, subcategory_id, asset_id, description} = req.body;
    const request = await requestModel.createRequest({
        request_type,
        requested_by: req.user.public_id,
        department_id: req.user.department_id,
        category_id,
        subcategory_id,
        asset_id,
        description,
        assigned_to_role: request_type === "NEW ASSET" ? "ASSET MANAGER" : "MAINTENANCE ENGINEER"
    });

    res.status(201).json({ data: request, message: "Request sent successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};



exports.getPendingRequests = async (req, res) => {
  try {
    const {dir} = req.query;
    const requests = await requestModel.getPendingRequestsByRole(
      req.user.role,
      req.user.department_id,
      dir
    );
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getRequests = async (req, res) => {
    try {
    const requests = await requestModel.getRequestsByUserId(req.user.public_id, req.query);
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.approveAssetRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { asset_id } = req.body;
    console.log("Approving request", { requestId, asset_id });

    if (req.user.role !== "ASSET MANAGER") {
      return res.status(403).json({ error: "Only asset managers can approve asset requests" });
    }

    await db.query("BEGIN");

    const request = await requestModel.getRequestById(requestId);

    if (!request || request.request_type !== "NEW ASSET") {
      throw new Error("Invalid asset request");
    }

    await assetModel.updateAsset(asset_id, {
      assigned_to: request.requested_by,
      status: "active",
    });

    await requestModel.markFulfilled(requestId, "APPROVED");

    await db.query("COMMIT");

    res.json({ message: "Asset assigned successfully" });
  } catch (err) {
    await db.query("ROLLBACK");
    res.status(400).json({ error: err.message });
  } 
};

exports.completeMaintenanceRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const {
      maintenance_type,
      cost,
      maintenance_date,
      next_due_date
    } = req.body;

    if (req.user.role !== "MAINTENANCE ENGINEER") {
      return res.status(403).json({ error: "Only maintenance engineers can complete maintenance requests" });
    }

    await db.query("BEGIN");

    const request = await requestModel.getRequestById(requestId);

    if (!request || request.request_type !== "MAINTENANCE") {
      throw new Error("Invalid maintenance request");
    }

    await maintenanceModel.createMaintenance({
      asset_id: request.asset_id,
      maintenance_type,
      description: request.description,
      performed_by: req.user.public_id,
      cost,
      maintenance_date,
      next_due_date
    });

    await requestModel.markFulfilled(requestId, "FULFILLED");

    await db.query("COMMIT");

    res.json({ message: "Maintenance completed and recorded" });
  } catch (err) {
    await db.query("ROLLBACK");
    res.status(400).json({ error: err.message });
  }
};

exports.rejectRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { remark } = req.body;

    await requestModel.markRejected(requestId, remark);

    res.json({ message: "Request rejected successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


exports.updateRemark = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { remark } = req.body;

    await requestModel.updateRemark(requestId, remark);

    res.json({ message: "Remark updated successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

exports.cancelRequest = async (req, res) => {
  try {
    const { requestId } = req.params;

    await requestModel.cancelRequest(requestId);

    res.json({ message: "Request canceled successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};