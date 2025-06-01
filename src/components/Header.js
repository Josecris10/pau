import React, {useContext} from 'react';
import { AuthContext } from '../AuthContext';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import './Header.css';
import logo from '../assets/usm-logo.png';

// Luego en el JSX:


const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleClick = () => {
    if (user) logout();
    navigate('/login');
  };

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

    <button className="cta-button" onClick={handleClick}>
      {user ? `Cerrar sesión` : `Iniciar Sesión`}
    </button>
    </header>
  );
};

export default Header;