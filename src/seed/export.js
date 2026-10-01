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
    fs.mkdirSync(DIR, { recursive: true });
    const collections = await mongoose.connection.db.listCollections().toArray();
    for (const { name } of collections) {
      const docs = await mongoose.connection.db.collection(name).find({}).toArray();
      fs.writeFileSync(path.join(DIR, `${name}.json`), EJSON.stringify(docs, null, 2, { relaxed: false }));
      console.log(`Exportada ${name}: ${docs.length} documentos`);
    }
  } catch (err) {
    console.error('Error exportando:', err.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
})();
