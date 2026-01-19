const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    
    password: {
      type: String,
      required: true,
      select: false,
    },

    rollNumber: {
      type: String,
      required: true,
      unique: true,
    },

    department: {
      type: String,
      required: true,
    },

    year: {
      type: Number,
      required: true,
      min: 1,
      max: 4,
    },

    attendance: {
      type: String,
      enum: ["present", "absent"],
      default: "absent",
    },

    results: {
      semester: {
        type: Number,
      },
      subjects: [
        {
          subjectName: {
            type: String,
          },
          marks: {
            type: Number,
          },
        },
      ],
      totalMarks: {
        type: Number,
      },
      percentage: {
        type: Number,
      },
      grade: {
        type: String,
      },
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
studentSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;  // ✅ Add return to prevent next() being called twice
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const Student = mongoose.model("Student", studentSchema);

module.exports = Student;
