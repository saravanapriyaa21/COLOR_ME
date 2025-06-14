import React, { useState } from "react";

const ColorYourHousePage: React.FC = () => {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className="page">
      <h3 className="section-title">Upload Your Room</h3>
      <input type="file" accept="image/*" onChange={handleUpload} />
      {preview && (
        <div className="image-frame">
          <img src={preview} alt="preview" className="uploaded-img" />
        </div>
      )}
      <h4 className="section-title">Recommended Colors</h4>
      <div className="color-grid">
        {["#FF5733", "#FFC300", "#DAF7A6"].map((color, i) => (
          <div
            key={i}
            className="color-swatch"
            style={{ backgroundColor: color }}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default ColorYourHousePage;
