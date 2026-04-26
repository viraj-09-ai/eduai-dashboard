import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";

export default function AdvancedAnalytics({ students }) {

  // ✅ TRUE BLACK EMPTY STATE
  if (!students || students.length === 0) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center text-[#666] bg-transparent">
        <p className="text-sm font-medium mb-1">No performance data available</p>
        <p className="text-xs">Add students to generate trend lines.</p>
      </div>
    );
  }

  // 📊 FORMAT DATA FOR THE TREND LINE
  // We grab just the first name so the X-Axis looks clean and minimal
  const chartData = students.map((s) => ({
    name: s.name.split(' ')[0], 
    Marks: s.marks,
    Attendance: s.attendance,
  }));

  // 🎨 CUSTOM TRUE BLACK TOOLTIP
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#050505] border border-[#222] p-4 rounded-xl shadow-2xl">
          <p className="text-sm font-bold text-white mb-3">
            {payload[0].payload.name}
          </p>
          {payload.map((p, i) => (
            <div key={i} className="flex items-center justify-between gap-4 mb-2 last:mb-0">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }}></span>
                <span className="text-xs font-medium text-[#888]">{p.name}</span>
              </div>
              <span className="text-sm font-bold text-white">{p.value}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={chartData} margin={{ top: 10, right: 0, left: -25, bottom: 0 }}>
        
        <defs>
          {/* Neon Green Gradient for the primary data (Marks) */}
          <linearGradient id="colorMarks" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#22C55E" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#22C55E" stopOpacity={0} />
          </linearGradient>
          
          {/* Subtle Dark Gradient for the secondary data (Attendance) */}
          <linearGradient id="colorAtt" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#333333" stopOpacity={0.5} />
            <stop offset="95%" stopColor="#333333" stopOpacity={0} />
          </linearGradient>
        </defs>
        
        {/* Very subtle grid lines to match the dark theme */}
        <CartesianGrid strokeDasharray="3 3" stroke="#1A1A1A" vertical={false} />
        
        <XAxis 
          dataKey="name" 
          stroke="#444" 
          tick={{ fill: '#666', fontSize: 11 }} 
          tickLine={false} 
          axisLine={false}
          dy={10} 
        />
        <YAxis 
          stroke="#444" 
          tick={{ fill: '#666', fontSize: 11 }} 
          tickLine={false} 
          axisLine={false} 
        />
        
        <Tooltip 
          content={<CustomTooltip />} 
          cursor={{ stroke: '#333', strokeWidth: 1, strokeDasharray: '4 4' }} 
        />
        
        {/* Background Area (Attendance - Dark Gray) */}
        <Area 
          type="monotone" 
          dataKey="Attendance" 
          stroke="#444" 
          strokeWidth={2}
          fillOpacity={1} 
          fill="url(#colorAtt)" 
        />
        
        {/* Foreground Area (Marks - Neon Green) */}
        <Area 
          type="monotone" 
          dataKey="Marks" 
          stroke="#22C55E" 
          strokeWidth={3}
          fillOpacity={1} 
          fill="url(#colorMarks)" 
          activeDot={{ r: 6, fill: '#050505', stroke: '#22C55E', strokeWidth: 2 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}