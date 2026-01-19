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

    try {
      const token = localStorage.getItem("token");

      await axios.post(
        "http://localhost:5000/api/students/register",
        { name, rollNumber, email, password, department, year },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Student registered successfully");
      setShowStudentForm(false);

      // Clear form
      setName("");
      setRollNumber("");
      setEmail("");
      setPassword("");
      setDepartment("");
      setYear("");
    } catch (error) {
      console.log(error.response?.data);
      alert(error.response?.data?.message || "Registration failed");
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
