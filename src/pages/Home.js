import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  return (
    <div className="home-container">
      <h2>Bienvenido a la Plataforma de Ayudantías Unificada</h2>
      <p>Seleccione una opción del menú para continuar.</p>

      <div className="menu-buttons">
        <Link to="/postulaciones" className="menu-button">
          Ver Postulantes
        </Link>
      </div>  
    </div>
  );
};

export default Home;
