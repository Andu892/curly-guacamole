const Student = require("../models/Student");
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateToken");
/**
 * @desc    Register student (Admin only)
 * @route   POST /api/students/register
 * @access  Private (Admin)
 */
const studentRegister = async (req, res) => {
  try {
    const { name, email, rollNumber, department, year, password } = req.body;

    if (!name || !email || !rollNumber || !department || !year || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const studentExists = await Student.findOne({
      $or: [{ email }, { rollNumber }],
    });

    if (studentExists) {
      return res
        .status(400)
        .json({ message: "Student already exists" });
    }

    const student = await Student.create({
      name,
      email,
      rollNumber,
      department,
      year,
      password,
      createdBy: req.admin._id,
    });

    res.status(201).json(student);
  } catch (error) {
    console.error("Student Register Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
const studentLogin = async (req, res) => {
  try {
    const { emailOrRoll, password } = req.body;

    const student = await Student.findOne({
      $or: [{ email: emailOrRoll }, { rollNumber: emailOrRoll }],
    }).select("+password");

    if (student && (await bcrypt.compare(password, student.password))) {
      res.json({
        _id: student._id,
        name: student.name,
        email: student.email,
        rollNumber: student.rollNumber,
        token: generateToken(student._id),
      });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    console.error("Student Login Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * @desc    Add student (same as register – optional usage)
 * @route   POST /api/students
 * @access  Private (Admin)
 */
const addStudent = async (req, res) => {
  try {
    const student = await Student.create({
      ...req.body,
      createdBy: req.admin._id,
    });

    res.status(201).json(student);
  } catch (error) {
    console.error("Add Student Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * @desc    Get student details by ID
 * @route   GET /api/students/:id
 * @access  Private (Admin)
 */
const getStudentDetail = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.status(200).json(student);
  } catch (error) {
    console.error("Get Student Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * @desc    Update student
 * @route   PUT /api/students/:id
 * @access  Private (Admin)
 */
const updateStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.status(200).json(student);
  } catch (error) {
    console.error("Update Student Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * @desc    Delete student
 * @route   DELETE /api/students/:id
 * @access  Private (Admin)
 */
const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    await student.deleteOne();
    res.status(200).json({ message: "Student deleted successfully" });
  } catch (error) {
    console.error("Delete Student Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * @desc    Mark student attendance
 * @route   PUT /api/students/:id/attendance
 * @access  Private (Admin)
 */
const studentAttendance = async (req, res) => {
  try {
    const { status } = req.body; // present / absent

    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    student.attendance = status;
    await student.save();

    res.status(200).json({ message: "Attendance updated" });
  } catch (error) {
    console.error("Attendance Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * @desc    Upload exam result
 * @route   PUT /api/students/:id/results
 * @access  Private (Admin)
 */
const uploadExamResult = async (req, res) => {
  try {
    const { semester, subjects } = req.body;

    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    let totalMarks = 0;
    subjects.forEach((s) => (totalMarks += s.marks));

    const percentage =
      (totalMarks / (subjects.length * 100)) * 100;

    let grade = "F";
    if (percentage >= 90) grade = "A";
    else if (percentage >= 75) grade = "B";
    else if (percentage >= 60) grade = "C";
    else if (percentage >= 40) grade = "D";

    student.results = {
      semester,
      subjects,
      totalMarks,
      percentage,
      grade,
    };

    await student.save();

    res.status(200).json(student.results);
  } catch (error) {
    console.error("Upload Result Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


/**
 * @desc    Get all students (Admin only)
 * @route   GET /api/students
 * @access  Private (Admin)
 */
const getAllStudents = async (req, res) => {
  try {
    const students = await Student.find().populate(
      "createdBy",
      "name email"
    );

    res.status(200).json(students);
  } catch (error) {
    console.error("Get Students Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


module.exports = {
  studentRegister,
  studentLogin,
  addStudent,
  getStudentDetail,
  deleteStudent,
  updateStudent,
  studentAttendance,
  uploadExamResult,
  getAllStudents,
};
