import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const LoginPage = ({ onLogin }: { onLogin: () => void }) => {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const endpoint = isSignup ? "/api/signup" : "/api/login";

    try {
      const res = await fetch(`http://localhost:3000${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          isSignup ? { email, password, username } : { email, password }
        ),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        // ✅ Save username and email to localStorage from returned user
        if (data.user && data.user.username) {
          localStorage.setItem("username", data.user.username);
        } else if (isSignup) {
          localStorage.setItem("username", username); // fallback for signup
        }

        localStorage.setItem("email", email);
        onLogin(); // callback to parent (optional use)
        navigate("/dashboard"); // go to dashboard
      } else {
        setError(data.message || "Authentication failed");
      }
    } catch (err) {
      setError("Server error");
    }
  };

  return (
    <div className="form-container">
      <Card className="form-card">
        <h2 className="form-title">
          {isSignup
            ? "SIGN UP TO EXPLORE!"
            : "LOGIN TO GET YOUR PERSONALIZED RECOMMENDATIONS"}
        </h2>

        {error && <p style={{ color: "red", marginBottom: "10px" }}>{error}</p>}

        <form onSubmit={handleSubmit}>
          {isSignup && (
            <input
              type="text"
              placeholder="Username"
              className="form-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          )}
          <input
            type="email"
            placeholder="Email"
            className="form-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="form-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button className="form-button" type="submit">
            {isSignup ? "Sign Up" : "Login"}
          </button>
        </form>

        <p className="form-toggle" onClick={() => setIsSignup(!isSignup)}>
          {isSignup
            ? "Already have an account? Login"
            : "Don't have an account? Sign up"}
        </p>
      </Card>
    </div>
  );
};

export default LoginPage;
