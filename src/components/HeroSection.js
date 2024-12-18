// components/HeroSection.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './HeroSection.css';

const HeroSection = () => {
  const navigate = useNavigate();

  const handleDonateClick = () => {
    navigate('/donate');
  };

  return (
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
            <button className="donate-btn" onClick={handleDonateClick}>
              Donate Now
            </button>
          </div>
        </div>
      </section>
    </>
  );
};

export default HeroSection;
