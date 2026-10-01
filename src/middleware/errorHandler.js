class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

function notFound(req, res, next) {
  next(new HttpError(404, `Ruta no encontrada: ${req.method} ${req.originalUrl}`));
}

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  let status = err.status || 500;
  let message = err.message || 'Error interno del servidor';
  let errors;

  if (err.name === 'ValidationError') {
    status = 400;
    message = 'Error de validación';
    errors = Object.values(err.errors).map((e) => e.message);
  } else if (err.name === 'CastError') {
    status = 400;
    message = `Valor inválido para '${err.path}': ${err.value}`;
  } else if (err.type === 'entity.parse.failed') {
    status = 400;
    message = 'JSON mal formado';
  }

  if (status >= 500) {
    console.error(err);
    if (process.env.NODE_ENV === 'production') message = 'Error interno del servidor';
  }

  res.status(status).json({ success: false, message, ...(errors && { errors }) });
}

module.exports = { HttpError, notFound, errorHandler };
