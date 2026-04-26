import React, { useState } from "react";
import { motion } from "framer-motion";
import { User, Bell, Lock, Shield, Globe, Save, CheckCircle2, AlertCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const fadeUp = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } }
};

export default function Settings() {
  const { user, token } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  const [notifications, setNotifications] = useState(true);

  // --- PASSWORD UPDATE STATES ---
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [pwdMessage, setPwdMessage] = useState({ type: "", text: "" });

  // --- HANDLE PASSWORD SUBMIT ---
  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setPwdMessage({ type: "", text: "" });

    if (!currentPassword || !newPassword) {
      return setPwdMessage({ type: "error", text: "Please fill out both fields." });
    }

    setIsUpdating(true);

    try {
      const res = await fetch("http://localhost:5000/api/auth/change-password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` // Securely pass the user's token
        },
        body: JSON.stringify({ currentPassword, newPassword })
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to update password");

      // Success! Clear fields and show message
      setPwdMessage({ type: "success", text: data.message });
      setCurrentPassword("");
      setNewPassword("");

    } catch (error) {
      setPwdMessage({ type: "error", text: error.message });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="p-6 sm:p-8 h-screen bg-[#050505] text-[#E0E0E0] w-full max-w-[1400px] mx-auto overflow-y-auto custom-scrollbar font-sans">
      <motion.div initial="hidden" animate="show" variants={fadeUp} className="mb-8">
        <h1 className="text-[26px] font-bold text-white tracking-tight">Account Settings</h1>
        <p className="text-[#666] text-sm mt-1">Manage your preferences and account security.</p>
      </motion.div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* SETTINGS SIDEBAR */}
        <motion.div initial="hidden" animate="show" variants={fadeUp} className="w-full md:w-64 shrink-0 space-y-2">
          {[
            { id: "profile", icon: User, label: "My Profile" },
            { id: "notifications", icon: Bell, label: "Notifications" },
            { id: "security", icon: Lock, label: "Security & Privacy" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setPwdMessage({ type: "", text: "" }); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                activeTab === tab.id 
                  ? "bg-[#22C55E]/10 text-[#22C55E] border border-[#22C55E]/20" 
                  : "bg-transparent text-[#888] hover:bg-[#111] hover:text-white border border-transparent"
              }`}
            >
              <tab.icon size={18} /> {tab.label}
            </button>
          ))}
        </motion.div>

        {/* SETTINGS CONTENT */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 bg-[#0A0A0A] border border-[#1A1A1A] rounded-[2rem] shadow-2xl p-6 sm:p-8">
          
          {activeTab === "profile" && (
            <div className="space-y-6">
              <div className="flex items-center gap-6 pb-6 border-b border-[#1A1A1A]">
                <div className="w-20 h-20 rounded-full bg-[#111] border-2 border-[#22C55E] p-1 flex items-center justify-center relative">
                   <div className="w-full h-full rounded-full bg-[#1A1A1A] flex items-center justify-center text-2xl font-bold text-white">
                      {user?.email?.charAt(0).toUpperCase() || 'U'}
                   </div>
                   <div className="absolute bottom-0 right-0 w-5 h-5 bg-[#22C55E] border-2 border-[#0A0A0A] rounded-full"></div>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">{user?.email || "User"}</h2>
                  <p className="text-sm text-[#22C55E] font-bold uppercase tracking-wider mt-1">{user?.role || "Student"} Account</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#888] uppercase tracking-wider">Email Address</label>
                  <input type="text" disabled value={user?.email || ""} className="w-full bg-[#111] border border-[#222] text-[#888] rounded-xl px-4 py-3 outline-none cursor-not-allowed" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#888] uppercase tracking-wider">Language</label>
                  <div className="relative">
                    <Globe size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#666]" />
                    <select className="w-full bg-[#111] border border-[#222] text-white rounded-xl pl-11 pr-4 py-3 outline-none appearance-none">
                      <option>English (UK)</option>
                      <option>English (US)</option>
                      <option>Spanish</option>
                    </select>
                  </div>
                </div>
              </div>
              <button className="flex items-center gap-2 bg-[#22C55E] text-black font-bold px-6 py-3 rounded-xl hover:bg-[#1db954] transition-all">
                <Save size={18} /> Save Changes
              </button>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="space-y-6">
              <h2 className="text-lg font-bold text-white border-b border-[#1A1A1A] pb-4">Communication Preferences</h2>
              
              <div className="flex items-center justify-between p-4 bg-[#111] border border-[#222] rounded-xl">
                <div>
                  <h3 className="font-bold text-white">System Alerts</h3>
                  <p className="text-xs text-[#888] mt-1">Receive notifications about attendance and marks.</p>
                </div>
                <button 
                  onClick={() => setNotifications(!notifications)}
                  className={`w-12 h-6 rounded-full transition-colors relative ${notifications ? 'bg-[#22C55E]' : 'bg-[#333]'}`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-all ${notifications ? 'left-7' : 'left-1'}`}></div>
                </button>
              </div>
            </div>
          )}

          {activeTab === "security" && (
            <div className="space-y-6">
              <h2 className="text-lg font-bold text-white border-b border-[#1A1A1A] pb-4">Security Settings</h2>
              
              {/* STATUS MESSAGES */}
              {pwdMessage.text && (
                <div className={`p-4 rounded-xl flex items-center gap-3 text-sm font-bold border ${pwdMessage.type === 'success' ? 'bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]/20' : 'bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/20'}`}>
                  {pwdMessage.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                  {pwdMessage.text}
                </div>
              )}

              <div className="p-6 bg-[#050505] border border-[#1A1A1A] rounded-2xl flex items-start gap-4">
                <Shield className="text-[#EF4444] shrink-0 mt-1" size={24} />
                <form onSubmit={handlePasswordUpdate} className="w-full">
                  <h3 className="font-bold text-[#EF4444] text-lg">Change Password</h3>
                  <p className="text-xs text-[#888] mt-1 mb-6">You will need to know your current password to set a new one. This will securely update your database record.</p>
                  
                  <div className="space-y-4 max-w-md">
                    <input 
                      type="password" 
                      placeholder="Current Password" 
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full bg-[#111] border border-[#222] text-white rounded-xl px-4 py-3 outline-none focus:border-[#EF4444]/50 text-sm transition-all" 
                    />
                    <input 
                      type="password" 
                      placeholder="New Password (min 6 chars)" 
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full bg-[#111] border border-[#222] text-white rounded-xl px-4 py-3 outline-none focus:border-[#EF4444]/50 text-sm transition-all" 
                    />
                    <button 
                      type="submit"
                      disabled={isUpdating}
                      className="px-6 py-3 bg-[#EF4444] text-white text-sm font-bold rounded-xl hover:bg-[#DC2626] disabled:opacity-50 transition-colors flex items-center gap-2"
                    >
                      {isUpdating ? "Securing..." : "Update Password"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

        </motion.div>
      </div>
    </div>
  );
}