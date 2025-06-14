import React from "react";
import { useParams } from "react-router-dom";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import "@/index.css";

const colorDetails: Record<string, { 
  description: string; 
  images: string[];
  specs: { rgb: string; hex: string; cmyk: string };
  history: string;
  modernUse: string;
}> = {
  crimson: {
    description: "Crimson is a bold, passionate red that commands attention. It's deep, rich, and timeless—like confidence painted on a wall.",
    images: ["/colors/crimson.jpg", "/houses/crimson-house.png"],
    specs: {
      rgb: "220, 20, 60",
      hex: "#DC143C",
      cmyk: "0%, 91%, 73%, 14%"
    },
    history: "Once extracted from the kermes insect, Crimson has colored royal robes since ancient times. In medieval Europe, it symbolized wealth and power, often reserved for nobility and high-ranking clergy. The vibrant hue was famously used in Renaissance art to depict luxurious fabrics and royal garments.",
    modernUse: "Today, Crimson makes a dramatic statement in modern interiors. Use it for accent walls in contemporary living spaces, bold front doors that welcome guests with confidence, or as a striking backdrop for art galleries. It pairs beautifully with neutral tones and works exceptionally well in home offices to stimulate creativity."
  },
  "royal blue": {
    description: "Royal Blue is pure elegance in pigment form. Calm yet commanding, it brings a regal charm to any room.",
    images: ["/colors/royalblue.jpg", "/houses/royalblue-house.jpg"],
    specs: {
      rgb: "65, 105, 225",
      hex: "#4169E1",
      cmyk: "71%, 53%, 0%, 12%"
    },
    history: "Created in the 18th century for a competition to design a dress for Queen Charlotte of England, Royal Blue quickly became synonymous with British royalty. The color was later adopted by navies worldwide for uniforms, representing trust and authority. During the Industrial Revolution, it became accessible to the masses through synthetic dyes.",
    modernUse: "Ideal for creating serene yet sophisticated spaces, Royal Blue shines in bedrooms for peaceful sleep, modern kitchens when paired with brass accents, and home offices to promote focus. It's particularly stunning when used in matte finishes for contemporary furniture or glossy tiles in luxurious bathrooms."
  },
  emerald: {
    description: "Emerald brings the lushness of nature indoors. It's earthy, serene, and dripping in sophistication.",
    images: ["/colors/emerald.jpg", "/houses/emerald-house.jpg"],
    specs: {
      rgb: "80, 200, 120",
      hex: "#50C878",
      cmyk: "60%, 0%, 40%, 22%"
    },
    history: "The Ancient Egyptians mined emeralds as early as 1500 BCE, associating the color with fertility and rebirth. Cleopatra famously adored emerald gems. In Art Nouveau period, the color became a symbol of nature's beauty, extensively used in stained glass and decorative arts. Victorian era saw it in heavy drapery and wallpapers.",
    modernUse: "Emerald transforms spaces with organic elegance. Try it in powder rooms for a jewel-box effect, as kitchen cabinetry for unexpected drama, or in sunrooms to enhance the connection with nature. It pairs beautifully with natural wood tones and works magic in home libraries, creating a cozy yet refined atmosphere."
  },
  amethyst: {
    description: "Amethyst is soft, spiritual, and stunning. A peaceful purple that calms the mind while charming the eyes.",
    images: ["/colors/amethyst.jpg", "/houses/amethyst-house.jpg"],
    specs: {
      rgb: "153, 102, 204",
      hex: "#9966CC",
      cmyk: "25%, 50%, 0%, 20%"
    },
    history: "In ancient Greece, amethyst was believed to prevent intoxication, leading to purple drinking vessels. Byzantine emperors used it in royal regalia, while Catholic bishops adopted it for their rings. During the Victorian era, it became popular in mourning jewelry, symbolizing spiritual connection with departed loved ones.",
    modernUse: "Perfect for creating tranquil retreats, Amethyst works wonders in bedrooms for restful sleep, meditation spaces to enhance mindfulness, and creative studios to inspire imagination. Use it in velvet upholstery for luxurious texture, or in bathrooms with matte finishes for a spa-like serenity. It complements both warm metals and cool tones beautifully."
  },
  carmine: {
    description: "Carmine is rich, passionate, and dramatic—a timeless red that oozes vintage glam and depth.",
    images: ["/colors/carmine.jpg", "/houses/carmine-house.jpg"],
    specs: {
      rgb: "150, 0, 24",
      hex: "#960018",
      cmyk: "0%, 100%, 84%, 41%"
    },
    history: "Derived from cochineal insects, Carmine was prized by Aztec and Maya civilizations for textiles and artwork. Spanish conquistadors exported it to Europe where it became more valuable than gold. Famous artists like Rembrandt and Van Gogh used it in their masterpieces. In 19th century, it was a favorite for luxurious Victorian interiors.",
    modernUse: "Carmine adds instant drama to contemporary spaces. Use it in dining rooms to stimulate appetite and conversation, as an accent wall behind a neutral-toned bedroom for romantic ambiance, or in small doses through vintage-inspired furniture pieces. It creates stunning contrast with dark woods and looks particularly elegant in home bars or music rooms."
  },
};

const ColorDetailPage: React.FC = () => {
  const { colorName } = useParams<{ colorName: string }>();
  const color = colorDetails[colorName?.toLowerCase() || ""];

  if (!color) {
    return (
      <div className="center-screen">
        <p className="error-text">Color not found!</p>
      </div>
    );
  }

  return (
    <div className="color-detail-page">
      <div className="container">
        {/* Left - Carousel */}
        <div className="carousel-container">
          <Carousel
            showThumbs={false}
            infiniteLoop
            autoPlay
            showStatus={false}
          >
            {color.images.map((src, index) => (
              <div key={index}>
                <img
                  src={src}
                  alt={`Slide ${index + 1}`}
                  className="carousel-image"
                />
              </div>
            ))}
          </Carousel>
        </div>

        {/* Right - Details */}
        <div className="details-container">
          <h1 className="color-name">{colorName}</h1>
          <p className="color-description">{color.description}</p>

          <div className="section">
            <h2>Color Specifications</h2>
            <ul className="specs-list">
              <li><strong>RGB:</strong> {color.specs.rgb}</li>
              <li><strong>HEX:</strong> {color.specs.hex}</li>
              <li><strong>CMYK:</strong> {color.specs.cmyk}</li>
            </ul>
          </div>

          <div className="section">
            <h2>Historical Significance</h2>
            <p>{color.history}</p>
          </div>

          <div className="section">
            <h2>Modern Applications</h2>
            <p>{color.modernUse}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ColorDetailPage;