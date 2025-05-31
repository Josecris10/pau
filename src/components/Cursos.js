import React, { useEffect, useState } from 'react';
import './Cursos.css';

const Cursos = ({ usuario, onSeleccionarCurso }) => {
  const [cursosCompletos, setCursosCompletos] = useState([]);

  useEffect(() => {
    const fetchCursos = async () => {
      try {
        const codigos = usuario.cursos || [];

        // Fetch por cada código de curso
        const promesas = codigos.map(async (codigo) => {
          const res = await fetch(`http://localhost:3001/cursos?codigo=${codigo}`);
          const data = await res.json();
          return data[0]; // asumimos que siempre hay uno
        });

        const resultados = await Promise.all(promesas);
        setCursosCompletos(resultados);
      } catch (error) {
        console.error('Error cargando cursos:', error);
      }
    };

    fetchCursos();
  }, [usuario]);

  return (
    <div className="cursos-container">
      <h3>Tus cursos</h3>
      {cursosCompletos.length === 0 ? (
        <p>No tienes cursos asignados.</p>
      ) : (
        <ul className="cursos-lista">
          {cursosCompletos.map((curso) => (
            <li key={curso.codigo + curso.paralelo}>
              <button className="curso-button" onClick={() => onSeleccionarCurso(curso)}>
                <strong>{curso.nombre}</strong> ({curso.codigo})<br />
                Paralelo {curso.paralelo}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Cursos;
