require('dotenv').config();
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const { EJSON } = require('bson');
const connectDB = require('../config/db');

const DIR = path.join(__dirname, '..', '..', 'database');

(async () => {
  try {
    await connectDB();
    const files = fs.readdirSync(DIR).filter((f) => f.endsWith('.json'));
    for (const file of files) {
      const name = path.basename(file, '.json');
      const docs = EJSON.parse(fs.readFileSync(path.join(DIR, file), 'utf8'));
      const col = mongoose.connection.db.collection(name);
      await col.deleteMany({});
      if (docs.length) await col.insertMany(docs);
      console.log(`Importada ${name}: ${docs.length} documentos`);
    }
  } catch (err) {
    console.error('Error importando:', err.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
})();
