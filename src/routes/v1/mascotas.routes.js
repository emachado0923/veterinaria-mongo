const express = require('express');
const ctrl = require('../../controllers/mascotas.controller');

const router = express.Router();

// Express 4 no captura promesas rechazadas: se envuelve cada handler
const wrap = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

/**
 * @openapi
 * /mascotas:
 *   get:
 *     tags: [Mascotas]
 *     summary: Lista mascotas con filtros y paginación
 *     description: >
 *       También disponible como `/pacientes`. Permite filtrar por campos fijos y por datos no estructurados
 *       con `meta[clave]=valor` (metadatosVariables) y `consultaMeta[clave]=valor` (metadatos de consultas).
 *     parameters:
 *       - { in: query, name: page, schema: { type: integer, default: 1 } }
 *       - { in: query, name: limit, schema: { type: integer, default: 10, maximum: 100 } }
 *       - { in: query, name: q, schema: { type: string }, description: Búsqueda por nombre, raza o propietario }
 *       - { in: query, name: especie, schema: { type: string }, example: perro }
 *       - { in: query, name: raza, schema: { type: string } }
 *       - { in: query, name: propietario, schema: { type: string } }
 *       - { in: query, name: activo, schema: { type: boolean } }
 *       - { in: query, name: etiqueta, schema: { type: string }, description: "Etiquetas separadas por coma (todas deben coincidir)" }
 *       - { in: query, name: diagnostico, schema: { type: string }, description: Texto dentro de diagnósticos de consultas }
 *       - in: query
 *         name: meta
 *         style: deepObject
 *         explode: true
 *         schema: { type: object, additionalProperties: true }
 *         description: "Ej. meta[alergias]=penicilina"
 *       - in: query
 *         name: consultaMeta
 *         style: deepObject
 *         explode: true
 *         schema: { type: object, additionalProperties: true }
 *         description: "Ej. consultaMeta[temperatura]=39.4"
 *     responses:
 *       200:
 *         description: Lista paginada de mascotas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data: { type: array, items: { $ref: '#/components/schemas/Mascota' } }
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page: { type: integer }
 *                     limit: { type: integer }
 *                     total: { type: integer }
 *                     pages: { type: integer }
 *       500:
 *         description: Error interno
 *         content: { application/json: { schema: { $ref: '#/components/schemas/Error' } } }
 *   post:
 *     tags: [Mascotas]
 *     summary: Crea una mascota
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/Mascota' }
 *     responses:
 *       201:
 *         description: Mascota creada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data: { $ref: '#/components/schemas/Mascota' }
 *       400:
 *         description: Datos inválidos
 *         content: { application/json: { schema: { $ref: '#/components/schemas/Error' } } }
 *       500:
 *         description: Error interno
 *         content: { application/json: { schema: { $ref: '#/components/schemas/Error' } } }
 */
router.route('/').get(wrap(ctrl.listar)).post(wrap(ctrl.crear));

/**
 * @openapi
 * /mascotas/estadisticas/diagnosticos:
 *   get:
 *     tags: [Mascotas]
 *     summary: Diagnósticos más frecuentes por especie (aggregation)
 *     responses:
 *       200:
 *         description: Conteo de diagnósticos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       especie: { type: string }
 *                       diagnostico: { type: string }
 *                       casos: { type: integer }
 *       500:
 *         description: Error interno
 *         content: { application/json: { schema: { $ref: '#/components/schemas/Error' } } }
 */
router.get('/estadisticas/diagnosticos', wrap(ctrl.estadisticasDiagnosticos));

/**
 * @openapi
 * /mascotas/{id}:
 *   get:
 *     tags: [Mascotas]
 *     summary: Obtiene una mascota por ID
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: string } }
 *     responses:
 *       200:
 *         description: Mascota encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 data: { $ref: '#/components/schemas/Mascota' }
 *       400:
 *         description: ID inválido
 *         content: { application/json: { schema: { $ref: '#/components/schemas/Error' } } }
 *       404:
 *         description: No encontrada
 *         content: { application/json: { schema: { $ref: '#/components/schemas/Error' } } }
 *   put:
 *     tags: [Mascotas]
 *     summary: Actualiza una mascota
 *     description: Actualización parcial de los campos enviados (incluye metadatosVariables).
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: string } }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/Mascota' }
 *     responses:
 *       200:
 *         description: Mascota actualizada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 data: { $ref: '#/components/schemas/Mascota' }
 *       400:
 *         description: Datos o ID inválidos
 *         content: { application/json: { schema: { $ref: '#/components/schemas/Error' } } }
 *       404:
 *         description: No encontrada
 *         content: { application/json: { schema: { $ref: '#/components/schemas/Error' } } }
 *   delete:
 *     tags: [Mascotas]
 *     summary: Elimina una mascota
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: string } }
 *     responses:
 *       200:
 *         description: Mascota eliminada
 *       400:
 *         description: ID inválido
 *         content: { application/json: { schema: { $ref: '#/components/schemas/Error' } } }
 *       404:
 *         description: No encontrada
 *         content: { application/json: { schema: { $ref: '#/components/schemas/Error' } } }
 */
router
  .route('/:id')
  .get(wrap(ctrl.obtener))
  .put(wrap(ctrl.actualizar))
  .patch(wrap(ctrl.actualizar))
  .delete(wrap(ctrl.eliminar));

/**
 * @openapi
 * /mascotas/{id}/consultas:
 *   post:
 *     tags: [Mascotas]
 *     summary: Agrega una consulta al historial clínico
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: string } }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/Consulta' }
 *     responses:
 *       201:
 *         description: Consulta agregada; devuelve la mascota actualizada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 data: { $ref: '#/components/schemas/Mascota' }
 *       400:
 *         description: Datos o ID inválidos
 *         content: { application/json: { schema: { $ref: '#/components/schemas/Error' } } }
 *       404:
 *         description: Mascota no encontrada
 *         content: { application/json: { schema: { $ref: '#/components/schemas/Error' } } }
 */
router.post('/:id/consultas', wrap(ctrl.agregarConsulta));

module.exports = router;
