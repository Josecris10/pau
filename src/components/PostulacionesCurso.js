import React, { useEffect, useState, useMemo } from 'react';
import './PostulacionesCurso.css';
import Detalle from './Detalle.js';

const PostulacionesCurso = ({ curso, usuario, cursoUsuarios }) => {
  const [postulaciones, setPostulaciones] = useState([]);
  const [seleccionAceptar, setSeleccionAceptar] = useState({});
  const [seleccionRechazar, setSeleccionRechazar] = useState({});

  const [detalles, setDetalles] = useState([]);
  const [horario, setHorario] = useState([]);

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
        comparacion = parseInt(b.nota) - parseInt(a.nota);
      }
      else {
        return 0;
      }
      
      return direccion === 'asc' ? comparacion : -comparacion;
    });
  };

  // Manejar ordenamiento
  const handleSort = (campo) => {
    setOrden(prev => {
      const nuevaDireccion = prev.campo === campo && prev.direccion === 'asc' ? 'desc' : 'asc';
      return { campo, direccion: nuevaDireccion };
    });
  };

  // Obtener icono de orden
  const obtenerIconoOrden = (campo) => {
    if (orden.campo !== campo) return null;
    return orden.direccion === 'asc' ? '↑' : '↓';
  };

  const relacion = cursoUsuarios.find(
    cu => cu.codigo === curso.codigo && cu.usuarioId === usuario.id
  );
  const esCoordinador = relacion?.rol === 'coordinador';
  const sedeUsuario = relacion?.sede;

  // Postulaciones ordenadas
  const postulacionesOrdenadas = useMemo(() => {
    return ordenarPostulaciones(postulaciones, orden.campo, orden.direccion);
  }, [postulaciones, orden]);

  // Manejar selección para aceptar
  const handleSeleccionAceptar = (id, e) => {
    const isChecked = e.target.checked;
    setSeleccionAceptar(prev => ({ ...prev, [id]: isChecked }));
    // Deseleccionar automáticamente "Rechazar" si se marca "Aceptar"
    if (isChecked) {
      setSeleccionRechazar(prev => ({ ...prev, [id]: false }));
    }
  };

  // Manejar selección para rechazar
  const handleSeleccionRechazar = (id, e) => {
    const isChecked = e.target.checked;
    setSeleccionRechazar(prev => ({ ...prev, [id]: isChecked }));
    // Deseleccionar automáticamente "Aceptar" si se marca "Rechazar"
    if (isChecked) {
      setSeleccionAceptar(prev => ({ ...prev, [id]: false }));
    }
  };

  // Actualizar estados de las postulaciones seleccionadas
  const actualizarEstados = async () => {
    const idsAceptar = Object.keys(seleccionAceptar).filter(id => seleccionAceptar[id]);
    const idsRechazar = Object.keys(seleccionRechazar).filter(id => seleccionRechazar[id]);
    
    if (idsAceptar.length === 0 && idsRechazar.length === 0) {
      alert('Por favor selecciona al menos una postulación');
      return;
    }

    try {
      // Actualizar postulaciones aceptadas
      await Promise.all(idsAceptar.map(async (id) => {
        const response = await fetch(`http://localhost:3001/postulaciones/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ estado: 'Aceptado' }),
        });
        if (!response.ok) throw new Error(`Error al aceptar postulación ${id}`);
      }));

      // Actualizar postulaciones rechazadas
      await Promise.all(idsRechazar.map(async (id) => {
        const response = await fetch(`http://localhost:3001/postulaciones/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ estado: 'Rechazado' }),
        });
        if (!response.ok) throw new Error(`Error al rechazar postulación ${id}`);
      }));

      // Actualizar estado local
      setPostulaciones(prev => prev.map(p => {
        if (seleccionAceptar[p.id]) return { ...p, estado: 'Aceptado' };
        if (seleccionRechazar[p.id]) return { ...p, estado: 'Rechazado' };
        return p;
      }));

      // Limpiar selecciones
      setSeleccionAceptar({});
      setSeleccionRechazar({});
      alert('Estados actualizados correctamente');
    } catch (error) {
      console.error('Error al actualizar estados:', error);
      alert('Ocurrió un error al actualizar los estados');
    }
  };

  // Obtener datos iniciales
  useEffect(() => {
    if (!curso) return;
    
    const fetchAllData = async () => {
    try {
        const postRes = await fetch("http://localhost:3001/postulaciones");
	      if (!postRes.ok) throw new Error(`Error postulaciones: ${postRes.status}`);
	      const post = await postRes.json();

	      const detallesRes = await fetch("http://localhost:3001/detalles");
	      if (!detallesRes.ok) throw new Error(`Error detalles: ${detallesRes.status}`);
	      const detalles = await detallesRes.json();

	      const horarioRes = await fetch("http://localhost:3001/horario");
	      if (!horarioRes.ok) throw new Error(`Error horario: ${horarioRes.status}`);
	      const horario = await horarioRes.json();

		let postulacionesFiltradas = post.filter(p => p.curso === curso.codigo);
		    if (!esCoordinador && sedeUsuario) {
		      postulacionesFiltradas = postulacionesFiltradas.filter(p => p.sede === sedeUsuario);
		    }

		    console.log('Postulaciones filtradas:', postulacionesFiltradas);
		    
		    // Establecer estados
		    setPostulaciones(postulacionesFiltradas);
		    setDetalles(detalles);
		    setHorario(horario);

		} 
		catch (err) {
			console.error("Error al cargar datos:", err);
		}
	};

    fetchAllData();
  	}, [curso, esCoordinador, sedeUsuario]);

  // Inicializar selecciones basadas en el estado actual
  useEffect(() => {
    const inicialAceptar = {};
    const inicialRechazar = {};
    
    postulaciones.forEach(p => {
      if (p.estado === 'Aceptado') inicialAceptar[p.id] = true;
      if (p.estado === 'Rechazado') inicialRechazar[p.id] = true;
    });

    setSeleccionAceptar(inicialAceptar);
    setSeleccionRechazar(inicialRechazar);
  }, [postulaciones]);

  if (!curso) {
    return <p>Cargando curso...</p>;
  }

  return (
    <div className="postulaciones-container">
      <h3>Postulaciones para {curso.nombre} {curso.codigo} - Paralelo {curso.paralelo}</h3>
      {postulaciones.length === 0 ? (
        <p>No hay postulaciones para este curso.</p>
      ) : (
        <>
          <table className="postulaciones-table">
            <thead>
              <tr>
                <th className="clickeable" onClick={() => handleSort('nombre')}>Nombre {obtenerIconoOrden('nombre')}</th>
                <th className="clickeable" onClick={() => handleSort('preferencia')}>Pref. {obtenerIconoOrden('preferencia')}</th>
                <th className="clickeable" onClick={() => handleSort('nota')}>Nota {obtenerIconoOrden('nota')}</th>
                <th className="no-clickeable">Estado</th>
                <th className="no-clickeable">Mas Información</th>
                <th className="no-clickeable">Aceptar</th>
                <th className="noclickeable">Rechazar</th>
              </tr>
            </thead>
            <tbody>
              {postulacionesOrdenadas.map(p => (
                <tr key={p.id}>
                  <td>{p.nombre}</td>
                  <td>{p.preferencia}</td>
                  <td>{p.nota}</td>
                  <td className={
                    p.estado === 'Aceptado' ? 'estado-aceptado' :
                    p.estado === 'Pendiente' ? 'estado-pendiente' :
                    'estado-rechazado'
                  }>
                    {p.estado}
                  </td>
                  <td>
                    <Detalle
                        postulante={p}
                        detallesData={detalles}
                        horarioData={horario}
                    />
                  </td>
                  <td>
                    <input
                      type="radio"
                      checked={!!seleccionAceptar[p.id]}
                      onChange={(e) => handleSeleccionAceptar(p.id, e)}
                      className="radio-aceptar"
                    />
                  </td>
                  <td>
                    <input
                      type="radio"
                      checked={!!seleccionRechazar[p.id]}
                      onChange={(e) => handleSeleccionRechazar(p.id, e)}
                      className="radio-rechazar"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          <div className="acciones-container">
            <button
              onClick={actualizarEstados}
              className="boton-confirmar"
              disabled={
                !Object.values(seleccionAceptar).some(sel => sel) &&
                !Object.values(seleccionRechazar).some(sel => sel)
              }
            >
              Confirmar Cambios
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default PostulacionesCurso;