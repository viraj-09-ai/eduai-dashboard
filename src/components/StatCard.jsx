import { motion } from "framer-motion";

export default function StatCard({
  title,
  value,
  icon,
  trend = "up", // "up" | "down" | null
  color = "green", // green | blue | red | yellow
}) {
  const colorStyles = {
    green: {
      glow: "hover:shadow-[0_0_25px_rgba(34,197,94,0.4)]",
      border: "border-green-500/30",
      text: "text-green-400",
      bg: "from-green-500/10",
    },
    blue: {
      glow: "hover:shadow-[0_0_25px_rgba(59,130,246,0.4)]",
      border: "border-blue-500/30",
      text: "text-blue-400",
      bg: "from-blue-500/10",
    },
    red: {
      glow: "hover:shadow-[0_0_25px_rgba(239,68,68,0.4)]",
      border: "border-red-500/30",
      text: "text-red-400",
      bg: "from-red-500/10",
    },
    yellow: {
      glow: "hover:shadow-[0_0_25px_rgba(234,179,8,0.4)]",
      border: "border-yellow-500/30",
      text: "text-yellow-400",
      bg: "from-yellow-500/10",
    },
  };

  const style = colorStyles[color] || colorStyles.green;

  return (
    <motion.div
      whileHover={{ scale: 1.04 }}
      className={`relative p-5 rounded-2xl 
      bg-gradient-to-br ${style.bg} to-transparent 
      border ${style.border} 
      backdrop-blur-xl 
      shadow-lg 
      transition ${style.glow}`}
    >

      {/* ICON */}
      <div className="flex justify-between items-start mb-3">
        <p className="text-xs text-gray-400">{title}</p>

        {icon && (
          <div className={`text-lg ${style.text}`}>
            {icon}
          </div>
        )}
      </div>

      {/* VALUE */}
      <h2 className={`text-3xl font-bold ${style.text}`}>
        {value}
      </h2>

      {/* TREND */}
      {trend && (
        <div className="flex items-center gap-1 mt-2 text-xs">
          {trend === "up" ? (
            <span className="text-green-400">▲ +12%</span>
          ) : (
            <span className="text-red-400">▼ -5%</span>
          )}
          <span className="text-gray-500">vs last</span>
        </div>
      )}

      {/* GLOW DOT */}
      <div className={`absolute top-2 right-2 w-2 h-2 rounded-full ${style.text} animate-pulse`} />
    </motion.div>
  );
}