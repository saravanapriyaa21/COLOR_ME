import React from "react";
import { useNavigate } from "react-router-dom";
import "@/index.css";

const colorData = [
  { name: "Crimson", file: "/houses/crimson-house.png" },
  { name: "Royal Blue", file: "/houses/royalblue-house.jpg" },
  { name: "Emerald", file: "/houses/emerald-house.jpg" },
  { name: "Amethyst", file: "/houses/amethyst-house.jpg" },
  { name: "Carmine", file: "/houses/carmine-house.jpg" },
];

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="homepage-wrapper">
      {/* Top animated banner */}
      <div className="photo-container">
        <img
          src="/home.png"
          alt="Home Animation"
          className="animated-photo"
        />
      </div>

      {/* Title and subtitle */}
      <h1 className="page-title">Goated Colors</h1>
      <p className="page-subtitle">
        Colors liked by customers regardless of centuries
      </p>

      {/* Scrollable color grid container */}
      <div className="color-grid-container">
        <div className="color-grid">
          {colorData.map((color) => (
            <div
              key={color.name}
              className="color-card"
              onClick={() =>
                navigate(`/color/${encodeURIComponent(color.name.toLowerCase())}`)
              }
            >
              <img
                src={color.file}
                alt={`${color.name} House`}
                className="color-image"
              />
              <div className="color-overlay">
                <p className="overlay-color-name">{color.name}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
