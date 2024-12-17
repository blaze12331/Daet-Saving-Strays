import React from 'react';
import { NavLink } from 'react-router-dom';
import './Header.css';
import DSSLogo from '../assets/DSS.png';

const Header = () => {
  return (
    <header className="header">
      <div className="logo">
        <img src={DSSLogo} alt="DSS Logo" className="logo-img" />
      </div>
      <nav className="nav">
        <NavLink to="/about-us" activeClassName="active-link">
          About Us
        </NavLink>
        <NavLink to="/for-adoption" activeClassName="active-link">
          For Adoption
        </NavLink>
        <NavLink to="/help-page" activeClassName="active-link">
          How to Help
        </NavLink>
        <NavLink to="/stories" activeClassName="active-link">
          Success Stories
        </NavLink>
        <NavLink to="/events" activeClassName="active-link">
          Events
        </NavLink>
      </nav>
      <button className="adopt-btn">Adopt Now</button>
    </header>
  );
};

export default Header;
