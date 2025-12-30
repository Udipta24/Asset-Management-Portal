const {
    createVendor,
    getAllVendors,
    getVendorById,
    updateVendor,
    deleteVendor,
  } = require("../models/vendorModel");
  
  /**
   * Create vendor
   */
  exports.createVendor = async (req, res, next) => {
    try {
      const vendor = await createVendor(req.body);
      res.status(201).json({
        message: "Vendor created successfully",
        vendor,
      });
    } catch (err) {
      next(err);
    }
  };
  
  /**
   * Get all vendors
   */
  exports.getVendors = async (req, res, next) => {
    try {
      const vendors = await getAllVendors();
      res.json({ vendors });
    } catch (err) {
      next(err);
    }
  };
  
  /**
   * Get vendor by ID
   */
  exports.getVendorById = async (req, res, next) => {
    try {
      const vendor = await getVendorById(req.params.vendorId);
  
      if (!vendor) {
        return res.status(404).json({ message: "Vendor not found" });
      }
  
      res.json({ vendor });
    } catch (err) {
      next(err);
    }
  };
  
  /**
   * Update vendor
   */
  exports.updateVendor = async (req, res, next) => {
    try {
      const updated = await updateVendor(
        req.params.vendorId,
        req.body
      );
  
      if (!updated) {
        return res.status(404).json({ message: "Vendor not found" });
      }
  
      res.json({
        message: "Vendor updated successfully",
        vendor: updated,
      });
    } catch (err) {
      next(err);
    }
  };
  
  /**
   * Delete vendor
   */
  exports.deleteVendor = async (req, res, next) => {
    try {
      const deleted = await deleteVendor(req.params.vendorId);
  
      if (!deleted) {
        return res.status(404).json({ message: "Vendor not found" });
      }
  
      res.json({
        message: "Vendor deleted successfully",
        vendor: deleted,
      });
    } catch (err) {
      next(err);
    }
  };
  