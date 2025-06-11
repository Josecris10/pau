import { useState } from 'react';
import './Detalle.css';

const DetallePostulante = ({ postulante, detallesData, horarioData }) => {

  const abrirVentanaDetalle = () => {
    console.log('Datos recibidos en componente Detalle:');
    console.log('Postulante:', postulante);
    console.log('Todos los detalles:', detallesData);
    console.log('Todos los horarios:', horarioData);


    // Buscar en las tablas relacionadas
    const detalles = detallesData.find(d => d.id === postulante.id) || {};
    const horario = horarioData.find(h => h.id === postulante.id) || {};

    // Función para formatear la experiencia
    const formatExperiencia = (exp) => {
      if (!exp || exp.length === 0) return 'Ninguna registrada';
      return exp.join('<br>');
    };

    // Función para formatear el horario
    const formatHorario = (horarioObj) => {
      if (!horarioObj || Object.keys(horarioObj).length === 0) {
        return 'No se ha registrado disponibilidad horaria';
      }
      
      return Object.entries(horarioObj).map(([dia, horas]) => 
        `<div><strong>${dia}:</strong> ${horas.join(', ')}</div>`
      ).join('');
    };

    // Contenido HTML para la nueva ventana
    const contenido = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Detalle de ${postulante.nombre}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 20px;
              line-height: 1.6;
            }
            h2 {
              color: #2c3e50;
              border-bottom: 1px solid #eee;
              padding-bottom: 5px;
            }
            .info-section {
              margin-bottom: 20px;
            }
            .info-item {
              margin-bottom: 8px;
            }
            .info-adicional {
              display: none;
              margin-top: 15px;
              padding: 10px;
              background-color: #f5f5f5;
              border-radius: 5px;
            }
            .toggle-btn {
              background-color: #4285f4;
              color: white;
              border: none;
              padding: 8px 15px;
              border-radius: 4px;
              cursor: pointer;
              margin: 10px 0;
            }
          </style>
        </head>
        <body>
          <h1>Detalle del Postulante</h1>
          
          <div class="info-section">
            <h2>Información Básica</h2>
            <div class="info-item"><strong>Nombre:</strong> ${postulante.nombre}</div>
            <div class="info-item"><strong>Correo:</strong> ${detalles.correo || 'No registrado'}</div>
            <div class="info-item"><strong>Carrera:</strong> ${postulante.carrera}</div>
            <div class="info-item"><strong>Sede:</strong> ${postulante.sede}</div>
          </div>

          <button class="toggle-btn" onclick="document.getElementById('info-avanzada').style.display='block';this.style.display='none'">
            Mostrar información adicional
          </button>

          <div id="info-avanzada" class="info-adicional">
            <h2>Experiencia Docente</h2>
            <div class="info-item">${formatExperiencia(detalles.experiencia)}</div>
            
            <h2>Disponibilidad Horaria</h2>
            <div class="info-item">${formatHorario(horario.horario)}</div>
          </div>

          <script>
            // Puedes añadir más lógica JavaScript aquí si es necesario
          </script>
        </body>
      </html>
    `;

    // Abrir nueva ventana
    const ventana = window.open('', '_blank', 'width=600,height=500');
    ventana.document.write(contenido);
    ventana.document.close();
  };

  return (
    <button 
      className="detalle-button"
      onClick={abrirVentanaDetalle}
    >
      Ver detalle
    </button>
  );
};

export default DetallePostulante;