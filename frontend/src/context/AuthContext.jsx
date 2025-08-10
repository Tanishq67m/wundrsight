import React, { createContext, useState, useEffect, useContext } from "react";
import * as api from "../api/auth";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [role, setRole] = useState(() => localStorage.getItem("role"));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
    } else {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
    }
  }, [token, role]);

  async function login(email, password) {
    setLoading(true);
    try {
      const data = await api.login(email, password);
      setToken(data.token);
      setRole(data.role);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      throw err;
    }
  }

  async function register(name, email, password) {
    setLoading(true);
    try {
      await api.register(name, email, password);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      throw err;
    }
  }

  function logout() {
    setToken(null);
    setRole(null);
  }

  return (
    <AuthContext.Provider value={{ token, role, login, logout, register, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
