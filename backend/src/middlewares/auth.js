const jwt = require("jsonwebtoken");

exports.authenticate = (req, res, next) => {
  const cookieName = process.env.COOKIE_NAME || "asset_token";

  // Get token from HTTP-only cookie
  const token = req.cookies[cookieName];

  if (!token) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  try {
    // Decode JWT
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};
