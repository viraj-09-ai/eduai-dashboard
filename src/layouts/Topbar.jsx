import { Bell, Search } from "lucide-react";
import { motion } from "framer-motion";

export default function Topbar() {
  return (
    <div className="sticky top-0 z-50 backdrop-blur-xl bg-[#020617]/80 border-b border-white/10">

      <div className="flex items-center justify-between px-6 py-4">

        {/* 🔍 SEARCH */}
        <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-2 rounded-xl w-[300px] hover:border-white/20 transition">

          <Search size={16} className="text-gray-400" />

          <input
            type="text"
            placeholder="Search students..."
            className="bg-transparent outline-none text-sm text-gray-300 w-full placeholder-gray-500"
          />
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-6">

          {/* 🔔 NOTIFICATION */}
          <motion.div
            whileHover={{ scale: 1.1 }}
            className="relative cursor-pointer"
          >
            <Bell className="text-gray-400 hover:text-white" />

            {/* DOT */}
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          </motion.div>

          {/* 👤 USER */}
          <div className="flex items-center gap-3 cursor-pointer">

            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center text-black font-bold">
              V
            </div>

            <div className="hidden md:block">
              <p className="text-sm font-semibold">Viraj</p>
              <p className="text-xs text-gray-400">Teacher</p>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}