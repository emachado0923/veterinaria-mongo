const Mascota = require('../models/Mascota');
const { HttpError } = require('../middleware/errorHandler');

const escapeRegex = (s) => String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// "12" -> 12, "true" -> true; el resto queda como string
function coerce(value) {
  if (value === 'true') return true;
  if (value === 'false') return false;
  if (value !== '' && !Number.isNaN(Number(value))) return Number(value);
  return value;
}

// Convierte ?prefijo[clave]=valor en { 'campo.clave': valor }; ignora operadores ($...)
function dynamicFilters(obj, fieldPrefix) {
  const out = {};
  if (!obj || typeof obj !== 'object') return out;
  for (const [key, value] of Object.entries(obj)) {
    if (key.startsWith('$') || key.includes('.$') || typeof value === 'object') continue;
    out[`${fieldPrefix}.${key}`] = coerce(value);
  }
  return out;
}

function buildFilter(q) {
  const filter = {};
  if (q.especie) filter.especie = String(q.especie).toLowerCase();
  if (q.raza) filter.raza = new RegExp(escapeRegex(q.raza), 'i');
  if (q.propietario) filter['propietario.nombre'] = new RegExp(escapeRegex(q.propietario), 'i');
  if (q.activo !== undefined) filter.activo = q.activo === 'true';
  if (q.etiqueta) filter.etiquetas = { $all: String(q.etiqueta).toLowerCase().split(',') };
  if (q.diagnostico) {
    filter['historialClinico.diagnosticos'] = new RegExp(escapeRegex(q.diagnostico), 'i');
  }
  if (q.q) {
    const rx = new RegExp(escapeRegex(q.q), 'i');
    filter.$or = [{ nombre: rx }, { raza: rx }, { 'propietario.nombre': rx }];
  }
  Object.assign(filter, dynamicFilters(q.meta, 'metadatosVariables'));
  Object.assign(filter, dynamicFilters(q.consultaMeta, 'historialClinico.metadatos'));
  return filter;
}

exports.listar = async (req, res) => {
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 10, 1), 100);
  const filter = buildFilter(req.query);

  const [data, total] = await Promise.all([
    Mascota.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
    Mascota.countDocuments(filter)
  ]);

  res.status(200).json({
    success: true,
    data,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) }
  });
};

exports.obtener = async (req, res) => {
  const mascota = await Mascota.findById(req.params.id);
  if (!mascota) throw new HttpError(404, 'Mascota no encontrada');
  res.status(200).json({ success: true, data: mascota });
};

exports.crear = async (req, res) => {
  const mascota = await Mascota.create(req.body);
  res.status(201).json({ success: true, data: mascota });
};

exports.actualizar = async (req, res) => {
  const mascota = await Mascota.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  if (!mascota) throw new HttpError(404, 'Mascota no encontrada');
  res.status(200).json({ success: true, data: mascota });
};

exports.eliminar = async (req, res) => {
  const mascota = await Mascota.findByIdAndDelete(req.params.id);
  if (!mascota) throw new HttpError(404, 'Mascota no encontrada');
  res.status(200).json({ success: true, message: 'Mascota eliminada', data: mascota });
};

exports.agregarConsulta = async (req, res) => {
  const mascota = await Mascota.findById(req.params.id);
  if (!mascota) throw new HttpError(404, 'Mascota no encontrada');
  mascota.historialClinico.push(req.body);
  await mascota.save();
  res.status(201).json({ success: true, data: mascota });
};

// Estadística con aggregation: diagnósticos más frecuentes por especie
exports.estadisticasDiagnosticos = async (req, res) => {
  const data = await Mascota.aggregate([
    { $unwind: '$historialClinico' },
    { $unwind: '$historialClinico.diagnosticos' },
    {
      $group: {
        _id: { especie: '$especie', diagnostico: '$historialClinico.diagnosticos' },
        casos: { $sum: 1 }
      }
    },
    { $sort: { casos: -1 } },
    { $project: { _id: 0, especie: '$_id.especie', diagnostico: '$_id.diagnostico', casos: 1 } }
  ]);
  res.status(200).json({ success: true, data });
};
