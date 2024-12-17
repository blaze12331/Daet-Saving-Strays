import React, { useState } from "react";
import { FaGoogle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { auth, googleProvider } from "../config/firebase";
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import "./LoginForm.css";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Google Sign-In provider
  const googleProvider = new GoogleAuthProvider();

  // Handle email/password login
  const handleEmailPasswordLogin = async (e) => {
    e.preventDefault();

    if (email === "" || password === "") {
      setError("Please fill in all fields.");
      console.error("Error: Fields are empty.");
      return;
    }

    try {
      // Sign in with email and password
      console.log("Attempting to log in with email:", email);
      await signInWithEmailAndPassword(auth, email, password);

      alert("Logged in successfully!");
      console.log("Login successful. Navigating to /petlist");
      navigate("/petlist");
    } catch (err) {
      console.error("Firebase Error Code:", err.code, "Message:", err.message);

      // Provide detailed error messages for debugging
      if (err.code === "auth/wrong-password") {
        setError("Incorrect password. Please try again.");
      } else if (err.code === "auth/user-not-found") {
        setError("No account found with this email.");
      } else if (err.code === "auth/invalid-email") {
        setError("Invalid email format.");
      } else if (err.code === "auth/too-many-requests") {
        setError("Too many failed attempts. Try again later.");
      } else {
        setError("Login failed. Please try again.");
      }
    }
  };

  // Handle Google login
  const handleGoogleLogin = async () => {
    try {
      console.log("Attempting Google login...");
      await signInWithPopup(auth, googleProvider);

      alert("Logged in successfully with Google!");
      console.log("Google login successful. Navigating to /petlist");
      navigate("/petlist");
    } catch (err) {
      console.error("Google Login Error Code:", err.code, "Message:", err.message);
      setError("Failed to sign in with Google. Please try again.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Log in</h2>
        <p className="welcome-text">Welcome to Daet Saving Strays</p>

        {/* Email/Password Login Form */}
        <form onSubmit={handleEmailPasswordLogin}>
          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && <p className="error">{error}</p>}

          <button type="submit" className="login-btn">
            Log in
          </button>
        </form>

        {/* Google Login */}
        <div className="or-container">
          <p>or Continue with</p>
        </div>
        <div className="social-icons">
          <FaGoogle
            className="icon google"
            onClick={handleGoogleLogin} // Google Login Button
            style={{ cursor: "pointer" }}
          />
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
