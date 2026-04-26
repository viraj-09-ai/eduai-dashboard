import React, { useState, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  Filter, 
  ArrowUpDown, 
  ChevronLeft, 
  ChevronRight, 
  MoreVertical,
  Activity,
  Download 
} from "lucide-react";
import { useStudents } from "../context/StudentContext";
import { useAuth } from "../context/AuthContext";
import { predictStudent } from "../utils/predictor";

export default function Students() {
  // 🔥 FIX 1: Added bulkAddStudents here
  const { students, loading, fetchStudents, deleteStudent, bulkAddStudents } = useStudents();
  
  const { token, user } = useAuth(); 
  
  const isStudent = user?.role === 'student';
  const fileInputRef = useRef(null);

  // --- Table Logic State ---
  const [searchTerm, setSearchTerm] = useState("");
  const [riskFilter, setRiskFilter] = useState("All");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8; 

  const [activeDropdown, setActiveDropdown] = useState(null);

  // --- CSV Import Function ---
  const handleImportCSV = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const text = event.target.result;
      const rows = text.split("\n").filter(row => row.trim() !== "");
      const dataRows = rows.slice(1); 

      const newStudents = dataRows.map(row => {
        const [name, email, marks, attendance] = row.split(",").map(v => v?.trim());
        if (!name) return null;
        return { 
          name, 
          email: email || `${name.toLowerCase().replace(/\s/g, '')}@eduai.com`, 
          marks: parseInt(marks) || 0, 
          attendance: parseInt(attendance) || 0 
        };
      }).filter(s => s !== null);

      try {
        console.log("Attempting to send to backend:", newStudents);
        
        // 🔥 Now using your powerful Context function!
        const created = await bulkAddStudents(newStudents); 
        
        if (created && created.length > 0) {
          alert(`Successfully imported ${created.length} students!`);
          if (fetchStudents) fetchStudents(); 
        } else {
          // THIS triggers if the backend rejects the data
          alert("⚠️ Server rejected the data! Please check your VS Code Backend Terminal for red error messages.");
        }
      } catch (error) {
        console.error("Bulk Import Failed:", error);
      }
    };
    reader.readAsText(file);
    e.target.value = null; 
  };

  // --- Data Pipeline ---
  const processedStudents = useMemo(() => {
    if (!students) return [];

    let data = isStudent 
      ? students.filter(s => s.email === user?.email || `${s.name?.toLowerCase().replace(' ', '')}@eduai.com` === user?.email)
      : [...students];

    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      data = data.filter(s => 
        s.name?.toLowerCase().includes(lowerSearch) || 
        (s.email && s.email.toLowerCase().includes(lowerSearch))
      );
    }

    if (riskFilter !== "All") {
      data = data.filter(s => predictStudent(s).status === riskFilter);
    }

    if (sortConfig.key) {
      data.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
        if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return data;
  }, [students, searchTerm, riskFilter, sortConfig, isStudent, user]);

  const totalPages = Math.ceil(processedStudents.length / itemsPerPage);
  
  const paginatedStudents = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return processedStudents.slice(startIndex, startIndex + itemsPerPage);
  }, [processedStudents, currentPage]);

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
    setSortConfig({ key, direction });
  };

  if (loading) {
    return (
      <div className="h-screen bg-[#050505] w-full flex items-center justify-center">
        <Activity size={40} className="text-[#22C55E] animate-pulse" />
      </div>
    );
  }

  return (
    <div 
      onClick={() => setActiveDropdown(null)}
      className="p-6 sm:p-8 h-screen overflow-y-auto custom-scrollbar bg-[#050505] text-[#E0E0E0] w-full max-w-[1400px] mx-auto font-sans pb-20"
    >
      
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-[26px] font-bold text-white tracking-tight">Student Directory</h1>
        <p className="text-[#666] text-sm mt-1">Manage, search, and filter the complete academic database.</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-[2rem] shadow-2xl overflow-hidden flex flex-col">
        
        {/* Toolbar */}
        <div className="p-5 border-b border-[#1A1A1A] flex flex-col md:flex-row gap-4 justify-between items-center bg-[#050505]/50">
          
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#666]" size={16} />
              <input 
                type="text" 
                placeholder="Search students..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#111] border border-[#222] text-white rounded-xl pl-11 pr-4 py-2.5 outline-none focus:border-[#22C55E]/50 text-sm transition-all"
              />
            </div>

            {!isStudent && (
              <>
                <input type="file" accept=".csv" ref={fileInputRef} onChange={handleImportCSV} className="hidden" />
                <button 
                  onClick={() => fileInputRef.current.click()}
                  className="flex items-center gap-2 px-4 py-2.5 bg-[#111] border border-[#222] rounded-xl text-xs font-bold text-[#888] hover:text-[#22C55E] hover:border-[#22C55E]/50 transition-all group"
                >
                  <Download size={14} className="rotate-180 group-hover:-translate-y-0.5 transition-transform" /> 
                  Import CSV
                </button>
              </>
            )}
          </div>

          {!isStudent && (
            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="flex items-center gap-2 bg-[#111] border border-[#222] rounded-xl px-4 py-2.5 text-sm">
                <Filter size={16} className="text-[#666]" />
                <span className="text-[#888] font-semibold">Risk Level:</span>
                <select 
                  value={riskFilter}
                  onChange={(e) => setRiskFilter(e.target.value)}
                  className="bg-transparent text-white outline-none cursor-pointer font-bold"
                >
                  <option value="All" className="bg-[#111] text-[#E0E0E0]">All Students</option>
                  <option value="Good" className="bg-[#111] text-[#E0E0E0]">On Track</option>
                  <option value="At Risk" className="bg-[#111] text-[#E0E0E0]">At Risk</option>
                  <option value="Fail" className="bg-[#111] text-[#E0E0E0]">Critical</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Table */}
        <div className="w-full overflow-x-auto min-h-[400px]">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead className="bg-[#111]/50">
              <tr className="border-b border-[#222]">
                <th className="p-4 text-xs font-bold text-[#888] uppercase tracking-wider">
                  <button onClick={() => handleSort('name')} className="flex items-center gap-2 hover:text-white transition-colors">
                    Student Name <ArrowUpDown size={12} />
                  </button>
                </th>
                <th className="p-4 text-xs font-bold text-[#888] uppercase tracking-wider text-center">Marks</th>
                <th className="p-4 text-xs font-bold text-[#888] uppercase tracking-wider text-center">Attendance</th>
                <th className="p-4 text-xs font-bold text-[#888] uppercase tracking-wider text-center">Status</th>
                {!isStudent && <th className="p-4 text-xs font-bold text-[#888] uppercase tracking-wider text-right">Actions</th>}
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {paginatedStudents.length > 0 ? paginatedStudents.map((student, index) => {
                  const status = predictStudent(student);
                  const currentId = student.id || student._id || index; // Safety check for ID
                  
                  return (
                    <motion.tr 
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      key={currentId} 
                      className="border-b border-[#1A1A1A] last:border-0 hover:bg-[#111] transition-colors group"
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-[#1A1A1A] text-white flex items-center justify-center text-sm font-bold border border-[#222]">
                            {student.name?.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-[#DDD] group-hover:text-white transition-colors">{student.name}</p>
                            <p className="text-xs text-[#666]">{student.email || 'no-email@eduai.com'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-sm font-semibold text-[#CCC] text-center">{student.marks} / 100</td>
                      
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-3">
                          <span className="text-xs font-bold text-[#888] w-8">{student.attendance}%</span>
                          <div className="w-20 h-1.5 bg-[#1A1A1A] rounded-full overflow-hidden border border-[#222]">
                            <div className="h-full bg-[#3B82F6]" style={{ width: `${student.attendance}%` }} />
                          </div>
                        </div>
                      </td>

                      {/* Status Badge + XAI Reason */}
                      <td className="p-4 text-center">
                        <div className="flex flex-col items-center gap-1.5">
                          {/* Main Badge */}
                          <span className={`inline-flex px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${status.color} ${status.bg} border-current/20 shadow-sm`}>
                            {status.label || status.status}
                          </span>
                          
                          {/* EXPLAINABLE AI REASON */}
                          {status.status !== "Good" && (
                            <span className="text-[9px] text-[#555] font-medium italic max-w-[120px] leading-tight text-center">
                              {status.reason}
                            </span>
                          )}
                        </div>
                      </td>
                      
                      {!isStudent && (
                        <td className="p-4 text-right relative">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation(); 
                              setActiveDropdown(activeDropdown === currentId ? null : currentId);
                            }}
                            className="p-2 text-[#666] hover:text-white hover:bg-[#222] rounded-lg transition-all"
                          >
                            <MoreVertical size={16} />
                          </button>
                          
                          {/* The Popup Dropdown Menu */}
                          <AnimatePresence>
                            {activeDropdown === currentId && (
                              <motion.div 
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="absolute right-12 top-8 w-32 bg-[#111] border border-[#222] rounded-xl shadow-2xl z-50 overflow-hidden flex flex-col"
                              >
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setActiveDropdown(null);
                                    alert(`Edit mode for ${student.name} coming soon!`);
                                  }}
                                  className="w-full text-left px-4 py-2.5 text-xs font-semibold text-[#CCC] hover:bg-[#222] hover:text-white transition-colors border-b border-[#222]"
                                >
                                  Edit Student
                                </button>
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (window.confirm(`Are you sure you want to delete ${student.name}?`)) {
                                      deleteStudent(currentId);
                                    }
                                    setActiveDropdown(null);
                                  }}
                                  className="w-full text-left px-4 py-2.5 text-xs font-semibold text-[#EF4444] hover:bg-[#EF4444]/10 transition-colors"
                                >
                                  Delete Record
                                </button>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </td>
                      )}
                    </motion.tr>
                  );
                }) : (
                  <tr>
                    <td colSpan="5" className="p-12 text-center text-[#666]">
                      <p className="text-sm font-semibold">No students found.</p>
                    </td>
                  </tr>
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-[#1A1A1A] bg-[#050505]/50 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-xs text-[#666] font-semibold">
              Showing <span className="text-white">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="text-white">{Math.min(currentPage * itemsPerPage, processedStudents.length)}</span> of <span className="text-white">{processedStudents.length}</span> students
            </p>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 bg-[#111] border border-[#222] text-[#888] rounded-lg hover:bg-[#222] hover:text-white transition-all disabled:opacity-20"
              >
                <ChevronLeft size={16} />
              </button>
              <div className="flex gap-1">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button 
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-bold transition-all ${currentPage === i + 1 ? "bg-[#22C55E] text-black" : "text-[#888]"}`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
              <button 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 bg-[#111] border border-[#222] text-[#888] rounded-lg hover:bg-[#222] hover:text-white transition-all disabled:opacity-20"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}