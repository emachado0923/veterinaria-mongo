const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'API Clínica Veterinaria',
      version: '1.0.0',
      description:
        'API REST para gestionar mascotas y expedientes médicos. Incluye campos fijos y datos flexibles (metadatos variables) aprovechando MongoDB.'
    },
    servers: [{ url: '/api/v1', description: 'API v1' }],
    tags: [{ name: 'Mascotas', description: 'CRUD de mascotas / pacientes y expedientes médicos' }],
    components: {
      schemas: {
        Propietario: {
          type: 'object',
          required: ['nombre'],
          properties: {
            nombre: { type: 'string', example: 'Laura Gómez' },
            telefono: { type: 'string', example: '+57 300 123 4567' },
            email: { type: 'string', example: 'laura@correo.com' },
            direccion: { type: 'string', example: 'Cra 10 # 20-30, Bogotá' }
          }
        },
        Consulta: {
          type: 'object',
          required: ['motivo'],
          properties: {
            _id: { type: 'string' },
            fecha: { type: 'string', format: 'date-time' },
            motivo: { type: 'string', example: 'Vómito y decaimiento' },
            veterinario: { type: 'string', example: 'Dr. Andrés Ruiz' },
            diagnosticos: { type: 'array', items: { type: 'string' }, example: ['gastroenteritis'] },
            tratamiento: { type: 'string', example: 'Dieta blanda y metoclopramida 5 días' },
            metadatos: {
              type: 'object',
              additionalProperties: true,
              description: 'Datos libres de la consulta (signos vitales, resultados de laboratorio, etc.)',
              example: { temperatura: 39.4, laboratorio: { leucocitos: 15000 } }
            }
          }
        },
        Mascota: {
          type: 'object',
          required: ['nombre', 'especie', 'propietario'],
          properties: {
            _id: { type: 'string', example: '66f1c0a5e4b0a1a2b3c4d5e6' },
            nombre: { type: 'string', example: 'Firulais' },
            especie: { type: 'string', example: 'perro' },
            raza: { type: 'string', example: 'Labrador' },
            sexo: { type: 'string', enum: ['macho', 'hembra', 'desconocido'] },
            fechaNacimiento: { type: 'string', format: 'date' },
            pesoKg: { type: 'number', example: 28.5 },
            propietario: { $ref: '#/components/schemas/Propietario' },
            etiquetas: { type: 'array', items: { type: 'string' }, example: ['crónico', 'alérgico'] },
            historialClinico: { type: 'array', items: { $ref: '#/components/schemas/Consulta' } },
            metadatosVariables: {
              type: 'object',
              additionalProperties: true,
              description: 'Atributos dinámicos sin esquema fijo',
              example: { alergias: ['penicilina'], microchip: '985112003456789', dieta: { tipo: 'hipoalergénica' } }
            },
            activo: { type: 'boolean', example: true },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },
        Error: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string', example: 'Mascota no encontrada' },
            errors: { type: 'array', items: { type: 'string' } }
          }
        }
      }
    }
  },
  apis: ['./src/routes/v1/*.js']
};

module.exports = swaggerJsdoc(options);
