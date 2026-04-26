import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Info, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useNotifications } from '../context/NotificationContext';

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const { notifications, unreadCount, markAsRead, clearAll } = useNotifications();

  return (
    <div className="relative">
      {/* 🔔 TRIGGER BUTTON */}
      <button 
        onClick={() => { setIsOpen(!isOpen); markAsRead(); }}
        aria-label="Toggle notifications"
        className="relative p-2.5 text-white bg-[#111] border border-[#222] rounded-xl transition-all hover:border-[#22C55E]/50 group flex items-center justify-center"
      >
        <Bell size={20} className="group-hover:rotate-12 transition-transform text-[#E0E0E0]" />
        
        {/* RED BADGE */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#EF4444] text-white text-[10px] font-black flex items-center justify-center rounded-full border-2 border-[#0A0A0A] shadow-lg animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {/* DROPDOWN MENU */}
      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)}></div>
            <motion.div 
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute right-0 mt-3 w-80 bg-[#0D0D0D] border border-[#222] rounded-[1.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.7)] z-50 overflow-hidden"
            >
              <div className="p-4 border-b border-[#1A1A1A] flex justify-between items-center bg-[#111]">
                <h3 className="font-bold text-sm text-white">System Notifications</h3>
                <button onClick={clearAll} className="text-[10px] font-bold text-[#666] hover:text-[#EF4444] uppercase tracking-widest transition-colors">Clear All</button>
              </div>

              <div className="max-h-[350px] overflow-y-auto custom-scrollbar bg-[#0D0D0D]">
                {notifications.length > 0 ? (
                  notifications.map((n) => (
                    <div key={n.id} className="p-4 border-b border-[#1A1A1A] hover:bg-[#151515] transition-colors flex gap-3 group">
                      <div className={`mt-1 shrink-0 ${n.type === 'error' ? 'text-[#EF4444]' : 'text-[#22C55E]'}`}>
                        {n.type === 'error' ? <AlertTriangle size={16} /> : <Info size={16} />}
                      </div>
                      <div className="flex-1">
                        <p className={`text-xs font-bold ${n.type === 'error' ? 'text-[#EF4444]' : 'text-white'}`}>{n.title}</p>
                        <p className="text-[11px] text-[#888] mt-0.5 leading-relaxed">{n.message}</p>
                        <p className="text-[9px] text-[#333] mt-2 font-bold uppercase">{n.time}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-10 text-center text-[#444]">
                    <CheckCircle2 size={30} className="mx-auto mb-3 opacity-10" />
                    <p className="text-xs font-medium">No active alerts.</p>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}