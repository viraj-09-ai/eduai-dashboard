import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { BrowserRouter } from "react-router-dom";

import { StudentProvider } from "./context/StudentContext";
import { AuthProvider } from "./context/AuthContext";
import { NotificationProvider } from './context/NotificationContext'; // 1. Add this import

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <StudentProvider>
          <NotificationProvider>
          <App />
          </NotificationProvider>
        </StudentProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);