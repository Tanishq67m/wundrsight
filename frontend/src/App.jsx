import React, { useState } from "react";
import { ToastContainer } from "react-toastify";
import { useAuth } from "./context/AuthContext";
import Login from "./components/Login";
import Register from "./components/Register";
import PatientDashboard from "./components/PatientDashboard";
import AdminDashboard from "./components/AdminDashboard";
import Navbar from "./components/Navbar";

export default function App() {
  const { token, role, logout, setAuth } = useAuth();
  const [showLogin, setShowLogin] = useState(true);

  // Handle successful login/register
  function handleLogin(token, role) {
    setAuth(token, role);
  }

  // Show login or register forms if no token
  if (!token)
    return (
      <>
        <Navbar
          user={null}
          onLogout={logout}
          onShowLogin={() => setShowLogin(true)}
          onShowRegister={() => setShowLogin(false)}
        />
        {showLogin ? (
          <Login onLogin={handleLogin} />
        ) : (
          <Register onRegister={() => setShowLogin(true)} />
        )}
        <ToastContainer position="top-right" autoClose={3000} />
      </>
    );

  // Logged in view
  return (
    <>
      <Navbar user={{ role }} onLogout={logout} />
      <div className="max-w-4xl mx-auto mt-6">
        {role === "admin" ? (
          <AdminDashboard token={token} />
        ) : (
          <PatientDashboard token={token} />
        )}
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}
