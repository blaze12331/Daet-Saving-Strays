import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './Header.css';
import DSSLogo from '../assets/DSS.png';

const Header = () => {
  const navigate = useNavigate(); // React Router's navigation hook

  const handleAdoptClick = () => {
    navigate('/for-adoption'); // Navigate to the "For Adoption" route
  };

  return (
    <header className="header">
      <div className="logo">
        <img src={DSSLogo} alt="DSS Logo" className="logo-img" />
      </div>
      <nav className="nav">
      <nav className="nav">
  <NavLink to="/about-us#about-content" activeClassName="active-link">
    About Us
  </NavLink>
  <NavLink to="/for-adoption" activeClassName="active-link">
    For Adoption
  </NavLink>
  <NavLink to="/help-page" activeClassName="active-link">
    How to Help
  </NavLink>
  <NavLink to="/events" activeClassName="active-link">
    Events
  </NavLink>
</nav>

      </nav>
      <button className="adopt-btn" onClick={handleAdoptClick}>
        Adopt Now
      </button>
    </header>
  );
};

export default Header;
