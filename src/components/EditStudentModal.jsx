import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, User, BarChart2, Activity } from "lucide-react";
import { useStudents } from "../context/StudentContext";

export default function EditStudentModal({ isOpen, onClose, studentData }) {
  const { updateStudent } = useStudents();
  
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    marks: "",
    attendance: ""
  });

  // Load the student's current data when the modal opens
  useEffect(() => {
    if (studentData) {
      setFormData({
        id: studentData.id,
        name: studentData.name,
        marks: studentData.marks,
        attendance: studentData.attendance
      });
    }
  }, [studentData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    updateStudent({
      ...formData,
      marks: Number(formData.marks),
      attendance: Number(formData.attendance)
    });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />

          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md bg-[#0A0A0A] rounded-2xl border border-[#222] shadow-2xl overflow-hidden"
          >
            <div className="flex justify-between items-center p-6 border-b border-[#1A1A1A]">
              <h2 className="text-xl font-bold text-white">Edit Student</h2>
              <button onClick={onClose} className="text-[#666] hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-[#888] uppercase tracking-wider">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-[#555]" size={18} />
                  <input 
                    type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-[#121212] border border-[#222] text-white rounded-xl pl-12 pr-4 py-3 outline-none focus:border-[#3B82F6]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-[#888] uppercase tracking-wider">Total Marks</label>
                  <div className="relative">
                    <BarChart2 className="absolute left-4 top-1/2 -translate-y-1/2 text-[#555]" size={18} />
                    <input 
                      type="number" required min="0" max="100" value={formData.marks} onChange={(e) => setFormData({...formData, marks: e.target.value})}
                      className="w-full bg-[#121212] border border-[#222] text-white rounded-xl pl-12 pr-4 py-3 outline-none focus:border-[#3B82F6]"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-[#888] uppercase tracking-wider">Attendance %</label>
                  <div className="relative">
                    <Activity className="absolute left-4 top-1/2 -translate-y-1/2 text-[#555]" size={18} />
                    <input 
                      type="number" required min="0" max="100" value={formData.attendance} onChange={(e) => setFormData({...formData, attendance: e.target.value})}
                      className="w-full bg-[#121212] border border-[#222] text-white rounded-xl pl-12 pr-4 py-3 outline-none focus:border-[#3B82F6]"
                    />
                  </div>
                </div>
              </div>

              <button type="submit" className="w-full mt-4 bg-[#3B82F6] hover:bg-[#2563EB] text-white font-bold py-3.5 rounded-xl transition-all shadow-[0_0_15px_rgba(59,130,246,0.2)]">
                Save Changes
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}