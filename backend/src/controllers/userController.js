// internal modules
const { getUserByEmail } = require("../models/userModel");

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
          full_name: user.full_name,
          email: user.email,
          role: user.role,
        },
      });
    } catch (err) {
      next(err);
    }
  };