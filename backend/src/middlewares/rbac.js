// role based authorization
exports.authorize = (...roles) => (req, res, next) => {
  // Check that user info is set in the request (by prior authentication middleware)
  if (!req.user || !req.user.role) {
    return res.status(403).json({ message: "Access denied: No user role" });
  }
  // Only allow if user role matches allowed roles (defaults to user if no roles given)
  const allowedRoles = roles.length ? roles : ["user"];
  
  if (!allowedRoles.includes(req.user.role)) {
    return res.status(403).json({ message: "Access denied: Insufficient role" });
  }
  next();
}