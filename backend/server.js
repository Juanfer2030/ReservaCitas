const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.error('Error connecting to MongoDB', err));

const citaSchema = new mongoose.Schema({
  nombre: String,
  fecha: String,
  hora: String,
});

const Cita = mongoose.model('Cita', citaSchema);

app.post('/api/citas', async (req, res) => {
  try {
    const nuevaCita = new Cita(req.body);
    await nuevaCita.save();
    res.status(201).json(nuevaCita);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/api/citas', async (req, res) => {
  try {
    const citas = await Cita.find();
    res.status(200).json(citas);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Eliminar una cita por ID
app.delete('/api/citas/:id', async (req, res) => {
  try {
    await Cita.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Cita eliminada correctamente' });
  } catch (err) {
    res.status(500).json({ message: 'Error al eliminar la cita' });
  }
});

// Actualizar una cita por ID
app.put('/api/citas/:id', async (req, res) => {
  try {
    const { nombre, fecha, hora } = req.body;
    const citaActualizada = await Cita.findByIdAndUpdate(
      req.params.id,
      { nombre, fecha, hora },
      { new: true }
    );
    res.status(200).json(citaActualizada);
  } catch (err) {
    res.status(500).json({ message: 'Error al actualizar la cita' });
  }
});


app.listen(5000, () => {
  console.log('Server running on port 5000');
});
