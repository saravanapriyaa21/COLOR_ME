import React, { useState } from 'react';
import axios from 'axios';

type ColorSuggestion = {
  name: string;
  hex: string;
};

export default function ColorYourHouse() {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<ColorSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [tintedImage, setTintedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
      setSuggestions([]);
      setTintedImage(null);
      setError(null);
      setSelectedColor(null);
    }
  };

  const handleUpload = async () => {
    if (!image) return;
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('image', image);

    try {
      const response = await axios.post('http://localhost:5000/api/suggest-colors', formData);
      setSuggestions(response.data);
    } catch (err: any) {
      console.error('Error uploading image:', err);
      setError("No suitable colors found or server error. Try another image.");
    } finally {
      setLoading(false);
    }
  };

  const handleApplyColor = async (hex: string, name: string) => {
    setSelectedColor(name);
    try {
      const response = await axios.post(
        'http://localhost:5000/api/tint-room',
        { hex },
        { responseType: 'blob' }
      );
      const imageBlob = new Blob([response.data], { type: 'image/png' });
      const imageUrl = URL.createObjectURL(imageBlob);
      setTintedImage(imageUrl);
    } catch (err) {
      console.error('Error tinting image:', err);
      setError("Failed to apply selected color. Try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-md overflow-hidden p-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2 font-copperplate">Color Your Space</h1>
          <p className="text-gray-600">*Upload a room photo and discover perfect color schemes</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Left Column - Upload and Preview */}
          <div className="space-y-6">
            <div className="bg-gray-100 p-6 rounded-lg border-2 border-dashed border-gray-300 hover:border-blue-400 transition-colors duration-300">
              <label className="flex flex-col items-center justify-center cursor-pointer">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <p className="mb-2 text-sm text-gray-500">
                    <span className="font-semibold">*Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">*PNG, JPG, JPEG (MAX. 5MB)</p>
                </div>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleFileChange} 
                  className="hidden" 
                />
              </label>
            </div>

            {preview && (
              <div className="relative group">
                <img 
                  src={preview} 
                  alt="Uploaded Room" 
                  className="rounded-lg shadow-md w-full h-auto max-h-80 object-contain border border-gray-200 image-frame" 
                />
                {tintedImage && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg">
                    <span className="text-white font-medium">Original Image</span>
                  </div>
                )}
              </div>
            )}

            {tintedImage && (
              <div className="mt-4">
                <h3 className="text-lg font-semibold mb-2 text-gray-800">Color Applied</h3>
                <img 
                  src={tintedImage} 
                  alt="Tinted Room" 
                  className="rounded-lg shadow-md w-full h-auto max-h-80 object-contain border border-gray-200 image-frame" 
                />
              </div>
            )}
          </div>

          {/* Right Column - Controls and Results */}
          <div className="space-y-6">
            <button
              onClick={handleUpload}
              disabled={!image || loading}
              className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-300 ${
                !image || loading 
                  ? 'bg-gray-300 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg transform hover:-translate-y-0.5'
              }`}
            >
              {loading ? 'Analyzing your image...' : 'Suggest Colors'}
            </button>

            {error && (
              <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {suggestions.length > 0 && (
              <div className="bg-gray-50 p-6 rounded-lg">
                <h2 className="text-xl font-bold text-gray-800 mb-4 font-copperplate">Recommended Color Palette</h2>
                <div className="grid grid-cols-3 gap-4">
                  {suggestions.map((color, idx) => (
                    <div
                      key={idx}
                      className={`cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                        selectedColor === color.name ? 'ring-2 ring-blue-500' : ''
                      }`}
                      onClick={() => handleApplyColor(color.hex, color.name)}
                    >
                      <div
                        className="w-full h-24 rounded-lg shadow-md mx-auto flex items-end p-3"
                        style={{ backgroundColor: color.hex }}
                      >
                        <span className="text-xs font-medium text-white bg-black bg-opacity-50 px-2 py-1 rounded">
                          {color.hex}
                        </span>
                      </div>
                      <p className="mt-2 text-sm font-medium text-gray-700 text-center font-lucida">
                        {color.name}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedColor && (
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-700">
                  <span className="font-medium">Selected:</span> {selectedColor}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}