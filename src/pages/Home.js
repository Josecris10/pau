import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../AuthContext';
import Cursos from '../components/Cursos';
import PostulacionesCurso from '../components/PostulacionesCurso';
import './Home.css';

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
            {!user && <h2>Bienvenido a la Plataforma de Ayudantías Unificada</h2>}

            {user ? (
                <>
            {/*Navegacion tipo migas de pan*/}
                    <p>
                      <span 
                        onClick={() => {
                          setRolDocente(null);
                          setCursoSeleccionado(null);
                        }}
                        style={{cursor: 'pointer'}}
                      >
                        Inicio
                      </span>
                      {rolDocente && (
                        <>
                          -> <span 
                               onClick={() => setCursoSeleccionado(null)}
                               style={{cursor: 'pointer'}}
                             >
                               {rolDocente}
                             </span>
                        </>
                      )}
                      {cursoSeleccionado && `-> ${cursoSeleccionado.codigo}`}
                    </p>

                    {!rolDocente ? (
                        <>
                            <p> Elegir su rol </p>
                            <button onClick={() => setRolDocente("Profesor")}> Profesor </button>
                            <button onClick={() => setRolDocente("Coordinador")}> Coordinador </button>
                        </>
                    ) : (
                        <>
                            {!cursoSeleccionado ? (
                                <>
                                    <Cursos usuario={user} onSeleccionarCurso={setCursoSeleccionado} />
                                    <button className="volver-button" onClick={() => setRolDocente(null)}>
                                        Volver
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button className="volver-button" onClick={() => setCursoSeleccionado(null)}>
                                        Volver a cursos
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
                <p>Inicia sesión para continuar</p>
            )}
        </div>
    );
};

export default Home;
