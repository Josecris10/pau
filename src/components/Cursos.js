import React, { useEffect, useState } from 'react';
import './Cursos.css';

const Cursos = ({ usuario, onSeleccionarCurso }) => {
  const [cursosPorCodigo, setCursosPorCodigo] = useState([]);

  useEffect(() => {
    const fetchCursos = async () => {
      try {
        const codigos = usuario.cursos || [];

        const agrupados = {};

        for (const codigo of codigos) {
          const resRel = await fetch(
            `http://localhost:3001/cursoUsuarios?codigo=${codigo}&usuarioId=${usuario.id}`
          );
          const relaciones = await resRel.json();
          const perfilCurso = relaciones[0]?.perfil;

          const resCursos = await fetch(
            `http://localhost:3001/cursos?codigo=${codigo}`
          );
          const cursos = await resCursos.json();

          if (cursos.length > 0) {
            agrupados[codigo] = {
              nombre: cursos[0].nombre,
              codigo: codigo,
              perfilCurso,
            };
          }
        }

        const cursosFinales = Object.values(agrupados);
        setCursosPorCodigo(cursosFinales);
      } catch (error) {
        console.error('Error cargando cursos:', error);
      }
    };

    fetchCursos();
  }, [usuario]);

  return (
    <div className="cursos-container">
      <h3>Tus cursos</h3>
      {cursosPorCodigo.length === 0 ? (
        <p>No tienes cursos asignados.</p>
      ) : (
        <ul className="cursos-lista">
          {cursosPorCodigo.map((curso) => (
            <li key={curso.codigo}>
              <button className="curso-button">
                {curso.nombre} ({curso.codigo})
              </button>
              <div style={{ textAlign: 'center', marginTop: '6px' }}>
                {curso.perfilCurso === 'profesor' || curso.perfilCurso === 'coordinador' ? (
                  <button
                    className="acceso-rol-button"
                    onClick={() =>
                      onSeleccionarCurso({
                        codigo: curso.codigo,
                        perfil: 'profesor',
                        sede: usuario.sede,
                      })
                    }
                  >
                    Acceder como profesor
                  </button>
                ) : null}

                {curso.perfilCurso === 'coordinador' && (
                  <button
                    className="acceso-rol-button"
                    style={{ marginLeft: '10px' }}
                    onClick={() =>
                      onSeleccionarCurso({
                        codigo: curso.codigo,
                        perfil: 'coordinador',
                        sede: usuario.sede,
                      })
                    }
                  >
                    Acceder como coordinador
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Cursos;
