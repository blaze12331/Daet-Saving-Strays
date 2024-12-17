import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import Header from "./components/Header";
import HeroSection from "./components/HeroSection";
import AboutUs from "./components/AboutUs";
import AdoptionCards from "./components/AdoptionCards";
import HelpPage from "./components/HelpPage";
import Stories from "./components/Stories";
import Events from "./components/Events";
import DonatePage from "./components/DonatePage";
import LoginForm from "./components2/LoginForm";
import PetList from "./components2/PetList";
import Event from "./components2/Event";
import AdoptionList from "./components2/AdoptionList";
import History from "./components2/History";
import Header1 from "./components2/Header1"; // Ensure Header1 is imported

const App = () => {
  const [lastScrollY, setLastScrollY] = useState(0);

  // Detect Subdomain
  const hostname = window.location.hostname;
  const isLoginSubdomain = hostname.startsWith("login."); // Adjust subdomain as needed

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

  // Render LoginForm only for login subdomain
  if (isLoginSubdomain) {
    return <LoginForm />;
  }

  // Render Main App for other domains
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Routes without Header, but with Header1 */}
          <Route
            path="/login"
            element={
              <>
              <LoginForm />
                <Header1 />
                
              </>
            }
          />
          <Route
            path="/petlist"
            element={
              <>
                <Header1 />
                <PetList />
              </>
            }
          />
          <Route
            path="/event"
            element={
              <>
                <Header1 />
                <Event />
              </>
            }
          />
          <Route
            path="/adopt-list"
            element={
              <>
                <Header1 />
                <AdoptionList />
              </>
            }
          />
          <Route
            path="/history"
            element={
              <>
                <Header1 />
                <History />
              </>
            }
          />

          {/* Routes with Header */}
          <Route
            path="*"
            element={
              <>
                <Header />
                <Routes>
                  <Route path="/" element={<HeroSection id="hero-section" />} />
                  <Route path="/about-us" element={<AboutUs />} />
                  <Route path="/for-adoption" element={<AdoptionCards />} />
                  <Route path="/help-page" element={<HelpPage />} />
                  <Route path="/stories" element={<Stories />} />
                  <Route path="/events" element={<Events />} />
                  <Route path="/donate" element={<DonatePage />} />
                </Routes>
              </>
            }
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
