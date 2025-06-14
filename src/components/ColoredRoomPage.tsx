import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const ColoredRoomPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { colorName, hexCode } = location.state || {
    colorName: "Default",
    hexCode: "#FFFFFF",
  };

  const [tintedImageUrl, setTintedImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Send request to Flask API when component mounts
    const sendColorToBackend = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/tint-room", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ hex: hexCode }),
        });

        const blob = await response.blob();
        const imageUrl = URL.createObjectURL(blob);
        setTintedImageUrl(imageUrl);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching tinted image:", error);
        setLoading(false);
      }
    };

    sendColorToBackend();
  }, [hexCode]);

  return (
    <div className="colored-room-page">
      <div className="room-preview-container">
        <h2>{colorName} Room Preview</h2>

        <div className="room-image-container">
          {loading ? (
            <p>Generating tinted room image...</p>
          ) : (
            <img
              src={tintedImageUrl!}
              alt={`Room tinted in ${colorName}`}
              className="room-base-image"
              style={{ maxWidth: "100%", borderRadius: "10px" }}
            />
          )}
        </div>

        <div className="color-info">
          <div
            className="color-swatch-large"
            style={{ backgroundColor: hexCode }}
          />
          <p><strong>Color:</strong> {colorName}</p>
          <p><strong>HEX:</strong> {hexCode}</p>
        </div>

        <button
          className="back-button"
          onClick={() => navigate(-1)}
        >
          Back to Colors
        </button>
      </div>
    </div>
  );
};

export default ColoredRoomPage;
