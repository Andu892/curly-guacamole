const jwt = require("jsonwebtoken");
const Student = require("../models/Student");

const protectStudent = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Optional role check if you add role in token later
    // if (decoded.role !== "student") {
    //   return res.status(403).json({ message: "Access denied" });
    // }

    const student = await Student.findById(decoded.id);

    if (!student) {
      return res.status(401).json({ message: "Student not found" });
    }

    req.student = student;
    next();
  } catch (error) {
    console.error("Student Auth Error:", error.message);
    return res.status(401).json({ message: "Not authorized, token failed" });
  }
};

module.exports = { protectStudent };
