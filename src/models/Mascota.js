const mongoose = require('mongoose');

const { Schema } = mongoose;

const propietarioSchema = new Schema(
  {
    nombre: { type: String, required: [true, 'El nombre del propietario es obligatorio'], trim: true },
    telefono: { type: String, trim: true },
    email: { type: String, trim: true, lowercase: true },
    direccion: { type: String, trim: true }
  },
  { _id: false }
);

// Cada consulta combina campos básicos con un objeto `metadatos` libre.
const consultaSchema = new Schema({
  fecha: { type: Date, default: Date.now },
  motivo: { type: String, required: [true, 'El motivo de la consulta es obligatorio'], trim: true },
  veterinario: { type: String, trim: true },
  diagnosticos: [{ type: String, trim: true, lowercase: true }],
  tratamiento: { type: String, trim: true },
  metadatos: { type: Schema.Types.Mixed, default: {} }
});

const mascotaSchema = new Schema(
  {
    nombre: { type: String, required: [true, 'El nombre es obligatorio'], trim: true },
    especie: { type: String, required: [true, 'La especie es obligatoria'], trim: true, lowercase: true },
    raza: { type: String, trim: true },
    sexo: { type: String, enum: ['macho', 'hembra', 'desconocido'], default: 'desconocido' },
    fechaNacimiento: Date,
    pesoKg: { type: Number, min: [0, 'El peso no puede ser negativo'] },
    propietario: { type: propietarioSchema, required: [true, 'El propietario es obligatorio'] },
    etiquetas: [{ type: String, trim: true, lowercase: true }],
    historialClinico: [consultaSchema],
    // Atributos dinámicos sin esquema (alergias, microchip, vacunas, dieta, etc.)
    metadatosVariables: { type: Schema.Types.Mixed, default: {} },
    activo: { type: Boolean, default: true }
  },
  { timestamps: true, minimize: false }
);

mascotaSchema.index({ especie: 1, raza: 1 });
mascotaSchema.index({ 'propietario.nombre': 1 });
mascotaSchema.index({ 'historialClinico.diagnosticos': 1 });
mascotaSchema.index({ etiquetas: 1 });

module.exports = mongoose.model('Mascota', mascotaSchema);
