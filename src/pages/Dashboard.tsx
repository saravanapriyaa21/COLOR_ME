import React from "react";
import { Link, Routes, Route } from "react-router-dom";
import ColorsPage from "@/components/ColorsPage";
import ColorYourHousePage from "@/components/ColorYourHousePage";
import HomePage from "@/pages/HomePage";

const Dashboard: React.FC = () => {
  const username = localStorage.getItem("username") || "Guest";

  return (
    <div className="dashboard-container">
      <nav className="navbar">
        <h2 className="welcome">Welcome, {username} </h2>
        <div className="nav-links">
          <Link to="/dashboard" className="nav-link">Home</Link>
          <Link to="/dashboard/colors" className="nav-link">Colors</Link>
          <Link to="/dashboard/color-your-house" className="nav-link">Color Your House</Link>
        </div>
      </nav>

      <div className="page-content p-0 m-0">
        <Routes>
          <Route path="/" element={<HomePage />} /> {/* Shows under navbar */}
          <Route path="colors" element={<ColorsPage />} />
          <Route path="color-your-house" element={<ColorYourHousePage />} />
        </Routes>
      </div>
    </div>
  );
};

export default Dashboard;
