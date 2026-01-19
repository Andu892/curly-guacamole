import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function StudentDashboard() {
  const navigate = useNavigate();
  const [student, setStudent] = useState({});


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
    const studentId = localStorage.getItem("studentId");

    console.log("token:", token);
    console.log("role:", role);
    console.log("studentId:", studentId);

if (!token || role !== "student") {
  navigate("/student/login");
  return;
}


    // if no studentId, don't crash
    if (!studentId) {
      console.log("studentId missing");
      return;
    }

    const fetchStudentDetails = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/students/${studentId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setStudent(res.data);
      } catch (error) {
       console.log("Fetch student error:", error.response?.data || error.message);
  // localStorage.clear();
  // navigate("/student/login");
        }   
       };

    fetchStudentDetails();
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
          </div>
          <div style={{ background: "white", padding: "20px", borderRadius: "12px", boxShadow: "0 4px 10px rgba(0,0,0,0.1)", textAlign: "center" }}>
            Attendance
          </div>
          <div style={{ background: "white", padding: "20px", borderRadius: "12px", boxShadow: "0 4px 10px rgba(0,0,0,0.1)", textAlign: "center" }}>
            Marks
          </div>
          <div style={{ background: "white", padding: "20px", borderRadius: "12px", boxShadow: "0 4px 10px rgba(0,0,0,0.1)", textAlign: "center" }}>
            Assignments
          </div>
          <div style={{ background: "white", padding: "20px", borderRadius: "12px", boxShadow: "0 4px 10px rgba(0,0,0,0.1)", textAlign: "center" }}>
            Notices
          </div>
        </div>
      </div>
    </div>
  );
}
