import React, { useEffect, useState } from 'react';
import './PostulacionesCurso.css';

const PostulacionesCurso = ({ curso }) => {
  const [postulaciones, setPostulaciones] = useState([]);

  useEffect(() => {
    if (!curso) return;

    const fetchData = async () => {
      try {
        const res = await fetch("http://localhost:3001/postulaciones");
        const data = await res.json();

        const postulacionesCurso = data.filter(p => p.curso === curso.codigo);
        setPostulaciones(postulacionesCurso);
      } catch (error) {
        console.error("Error al cargar postulaciones:", error);
      }
    };

    fetchData();
  }, [curso]);

  if (!curso) {
    return <p>Cargando curso...</p>;
  }

  return (
    <div className="postulaciones-container">
      <h3>Postulaciones para {curso.nombre} ({curso.codigo}) - Paralelo {curso.paralelo}</h3>
      {postulaciones.length === 0 ? (
        <p>No hay postulaciones para este curso.</p>
      ) : (
        <table className="postulaciones-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Pref.</th>
              <th>Nota de presentacion</th>
              <th>Carrera</th>
              <th>Fecha</th>
              <th>Sede</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {postulaciones.sort((a, b) => parseInt(a.preferencia) - parseInt(b.preferencia))
            .map(p => (
              <tr key={p.id}>
                <td>{p.nombre}</td>
                <td>{p.preferencia}</td>
                <td>{p.nota}</td>
                <td>{p.carrera}</td>
                <td>{p.fechaPostulacion}</td>
                <td>{p.sede}</td>

                <td className ={
                  p.estado === 'Aceptado' ? 'estado-aceptado' :
                  p.estado === 'Pendiente' ? 'estado-pendiente' :
                  p.estado === 'Rechazado' ? 'estado-rechazado' : ''
                }>{p.estado}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PostulacionesCurso;
