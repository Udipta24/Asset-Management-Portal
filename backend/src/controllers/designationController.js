const designationModel = require("../models/designationModel");

// Create a new designation
exports.create = async (req, res, next) => {
  try {
    const { designation_name, description } = req.body;
    if (!designation_name || !designation_name.trim()) {
      return res.status(400).json({ error: "Designation name is required" });
    }

    // Check if designation already exists (case-insensitive)
    const existing = await designationModel.findByName(designation_name.trim());
    if (existing) {
      return res.status(409).json({ error: "Designation already exists" });
    }

    const designation = await designationModel.createDesignation(
      designation_name.trim(), description
    );
    res.status(201).json(designation);
  } catch (err) {
    next(err);
  }
};

exports.updateDesc = async (req, res, next) => {
  try {
    const id = req.params.id;
    const { description } = req.body;

    if (!description) {
      return res.status(400).json({ error: "Missing required description." });
    }

    const updated = await designationModel.updateDesignationDescription(
      id,
      description
    );
    if (!updated) {
      return res.status(404).json({ error: "Designation not found" });
    }

    res.json(updated);
  } catch (error) {
    next(error);
  }
};
// Delete a designation by id
exports.delete = async (req, res, next) => {
  try {
    const designation_id = req.params.id;
    if (!designation_id) {
      return res.status(400).json({ error: "Designation id is required" });
    }

    const result = await designationModel.deleteDesignation(designation_id);
    if (!result) {
      return res.status(404).json({ error: "Designation not found" });
    }
    if (result && result.message) {
      // Cannot delete due to assigned assets
      return res.status(409).json({ error: result.message });
    }
    res.json({
      message: "Designation deleted successfully",
      designation: result,
    });
  } catch (err) {
    next(err);
  }
};
// List all designations
exports.listAll = async (req, res, next) => {
  try {
    const designations = await designationModel.listAllDesignations();
    res.json(designations);
  } catch (err) {
    next(err);
  }
};
