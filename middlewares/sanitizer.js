// /middlewares/sanitizer.js
// Middleware para sanitização de inputs contra XSS

const xss = require('xss');

/**
 * Sanitiza recursivamente um objeto, removendo scripts maliciosos
 * @param {*} data - Dados a serem sanitizados
 * @returns {*} Dados sanitizados
 */
const sanitizeData = (data) => {
  if (typeof data === 'string') {
    return xss(data);
  }

  if (Array.isArray(data)) {
    return data.map(sanitizeData);
  }

  if (typeof data === 'object' && data !== null) {
    const sanitized = {};
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        sanitized[key] = sanitizeData(data[key]);
      }
    }
    return sanitized;
  }

  return data;
};

/**
 * Middleware Express para sanitizar req.body, req.query e req.params
 */
const sanitizeInput = (req, res, next) => {
  if (req.body) {
    req.body = sanitizeData(req.body);
  }

  if (req.query) {
    req.query = sanitizeData(req.query);
  }

  if (req.params) {
    req.params = sanitizeData(req.params);
  }

  next();
};

module.exports = {
  sanitizeInput,
  sanitizeData
};
