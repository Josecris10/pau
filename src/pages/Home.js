import React, { useContext, useState } from 'react';
import { AuthContext } from '../AuthContext';
import Cursos from '../components/Cursos';
import PostulacionesCurso from '../components/PostulacionesCurso';
import './Home.css';

const Home = ({ usuario }) => {
  const { user } = useContext(AuthContext);
  const [cursoSeleccionado, setCursoSeleccionado] = useState(null);

  return (
    <div className="home-container">
      <h2>Bienvenido a la Plataforma de Ayudantías Unificada</h2>
      {!user ? (
        <p>Inicia sesión para continuar</p>
      ) : (
        <>
          <p> Perfil de <strong>{user.perfil}</strong> - {user.nombre}</p>
          
          {!cursoSeleccionado ? (
            <Cursos usuario={user} onSeleccionarCurso={setCursoSeleccionado}/>
          ) : (
            <>
              <button className="volver-button" onClick={()=> setCursoSeleccionado(null)}>
                Volver a cursos
              </button>
              
              <PostulacionesCurso curso={cursoSeleccionado} />
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Home;
