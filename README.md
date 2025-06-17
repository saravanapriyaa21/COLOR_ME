# COLORÉ - color your space, your way
Ever wondered how your room would look in a new color?
COLORÉ lets you try out wall colors on your own room photos—instantly. Just upload a pic, pick a shade, and watch the walls change without touching the furniture. It’s like a smart paint test, but way cooler.

Powered by AI, MongoDB, and a bit of magic,
Built with love using React, Flask, and Google Cloud.

## Features

-  Upload any image of a room interior
-  Get personalized wall color suggestions using *Google Vision AI*
-  Search matching shades via *MongoDB Atlas Vector Search*
-  Preview the selected colors on the walls using realistic image tinting
-  Built for the Web — Fast, responsive, and user-friendly interface

---

## How It Works

1. *Image Upload*: Users upload a room photo from their device.
2. *Label Detection*: Google Vision API identifies key elements (e.g., "Living Room", "Couch", etc.).
3. *Embedding Generation*: The best matching label is converted into a numerical vector embedding.
4. *Vector Search*: MongoDB Atlas searches for colors with similar aesthetic embeddings.
5. *Color Suggestions*: Top 3 color shades are suggested.
6. *Tinted Preview*: The selected color is realistically applied to the wall area of the uploaded image using masking and color blending.

---
## Tech Stack

| Layer       | Technology                         |
|-------------|-------------------------------------|
| Frontend    | React + TypeScript                  |
| Backend     | Flask (Python)                      |
| Cloud AI    | Google Vision API (Label Detection) |
| Database    | MongoDB Atlas + Vector Search       |
| Image Tools | Pillow (PIL), NumPy                 |
| Hosting     | Google Cloud Run / Cloud Storage    |

---
## Folder Structure
<pre> Coloré/ ├── client/ # React frontend ├── server/ # Flask backend │ ├── app.py # Main API routes │ └── image_data/ # Room base, mask, and output folders ├── colore-service-account.json # Google Cloud credentials (safe file) ├── README.md ├── requirements.txt └── package.json </pre>

---
## 🔐 Authentication & Privacy

- Google Vision API is securely accessed via environment credentials.
- No uploaded images or user data are stored permanently.
- The app is built following Google Cloud security practices.

---

## Installation Steps
### Backend Setup (Python)

bash  
cd server  
pip install -r requirements.txt  
python app.py  

### Frontend setup
cd client  
npm install  
npm run dev  
npm start  

### Database Connection
node index.js  