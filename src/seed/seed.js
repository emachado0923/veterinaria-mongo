require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Mascota = require('../models/Mascota');
const { mascotas } = require('./data');

(async () => {
  try {
    await connectDB();
    await Mascota.deleteMany({});
    const docs = await Mascota.insertMany(mascotas);
    console.log(`Seed completado: ${docs.length} mascotas insertadas`);
  } catch (err) {
    console.error('Error en el seed:', err.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
})();
