const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");

/**
 * @desc    Protect admin routes
 */
const protectAdmin = async (req, res, next) => {
  let token;

  try {
    // 1️⃣ Check if token exists in headers
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];

      // 2️⃣ Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 3️⃣ Get admin from DB (without password)
      req.admin = await Admin.findById(decoded.id).select("-password");

      if (!req.admin) {
        return res.status(401).json({ message: "Admin not found" });
      }

      next();
    } else {
      return res.status(401).json({ message: "Not authorized, no token" });
    }
  } catch (error) {
    console.error("Auth Middleware Error:", error);
    res.status(401).json({ message: "Not authorized, token failed" });
  }
};

module.exports = { protectAdmin };
