import React from 'react';
import './Header.css';
import logo from './assets/usm-logo.png';

// Luego en el JSX:


const Header = () => {
  return (
    <header className="header">
      {/* Logo */}
      	<div className="logo">
  		 <img src={logo} alt="Logo" className="logo" />
		</div>

	<h1>Plataforma de Ayudantías Unificada</h1>

      {/* Botón de acción */}
      <button className="cta-button">Login</button>
    </header>
  );
};

export default Header;