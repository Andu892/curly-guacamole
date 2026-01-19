import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Signup() {
  const nav = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // ❌ Prevent logged-in users from accessing signup
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      nav("/admin/dashboard");
    }
  }, [nav]);

  const handleSignup = async () => {
    if (!name || !email || !password) {
      alert("All fields are required");
      return;
    }



  try {
    await axios.post(
      "/api/admin/register",
      { name, email, password }
    );

    alert("Admin registered successfully");
    nav("/admin/login"); // go to login
  } catch (err) {
    alert(err.response?.data?.message || "Signup failed");
  }
};

  return (
    <div style={page}>
      <div style={card}>
        <h1>EduNexus</h1>
        <h3>Create Account</h3>

        <input style={input} placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} />
        <input style={input} placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input style={input} type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />

        <button style={btn} onClick={handleSignup}>Signup</button>
      </div>
    </div>
  );
}

const page={background:"#081a33",minHeight:"100vh",display:"flex",justifyContent:"center",alignItems:"center"};
const card={background:"white",padding:"35px",width:"350px",borderRadius:"15px",textAlign:"center",boxShadow:"0 0 25px rgba(0,0,0,0.4)"};
const input={width:"100%",padding:"12px",margin:"10px 0",borderRadius:"8px",border:"1px solid #ccc"};
const btn={width:"100%",padding:"12px",background:"#081a33",color:"white",border:"none",borderRadius:"8px",marginTop:"10px"};