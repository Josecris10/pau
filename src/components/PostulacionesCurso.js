import React, { useEffect, useState, useMemo } from 'react';
import './PostulacionesCurso.css';


const PostulacionesCurso = ({ curso, usuario, cursoUsuarios }) => {
  const [postulaciones, setPostulaciones] = useState([]);
  const [orden, setOrden] = useState({
    campo: null,
    direccion: 'asc'
  });
  console.log("usuario en postulacionescurso", usuario);
  console.log("curso en postulacionesCurso:", curso);
  console.log("cursousuarios en postulacionescurso:", cursoUsuarios);

  // Función pura para ordenamiento
  const ordenarPostulaciones = (lista, campo, direccion) => {
    if (!campo) return lista;
    
    return [...lista].sort((a, b) => {
      let comparacion;
      
      if (campo === 'nombre') {
        comparacion = a.nombre.localeCompare(b.nombre);
      } 
      else if (campo === 'preferencia') {
        comparacion = parseInt(a.preferencia) - parseInt(b.preferencia);
      }
	  else if (campo === 'nota') {
        comparacion = parseInt(a.nota) - parseInt(b.nota);
      }
      else {
        return 0;
      }
      
      return direccion === 'asc' ? comparacion : -comparacion;
    });
  };

  const handleSort = (campo) => {
    setOrden(prev => {
      const nuevaDireccion = prev.campo === campo && prev.direccion === 'asc' ? 'desc' : 'asc';
      return { campo, direccion: nuevaDireccion };
    });
  };

  // Postulaciones ordenadas usando useMemo para optimización
  const postulacionesOrdenadas = useMemo(() => {
    return ordenarPostulaciones(postulaciones, orden.campo, orden.direccion);
  }, [postulaciones, orden]);
  
  const obtenerIconoOrden = (campo) => {
    if (orden.campo !== campo) return null;
    return orden.direccion === 'asc' ? '↑' : '↓';
  };
  
  const relacion = cursoUsuarios.find(
    cu => cu.codigo === curso.codigo && cu.usuarioId === usuario.id
  );
  const esCoordinador = relacion?.rol === 'coordinador';
  const sedeUsuario = relacion?.sede;


  useEffect(() => {
    if (!curso) return;
    
    const fetchData = async () => {
      try {
        const res = await fetch("http://localhost:3001/postulaciones");
        const data = await res.json();
        let postulacionesCurso = data.filter(p => p.curso === curso.codigo);

        if (!esCoordinador && sedeUsuario){
          postulacionesCurso = postulacionesCurso.filter(p => p.sede === sedeUsuario);
        }
        setPostulaciones(postulacionesCurso);
      } catch (error) {
        console.error("Error al cargar postulaciones:", error);
      }
    };
    


    fetchData();
  }, [curso, esCoordinador, sedeUsuario]);

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
              <th onClick={() => handleSort('nombre')}>Nombre {obtenerIconoOrden('nombre')}</th>
              <th onClick={() => handleSort('preferencia')}>Pref. {obtenerIconoOrden('preferencia')}</th>
              <th onClick={() => handleSort('nota')}>Nota de presentacion {obtenerIconoOrden('nota')}</th>
              <th>Carrera</th>
              <th>Fecha</th>
              <th>Sede</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {postulacionesOrdenadas.map(p => (
              <tr key={p.id}>
                <td>{p.nombre}</td>
                <td>{p.preferencia}</td>
                <td>{p.nota}</td>
                <td>{p.carrera}</td>
                <td>{p.fechaPostulacion}</td>
                <td>{p.sede}</td>
                <td className={
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