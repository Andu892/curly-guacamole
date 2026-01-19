import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function RoleSelect() {
  const nav = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    // If already logged in, redirect properly
    if (!token || !role) return;

    if (role === "admin") {
      nav("/admin/dashboard");
    } else if (role === "student") {
      nav("/student/dashboard");
    } else {
      localStorage.clear(); // safety
    }
  }, [nav]);

  return (
    <div style={page}>
      <div style={card}>
        <h2>Select Role</h2>

        <button style={btn} onClick={() => nav("/student/login")}>
          Student
        </button>
        <button style={btn} onClick={() => nav("/admin/login")}>
          Admin
        </button>
      </div>
    </div>
  );
}

const page={background:"#081a33",minHeight:"100vh",display:"flex",justifyContent:"center",alignItems:"center"};
const card={background:"white",padding:"35px",width:"350px",borderRadius:"15px",textAlign:"center",boxShadow:"0 0 25px rgba(0,0,0,0.4)"};
const btn={width:"100%",padding:"12px",background:"#081a33",color:"white",border:"none",borderRadius:"8px",margin:"10px 0"};