import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';
import logo from '../assets/usm-logo.png';

// Luego en el JSX:


const Header = () => {
  return (
    <header className="header">
      <Link to ="/">
      {/* Logo */}
      	<div className="logo">
  		 <img src={logo} alt="Logo" className="logo" />
		</div>
      </Link>

	<h1>
     <div style={{ color: 'white', textDecoration: 'none' }}>
      Plataforma de Ayudantías Unificada
    </div>
  </h1>

  <Link to ="/login">
      <button className="cta-button">Login</button>
  </Link>
    </header>
  );
};

export default Header;