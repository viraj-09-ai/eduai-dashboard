export const predictStudent = (student) => {
  const reasons = [];
  
  // 1. Check Attendance
  if (student.attendance < 75) {
    reasons.push(`Low attendance (${student.attendance}%)`);
  }
  
  // 2. Check Marks
  if (student.marks < 50) {
    reasons.push("Marks below threshold");
  }

  // --- LOGIC ENGINE ---
  if (student.marks >= 85 && student.attendance >= 85) {
    return {
      status: "Good",
      label: "On Track",
      reason: "High performance & attendance",
      color: "text-[#22C55E]",
      bg: "bg-[#22C55E]/10"
    };
  }

  if (student.marks < 40 || student.attendance < 60) {
    return {
      status: "Fail",
      label: "Critical",
      reason: reasons.length > 0 ? reasons.join(" + ") : "Multiple risk factors",
      color: "text-[#EF4444]",
      bg: "bg-[#EF4444]/10"
    };
  }

  if (student.marks < 60 || student.attendance < 75) {
    return {
      status: "At Risk",
      label: "At Risk",
      reason: reasons.length > 0 ? reasons.join(" + ") : "Marginal performance",
      color: "text-[#F59E0B]",
      bg: "bg-[#F59E0B]/10"
    };
  }

  return {
    status: "Good",
    label: "On Track",
    reason: "Consistent performance",
    color: "text-[#22C55E]",
    bg: "bg-[#22C55E]/10"
  };
};