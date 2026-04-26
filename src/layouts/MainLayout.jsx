import React from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { LayoutDashboard, Users, BarChart2, MessageSquare, Settings, HelpCircle, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function MainLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // 🛡️ Filter navigation links based on user role
  const navLinks = [
    { name: "Dashboard", path: "/", icon: LayoutDashboard, roles: ['teacher', 'student'] },
    { name: "Students", path: "/students", icon: Users, roles: ['teacher', 'student'] },
    { name: "Analytics", path: "/analytics", icon: BarChart2, roles: ['teacher'] }, // Teacher Only
    { name: "Messages", path: "/messages", icon: MessageSquare, roles: ['teacher', 'student'] },
    { name: "Settings", path: "/settings", icon: Settings, roles: ['teacher', 'student'] },
    { name: "Help Centre", path: "/help", icon: HelpCircle, roles: ['teacher', 'student'] },
  ];

  // Only show links the user has permission to see
  const visibleLinks = navLinks.filter(link => link.roles.includes(user?.role));

  return (
    <div className="flex h-screen bg-[#050505] text-[#E0E0E0] font-sans selection:bg-[#22C55E]/30 overflow-hidden">
      
      {/* ================= SIDEBAR ================= */}
      <aside className="w-64 bg-[#0A0A0A] border-r border-[#1A1A1A] flex flex-col justify-between shrink-0">
        <div>
          {/* Logo */}
          <div className="p-6 sm:p-8 flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-[#22C55E] text-black font-extrabold text-lg flex items-center justify-center shadow-[0_0_15px_rgba(34,197,94,0.3)]">
              E
            </div>
            <h1 className="text-xl font-bold text-white tracking-tight">EduAI</h1>
          </div>

          {/* Navigation Links */}
          <nav className="px-4 space-y-1">
            {visibleLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all ${
                    isActive
                      ? "bg-[#22C55E] text-black shadow-[0_0_15px_rgba(34,197,94,0.15)]" // 🟢 ACTIVE STATE
                      : "text-[#888] hover:text-white hover:bg-[#111]"                 // ⚪ INACTIVE STATE
                  }`
                }
              >
                <link.icon size={18} />
                {link.name}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Logout Button */}
        <div className="p-4 border-t border-[#1A1A1A]">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-[#666] hover:text-[#EF4444] hover:bg-[#EF4444]/10 rounded-xl transition-all font-semibold"
          >
            <LogOut size={18} />
            Log Out
          </button>
        </div>
      </aside>

      {/* ================= MAIN CONTENT AREA ================= */}
      {/* The <Outlet /> is where React Router injects the actual page content (Dashboard, Students, etc.) */}
      <main className="flex-1 overflow-hidden flex flex-col bg-[#050505]">
        <Outlet /> 
      </main>

    </div>
  );
}