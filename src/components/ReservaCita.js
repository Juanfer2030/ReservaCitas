import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../ReservaCita.css';

const ReservaCita = () => {
  const [nombre, setNombre] = useState('');
  const [fecha, setFecha] = useState('');
  const [hora, setHora] = useState('');
  const [citas, setCitas] = useState([]);
  const [editando, setEditando] = useState(false);
  const [citaId, setCitaId] = useState(null);

  useEffect(() => {
    fetchCitas();
  }, []);

  const fetchCitas = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/citas');
      setCitas(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editando) {
        await axios.put(`http://localhost:5000/api/citas/${citaId}`, { nombre, fecha, hora });
        setEditando(false);
        setCitaId(null);
      } else {
        await axios.post('http://localhost:5000/api/citas', { nombre, fecha, hora });
      }
      fetchCitas();
      setNombre('');
      setFecha('');
      setHora('');
    } catch (err) {
      console.error(err);
    }
  };

  // Función para eliminar una cita
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/citas/${id}`);
      fetchCitas(); // Actualizar la lista de citas después de eliminar
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (cita) => {
    setEditando(true);
    setCitaId(cita._id);
    setNombre(cita.nombre);
    setFecha(cita.fecha);
    setHora(cita.hora);
  };

  return (
    <div className="container">
      <h1>Reserva de Citas Médicas</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nombre del paciente</label>
          <input 
            type="text" 
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Fecha</label>
          <input 
            type="date" 
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Hora</label>
          <input 
            type="time" 
            value={hora}
            onChange={(e) => setHora(e.target.value)}
            required
          />
        </div>
        <button type="submit">{editando ? 'Guardar Cambios' : 'Reservar Cita'}</button>
      </form>

      <h2>Citas Reservadas</h2>
      <ul>
        {citas.map((cita) => (
          <li key={cita._id}>
            <div>
              <strong>{cita.nombre}</strong> - {cita.fecha} a las {cita.hora}
            </div>
            <div>
              <button onClick={() => handleEdit(cita)}>Editar</button>
              <button onClick={() => handleDelete(cita._id)}>Eliminar</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ReservaCita;
