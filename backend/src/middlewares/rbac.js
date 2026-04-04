// role based authorization
exports.authorize = (...roles) => (req, res, next) => {
  // console.log("AUTHORIZE req.user =", req.user);
  //   console.log("EXPECTED ROLES =", roles);
  if (!req.user || !req.user.role) {
    return res.status(403).json({ message: "Access denied: No user role" });
  }
  const userRole = req.user.role.toUpperCase();
  // console.log("roles:", roles);
  // console.log("type:", typeof roles);
  const allowedRoles = roles.length 
    ? roles.map(r => r.toUpperCase()) 
    : ["USER"];
  // const allowedRoles = roles.map(r => r.toUpperCase());
  
  if (!allowedRoles.includes(userRole)) {
    return res.status(403).json({ message: "Access denied: Insufficient role" });
  }
  next();
}