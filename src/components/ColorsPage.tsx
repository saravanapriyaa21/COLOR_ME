import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface Color {
  name: string;
  hex: string;
}

const ColorsPage: React.FC = () => {
  const [colors, setColors] = useState<Color[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:3000/api/colors")
      .then(res => res.json())
      .then(data => {
        const mappedColors = data.map((item: any) => ({
          name: item["Name"],
          hex: item["Hex (24 bit)"]
        }));
        setColors(mappedColors);
      })
      .catch(err => console.error("Error fetching colors:", err));
  }, []);

  const handleColorClick = (color: Color) => {
    navigate("/colored-room", { 
      state: { 
        colorName: color.name,
        hexCode: color.hex 
      } 
    });
  };

  return (
    <div className="page-content">
      <h3 className="section-title">Available Colors</h3>
      <div className="color-grid">
        {colors.map((color, index) => (
          <div 
            key={index} 
            className="color-card"
            onClick={() => handleColorClick(color)}
          >
            <div
              className="color-swatch"
              style={{ backgroundColor: color.hex }}
            ></div>
            <p className="color-name">{color.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ColorsPage;