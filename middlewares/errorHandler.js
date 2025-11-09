// /middlewares/errorHandler.js
// Middleware global de tratamento de erros

const logger = require('../utils/logger');

// Middleware para tratar erros não capturados
const errorHandler = (err, req, res, next) => {
  // Log do erro
  logger.error(`Error: ${err.message}`, {
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userId: req.userId || 'anonymous',
    body: req.body,
  });

  // Determinar status code
  const statusCode = err.statusCode || err.status || 500;

  // Preparar resposta
  const response = {
    error: err.message || 'Erro interno do servidor',
    status: statusCode,
  };

  // Em desenvolvimento, incluir stack trace
  if (process.env.NODE_ENV === 'development') {
    response.stack = err.stack;
    response.details = err.details || null;
  }

  // Enviar resposta
  res.status(statusCode).json(response);
};

// Middleware para tratar rotas não encontradas (404)
const notFoundHandler = (req, res, next) => {
  const error = new Error(`Rota não encontrada: ${req.method} ${req.url}`);
  error.statusCode = 404;

  logger.warn(`404 - Rota não encontrada: ${req.method} ${req.url}`, {
    ip: req.ip,
    userId: req.userId || 'anonymous',
  });

  next(error);
};

// Middleware para logar requisições HTTP
const httpLogger = (req, res, next) => {
  const start = Date.now();

  // Capturar quando a resposta for enviada
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.logRequest(req, res, duration);
  });

  next();
};

// Middleware para validar se é JSON válido
const validateJSON = (err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    logger.warn('JSON inválido recebido', {
      url: req.url,
      method: req.method,
      ip: req.ip,
    });

    return res.status(400).json({
      error: 'JSON inválido no corpo da requisição',
    });
  }

  next(err);
};

module.exports = {
  errorHandler,
  notFoundHandler,
  httpLogger,
  validateJSON,
};
