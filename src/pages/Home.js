import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../AuthContext';
import Cursos from '../components/Cursos';
import PostulacionesCurso from '../components/PostulacionesCurso';
import './Home.css';

import prof from '../assets/Profesor.png';
import coor from '../assets/Coordinador.png';

const Home = () => {
    const { user } = useContext(AuthContext);
    const [cursoSeleccionado, setCursoSeleccionado] = useState(null);
    const [rolDocente, setRolDocente] = useState(null);
    const [cursoUsuarios, setCursoUsuarios] = useState([]);

    useEffect(() => {
        const fetchCursoUsuarios = async () => {
            try {
                const res = await fetch('http://localhost:3001/cursoUsuarios');
                const data = await res.json();
                console.log("Datos obtenidos de cursoUsuarios:", data);
                setCursoUsuarios(data);
            } catch (error) {
                console.error("Error al cargar los cursos:", error);
            }
        };
        fetchCursoUsuarios();
    }, []);

    // Logs generales en cada render
    console.log("user (AuthContext):", user);
    console.log("cursoUsuarios (state):", cursoUsuarios);
    console.log("cursoSeleccionado (state):", cursoSeleccionado);

    // Logs justo antes de renderizar PostulacionesCurso (sólo si hay curso seleccionado)
    if (cursoSeleccionado) {
        console.log("Datos para PostulacionesCurso -> curso:", cursoSeleccionado);
        console.log("Datos para PostulacionesCurso -> usuario:", user);
        console.log("Datos para PostulacionesCurso -> cursoUsuarios:", cursoUsuarios);
    }

    return (
        <div className="home-container">
            {!user && <h2 className="titulo-principal">Bienvenido a la Plataforma de Ayudantías Unificada</h2>}

            {user ? (
                <>
            {/*Navegacion tipo migas de pan*/}
                    <p className="breadcrumb">
                      <span 
                        onClick={() => {
                          setRolDocente(null);
                          setCursoSeleccionado(null);
                        }}
                      >
                        Inicio
                      </span>
                      {rolDocente && (
                        <>
                          -> <span 
                               onClick={() => setCursoSeleccionado(null)}
                             >
                               {rolDocente}
                             </span>
                        </>
                      )}
                      {cursoSeleccionado && `-> ${cursoSeleccionado.codigo}`}
                    </p>

                    {!rolDocente ? (
                        <>
                            <h2 className="titulo-principal"> ¡Bienvenido! Elige tu perfil. </h2>
                            <div className="menu-buttons">
                                <div className="rol-opcion" onClick={() => setRolDocente("profesor")}>
                                    <img src={prof} alt="Profesor" className="rol-img" />
                                    <p>Profesor</p>
                                </div>
                                <div className="rol-opcion" onClick={() => setRolDocente("coordinador")}>
                                    <img src={coor} alt="Coordinador" className="rol-img" />
                                    <p>Coordinador</p>
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            {!cursoSeleccionado ? (
                                <>
                                    <Cursos usuario={user} onSeleccionarCurso={setCursoSeleccionado} rolDocente={rolDocente} />
                                    <button className="volver-button" onClick={() => setRolDocente(null)}>
                                        Volver
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button className="volver-button" onClick={() => setCursoSeleccionado(null)}>
                                        Volver
                                    </button>
                                    <PostulacionesCurso
                                        curso={cursoSeleccionado}
                                        usuario={user}
                                        cursoUsuarios={cursoUsuarios}
                                    />
                                </>
                            )}
                        </>
                    )}
                </>
            ) : (
                <p className= "mensaje-principal">Inicia sesión para continuar</p>
            )}
        </div>
    );
};

export default Home;
