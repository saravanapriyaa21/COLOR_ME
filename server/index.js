import express from 'express';
import cors from 'cors';
import { MongoClient } from 'mongodb';

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const uri = "mongodb+srv://saravanapriyaa:a4aSLfRNHRZE9%3A4@paint-app.vgl8nua.mongodb.net/?retryWrites=true&w=majority&appName=paint-app";

const client = new MongoClient(uri, {
  serverSelectionTimeoutMS: 5000, // timeout after 5 seconds if can't connect
});

let db, usersCollection, colorsCollection;

async function init() {
  try {
    await client.connect();
    db = client.db("paint_app"); // change if your DB name is different
    usersCollection = db.collection("users");
    colorsCollection = db.collection("colors");
    console.log("✅ Connected to MongoDB Atlas!");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  }
}
init();

// ---------------- COLORS API ----------------
app.get("/api/colors", async (req, res) => {
  try {
    const colors = await colorsCollection.find({}).limit(1000).toArray();
    res.json(colors);
  } catch (err) {
    console.error("Colors fetch error:", err);
    res.status(500).json({ error: "Failed to fetch colors" });
  }
});

// ---------------- LOGIN API ----------------
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await usersCollection.findOne({ email });

    if (!user) {
      return res.status(401).json({ success: false, message: "User not found. Please sign up." });
    }

    if (user.password_hash === password) {
      return res.status(200).json({ success: true, message: "Login successful", user });
    } else {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Server error during login" });
  }
});

// ---------------- SIGNUP API ----------------
app.post("/api/signup", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const existingUser = await usersCollection.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    const newUser = {
      username,
      email,
      password_hash: password,
      base_color: "",
      liked_palettes: [],
      uploads: [],
      history: [],
    };

    await usersCollection.insertOne(newUser);

    res.status(201).json({ success: true, message: "User registered successfully" });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ error: "Server error during signup" });
  }
});

// ---------------- START SERVER ----------------
app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
