import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import ColorDetailPage from "./pages/ColorDetailPage";
import ColoredRoomPage from "./components/ColoredRoomPage"; // Add this import

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <Router>
      <Routes>
        {/* Login Page */}
        <Route
          path="/"
          element={
            isLoggedIn ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <LoginPage onLogin={() => setIsLoggedIn(true)} />
            )
          }
        />

        {/* Dashboard page (with navbar, welcome message, etc.) */}
        <Route path="/dashboard/*" element={<Dashboard />} />

        {/* Color Detail Page for each color */}
        <Route path="/color/:colorName" element={<ColorDetailPage />} />
        
        {/* New Colored Room Page */}
        <Route path="/colored-room" element={<ColoredRoomPage />} />
      </Routes>
    </Router>
  );
};

export default App;