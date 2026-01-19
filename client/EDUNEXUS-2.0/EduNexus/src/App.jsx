import { Routes, Route } from "react-router-dom";

// Pages
import RoleSelect from "./pages/RoleSelect";
import Login from "./pages/Login"; // Admin Login
import Signup from "./pages/Signup";
import AdminDashboard from "./pages/AdminDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import StudentLogin from "./pages/StudentLogin";

function App() {
  return (
    <Routes>
      {/* 🌍 Public */}
      <Route path="/" element={<RoleSelect />} />

      {/* 🛡️ Admin Routes */}
      <Route path="/admin/login" element={<Login />} />
      <Route path="/admin/signup" element={<Signup />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />

      {/* 🎓 Student Routes */}
      <Route path="/student/login" element={<StudentLogin />} />
      <Route path="/student/dashboard" element={<StudentDashboard />} />

      {/* ❌ Fallback */}
      <Route path="*" element={<RoleSelect />} />
    </Routes>
  );
}

export default App;
