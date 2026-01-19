const express = require("express");
const router = express.Router();

const {
  registerAdmin,
  loginAdmin,
} = require("../controllers/admincontroller");

const { protectAdmin } = require("../middleware/authMiddleware");

// ================= PUBLIC ROUTES =================

// Register Admin
// POST /api/admin/register
router.post("/register", registerAdmin);

// Login Admin
// POST /api/admin/login
router.post("/login", loginAdmin);

// ================= PROTECTED ROUTES (EXAMPLE) =================

// Admin Profile (test protected route)
// GET /api/admin/profile
router.get("/profile", protectAdmin, (req, res) => {
  res.status(200).json(req.admin);
});

module.exports = router;
