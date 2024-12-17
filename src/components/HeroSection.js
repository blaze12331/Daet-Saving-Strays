// components/HeroSection.js
import React from 'react';
import './HeroSection.css';

const HeroSection = () => (
  <>
    <section className="hero">
      <div className="hero-content">
        <h1>Join Us to Save Strays</h1>
        <p>
          At Daet Saving Strays, we are dedicated to rescuing and rehoming stray animals.
          With your support, we provide compassionate care and safe shelters for those in need.
          Together, we can make a difference.
        </p>
        <div className="hero-buttons">
          <button className="donate-btn">Donate Now</button>
          <button className="learn-btn">Learn More</button>
        </div>
      </div>
    </section>

    {/* Wrapper for the AboutUs Component */}
  
  </>
);

export default HeroSection;
