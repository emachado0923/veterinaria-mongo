require('dotenv').config();
const connectDB = require('./config/db');
const app = require('./app');
const Mascota = require('./models/Mascota');
const { mascotas } = require('./seed/data');

const PORT = process.env.PORT || 3000;

async function start() {
  try {
    await connectDB();

    if (process.env.NODE_ENV === 'development' && process.env.AUTO_SEED === 'true') {
      if ((await Mascota.countDocuments()) === 0) {
        await Mascota.insertMany(mascotas);
        console.log(`Seed automático: ${mascotas.length} mascotas insertadas`);
      }
    }

    app.listen(PORT, () => {
      console.log(`Servidor en http://localhost:${PORT}`);
      console.log(`Swagger en http://localhost:${PORT}/api/v1/docs`);
    });
  } catch (err) {
    console.error('No se pudo iniciar la aplicación:', err.message);
    process.exit(1);
  }
}

start();
