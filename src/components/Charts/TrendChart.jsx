import React, { useState } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine 
} from 'recharts';
import { Calendar, AlertCircle } from 'lucide-react';

// --- MOCK DATA ---
const monthlyData = [
  { name: 'Jan', performance: 85, attendance: 90 },
  { name: 'Feb', performance: 88, attendance: 92 },
  { name: 'Mar', performance: 45, attendance: 60 }, // 🔥 DIP
  { name: 'Apr', performance: 75, attendance: 85 },
  { name: 'May', performance: 82, attendance: 88 },
  { name: 'Jun', performance: 90, attendance: 95 },
];

const weeklyData = [
  { name: 'Week 1', performance: 92, attendance: 95 },
  { name: 'Week 2', performance: 88, attendance: 90 },
  { name: 'Week 3', performance: 85, attendance: 85 },
  { name: 'Week 4', performance: 55, attendance: 70 }, // 🔥 DIP
];

// --- CUSTOM DIP HIGHLIGHTER ---
const CustomDot = (props) => {
  const { cx, cy, payload } = props;
  // If performance drops below 60, show a glowing red warning dot
  if (payload.performance < 60) {
    return (
      <svg x={cx - 8} y={cy - 8} width={16} height={16}>
        <circle cx="8" cy="8" r="6" fill="#EF4444" stroke="#0A0A0A" strokeWidth="2" className="animate-pulse" />
      </svg>
    );
  }
  return null; // Hide normal dots to keep it clean
};

export default function TrendChart() {
  const [timeRange, setTimeRange] = useState('monthly');
  const data = timeRange === 'monthly' ? monthlyData : weeklyData;

  return (
    <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-[2rem] p-6 shadow-2xl h-full flex flex-col">
      
      {/* HEADER & FILTERS */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-white font-bold text-lg">Performance Trends</h2>
          <p className="text-[#666] text-xs mt-1">Cohort analysis over time</p>
        </div>

        {/* TIME TOGGLE */}
        <div className="flex bg-[#111] p-1 rounded-lg border border-[#222]">
          <button 
            onClick={() => setTimeRange('weekly')}
            className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${timeRange === 'weekly' ? 'bg-[#222] text-white shadow-sm' : 'text-[#666] hover:text-[#aaa]'}`}
          >
            Weekly
          </button>
          <button 
            onClick={() => setTimeRange('monthly')}
            className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${timeRange === 'monthly' ? 'bg-[#222] text-white shadow-sm' : 'text-[#666] hover:text-[#aaa]'}`}
          >
            Monthly
          </button>
        </div>
      </div>

      {/* CHART CONTAINER */}
      <div className="flex-1 w-full min-h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorPerf" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22C55E" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#22C55E" stopOpacity={0}/>
              </linearGradient>
            </defs>
            
            <CartesianGrid strokeDasharray="3 3" stroke="#1A1A1A" vertical={false} />
            <XAxis dataKey="name" stroke="#555" fontSize={10} tickLine={false} axisLine={false} dy={10} />
            <YAxis stroke="#555" fontSize={10} tickLine={false} axisLine={false} dx={-10} domain={[0, 100]} />
            
            <Tooltip 
              contentStyle={{ backgroundColor: '#111', borderColor: '#222', borderRadius: '12px', fontSize: '12px', color: '#fff' }}
              itemStyle={{ color: '#22C55E' }}
            />

            {/* CRITICAL THRESHOLD LINE */}
            <ReferenceLine y={60} stroke="#EF4444" strokeDasharray="3 3" strokeOpacity={0.5} />

            <Area 
              type="monotone" 
              dataKey="performance" 
              stroke="#22C55E" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorPerf)" 
              activeDot={{ r: 6, fill: '#22C55E', stroke: '#0A0A0A', strokeWidth: 2 }}
              dot={<CustomDot />} // 🔥 Injects our custom warning dots
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* FOOTER INSIGHT */}
      <div className="mt-4 pt-4 border-t border-[#1A1A1A] flex items-center gap-2 text-xs text-[#888]">
        <AlertCircle size={14} className="text-[#F59E0B]" />
        <span>Dips below the <span className="text-[#EF4444] font-bold">red threshold (60%)</span> are flagged automatically.</span>
      </div>
    </div>
  );
}