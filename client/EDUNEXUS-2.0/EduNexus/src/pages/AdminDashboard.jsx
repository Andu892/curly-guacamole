import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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
  const [students, setStudents] = useState([
    { id: 1, name: "John Doe", rollNumber: "12345", email: "john@example.com", department: "CS", year: "3", attendance: 85, results: "A" },
    { id: 2, name: "Jane Smith", rollNumber: "12346", email: "jane@example.com", department: "IT", year: "2", attendance: 90, results: "B+" },
  ]);

  // Edit State
  const [editingStudent, setEditingStudent] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token || role !== "admin") {
      navigate("/admin/login");
      return;
    }

    const verifyAdmin = async () => {
      try {
        await axios.get("http://localhost:5000/api/admin/profile", {
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

    // Add to local state instead of API
    const newStudent = {
      id: students.length + 1,
      name,
      rollNumber,
      email,
      department,
      year,
      attendance: 0,
      results: "N/A"
    };
    setStudents([...students, newStudent]);

    alert("Student added successfully");
    setShowStudentForm(false);

    // Clear form
    setName("");
    setRollNumber("");
    setEmail("");
    setPassword("");
    setDepartment("");
    setYear("");
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

  const handleUpdate = (e) => {
    e.preventDefault();
    const updatedStudents = students.map(s => 
      s.id === editingStudent.id ? { ...s, name, rollNumber, email, department, year } : s
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
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      setStudents(students.filter(s => s.id !== id));
      alert("Student deleted successfully");
    }
  };

  const handleAttendance = (student) => {
    const newAttendance = prompt("Enter new attendance percentage:", student.attendance);
    if (newAttendance !== null) {
      const updatedStudents = students.map(s => 
        s.id === student.id ? { ...s, attendance: parseInt(newAttendance) || 0 } : s
      );
      setStudents(updatedStudents);
    }
  };

  const handleResults = (student) => {
    const newResults = prompt("Enter new results grade:", student.results);
    if (newResults !== null) {
      const updatedStudents = students.map(s => 
        s.id === student.id ? { ...s, results: newResults } : s
      );
      setStudents(updatedStudents);
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
                <tr key={student.id}>
                  <td style={td}>{student.name}</td>
                  <td style={td}>{student.rollNumber}</td>
                  <td style={td}>{student.email}</td>
                  <td style={td}>{student.department}</td>
                  <td style={td}>{student.year}</td>
                  <td style={td}>{student.attendance}%</td>
                  <td style={td}>{student.results}</td>
                  <td style={td}>
                    <button style={actionBtn} onClick={() => handleEdit(student)}>Edit</button>
                    <button style={deleteBtn} onClick={() => handleDelete(student.id)}>Delete</button>
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
