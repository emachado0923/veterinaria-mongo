const express = require('express');
const cors = require('cors');
const v1Routes = require('./routes/v1');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) =>
  res.status(200).json({ success: true, message: 'API Clínica Veterinaria', docs: '/api/v1/docs' })
);
app.use('/api/v1', v1Routes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
