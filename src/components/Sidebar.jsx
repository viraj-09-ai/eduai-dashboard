import React from "react";
import { NavLink } from "react-router-dom";
import { 
  LayoutDashboard, 
  Users, 
  BarChart2, 
  Settings, 
  MessageSquare, 
  HelpCircle, 
  Search,
  LogOut
} from "lucide-react";

// 🔥 IMPORTANT: Ensure this file exists at src/components/NotificationBell.jsx
import NotificationBell from "./NotificationBell";

export default function Sidebar() {
  const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/" },
    { name: "Students", icon: Users, path: "/students" },
    { name: "Analytics", icon: BarChart2, path: "/analytics" },
  ];

  const settingItems = [
    { name: "Messages", icon: MessageSquare, path: "/messages" },
    { name: "Settings", icon: Settings, path: "/settings" },
    { name: "Help Centre", icon: HelpCircle, path: "/help" },
  ];

  return (
    <div className="w-[280px] h-screen bg-[#0A0A0A] border-r border-[#1A1A1A] flex flex-col px-5 py-6 font-sans text-sm selection:bg-[#22C55E]/30 shrink-0">
      
      {/* Brand Logo & Notification Bell Section */}
      <div className="flex items-center justify-between mb-8 px-2">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#22C55E] flex items-center justify-center shadow-[0_0_15px_rgba(34,197,94,0.3)]">
            <span className="text-black font-extrabold text-lg leading-none">E</span>
          </div>
          <span className="text-white font-bold text-lg tracking-wide">EduAI</span>
        </div>

        {/* 🔥 THE NOTIFICATION BELL COMPONENT */}
        <NotificationBell />
      </div>

      {/* Sidebar Search */}
      <div className="relative mb-8">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#666]" size={16} />
        <input 
          type="text" 
          placeholder="Search" 
          className="w-full bg-[#121212] border border-[#222] text-white rounded-xl pl-9 pr-4 py-2.5 outline-none focus:border-[#22C55E]/50 focus:bg-[#161616] placeholder-[#666] transition-all"
        />
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar pr-1">
        <p className="text-[10px] text-[#555] font-bold uppercase tracking-widest mb-3 px-2">Dashboard</p>
        <ul className="space-y-1.5 mb-8">
          {menuItems.map((item) => (
            <li key={item.name}>
              <NavLink 
                to={item.path}
                className={({ isActive }) => `
                  flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all font-medium group
                  ${isActive 
                    ? "bg-[#22C55E] text-black shadow-[0_0_20px_rgba(34,197,94,0.15)]" 
                    : "text-[#888] hover:text-white hover:bg-[#151515]"}
                `}
              >
                {({ isActive }) => (
                  <>
                    <item.icon size={18} className={isActive ? "text-black" : "text-[#888] group-hover:text-white"} />
                    {item.name}
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>

        <p className="text-[10px] text-[#555] font-bold uppercase tracking-widest mb-3 px-2">Settings</p>
        <ul className="space-y-1.5">
          {settingItems.map((item) => (
            <li key={item.name}>
              <NavLink 
                to={item.path}
                className={({ isActive }) => `
                  flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all font-medium group
                  ${isActive 
                    ? "bg-[#22C55E] text-black shadow-[0_0_20px_rgba(34,197,94,0.15)]" 
                    : "text-[#888] hover:text-white hover:bg-[#151515]"}
                `}
              >
                {({ isActive }) => (
                  <>
                    <item.icon size={18} className={isActive ? "text-black" : "text-[#888] group-hover:text-white"} />
                    {item.name}
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>

      {/* Log Out Section */}
      <div className="mt-auto pt-6 border-t border-[#1A1A1A]">
        <NavLink to="/login" className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all font-medium text-[#888] hover:text-[#EF4444] hover:bg-[#EF4444]/10 group">
          <LogOut size={18} className="text-[#888] group-hover:text-[#EF4444] transition-colors" />
          Log Out
        </NavLink>
      </div>
    </div>
  );
}