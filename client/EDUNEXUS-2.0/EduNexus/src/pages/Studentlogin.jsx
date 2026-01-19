import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function StudentLogin() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/students/login",
        { emailOrRoll: email, password }
      );

      console.log("LOGIN SUCCESS RESPONSE:", res.data);

      // ✅ Save auth data
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", "student");
      localStorage.setItem("studentId", res.data._id); // ✅ IMPORTANT

      // ✅ Go to student dashboard
      console.log("Navigating to student dashboard...");
      nav("/student/dashboard");
    } catch (err) {
      console.log("LOGIN ERROR FULL:", err);
      console.log("LOGIN ERROR RESPONSE:", err.response?.data);
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div style={page}>
      <div style={card}>
        <h1>EduNexus</h1>
        <h3>Student Login</h3>

        <input
          style={input}
          placeholder="Email or Roll Number"
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

        <button style={btn} onClick={handleLogin}>
          Login
        </button>
      </div>
    </div>
  );
}

const page = {
  background: "#081a33",
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const card = {
  background: "white",
  padding: "35px",
  width: "350px",
  borderRadius: "15px",
  textAlign: "center",
  boxShadow: "0 0 25px rgba(0,0,0,0.4)",
};

const input = {
  width: "100%",
  padding: "12px",
  margin: "10px 0",
  borderRadius: "8px",
  border: "1px solid #ccc",
};

const btn = {
  width: "100%",
  padding: "12px",
  background: "#081a33",
  color: "white",
  border: "none",
  borderRadius: "8px",
  marginTop: "10px",
};
