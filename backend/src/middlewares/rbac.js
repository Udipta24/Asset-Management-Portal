// src/middlewares/rbac.js
// Usage: authorize('admin','asset_manager')
exports.authorize = (...allowedRoles) => (req, res, next) => {
  if (!req.user) return res.status(401).json({ message: "Not authenticated" });
  if (allowedRoles.length === 0) return next();
  if (!allowedRoles.includes(req.user.role)) return res.status(403).json({ message: "Forbidden" });
  next();
};
