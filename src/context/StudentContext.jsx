import React, { createContext, useContext, useState, useEffect } from 'react';

const StudentContext = createContext();

export function useStudents() {
  return useContext(StudentContext);
}

export function StudentProvider({ children }) {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔌 YOUR BACKEND URL
  const API_URL = "http://localhost:5000/api/students";

  // Helper function to get the token (assuming you store it in localStorage after login)
  const getToken = () => localStorage.getItem("token");

  // ==========================================
  // 📥 READ: Fetch from MongoDB (Moved outside useEffect so it can be exported!)
  // ==========================================
 const fetchStudents = async () => {
    try {
      // 🔥 ADD THIS EXACT LINE TO FAKE A SLOW INTERNET CONNECTION:
      await new Promise(resolve => setTimeout(resolve, 3000));

      const res = await fetch(API_URL, {
        headers: {
          "Authorization": `Bearer ${getToken()}` 
        }
      });
      
      if (!res.ok) throw new Error("Failed to fetch data");
      
      const data = await res.json();
      
      const formattedData = data.map(student => ({
        ...student,
        id: student._id 
      }));

      setStudents(formattedData);
    } catch (error) {
      console.error("❌ Error loading students:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // ==========================================
  // 🟢 CREATE: Send to MongoDB
  // ==========================================
  const addStudent = async (newStudent) => {
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${getToken()}` 
        },
        body: JSON.stringify(newStudent),
      });

      const savedStudent = await res.json();
      
      setStudents(prev => [{ ...savedStudent, id: savedStudent._id }, ...prev]);
    } catch (error) {
      console.error("❌ Error adding student:", error);
    }
  };

  // ==========================================
  // 📥 BULK CREATE: Upload multiple students from CSV
  // ==========================================
  const bulkAddStudents = async (newStudents) => {
    try {
      const createdStudents = [];

      for (const student of newStudents) {
        const res = await fetch(API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${getToken()}`
          },
          body: JSON.stringify(student),
        });

        if (!res.ok) {
          console.warn(`Failed to add student ${student.name}`);
          continue;
        }

        const savedStudent = await res.json();
        createdStudents.push({ ...savedStudent, id: savedStudent._id });
      }

      if (createdStudents.length > 0) {
        setStudents(prev => [...createdStudents, ...prev]);
      }

      return createdStudents;
    } catch (error) {
      console.error("❌ Error bulk adding students:", error);
      return [];
    }
  };

  // ==========================================
  // 🔵 UPDATE: Edit in MongoDB
  // ==========================================
  const updateStudent = async (updatedStudent) => {
    try {
      const res = await fetch(`${API_URL}/${updatedStudent.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${getToken()}`
        },
        body: JSON.stringify(updatedStudent),
      });

      const savedStudent = await res.json();

      setStudents(students.map(student => 
        student.id === updatedStudent.id ? { ...savedStudent, id: savedStudent._id } : student
      ));
    } catch (error) {
      console.error("❌ Error updating student:", error);
    }
  };

  // ==========================================
  // 🔴 DELETE: Remove from MongoDB
  // ==========================================
  const deleteStudent = async (id) => {
    try {
      await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${getToken()}`
        }
      });

      setStudents(students.filter(student => student.id !== id));
    } catch (error) {
      console.error("❌ Error deleting student:", error);
    }
  };

  return (
    <StudentContext.Provider value={{ 
      students, 
      setStudents,    // 🔥 FIXED: UI can now update data locally
      loading, 
      fetchStudents,  // 🔥 FIXED: UI can now refresh data from DB
      addStudent, 
      bulkAddStudents, 
      updateStudent, 
      deleteStudent 
    }}>
      {children}
    </StudentContext.Provider>
  );
}