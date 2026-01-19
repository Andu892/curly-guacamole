const express = require("express");
const router = express.Router();

const {
  studentRegister,
  studentLogin,
  addStudent,
  getStudentDetail,
  deleteStudent,
  updateStudent,
  studentAttendance,
  uploadExamResult,
  getAllStudents,
} = require("../controllers/studentController");

// Import student middleware
const { protectStudent } = require("../middleware/studentAuthMiddleware");
router.post("/login", studentLogin);
const { protectAdmin } = require("../middleware/authMiddleware");
//login
router.get("/profile", protectStudent, getStudentDetail);
/**
 * 🔒 All routes below are ADMIN ONLY
 */
router.use(protectAdmin);

// ================= STUDENT ROUTES =================

// Register student
// POST /api/students/register
router.post("/register", studentRegister);
console.log("Student routes loaded");

// Add student (optional duplicate entry point)
// POST /api/students
router.post("/", addStudent);

// Get student details
// GET /api/students/:id
router.get("/:id", getStudentDetail);

// Update student
// PUT /api/students/:id
router.put("/:id", updateStudent);

// Delete student
// DELETE /api/students/:id
router.delete("/:id", deleteStudent);

// Student attendance
// PUT /api/students/:id/attendance
router.put("/:id/attendance", studentAttendance);

// Upload exam results
// PUT /api/students/:id/results
router.put("/:id/results", uploadExamResult);


// Get all students
// GET /api/students
router.get("/", getAllStudents);




module.exports = router;
