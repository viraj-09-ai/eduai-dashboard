import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);
  
  const navigate = useNavigate();

  // 🔌 YOUR BACKEND AUTH URL
  const AUTH_URL = "https://eduai-dashboard.onrender.com/api/auth";

  useEffect(() => {
    if (token) {
      // In a real production app, you would decode the JWT token here to get the exact role.
      // For now, we will rely on the role returned during login.
      const storedRole = localStorage.getItem('role') || 'student';
      const storedEmail = localStorage.getItem('email') || '';
      setUser({ role: storedRole, email: storedEmail }); 
    }
    setLoading(false);
  }, [token]);

  // 🟢 LOGIN FUNCTION
  const login = async (email, password) => {
    try {
      const res = await fetch(`${AUTH_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Login failed");
      }

      // Save token and role, then set user state
      localStorage.setItem('token', data.token);
      localStorage.setItem('role', data.role);
      localStorage.setItem('email', data.email);
      setToken(data.token);
      setUser({ email: data.email, role: data.role });
      
      navigate("/");
      return { success: true };
    } catch (error) {
      console.error("Login Error:", error);
      return { success: false, error: error.message };
    }
  };

  // 🔵 REGISTER FUNCTION (NEW!)
  const register = async (email, password, role) => {
    try {
      const res = await fetch(`${AUTH_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || data.message || "Registration failed");
      }

      return { success: true };
    } catch (error) {
      console.error("Registration Error:", error);
      return { success: false, error: error.message };
    }
  };

  // 🔴 LOGOUT FUNCTION
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('email');
    setToken(null);
    setUser(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}