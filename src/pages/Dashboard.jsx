import React, { useMemo } from "react";
import { motion } from "framer-motion";
import TrendChart from '../components/Charts/TrendChart';
import { Link } from "react-router-dom";
import {
  MoreVertical,
  TrendingUp,
  ChevronDown,
  AlertCircle,
  ArrowRight,
  Download,
  Users,
  Activity,
  Award,
  Zap 
} from "lucide-react";
import {
  BarChart, Bar, PieChart, Pie, Cell, 
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend
} from "recharts";

import { useStudents } from "../context/StudentContext";
import { useAuth } from "../context/AuthContext";
import { predictStudent } from "../utils/predictor";

// --- ANIMATION VARIANTS ---
const fadeUp = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } }
};

// --- CHART COLORS ---
const COLORS = {
  good: "#22C55E",    // Neon Green
  risk: "#F59E0B",    // Amber
  fail: "#EF4444",    // Red
  attendance: "#3B82F6" // Blue
};

export default function Dashboard() {
  const { user } = useAuth(); // 🛡️ GRAB THE LOGGED-IN USER
  const { students, loading } = useStudents();

  const isStudent = user?.role === 'student';

  // =========================
  // 📊 CALCULATIONS & DATA PREP
  // =========================
  
  // 1. Class-wide aggregations
  const total = students?.length || 0;
  const avgMarks = total ? students.reduce((sum, s) => sum + s.marks, 0) / total : 0;
  const avgAttendance = total ? students.reduce((sum, s) => sum + s.attendance, 0) / total : 0;

  // 2. Personal Profile
  const myProfile = useMemo(() => {
    if (!isStudent || !students) return null;
    return students.find(s => 
      s.email === user?.email || 
      `${s.name.toLowerCase().replace(' ', '')}@eduai.com` === user?.email
    );
  }, [students, user, isStudent]);

  // 3. Top Student Calculation
  const topStudent = useMemo(() => {
    if (!students || students.length === 0) return null;
    return [...students].sort((a, b) => b.marks - a.marks)[0];
  }, [students]);

  // 4. Pie Chart (Risk Distribution)
  const riskStats = (students || []).reduce(
    (acc, s) => {
      const p = predictStudent(s);
      if (p.status === "Fail") acc.fail++;
      else if (p.status === "At Risk") acc.risk++;
      else acc.good++;
      return acc;
    },
    { good: 0, risk: 0, fail: 0 }
  );

  const pieData = [
    { name: "On Track", value: riskStats.good, color: COLORS.good },
    { name: "At Risk", value: riskStats.risk, color: COLORS.risk },
    { name: "Critical", value: riskStats.fail, color: COLORS.fail },
  ];

  // 5. Bar Chart (Grade Distribution)
  const gradeBuckets = useMemo(() => {
    const buckets = { 'A (90+)': 0, 'B (80-89)': 0, 'C (70-79)': 0, 'D (60-69)': 0, 'F (<60)': 0 };
    students?.forEach(s => {
      if (s.marks >= 90) buckets['A (90+)']++;
      else if (s.marks >= 80) buckets['B (80-89)']++;
      else if (s.marks >= 70) buckets['C (70-79)']++;
      else if (s.marks >= 60) buckets['D (60-69)']++;
      else buckets['F (<60)']++;
    });
    return Object.keys(buckets).map(key => ({ grade: key, count: buckets[key] }));
  }, [students]);

  // 7. Table & Alert Lists
  const displayStudents = useMemo(() => {
    if (isStudent) return myProfile ? [myProfile] : [];
    return [...(students || [])].sort((a, b) => b.marks - a.marks).slice(0, 5);
  }, [students, isStudent, myProfile]);

  const displayAlerts = useMemo(() => {
    if (isStudent) {
      if (myProfile && predictStudent(myProfile).status !== 'Good') return [myProfile];
      return [];
    }
    return (students || []).filter(s => predictStudent(s).status === "Fail").slice(0, 4);
  }, [students, isStudent, myProfile]);

  // 🛡️ DYNAMIC STAT CARDS
  const statCards = isStudent ? [
    { label: "My Marks", value: `${myProfile?.marks || 0}/100`, icon: Award, color: "text-[#22C55E]" },
    { label: "My Attendance", value: `${myProfile?.attendance || 0}%`, icon: Activity, color: "text-[#3B82F6]" },
    { label: "Class Average", value: `${avgMarks.toFixed(1)}%`, icon: Users, color: "text-white" },
    { label: "My Status", value: myProfile ? predictStudent(myProfile).status : "N/A", icon: AlertCircle, color: myProfile && myProfile.marks < 50 ? "text-[#EF4444]" : "text-[#F59E0B]" },
  ] : [
    { label: "Total Students", value: total, icon: Users, color: "text-white" },
    { label: "Exam Average", value: `${avgMarks.toFixed(1)}%`, icon: Award, color: "text-[#22C55E]" },
    { label: "Avg Attendance", value: `${avgAttendance.toFixed(1)}%`, icon: Activity, color: "text-[#3B82F6]" },
    { label: "Critical Alerts", value: displayAlerts.length, icon: AlertCircle, color: "text-[#EF4444]" },
  ];

  // 🔥 THE NEW SMART INSIGHTS ENGINE
  const smartInsights = isStudent ? [
    { icon: TrendingUp, text: `You are performing ${myProfile?.marks >= avgMarks ? 'above' : 'below'} the class average by ${Math.abs((myProfile?.marks || 0) - avgMarks).toFixed(1)}%.`, color: myProfile?.marks >= avgMarks ? "text-[#22C55E]" : "text-[#F59E0B]" },
    { icon: Award, text: myProfile?.marks >= 90 ? "Excellent work! You are in the top tier." : `You need ${Math.max(0, 90 - (myProfile?.marks || 0))} more marks to reach an 'A' grade.`, color: "text-[#8B5CF6]" },
    { icon: Activity, text: myProfile?.attendance >= 75 ? "Your attendance is on track." : "Warning: Your attendance is dangerously low.", color: myProfile?.attendance >= 75 ? "text-[#3B82F6]" : "text-[#EF4444]" }
  ] : [
    { icon: AlertCircle, text: `${displayAlerts.length} students currently require immediate intervention.`, color: displayAlerts.length > 0 ? "text-[#EF4444]" : "text-[#22C55E]" },
    { icon: Award, text: `Top Performer: ${topStudent?.name} (${topStudent?.marks}%)`, color: "text-[#8B5CF6]" },
    { icon: Activity, text: `Class attendance average is ${avgAttendance.toFixed(1)}%.`, color: avgAttendance >= 75 ? "text-[#3B82F6]" : "text-[#F59E0B]" }
  ];

  // =========================
  // 📥 EXPORT REPORT FUNCTION
  // =========================
  const handleExport = () => {
    const dataToExport = isStudent ? (myProfile ? [myProfile] : []) : students;
    if (!dataToExport || dataToExport.length === 0) return alert("No data available to export.");

    const headers = ["ID,Student Name,Email,Marks,Attendance,Risk Status"];
    const csvRows = dataToExport.map((s, index) => {
      const status = predictStudent(s).status;
      const email = s.email || `${s.name.toLowerCase().replace(' ', '')}@eduai.com`;
      const id = s.id || `temp-${index}`;
      return `"${id}","${s.name}","${email}","${s.marks}","${s.attendance}%","${status}"`;
    });

    const csvContent = [headers, ...csvRows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `EduAI_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // --- CUSTOM TOOLTIP FOR CHARTS ---
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#050505] border border-[#222] p-3 rounded-xl shadow-2xl">
          <p className="text-xs font-bold text-white mb-2">{payload[0].payload.name || payload[0].payload.grade}</p>
          {payload.map((p, i) => (
            <div key={i} className="flex items-center gap-2 text-[11px] mb-1 last:mb-0">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color || p.payload.color }}></span>
              <span className="text-[#888]">{p.name}:</span>
              <span className="text-white font-bold">{p.value}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  // 🔥 NEW YOUTUBE-STYLE SKELETON LOADER
  if (loading) {
    return (
      <div className="h-screen overflow-y-auto custom-scrollbar bg-[#050505] p-6 sm:p-8 w-full">
        <div className="max-w-[1400px] mx-auto space-y-6 pointer-events-none">
          
          {/* 1. Header Skeleton */}
          <div className="flex justify-between items-center mb-2">
            <div className="space-y-3">
              <div className="h-8 w-48 bg-[#111] rounded-lg animate-pulse border border-[#1A1A1A]"></div>
              <div className="h-4 w-64 bg-[#111] rounded-lg animate-pulse border border-[#1A1A1A]"></div>
            </div>
            <div className="h-10 w-32 bg-[#111] rounded-xl animate-pulse border border-[#1A1A1A]"></div>
          </div>

          {/* 2. Four Stat Cards Skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-[#0A0A0A] rounded-2xl p-5 border border-[#1A1A1A] h-[130px] flex flex-col justify-end relative overflow-hidden">
                <div className="absolute top-4 right-4 w-10 h-10 bg-[#111] rounded-full animate-pulse"></div>
                <div className="h-3 w-24 bg-[#111] rounded mb-3 animate-pulse delay-75"></div>
                <div className="h-8 w-16 bg-[#111] rounded animate-pulse delay-150"></div>
              </div>
            ))}
          </div>

          {/* 3. Banner Skeleton */}
          <div className="h-[80px] w-full bg-[#0A0A0A] rounded-2xl animate-pulse border border-[#1A1A1A] delay-75"></div>

          {/* 4. Charts Skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="col-span-1 lg:col-span-2 h-[350px] bg-[#0A0A0A] rounded-2xl animate-pulse border border-[#1A1A1A] p-6 flex flex-col gap-6">
               <div className="h-6 w-48 bg-[#111] rounded delay-150"></div>
               <div className="flex-1 w-full bg-[#111] rounded-xl delay-300"></div>
            </div>
            <div className="h-[350px] bg-[#0A0A0A] rounded-2xl animate-pulse border border-[#1A1A1A] flex items-center justify-center">
               <div className="w-40 h-40 bg-[#111] rounded-full delay-150"></div>
            </div>
          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="relative h-screen overflow-y-auto custom-scrollbar bg-[#050505] text-[#E0E0E0] p-6 sm:p-8 w-full font-sans pb-20">
      <motion.div variants={staggerContainer} initial="hidden" animate="show" className="max-w-[1400px] mx-auto space-y-6">
        
        {/* ================= 1. HEADER & ACTIONS ================= */}
        <motion.div variants={fadeUp} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
          <div>
            <h1 className="text-[24px] font-bold text-white tracking-wide">
              {isStudent ? 'Student Portal' : 'Command Center'}
            </h1>
            <p className="text-[#666] text-sm mt-1">
              {isStudent ? 'Your personal academic overview' : 'Comprehensive pedagogical overview'}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={handleExport} className="flex items-center gap-2 text-sm text-[#888] hover:text-white transition-colors bg-[#0A0A0A] px-4 py-2.5 rounded-xl border border-[#1A1A1A] hover:border-[#22C55E]/50 hover:text-[#22C55E] shadow-lg">
              <Download size={14} /> Export Report
            </button>
            <button className="flex items-center gap-2 text-sm text-black font-bold bg-[#22C55E] hover:bg-[#1db954] px-4 py-2.5 rounded-xl shadow-[0_0_15px_rgba(34,197,94,0.2)] transition-all">
              Current Term <ChevronDown size={14} />
            </button>
          </div>
        </motion.div>

        {/* ================= 2. FOUR METRIC CARDS ================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {statCards.map((stat, i) => (
            <motion.div key={i} variants={fadeUp} className="bg-[#0A0A0A] rounded-2xl p-5 border border-[#1A1A1A] shadow-xl relative overflow-hidden group">
              <div className={`absolute top-4 right-4 opacity-10 group-hover:opacity-20 transition-opacity ${stat.color}`}>
                <stat.icon size={40} />
              </div>
              <p className="text-xs text-[#888] font-bold uppercase tracking-wider mb-2">{stat.label}</p>
              <h2 className={`text-3xl font-bold tracking-tight mb-3 ${stat.color}`}>{stat.value}</h2>
            </motion.div>
          ))}
        </div>

        {/* 🔥 ================= 2.5 SMART INSIGHTS BANNER ================= */}
        <motion.div variants={fadeUp} className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-2xl p-4 flex flex-col md:flex-row gap-4 items-center justify-between shadow-2xl relative overflow-hidden">
          <div className="absolute -left-20 -top-20 w-40 h-40 bg-[#8B5CF6]/10 blur-3xl rounded-full"></div>
          
          <div className="flex items-center gap-3 shrink-0 z-10">
            <div className="w-10 h-10 rounded-xl bg-[#111] flex items-center justify-center border border-[#8B5CF6]/30 shadow-[0_0_15px_rgba(139,92,246,0.15)]">
              <Zap size={20} className="text-[#8B5CF6]" />
            </div>
            <div>
              <h3 className="text-white font-bold tracking-wide text-sm">System Insights</h3>
              <p className="text-[10px] text-[#666] uppercase tracking-widest">Real-time Analysis</p>
            </div>
          </div>
          
          <div className="flex flex-wrap md:flex-nowrap gap-3 w-full justify-end z-10">
            {smartInsights.map((insight, i) => (
              <div key={i} className="flex items-center gap-2 bg-[#050505] border border-[#222] px-4 py-2.5 rounded-xl text-xs sm:text-sm flex-1 md:flex-none justify-center whitespace-nowrap shadow-inner">
                <insight.icon size={16} className={insight.color} />
                <span className="text-[#CCC] font-medium">{insight.text}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ================= 3. TRIPLE CHART GRID (Line, Bar, Pie) ================= */}
        {!isStudent && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* 🔥 NEW TREND CHART REPLACES OLD STATIC AREA CHART */}
            <motion.div variants={fadeUp} className="col-span-1 lg:col-span-2 h-[350px]">
              <TrendChart />
            </motion.div>

            {/* PIE CHART */}
            <motion.div variants={fadeUp} className="bg-[#0A0A0A] rounded-2xl p-6 border border-[#1A1A1A] shadow-xl flex flex-col items-center justify-center h-[350px]">
              <h3 className="text-base font-semibold text-[#CCC] w-full text-left mb-2">Risk Demographics</h3>
              <div className="w-full flex-1">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieData} innerRadius={55} outerRadius={75} paddingAngle={5} dataKey="value" stroke="none">
                      {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend verticalAlign="bottom" height={20} iconType="circle" wrapperStyle={{fontSize: '11px', color: '#888', marginTop: '10px'}} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          </div>
        )}

        {/* ================= 4. BOTTOM GRID (Table, Bar Chart, Alerts) ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* DIRECTORY PREVIEW */}
          <motion.div variants={fadeUp} className="bg-[#0A0A0A] rounded-2xl p-6 border border-[#1A1A1A] shadow-xl lg:col-span-2 overflow-hidden flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-base font-semibold text-[#CCC]">
                {isStudent ? "My Profile Record" : "Directory Preview"}
              </h3>
              {!isStudent && (
                <Link to="/students" className="flex items-center gap-1 text-[#22C55E] text-xs font-semibold hover:underline">
                  Full Directory <ArrowRight size={14} />
                </Link>
              )}
            </div>
            <div className="w-full overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[400px]">
                <thead>
                  <tr className="border-b border-[#222]">
                    <th className="pb-3 text-xs font-medium text-[#666]">Student Name</th>
                    <th className="pb-3 text-xs font-medium text-[#666]">Marks</th>
                    <th className="pb-3 text-xs font-medium text-[#666]">Attendance</th>
                    <th className="pb-3 text-xs font-medium text-[#666] text-right">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {displayStudents.length > 0 ? displayStudents.map((student, index) => {
                    const status = predictStudent(student);
                    return (
                      <tr key={index} className="border-b border-[#1A1A1A] last:border-0 hover:bg-[#111] transition-colors group">
                        <td className="py-3.5">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-[#1A1A1A] text-white flex items-center justify-center text-xs font-bold border border-[#222]">
                              {student.name.charAt(0)}
                            </div>
                            <p className="text-sm font-bold text-[#DDD] group-hover:text-white transition-colors">{student.name}</p>
                          </div>
                        </td>
                        <td className="py-3.5 text-sm font-semibold text-[#CCC]">{student.marks}</td>
                        <td className="py-3.5">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-medium text-[#888] w-7">{student.attendance}%</span>
                            <div className="w-16 h-1.5 bg-[#1A1A1A] rounded-full overflow-hidden">
                              <div className="h-full bg-[#3B82F6]" style={{ width: `${student.attendance}%` }} />
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 text-right">
                          <div className="flex flex-col items-end gap-1">
                            <span className={`inline-flex px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider border ${status.color} ${status.bg} border-current/20`}>
                              {status.label || status.status}
                            </span>
                            {/* 🔥 EXPLAINABLE AI INJECTED INTO DASHBOARD PREVIEW */}
                            {status.status !== "Good" && (
                              <span className="text-[9px] text-[#555] font-medium italic">
                                {status.reason}
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  }) : (
                    <tr>
                      <td colSpan="4" className="py-8 text-center text-sm text-[#555]">No data available.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* GRADE SPREAD BAR CHART */}
          <motion.div variants={fadeUp} className="bg-[#0A0A0A] rounded-2xl p-6 border border-[#1A1A1A] shadow-xl flex flex-col">
            <h3 className="text-base font-semibold text-[#CCC] mb-1">Grade Spread</h3>
            <p className="text-[11px] text-[#666] mb-4">Class performance distribution</p>
            <div className="flex-1 w-full min-h-[180px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={gradeBuckets} margin={{ top: 10, right: 0, left: -30, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1A1A1A" vertical={false} />
                  <XAxis dataKey="grade" stroke="#444" tick={{ fill: '#666', fontSize: 9 }} tickLine={false} axisLine={false} />
                  <YAxis stroke="#444" tick={{ fill: '#666', fontSize: 10 }} tickLine={false} axisLine={false} />
                  <Tooltip cursor={{fill: 'rgba(255,255,255,0.03)'}} content={<CustomTooltip />} />
                  <Bar dataKey="count" name="Students" fill="#8B5CF6" radius={[4, 4, 0, 0]} barSize={24} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* PRIORITY ALERTS */}
          <motion.div variants={fadeUp} className="bg-[#0A0A0A] rounded-2xl p-6 border border-[#1A1A1A] shadow-xl flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base font-semibold text-[#CCC]">Priority Alerts</h3>
              <span className="bg-[#EF4444]/10 text-[#EF4444] text-[10px] px-2 py-0.5 rounded border border-[#EF4444]/20 font-bold uppercase">Critical</span>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto pr-1 custom-scrollbar">
              {displayAlerts.length > 0 ? (
                displayAlerts.map((student, i) => (
                  <div key={i} className="flex flex-col gap-2 p-3 rounded-xl bg-[#050505] border border-[#1A1A1A] hover:border-[#EF4444]/30 transition-all group relative">
                    <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-[#EF4444] animate-pulse shadow-[0_0_8px_#EF4444]" />
                    <p className="text-white text-xs font-bold">{isStudent ? 'You have a critical alert!' : student.name}</p>
                    
                    <div className="flex gap-2">
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#111] text-[#888] border border-[#222]">
                        Marks: <span className="text-[#EF4444] font-bold">{student.marks}</span>
                      </span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#111] text-[#888] border border-[#222]">
                        Att: <span className={student.attendance < 75 ? "text-[#F59E0B] font-bold" : "text-white font-bold"}>{student.attendance}%</span>
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-[#555] space-y-2">
                  <AlertCircle size={24} className="opacity-20" />
                  <p className="text-xs font-medium">No critical alerts.</p>
                </div>
              )}
            </div>
          </motion.div>

        </div>
      </motion.div>
    </div>
  );
}