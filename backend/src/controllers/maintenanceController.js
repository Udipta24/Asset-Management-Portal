const {
  createMaintenance,
  getAllMaintenance,
  getMaintenanceById,
  updateMaintenance,
  deleteMaintenance,
} = require("../models/maintenanceModel");

/**
 * Create maintenance record
 */
exports.createMaintenance = async (req, res, next) => {
  try {
    const record = await createMaintenance({
      ...req.body,
      performed_by: req.user.user_id,
    });

    res.status(201).json({
      message: "Maintenance record created",
      maintenance: record,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Get all maintenance records
 */
exports.getAllMaintenance = async (req, res, next) => {
  try {
    const records = await getAllMaintenance();
    res.json({ records });
  } catch (err) {
    next(err);
  }
};

/**
 * Get maintenance by ID
 */
exports.getMaintenanceById = async (req, res, next) => {
  try {
    const record = await getMaintenanceById(req.params.maintenanceId);

    if (!record) {
      return res.status(404).json({ message: "Maintenance not found" });
    }

    res.json({ record });
  } catch (err) {
    next(err);
  }
};

/**
 * Update maintenance
 */
exports.updateMaintenance = async (req, res, next) => {
  try {
    const updated = await updateMaintenance(req.params.maintenanceId, req.body);

    if (!updated) {
      return res.status(404).json({ message: "Maintenance not found" });
    }

    res.json({
      message: "Maintenance updated",
      maintenance: updated,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Delete maintenance
 */
exports.deleteMaintenance = async (req, res, next) => {
  try {
    const deleted = await deleteMaintenance(req.params.maintenanceId);

    if (!deleted) {
      return res.status(404).json({ message: "Maintenance not found" });
    }

    res.json({
      message: "Maintenance deleted",
      maintenance: deleted,
    });
  } catch (err) {
    next(err);
  }
};
