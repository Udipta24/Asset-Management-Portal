// internal modules
const {
  getUserByEmail,
  getUserByPublicId,
  updateUserById,
  deleteUserById,
  promote,
  getAllUsers,
} = require("../models/userModel");

// Verify current session - returns user info if logged in
exports.me = async (req, res, next) => {
  try {
    // This endpoint requires authenticate middleware, so req.user is already set
    // Fetch full user details from database to get full_name
    const user = await getUserByEmail(req.user.email);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({
      user: {
        user_id: user.user_id,
        public_id: user.public_id,
        name: user.name,
        email: user.email,
        role: user.role_name,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    const userId = req.params.userId; // Should be the internal user_id, not public_id
    const updateFields = req.body;

    // Optionally, restrict who can update user details, depending on your requirements

    // Only allow permitted fields to update; checked in model as well
    const updatedUser = await updateUserById(userId, updateFields);

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (err) {
    next(err);
  }
};

exports.promoteUser = async (req, res, next) => {
  try {
    const { userId } = req.params; // This should be public_id from frontend
    const { role } = req.query;

    // Prevent self-promotion
    if (req.user.public_id === userId) {
      return res.status(403).json({
        message: "You cannot promote yourself",
      });
    }

    // Get user by public_id to get internal user_id
    const targetUser = await getUserByPublicId(userId);
    console.log(targetUser);
    if (!targetUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if user is already ASSET_MANAGER
    if (targetUser.role_name === "ASSET MANAGER" || targetUser.role_name === "MAINTENANCE ENGINEER" || targetUser.role_name === "ADMIN") {
      return res.status(400).json({
        message: "User is already promoted",
      });
    }

    // Promote user
    const promotedUser = await promote(targetUser.user_id, targetUser.department_id, role.toUpperCase());

    res.json({
      message: "User promoted to ASSET_MANAGER successfully",
      user: {
        user_id: promotedUser.public_id,
        name: promotedUser.name,
        email: promotedUser.email,
        department: promotedUser.department_name,
        role: promotedUser.role_name,
      },
    });
  } catch (err) {
    // Handle database constraint violation (one ASSET_MANAGER per department)
    if (err.message && err.message.includes("already has an ASSET_MANAGER")) {
      return res.status(409).json({ message: err.message });
    }
    next(err);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const userId = req.params.userId;

    // Optionally, restrict who can delete user accounts

    const deletedUser = await deleteUserById(userId);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User deleted successfully", user: deletedUser });
  } catch (err) {
    next(err);
  }
};

exports.listUsers = async (req, res, next) => {
  try {
    const { department_id, designation_id } = req.query;

    const users = await getAllUsers({ department_id, designation_id });

    res.json({ users });
  } catch (err) {
    next(err);
  }
};

exports.userByPublicId = async (req, res, next) => {
  try {
    const user = await getUserByPublicId(req.params.publicId);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ user });
  } catch (err) {
    next(err);
  }
};
