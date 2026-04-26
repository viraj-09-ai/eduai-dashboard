import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";

export default function StudentsChart({ data }) {
  const chartData = data.map((s) => ({
    name: s.name,
    marks: s.marks,
    attendance: s.attendance,
  }));

  return (
    <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-2xl">
      <h2 className="mb-4 text-lg font-semibold text-gray-300">
        Performance Overview
      </h2>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData} barGap={10}>
          
          {/* GRID */}
          <CartesianGrid stroke="rgba(255,255,255,0.1)" />

          {/* AXIS */}
          <XAxis dataKey="name" stroke="#aaa" />
          <YAxis stroke="#aaa" />

          {/* TOOLTIP */}
          <Tooltip
            contentStyle={{
              backgroundColor: "#1e293b",
              border: "none",
              borderRadius: "10px",
            }}
          />

          {/* LEGEND */}
          <Legend />

          {/* BARS */}
          <Bar
            dataKey="marks"
            fill="#22c55e"   // green
            radius={[6, 6, 0, 0]}
          />
          <Bar
            dataKey="attendance"
            fill="#3b82f6"   // blue
            radius={[6, 6, 0, 0]}
          />

        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}