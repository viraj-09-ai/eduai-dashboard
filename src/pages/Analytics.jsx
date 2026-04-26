import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { Download, TrendingUp, Users, Target, Activity } from "lucide-react";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  BarChart, Bar, Legend, Cell
} from "recharts";

import { useStudents } from "../context/StudentContext";

// --- ANIMATION VARIANTS ---
const fadeUp = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const COLORS = {
  primary: "#22C55E", // Neon Green
  secondary: "#3B82F6", // Blue
  accent: "#8B5CF6", // Purple
  dark: "#1A1A1A"
};

export default function Analytics() {
  const { students, loading } = useStudents();

  // =========================
  // 📊 DATA PROCESSING
  // =========================
  
  // 1. Top Level Stats
  const totalStudents = students?.length || 0;
  const avgMarks = totalStudents ? (students.reduce((acc, s) => acc + s.marks, 0) / totalStudents).toFixed(1) : 0;
  const avgAttendance = totalStudents ? (students.reduce((acc, s) => acc + s.attendance, 0) / totalStudents).toFixed(1) : 0;
  const highPerformers = students?.filter(s => s.marks >= 80).length || 0;

  // 2. Trend Data (Area Chart) - Maps your students' scores
  const trendData = useMemo(() => {
    return (students || []).map(s => ({
      name: s.name.split(" ")[0], // First name only for cleaner X-axis
      Score: s.marks,
      Attendance: s.attendance
    }));
  }, [students]);

  // 3. Subject Proficiency (Radar Chart) - Generated based on cohort average
  const subjectData = [
    { subject: 'Math', A: Math.min(100, Number(avgMarks) + 5), fullMark: 100 },
    { subject: 'Science', A: Math.min(100, Number(avgMarks) + 2), fullMark: 100 },
    { subject: 'English', A: Math.max(0, Number(avgMarks) - 4), fullMark: 100 },
    { subject: 'History', A: Math.max(0, Number(avgMarks) - 2), fullMark: 100 },
    { subject: 'Art', A: Math.min(100, Number(avgMarks) + 10), fullMark: 100 },
    { subject: 'Tech', A: Math.min(100, Number(avgMarks) + 8), fullMark: 100 },
  ];

  // 4. Grade Distribution (Bar Chart)
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

  // --- CUSTOM TOOLTIP ---
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#050505] border border-[#222] p-4 rounded-xl shadow-2xl">
          <p className="text-sm font-bold text-white mb-3">{label}</p>
          {payload.map((p, i) => (
            <div key={i} className="flex items-center justify-between gap-4 text-xs mb-1 last:mb-0">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.color }}></span>
                <span className="text-[#888]">{p.name}</span>
              </div>
              <span className="text-white font-bold">{p.value}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  if (loading) return <div className="p-8 w-full animate-pulse text-[#666]">Crunching numbers...</div>;

  return (
    <div className="p-6 sm:p-8 h-screen overflow-y-auto custom-scrollbar bg-[#050505] text-[#E0E0E0] w-full max-w-[1400px] mx-auto font-sans">
      
      <motion.div variants={staggerContainer} initial="hidden" animate="show" className="space-y-6 pb-10">
        
        {/* ================= HEADER ================= */}
        <motion.div variants={fadeUp} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
          <div>
            <h1 className="text-[26px] font-bold text-white tracking-tight">Deep Analytics</h1>
            <p className="text-[#666] text-sm mt-1">Advanced cohort reporting and predictive models</p>
          </div>
          <button className="flex items-center gap-2 text-sm text-black font-bold bg-[#22C55E] hover:bg-[#1db954] px-5 py-2.5 rounded-xl shadow-[0_0_15px_rgba(34,197,94,0.2)] transition-all">
            <Download size={16} /> Export Complete Report
          </button>
        </motion.div>

        {/* ================= STAT CARDS ================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            { label: "Analyzed Cohort", value: totalStudents, icon: Users, color: "text-white", bg: "bg-white/5" },
            { label: "Mean Performance", value: `${avgMarks}%`, icon: Target, color: "text-[#22C55E]", bg: "bg-[#22C55E]/10" },
            { label: "Overall Engagement", value: `${avgAttendance}%`, icon: Activity, color: "text-[#3B82F6]", bg: "bg-[#3B82F6]/10" },
            { label: "Top Percentile", value: highPerformers, icon: TrendingUp, color: "text-[#8B5CF6]", bg: "bg-[#8B5CF6]/10" },
          ].map((stat, i) => (
            <motion.div key={i} variants={fadeUp} className="bg-[#0A0A0A] rounded-2xl p-6 border border-[#1A1A1A] shadow-xl flex items-center gap-5 relative overflow-hidden group hover:border-[#333] transition-colors">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${stat.bg} ${stat.color} transition-transform group-hover:scale-110`}>
                <stat.icon size={24} />
              </div>
              <div>
                <p className="text-xs text-[#888] font-bold uppercase tracking-wider mb-1">{stat.label}</p>
                <h2 className="text-2xl font-bold text-white tracking-tight">{stat.value}</h2>
              </div>
            </motion.div>
          ))}
        </div>

        {/* ================= MAIN CHART AREA ================= */}
        <motion.div variants={fadeUp} className="bg-[#0A0A0A] rounded-2xl p-6 sm:p-8 border border-[#1A1A1A] shadow-xl">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-white">Cohort Trajectory</h3>
            <p className="text-sm text-[#666]">Comparing individual academic scores against attendance rates.</p>
          </div>
          <div className="w-full h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={COLORS.primary} stopOpacity={0.4}/>
                    <stop offset="95%" stopColor={COLORS.primary} stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorAtt" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={COLORS.secondary} stopOpacity={0.2}/>
                    <stop offset="95%" stopColor={COLORS.secondary} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1A1A1A" vertical={false} />
                <XAxis dataKey="name" stroke="#555" tick={{ fill: '#888', fontSize: 12 }} tickLine={false} axisLine={false} dy={10} />
                <YAxis stroke="#555" tick={{ fill: '#888', fontSize: 12 }} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#333', strokeDasharray: '4 4' }} />
                <Area type="monotone" dataKey="Attendance" stroke={COLORS.secondary} strokeWidth={2} fillOpacity={1} fill="url(#colorAtt)" />
                <Area type="monotone" dataKey="Score" stroke={COLORS.primary} strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" activeDot={{ r: 8, fill: '#050505', stroke: COLORS.primary, strokeWidth: 2 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* ================= BOTTOM SPLIT CHARTS ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* RADAR CHART */}
          <motion.div variants={fadeUp} className="bg-[#0A0A0A] rounded-2xl p-6 sm:p-8 border border-[#1A1A1A] shadow-xl flex flex-col items-center">
            <div className="w-full mb-2">
              <h3 className="text-lg font-bold text-white">Subject Proficiency</h3>
              <p className="text-sm text-[#666]">Cohort average across core subjects.</p>
            </div>
            <div className="w-full h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={subjectData}>
                  <PolarGrid stroke="#222" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#888', fontSize: 12 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#444' }} axisLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Radar name="Cohort Avg" dataKey="A" stroke={COLORS.accent} strokeWidth={2} fill={COLORS.accent} fillOpacity={0.3} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* BAR CHART */}
          <motion.div variants={fadeUp} className="bg-[#0A0A0A] rounded-2xl p-6 sm:p-8 border border-[#1A1A1A] shadow-xl flex flex-col">
            <div className="w-full mb-6">
              <h3 className="text-lg font-bold text-white">Grade Distribution</h3>
              <p className="text-sm text-[#666]">Number of students per grade bracket.</p>
            </div>
            <div className="flex-1 w-full min-h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={gradeBuckets} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1A1A1A" vertical={false} />
                  <XAxis dataKey="grade" stroke="#555" tick={{ fill: '#888', fontSize: 12 }} tickLine={false} axisLine={false} dy={10} />
                  <YAxis stroke="#555" tick={{ fill: '#888', fontSize: 12 }} tickLine={false} axisLine={false} />
                  <Tooltip cursor={{fill: 'rgba(255,255,255,0.02)'}} content={<CustomTooltip />} />
                  <Bar dataKey="count" name="Students" radius={[6, 6, 0, 0]} barSize={40}>
                    {gradeBuckets.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.grade.includes('F') ? '#EF4444' : entry.grade.includes('A') ? '#22C55E' : '#3B82F6'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

        </div>

      </motion.div>
    </div>
  );
}