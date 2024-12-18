import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import "./App.css";

// Components
import Header from "./components/Header";
import HeroSection from "./components/HeroSection";
import AboutUs from "./components/AboutUs";
import AdoptionCards from "./components/AdoptionCards";
import HelpPage from "./components/HelpPage";
import Stories from "./components/Stories";
import Events from "./components/Events";
import DonatePage from "./components/DonatePage";

// Components2 (Protected Routes)
import LoginForm from "./components2/LoginForm";
import PetList from "./components2/PetList";
import Event from "./components2/Event";
import AdoptionList from "./components2/AdoptionList";
import History from "./components2/History";
import Header1 from "./components2/Header1";
import DonationRecords from "./components2/DonationRecords";

// Firebase Auth
import { AuthProvider, useAuth } from "./config/AuthProvider";

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { currentUser } = useAuth();
  return currentUser ? children : <Navigate to="/login" replace />;
};

const App = () => {
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY < lastScrollY && lastScrollY > 200) {
        const heroSection = document.getElementById("hero-section");
        if (heroSection) {
          heroSection.scrollIntoView({ behavior: "smooth" });
        }
      }
      setLastScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Public Route */}
            <Route path="/login" element={<LoginForm />} />

            {/* Protected Routes */}
            <Route
              path="/petlist"
              element={
                <ProtectedRoute>
                  <Header1 />
                  <PetList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/event"
              element={
                <ProtectedRoute>
                  <Header1 />
                  <Event />
                </ProtectedRoute>
              }
            />
            <Route
              path="/adopt-list"
              element={
                <ProtectedRoute>
                  <Header1 />
                  <AdoptionList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/history"
              element={
                <ProtectedRoute>
                  <Header1 />
                  <History />
                </ProtectedRoute>
              }
            />
            <Route
              path="/donation-records"
              element={
                <ProtectedRoute>
                  <Header1 />
                  <DonationRecords />
                </ProtectedRoute>
              }
            />

            {/* Public Routes with Header */}
            <Route
              path="/"
              element={
                <>
                  <Header />
                  <HeroSection id="hero-section" />
                </>
              }
            />
            <Route
              path="/about-us"
              element={
                <>
                  <Header />
                  <AboutUs />
                </>
              }
            />
            <Route
              path="/for-adoption"
              element={
                <>
                  <Header />
                  <AdoptionCards />
                </>
              }
            />
            <Route
              path="/help-page"
              element={
                <>
                  <Header />
                  <HelpPage />
                </>
              }
            />
            <Route
              path="/stories"
              element={
                <>
                  <Header />
                  <Stories />
                </>
              }
            />
            <Route
              path="/events"
              element={
                <>
                  <Header />
                  <Events />
                </>
              }
            />
            <Route
              path="/donate"
              element={
                <>
                  <Header />
                  <DonatePage />
                </>
              }
            />

            {/* Catch-All: Redirect to Login */}
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
