const Admin = require("../models/Admin");
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateToken");

/**
 * @desc    Register Admin
 * @route   POST /api/admin/register
 * @access  Public
 */
const registerAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 1️⃣ Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // 2️⃣ Check if admin already exists
    const adminExists = await Admin.findOne({ email });
    if (adminExists) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    // 3️⃣ Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 4️⃣ Create admin
    const admin = await Admin.create({
      name,
      email,
      password: hashedPassword,
    });

    // 5️⃣ Send response with token
    if (admin) {
      res.status(201).json({
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        token: generateToken(admin._id),
      });
    } else {
      res.status(400).json({ message: "Invalid admin data" });
    }
  } catch (error) {
    console.error("Register Admin Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * @desc    Login Admin
 * @route   POST /api/admin/login
 * @access  Public
 */
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1️⃣ Validate input
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // 2️⃣ Find admin by email
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // 3️⃣ Compare password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

  res.status(200).json({
  token: generateToken(admin._id),
  admin: {
    _id: admin._id,
    name: admin.name,
    email: admin.email,
    role: "admin",
  },
});

  } catch (error) {
    console.error("Login Admin Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};




// @desc   Get admin profile
// @route  GET /api/admin/profile
// @access Private
const getAdminProfile = async (req, res) => {
  try {
    const admin = req.admin;

    res.status(200).json({
      id: admin._id,
      name: admin.name,
      email: admin.email,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc   Update admin profile
// @route  PUT /api/admin/profile
// @access Private
const updateAdminProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin._id);

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // Update fields
    admin.name = req.body.name || admin.name;
    admin.email = req.body.email || admin.email;

    // Save
    const updatedAdmin = await admin.save();

    res.status(200).json({
      id: updatedAdmin._id,
      name: updatedAdmin.name,
      email: updatedAdmin.email,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};


module.exports = {
  registerAdmin,
  loginAdmin,
  getAdminProfile,
  updateAdminProfile,
};


