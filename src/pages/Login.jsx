import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { User, Shield, CheckCircle2 } from "lucide-react";

export default function Login() {
  const [isLoginMode, setIsLoginMode] = useState(true); // Toggles between Login and Register
  
  // Form States
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student"); // Default registration role
  
  // Status States
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const { login, register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");
    setIsLoading(true);

    if (isLoginMode) {
      // --- LOGIN FLOW ---
      const result = await login(email, password);
      if (!result.success) {
        setError(result.error || "Invalid credentials. Please try again.");
      }
    } else {
      // --- REGISTRATION FLOW ---
      const result = await register(email, password, role);
      if (result.success) {
        setSuccessMsg("Account created successfully! You can now log in.");
        setIsLoginMode(true); // Auto-switch back to login mode
        setPassword(""); // Clear password for safety
      } else {
        setError(result.error || "Failed to create account. Email may already exist.");
      }
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4 selection:bg-[#22C55E]/30 font-sans">
      <div className="w-full max-w-md bg-[#0A0A0A] p-8 rounded-[2rem] border border-[#1A1A1A] shadow-2xl relative overflow-hidden transition-all duration-300">
        
        {/* Glow effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-1 bg-[#22C55E] shadow-[0_0_20px_#22C55E]"></div>

        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-[#22C55E] text-black font-extrabold text-2xl flex items-center justify-center mx-auto mb-4 shadow-[0_0_20px_rgba(34,197,94,0.3)]">
            E
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">EduAI Portal</h1>
          <p className="text-sm text-[#666] mt-2">
            {isLoginMode ? "Enter your credentials to access the system" : "Create a new account to join the platform"}
          </p>
        </div>

        {/* 🔄 MODE TOGGLE */}
        <div className="flex p-1 bg-[#111] rounded-xl mb-6 border border-[#222]">
          <button 
            type="button"
            onClick={() => { setIsLoginMode(true); setError(""); setSuccessMsg(""); }}
            className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${isLoginMode ? 'bg-[#22C55E] text-black shadow-md' : 'text-[#666] hover:text-white'}`}
          >
            Sign In
          </button>
          <button 
            type="button"
            onClick={() => { setIsLoginMode(false); setError(""); setSuccessMsg(""); }}
            className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${!isLoginMode ? 'bg-[#22C55E] text-black shadow-md' : 'text-[#666] hover:text-white'}`}
          >
            Create Account
          </button>
        </div>

        {/* MESSAGES */}
        {error && (
          <div className="mb-6 p-3 bg-[#EF4444]/10 border border-[#EF4444]/20 rounded-xl text-[#EF4444] text-sm text-center font-medium animate-pulse">
            {error}
          </div>
        )}
        {successMsg && (
          <div className="mb-6 p-3 bg-[#22C55E]/10 border border-[#22C55E]/20 rounded-xl text-[#22C55E] text-sm text-center font-medium flex items-center justify-center gap-2">
            <CheckCircle2 size={16} /> {successMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* 🎓 ROLE SELECTOR (ONLY VISIBLE DURING REGISTRATION) */}
          {!isLoginMode && (
            <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
              <label className="text-xs font-bold text-[#888] uppercase tracking-wider">I am a...</label>
              <div className="grid grid-cols-2 gap-3">
                <button 
                  type="button" 
                  onClick={() => setRole('student')}
                  className={`py-3 border rounded-xl flex items-center justify-center gap-2 transition-all ${role === 'student' ? 'border-[#22C55E] bg-[#22C55E]/10 text-[#22C55E]' : 'border-[#222] bg-[#111] text-[#888] hover:border-[#444]'}`}
                >
                  <User size={18}/> Student
                </button>
                <button 
                  type="button" 
                  onClick={() => setRole('teacher')}
                  className={`py-3 border rounded-xl flex items-center justify-center gap-2 transition-all ${role === 'teacher' ? 'border-[#22C55E] bg-[#22C55E]/10 text-[#22C55E]' : 'border-[#222] bg-[#111] text-[#888] hover:border-[#444]'}`}
                >
                  <Shield size={18}/> Teacher
                </button>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-xs font-bold text-[#888] uppercase tracking-wider">Email Address</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#111] border border-[#222] text-white rounded-xl px-4 py-3 outline-none focus:border-[#22C55E] focus:bg-[#161616] transition-all"
              placeholder={isLoginMode ? "admin@eduai.com" : "newuser@eduai.com"}
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-[#888] uppercase tracking-wider">Password</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#111] border border-[#222] text-white rounded-xl px-4 py-3 outline-none focus:border-[#22C55E] focus:bg-[#161616] transition-all"
              placeholder="••••••••"
              minLength={6}
            />
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full mt-6 bg-[#22C55E] hover:bg-[#1db954] text-black font-bold py-3.5 rounded-xl transition-all shadow-[0_0_15px_rgba(34,197,94,0.2)] hover:shadow-[0_0_25px_rgba(34,197,94,0.35)] disabled:opacity-50 flex items-center justify-center"
          >
            {isLoading 
              ? "Processing..." 
              : isLoginMode 
                ? "Secure Login" 
                : "Create Account"}
          </button>
        </form>
      </div>
    </div>
  );
}