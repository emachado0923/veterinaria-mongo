const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('../../config/swagger');
const mascotasRoutes = require('./mascotas.routes');

const router = express.Router();

router.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, { customSiteTitle: 'API Veterinaria' }));
router.get('/docs.json', (req, res) => res.json(swaggerSpec));

router.get('/health', (req, res) => res.status(200).json({ success: true, status: 'ok' }));

router.use('/mascotas', mascotasRoutes);
router.use('/pacientes', mascotasRoutes); // alias

module.exports = router;
