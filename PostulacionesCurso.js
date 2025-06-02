import React, { useEffect, useState, useMemo } from 'react';
import './PostulacionesCurso.css';

const PostulacionesCurso = ({ curso, usuario, cursoUsuarios }) => {
  const [postulaciones, setPostulaciones] = useState([]);
  const [seleccionados, setSeleccionados] = useState({});
  const [orden, setOrden] = useState({
    campo: null,
    direccion: 'asc'
  });

  // Función para ordenar postulaciones
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

  // Función para manejar el ordenamiento
  const handleSort = (campo) => {
    setOrden(prev => {
      const nuevaDireccion = prev.campo === campo && prev.direccion === 'asc' ? 'desc' : 'asc';
      return { campo, direccion: nuevaDireccion };
    });
  };

  // Función para obtener icono de orden
  const obtenerIconoOrden = (campo) => {
    if (orden.campo !== campo) return null;
    return orden.direccion === 'asc' ? '↑' : '↓';
  };

  // Postulaciones ordenadas
  const postulacionesOrdenadas = useMemo(() => {
    return ordenarPostulaciones(postulaciones, orden.campo, orden.direccion);
  }, [postulaciones, orden]);

  // Manejar selección/deselección de postulaciones
  const handleSeleccion = (id) => {
    setSeleccionados(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Actualizar estados de las postulaciones seleccionadas
  const actualizarEstados = async () => {
    const idsParaActualizar = Object.keys(seleccionados).filter(id => seleccionados[id]);
    
    if (idsParaActualizar.length === 0) {
      alert('Por favor selecciona al menos una postulación');
      return;
    }

    try {
      await Promise.all(idsParaActualizar.map(async (id) => {
        const postulacion = postulaciones.find(p => p.id === id);
        const nuevoEstado = postulacion.estado === 'Aceptado' ? 'Rechazado' : 'Aceptado';
        
        const response = await fetch(`http://localhost:3001/postulaciones/${id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ estado: nuevoEstado }),
        });

        if (!response.ok) throw new Error(`Error al actualizar postulación ${id}`);
      }));

      setPostulaciones(prevPostulaciones =>
        prevPostulaciones.map(p =>
          seleccionados[p.id] 
            ? { ...p, estado: p.estado === 'Aceptado' ? 'Rechazado' : 'Aceptado' } 
            : p
        )
      );
      
      setSeleccionados({});
      alert('Estados actualizados correctamente');
    } catch (error) {
      console.error('Error al actualizar estados:', error);
      alert('Ocurrió un error al actualizar los estados');
    }
  };

  // Obtener datos iniciales
  useEffect(() => {
    if (!curso) return;
    
    const fetchData = async () => {
      try {
        const res = await fetch("http://localhost:3001/postulaciones");
        const data = await res.json();
        let postulacionesCurso = data.filter(p => p.curso === curso.codigo);

        const relacion = cursoUsuarios.find(
          cu => cu.codigo === curso.codigo && cu.usuarioId === usuario.id
        );
        const esCoordinador = relacion?.rol === 'coordinador';
        const sedeUsuario = relacion?.sede;

        if (!esCoordinador && sedeUsuario) {
          postulacionesCurso = postulacionesCurso.filter(p => p.sede === sedeUsuario);
        }
        
        setPostulaciones(postulacionesCurso);
      } catch (error) {
        console.error("Error al cargar postulaciones:", error);
      }
    };

    fetchData();
  }, [curso, usuario.id, cursoUsuarios]);

  if (!curso) {
    return <p>Cargando curso...</p>;
  }

  return (
    <div className="postulaciones-container">
      <h3>Postulaciones para {curso.nombre} ({curso.codigo}) - Paralelo {curso.paralelo}</h3>
      {postulaciones.length === 0 ? (
        <p>No hay postulaciones para este curso.</p>
      ) : (
        <>
          <table className="postulaciones-table">
            <thead>
              <tr>
                <th>Selección</th>
                <th onClick={() => handleSort('nombre')}>Nombre {obtenerIconoOrden('nombre')}</th>
                <th onClick={() => handleSort('preferencia')}>Pref. {obtenerIconoOrden('preferencia')}</th>
                <th onClick={() => handleSort('nota')}>Nota de presentación {obtenerIconoOrden('nota')}</th>
                <th>Carrera</th>
                <th>Fecha</th>
                <th>Sede</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {postulacionesOrdenadas.map(p => (
                <tr key={p.id}>
                  <td>
                    <input 
                      type="checkbox" 
                      checked={!!seleccionados[p.id]} 
                      onChange={() => handleSeleccion(p.id)}
                    />
                  </td>
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
                  }>
                    {p.estado}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          <div className="acciones-container">
            <button 
              onClick={actualizarEstados}
              className="boton-confirmar"
              disabled={!Object.values(seleccionados).some(sel => sel)}
            >
              Confirmar Cambios de Estado
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default PostulacionesCurso;