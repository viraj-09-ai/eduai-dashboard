import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Context Providers
import { AuthProvider, useAuth } from "./context/AuthContext";
import { StudentProvider } from "./context/StudentContext";

// Layouts & Pages
import MainLayout from "./layouts/MainLayout"; 
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Students from "./pages/Students"; 
import Analytics from "./pages/Analytics";
import Messages from "./pages/Messages";
import Settings from "./pages/Settings";
import Help from "./pages/Help";

// 🛡️ SECURITY WRAPPER: Kicks users to /login if they aren't authenticated
const ProtectedRoute = ({ children }) => {
  const { token } = useAuth();
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  return (
    // We wrap the whole app in the Providers so every page can access data
    <AuthProvider>
      <StudentProvider>
        <div className="bg-[#050505] min-h-screen text-[#E0E0E0] font-sans selection:bg-[#22C55E]/30">
          <Routes>
            <Route path="/login" element={<Login />} />

            {/* 🛡️ All routes inside here are now PROTECTED */}
            <Route path="/" element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
              <Route index element={<Dashboard />} />
              <Route path="students" element={<Students />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="messages" element={<Messages />} />
              <Route path="settings" element={<Settings />} />
              <Route path="help" element={<Help />} />
            </Route>
            
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </div>
      </StudentProvider>
    </AuthProvider>
  );
}

export default App;