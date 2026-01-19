import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function StudentDashboard() {
  const navigate = useNavigate();
  const [student, setStudent] = useState({
    name: "John Doe",
    rollNumber: "12345",
    email: "john@example.com",
    department: "CS",
    year: "3",
    attendance: 85,
    results: "A"
  });


   const logoutHandler = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("studentId");
    navigate("/");
  };   

   // ✅ Logout button styles (IMPORTANT)
  const logoutBtn = {
    marginTop: "20px",
    padding: "10px",
    width: "100%",
    borderRadius: "6px",
    border: "none",
    cursor: "pointer",
    background: "#ff4d4d",
    color: "white",
  };
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token || role !== "student") {
      navigate("/student/login");
      return;
    }
  }, [navigate]);

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f4f7fb" }}>
      <div style={{ width: "220px", background: "#081a33", color: "white", padding: "20px" }}>
        <h2>EduNexus</h2>
        <p>Dashboard</p>
        <p>Profile</p>
        <p>Courses</p>
        <p>Results</p>

         {/* ✅ LOGOUT BUTTON */}
        <button onClick={logoutHandler} style={logoutBtn}>
          Logout
        </button>
      </div>
          
      <div style={{ flex: 1, padding: "20px" }}>
        <div style={{ background: "white", padding: "15px", borderRadius: "10px", marginBottom: "20px" }}>
          Student Dashboard
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "20px" }}>
          <div style={{ background: "white", padding: "20px", borderRadius: "12px", boxShadow: "0 4px 10px rgba(0,0,0,0.1)", textAlign: "center" }}>
            <h3>Welcome</h3>
            <p>{student?.name || "Student"}</p>
            <p>Roll: {student.rollNumber}</p>
            <p>Dept: {student.department}</p>
          </div>
          <div style={{ background: "white", padding: "20px", borderRadius: "12px", boxShadow: "0 4px 10px rgba(0,0,0,0.1)", textAlign: "center" }}>
            <h3>Attendance</h3>
            <p>{student.attendance}%</p>
          </div>
          <div style={{ background: "white", padding: "20px", borderRadius: "12px", boxShadow: "0 4px 10px rgba(0,0,0,0.1)", textAlign: "center" }}>
            <h3>Marks</h3>
            <p>Grade: {student.results}</p>
          </div>
          <div style={{ background: "white", padding: "20px", borderRadius: "12px", boxShadow: "0 4px 10px rgba(0,0,0,0.1)", textAlign: "center" }}>
            <h3>Assignments</h3>
            <p>Pending: 2</p>
          </div>
          <div style={{ background: "white", padding: "20px", borderRadius: "12px", boxShadow: "0 4px 10px rgba(0,0,0,0.1)", textAlign: "center" }}>
            <h3>Notices</h3>
            <p>New: 1</p>
          </div>
        </div>
      </div>
    </div>
  );
}
