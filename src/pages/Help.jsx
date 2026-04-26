import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ChevronDown, Mail, MessageCircle, FileText, LifeBuoy } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } }
};

const FAQS = [
  { q: "How do I update a student's marks?", a: "Navigate to the Students tab, click the three dots (...) next to the student's name, and select 'Edit Record'. Make sure you save your changes." },
  { q: "Can students see other students' grades?", a: "No. Role-Based Access Control (RBAC) ensures that students can only view their own personal dashboard and records." },
  { q: "How does the AI Assistant work?", a: "The AI is connected securely to your database. You can ask it questions about class averages, at-risk students, or specific names, and it will analyze the data in real-time." },
  { q: "I forgot my password. What do I do?", a: "Currently, you must contact your System Administrator to reset database passwords manually via the backend console." }
];

export default function Help() {
  const [openFAQ, setOpenFAQ] = useState(null);
  const [search, setSearch] = useState("");

  const filteredFaqs = FAQS.filter(faq => faq.q.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="p-6 sm:p-8 h-screen bg-[#050505] text-[#E0E0E0] w-full max-w-[1400px] mx-auto overflow-y-auto custom-scrollbar font-sans">
      
      {/* HEADER SECTION */}
      <motion.div initial="hidden" animate="show" variants={fadeUp} className="text-center max-w-2xl mx-auto mb-12 mt-8">
        <div className="w-16 h-16 bg-[#22C55E]/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-[#22C55E]/20 shadow-[0_0_30px_rgba(34,197,94,0.1)]">
          <LifeBuoy size={32} className="text-[#22C55E]" />
        </div>
        <h1 className="text-3xl font-bold text-white tracking-tight mb-4">How can we help you?</h1>
        <div className="relative max-w-md mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#666]" size={18} />
          <input 
            type="text" 
            placeholder="Search for articles or questions..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#111] border border-[#222] text-white rounded-xl pl-12 pr-4 py-4 outline-none focus:border-[#22C55E]/50 shadow-xl"
          />
        </div>
      </motion.div>

      {/* QUICK LINKS */}
      <motion.div initial="hidden" animate="show" variants={fadeUp} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {[
          { icon: FileText, title: "Documentation", desc: "Read the system manual" },
          { icon: MessageCircle, title: "Community", desc: "Join the teacher forum" },
          { icon: Mail, title: "Contact Admin", desc: "Open a support ticket" }
        ].map((item, i) => (
          <div key={i} className="bg-[#0A0A0A] p-6 rounded-2xl border border-[#1A1A1A] hover:border-[#333] transition-colors cursor-pointer group flex items-start gap-4">
            <div className="w-12 h-12 bg-[#111] rounded-xl flex items-center justify-center group-hover:bg-[#22C55E]/10 group-hover:text-[#22C55E] transition-colors border border-[#222]">
              <item.icon size={20} />
            </div>
            <div>
              <h3 className="font-bold text-white group-hover:text-[#22C55E] transition-colors">{item.title}</h3>
              <p className="text-xs text-[#666] mt-1">{item.desc}</p>
            </div>
          </div>
        ))}
      </motion.div>

      {/* FAQS */}
      <motion.div initial="hidden" animate="show" variants={fadeUp} className="max-w-3xl mx-auto bg-[#0A0A0A] rounded-2xl border border-[#1A1A1A] overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-[#1A1A1A] bg-[#050505]/50">
          <h2 className="text-lg font-bold text-white">Frequently Asked Questions</h2>
        </div>
        <div className="divide-y divide-[#1A1A1A]">
          {filteredFaqs.length > 0 ? filteredFaqs.map((faq, i) => (
            <div key={i} className="bg-[#0A0A0A]">
              <button 
                onClick={() => setOpenFAQ(openFAQ === i ? null : i)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-[#111] transition-colors"
              >
                <span className="font-semibold text-[#DDD]">{faq.q}</span>
                <ChevronDown size={18} className={`text-[#666] transition-transform ${openFAQ === i ? "rotate-180 text-[#22C55E]" : ""}`} />
              </button>
              <AnimatePresence>
                {openFAQ === i && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }} 
                    animate={{ height: "auto", opacity: 1 }} 
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <p className="p-6 pt-0 text-sm text-[#888] leading-relaxed border-t border-[#111]">
                      {faq.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )) : (
            <div className="p-8 text-center text-[#666]">No results found for "{search}"</div>
          )}
        </div>
      </motion.div>

    </div>
  );
}