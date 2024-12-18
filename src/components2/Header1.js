import React, { useState } from "react";
import "./Header1.css"; // External stylesheet for styling
import DSSLogo from "../assets/DSS (1).png"; // Import DSS.png image
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate
import { auth } from "../config/firebase"; // Firebase Authentication

const Header = () => {
  const [activeLink, setActiveLink] = useState("Manage Pets");

  // Initialize the useNavigate hook
  const navigate = useNavigate();

  // Handle logout
  const handleLogout = async () => {
    try {
      await auth.signOut(); // Firebase sign out
      console.log("User logged out successfully.");
      // Navigate to the login page
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error);
      alert("Failed to log out. Please try again.");
    }
  };

  return (
    <header className="header-container">
      {/* Logo Image */}
      <div className="logo">
        <img src={DSSLogo} alt="DSS Logo" className="logo-image" />
      </div>
      <nav className="nav-links">
        {/* Navigation Links */}
        <Link
          to="/petlist"
          className={activeLink === "Manage Pets" ? "active" : ""}
          onClick={() => setActiveLink("Manage Pets")}
        >
          Manage Pets
        </Link>
        <Link
          to="/adopt-list"
          className={activeLink === "Adoption Applicant List" ? "active" : ""}
          onClick={() => setActiveLink("Adoption Applicant List")}
        >
          Adoption Applicant List
        </Link>
        <Link
          to="/event"
          className={activeLink === "Events" ? "active" : ""}
          onClick={() => setActiveLink("Events")}
        >
          Events
        </Link>
        <Link
          to="/history"
          className={activeLink === "History" ? "active" : ""}
          onClick={() => setActiveLink("History")}
        >
          History
        </Link>
        <Link
          to="/donation-records"
          className={activeLink === "donation-records" ? "active" : ""}
          onClick={() => setActiveLink("donation-records")}
        >
          Donation Records
        </Link>
      </nav>
      <button className="logout-btn" onClick={handleLogout}>
        Logout
      </button>
    </header>
  );
};

export default Header;
