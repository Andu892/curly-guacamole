import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function AdminDashboard() {
  const navigate = useNavigate();

  // Student Form State
  const [showStudentForm, setShowStudentForm] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [rollNumber, setRollNumber] = useState("");
  const [department, setDepartment] = useState("");
  const [year, setYear] = useState("");
  const [password, setPassword] = useState("");

  // Students List State
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("/api/students", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStudents(res.data);
      } catch (error) {
        console.error("Failed to fetch students:", error);
      }
    };

    fetchStudents();
  }, []);

  // Edit State
  const [editingStudent, setEditingStudent] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    if (!token || !user || user.role !== "admin") {
      navigate("/admin/login");
      return;
    }

    const verifyAdmin = async () => {
      try {
        await axios.get("/api/admin/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch (error) {
        localStorage.clear();
        navigate("/admin/login");
      }
    };

    verifyAdmin();
  }, [navigate]);

  const logoutHandler = () => {
    localStorage.clear();
    navigate("/");
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    // Validation
    if (!name.trim() || !rollNumber.trim() || !email.trim() || !password.trim() || !department.trim() || !year.trim()) {
      alert("All fields are required");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post("/api/students/register", {
        name,
        email,
        rollNumber,
        department,
        year: parseInt(year),
        password,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setStudents([...students, res.data]);
      alert("Student added successfully");
      setShowStudentForm(false);

      // Clear form
      setName("");
      setRollNumber("");
      setEmail("");
      setPassword("");
      setDepartment("");
      setYear("");
    } catch (error) {
      alert(error.response?.data?.message || "Failed to add student");
    }
  };

  const handleEdit = (student) => {
    setEditingStudent(student);
    setName(student.name);
    setRollNumber(student.rollNumber);
    setEmail(student.email);
    setDepartment(student.department);
    setYear(student.year);
    setShowEditForm(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(`/api/students/${editingStudent._id}`, {
        name,
        rollNumber,
        email,
        department,
        year: parseInt(year),
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const updatedStudents = students.map(s => 
        s._id === editingStudent._id ? res.data : s
      );
      setStudents(updatedStudents);
      alert("Student updated successfully");
      setShowEditForm(false);
      setEditingStudent(null);
      // Clear form
      setName("");
      setRollNumber("");
      setEmail("");
      setDepartment("");
      setYear("");
    } catch (error) {
      alert(error.response?.data?.message || "Failed to update student");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`/api/students/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStudents(students.filter(s => s._id !== id));
        alert("Student deleted successfully");
      } catch (error) {
        alert(error.response?.data?.message || "Failed to delete student");
      }
    }
  };

  const handleAttendance = async (student) => {
    const status = prompt("Enter attendance status (present/absent):", student.attendance);
    if (status && (status === "present" || status === "absent")) {
      try {
        const token = localStorage.getItem("token");
        await axios.put(`/api/students/${student._id}/attendance`, {
          status,
        }, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const updatedStudents = students.map(s => 
          s._id === student._id ? { ...s, attendance: status } : s
        );
        setStudents(updatedStudents);
      } catch (error) {
        alert("Failed to update attendance");
      }
    }
  };

  const handleResults = async (student) => {
    const newResults = prompt("Enter new results grade:", student.results);
    if (newResults !== null) {
      try {
        const token = localStorage.getItem("token");
        await axios.put(`/api/students/${student._id}/results`, {
          grade: newResults,
        }, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const updatedStudents = students.map(s => 
          s._id === student._id ? { ...s, results: newResults } : s
        );
        setStudents(updatedStudents);
      } catch (error) {
        alert("Failed to update results");
      }
    }
  };

  return (
    <div style={layout}>
      <div style={sidebar}>
        <h2>EduNexus</h2>
        <p>Dashboard</p>
        <p>Students</p>
        <p>Teachers</p>
        <p>Reports</p>

        <button onClick={logoutHandler} style={logoutBtn}>
          Logout
        </button>
      </div>

      <div style={content}>
        <div style={navbar}>Admin Dashboard</div>

        <div style={grid}>
          <div style={box} onClick={() => setShowStudentForm(true)}>
            Add Student
          </div>
          <div style={box}>Edit Records</div>
          <div style={box}>Delete Student</div>
          <div style={box}>Analytics</div>
        </div>

        {/* Student Register Form */}
        {showStudentForm && (
          <div style={formContainer}>
            <h3>Register Student</h3>
            <input
              style={input}
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              style={input}
              placeholder="Roll Number"
              value={rollNumber}
              onChange={(e) => setRollNumber(e.target.value)}
            />
            <input
              style={input}
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              style={input}
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <input
              style={input}
              placeholder="Department"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
            />
            <input
              style={input}
              placeholder="Year"
              value={year}
              onChange={(e) => setYear(e.target.value)}
            />
            <button style={btn} onClick={handleRegister}>
              Register Student
            </button>
          </div>
        )}

        {/* Students List */}
        <div style={listContainer}>
          <h3>Students List</h3>
          <table style={table}>
            <thead>
              <tr>
                <th style={th}>Name</th>
                <th style={th}>Roll Number</th>
                <th style={th}>Email</th>
                <th style={th}>Department</th>
                <th style={th}>Year</th>
                <th style={th}>Attendance</th>
                <th style={th}>Results</th>
                <th style={th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map(student => (
                <tr key={student._id}>
                  <td style={td}>{student.name}</td>
                  <td style={td}>{student.rollNumber}</td>
                  <td style={td}>{student.email}</td>
                  <td style={td}>{student.department}</td>
                  <td style={td}>{student.year}</td>
                  <td style={td}>{student.attendance}</td>
                  <td style={td}>{student.results}</td>
                  <td style={td}>
                    <button style={actionBtn} onClick={() => handleEdit(student)}>Edit</button>
                    <button style={deleteBtn} onClick={() => handleDelete(student._id)}>Delete</button>
                    <button style={actionBtn} onClick={() => handleAttendance(student)}>Attendance</button>
                    <button style={actionBtn} onClick={() => handleResults(student)}>Results</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Edit Student Form */}
        {showEditForm && (
          <div style={formContainer}>
            <h3>Edit Student</h3>
            <input
              style={input}
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              style={input}
              placeholder="Roll Number"
              value={rollNumber}
              onChange={(e) => setRollNumber(e.target.value)}
            />
            <input
              style={input}
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              style={input}
              placeholder="Department"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
            />
            <input
              style={input}
              placeholder="Year"
              value={year}
              onChange={(e) => setYear(e.target.value)}
            />
            <button style={btn} onClick={handleUpdate}>
              Update Student
            </button>
            <button style={btn} onClick={() => setShowEditForm(false)}>
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// Styling
const layout = { display: "flex", minHeight: "100vh", background: "#f4f7fb" };
const sidebar = { width: "220px", background: "#081a33", color: "white", padding: "20px" };
const content = { flex: 1, padding: "20px" };
const navbar = { background: "white", padding: "15px", borderRadius: "10px", marginBottom: "20px" };
const grid = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "20px" };
const box = { background: "white", padding: "20px", borderRadius: "12px", boxShadow: "0 4px 10px rgba(0,0,0,0.1)", textAlign: "center" };

const formContainer = {
  background: "white",
  padding: "25px",
  marginTop: "20px",
  borderRadius: "12px",
  boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
};

const input = { width: "100%", padding: "12px", margin: "10px 0", borderRadius: "8px", border: "1px solid #ccc" };
const btn = { width: "100%", padding: "12px", background: "#081a33", color: "white", border: "none", borderRadius: "8px", marginTop: "10px" };
const logoutBtn = { marginTop: "20px", padding: "10px", width: "100%", borderRadius: "6px", border: "none", cursor: "pointer" };

const listContainer = {
  background: "white",
  padding: "25px",
  marginTop: "20px",
  borderRadius: "12px",
  boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
};

const table = {
  width: "100%",
  borderCollapse: "collapse",
};

const th = {
  border: "1px solid #ddd",
  padding: "8px",
  textAlign: "left",
  backgroundColor: "#f2f2f2",
};

const td = {
  border: "1px solid #ddd",
  padding: "8px",
};

const actionBtn = { ...btn, width: "auto", margin: "0 5px", padding: "5px 10px" };
const deleteBtn = { ...actionBtn, background: "#ff4d4d" };
