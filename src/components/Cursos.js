import React, { useEffect, useState } from 'react';
import './Cursos.css';

const Cursos = ({ usuario, onSeleccionarCurso, rolDocente }) => {
  const [cursos, setCursos] = useState([]);
  const [orden, setOrden] = useState({
    campo: 'codigo',
    direccion: 'asc'
  });

  useEffect(() => {
    const fetchCursos = async () => {
      try {
        if (rolDocente === 'coordinador') {
          const response = await fetch(
            `http://localhost:3001/cursos?coordinador=${usuario.nombre}`
          );
          const data = await response.json();
          setCursos(data);
        } 
        else if (rolDocente === 'profesor') {
          const response = await fetch(
            `http://localhost:3001/cursos?profesorId=${usuario.id}`
          );
          const data = await response.json();
          setCursos(data.filter(curso => 
            !curso.sede || curso.sede === usuario.sede
          ));
        }
      } catch (error) {
        console.error('Error cargando cursos:', error);
      }
    };

    fetchCursos();
  }, [usuario, rolDocente]);

  const handleOrdenar = (campo) => {
    setOrden(prev => ({
      campo,
      direccion: prev.campo === campo && prev.direccion === 'asc' ? 'desc' : 'asc'
    }));
  };

  const cursosOrdenados = [...cursos].sort((a, b) => {
    // Para ordenamiento numérico (paralelo)
    if (orden.campo === 'paralelo') {
      return orden.direccion === 'asc' 
        ? a.paralelo - b.paralelo 
        : b.paralelo - a.paralelo;
    }
    
    // Para ordenamiento alfabético (otros campos)
    const valorA = String(a[orden.campo] || '').toLowerCase();
    const valorB = String(b[orden.campo] || '').toLowerCase();
    
    if (valorA < valorB) return orden.direccion === 'asc' ? -1 : 1;
    if (valorA > valorB) return orden.direccion === 'asc' ? 1 : -1;
    return 0;
  });

  const renderIconoOrden = (campo) => {
    if (orden.campo !== campo) return null;
    return orden.direccion === 'asc' ? '↑' : '↓';
  };

  return (
    <div className="cursos-container">
      <h3 className="titulo-principal">Tus cursos</h3>
      {cursos.length === 0 ? (
        <p>No tienes cursos asignados.</p>
      ) : (
        <table className="cursos-tabla">
          <thead>
            <tr>
              <th onClick={() => handleOrdenar('codigo')}>
                Código {renderIconoOrden('codigo')}
              </th>
              <th onClick={() => handleOrdenar('nombre')}>
                Nombre {renderIconoOrden('nombre')}
              </th>
              <th onClick={() => handleOrdenar('paralelo')}>
                Paralelo {renderIconoOrden('paralelo')}
              </th>
              <th onClick={() => handleOrdenar('sede')}>
                Sede {renderIconoOrden('sede')}
              </th>
              <th onClick={() => handleOrdenar('coordinador')}>
                Coordinador {renderIconoOrden('coordinador')}
              </th>
              <th>Acceso</th>
            </tr>
          </thead>
          <tbody>
            {cursosOrdenados.map(curso => (
              <tr key={`${curso.codigo}-${curso.paralelo}`}>
                <td>{curso.codigo}</td>
                <td>{curso.nombre}</td>
                <td>{curso.paralelo}</td>
                <td>{curso.sede || 'No especificada'}</td>
                <td>{curso.coordinador}</td>
                <td>
                  <button
                    className="acceso-rol-button"
                    onClick={() => onSeleccionarCurso({
                      cursoId: curso.id,
                      codigo: curso.codigo,
                      paralelo: curso.paralelo,
                      perfil: rolDocente === 'coordinador' ? 'coordinador' : 'profesor'
                    })}
                  >
                    Acceder
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Cursos;