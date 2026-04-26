import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useStudents } from './StudentContext';
import { predictStudent } from '../utils/predictor';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const { students } = useStudents();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const prevStudentCount = useRef(students?.length || 0);

  useEffect(() => {
    if (!students || students.length === 0) return;

    const newAlerts = [];

    // 1. Detect New Student
    if (students.length > prevStudentCount.current) {
      const latest = students[students.length - 1];
      newAlerts.push({
        id: `new-${Date.now()}`,
        type: 'info',
        title: 'New Student Enrolled',
        message: `${latest.name} was added to the system.`,
        time: 'Just now'
      });
    }
    prevStudentCount.current = students.length;

    // 2. Detect Critical Risks
    students.forEach(s => {
      const prediction = predictStudent(s);
      if (prediction.status === "Fail") {
        newAlerts.push({
          id: `risk-${s._id || s.id}-${Date.now()}`,
          type: 'error',
          title: 'Critical Risk Detected',
          message: `${s.name} requires immediate intervention.`,
          time: 'Live Alert'
        });
      }
    });

    if (newAlerts.length > 0) {
      setNotifications(prev => {
        // 🔥 FIX: Only add alerts that don't already exist in the LATEST state
        const uniqueNewAlerts = newAlerts.filter(newA => 
          !prev.some(oldA => oldA.message === newA.message)
        );
        
        if (uniqueNewAlerts.length === 0) return prev;
        
        setUnreadCount(c => c + uniqueNewAlerts.length);
        return [...uniqueNewAlerts, ...prev].slice(0, 10);
      });
    }
  }, [students]);

  const markAsRead = () => setUnreadCount(0);
  const clearAll = () => { setNotifications([]); setUnreadCount(0); };

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, markAsRead, clearAll }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);