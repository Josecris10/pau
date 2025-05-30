import React from 'react';
import './Postulantes.css';

const Postulantes = () => {
    const postulaciones = [
        { id: 1, ramo: "INF134", nombre: "Jaime Gonzalez", estado: "Pendiente", fecha: "2025-02-10" },
        { id: 2, ramo: "INF155", nombre: "Antonia Beltrán", estado: "Aceptado", fecha: "2025-03-01"},
        { id: 3, ramo: "INF 221", nombre: "Benjamín Espinoza", estado: "Rechazado", fecha: "2025-03-17"},
    ];
    
    return (
        <div className="postulantes-container">
            <h2>Postulantes</h2>
            <table className="postulantes-table">
                <thead>
                    <tr>
                        <th>Ramo</th>
                        <th>Nombre</th>
                        <th>Estado</th>
                        <th>Fecha Postulación</th>
                    </tr>
                </thead>
                <tbody>
                    {postulaciones.map(p=> (
                        <tr key={p.id}>
                            <td>{p.ramo}</td>
                            <td>{p.nombre}</td>
                            <td><span className={`estado ${p.estado}`}>{p.estado}</span></td>
                            <td>{p.fecha}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Postulantes;