// /utils/helpers.js
// Funções auxiliares reutilizáveis

const { User } = require('../models');

/**
 * Busca um usuário pela matrícula
 * @param {string} matricula - Matrícula do usuário
 * @returns {Promise<User>} Usuário encontrado
 * @throws {Error} Se usuário não for encontrado
 */
const findUserByMatricula = async (matricula) => {
  const user = await User.findOne({ where: { matricula } });

  if (!user) {
    const error = new Error('Usuário não encontrado');
    error.statusCode = 404;
    throw error;
  }

  return user;
};

/**
 * Converte filtros de query (string ou array) para array
 * @param {string|string[]} val - Valor do filtro
 * @returns {string[]|null} Array de valores ou null
 */
const parseArrayFilter = (val) => {
  if (!val) return null;
  return Array.isArray(val) ? val : [val];
};

/**
 * Valida se uma senha atende aos requisitos mínimos
 * @param {string} senha - Senha a ser validada
 * @returns {boolean} True se válida
 */
const isValidPassword = (senha) => {
  // Mínimo 8 caracteres, pelo menos uma maiúscula, uma minúscula e um número
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  return regex.test(senha);
};

/**
 * Sanitiza uma string removendo caracteres perigosos
 * @param {string} str - String a ser sanitizada
 * @returns {string} String sanitizada
 */
const sanitizeString = (str) => {
  if (typeof str !== 'string') return str;

  // Remove tags HTML
  return str.replace(/<[^>]*>/g, '').trim();
};

/**
 * Formata data do formato brasileiro para ISO
 * @param {string} dateStr - Data no formato DD/MM/YYYY
 * @returns {string|null} Data no formato YYYY-MM-DD ou null se inválida
 */
const parseBrazilianDate = (dateStr) => {
  if (!dateStr) return null;

  const parts = dateStr.split('/');
  if (parts.length !== 3) return null;

  const [day, month, year] = parts;

  // Validação básica
  if (day.length !== 2 || month.length !== 2 || year.length !== 4) {
    return null;
  }

  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
};

/**
 * Gera uma senha aleatória segura
 * @param {number} length - Comprimento da senha (padrão: 12)
 * @returns {string} Senha gerada
 */
const generateSecurePassword = (length = 12) => {
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';
  const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';

  const allChars = lowercase + uppercase + numbers + symbols;

  let password = '';

  // Garantir pelo menos um de cada tipo
  password += lowercase[Math.floor(Math.random() * lowercase.length)];
  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += symbols[Math.floor(Math.random() * symbols.length)];

  // Preencher o resto
  for (let i = password.length; i < length; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }

  // Embaralhar
  return password.split('').sort(() => Math.random() - 0.5).join('');
};

/**
 * Cria um objeto de resposta padronizado para sucesso
 * @param {*} data - Dados a serem retornados
 * @param {string} message - Mensagem opcional
 * @returns {Object} Resposta padronizada
 */
const successResponse = (data, message = null) => {
  const response = {
    success: true,
    data,
  };

  if (message) {
    response.message = message;
  }

  return response;
};

/**
 * Cria um objeto de resposta padronizado para erro
 * @param {string} error - Mensagem de erro
 * @param {number} statusCode - Código de status HTTP
 * @param {*} details - Detalhes adicionais (apenas em desenvolvimento)
 * @returns {Object} Resposta de erro padronizada
 */
const errorResponse = (error, statusCode = 500, details = null) => {
  const response = {
    success: false,
    error,
    statusCode,
  };

  if (process.env.NODE_ENV === 'development' && details) {
    response.details = details;
  }

  return response;
};

/**
 * Wrapper para async/await em rotas Express
 * Captura erros e passa para o middleware de erro
 * @param {Function} fn - Função assíncrona do controller
 * @returns {Function} Middleware Express
 */
const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/**
 * Valida se um IP está em uma lista de IPs permitidos
 * @param {string} ip - IP a ser validado
 * @param {string[]} allowedIPs - Lista de IPs permitidos
 * @returns {boolean} True se permitido
 */
const isAllowedIP = (ip, allowedIPs = []) => {
  if (!allowedIPs || allowedIPs.length === 0) return true;
  return allowedIPs.includes(ip);
};

/**
 * Extrai o IP real da requisição (considerando proxies)
 * @param {Object} req - Objeto de requisição Express
 * @returns {string} IP do cliente
 */
const getRealIP = (req) => {
  return req.headers['x-forwarded-for']?.split(',')[0].trim() ||
         req.headers['x-real-ip'] ||
         req.connection.remoteAddress ||
         req.socket.remoteAddress ||
         req.ip;
};

module.exports = {
  findUserByMatricula,
  parseArrayFilter,
  isValidPassword,
  sanitizeString,
  parseBrazilianDate,
  generateSecurePassword,
  successResponse,
  errorResponse,
  asyncHandler,
  isAllowedIP,
  getRealIP,
};
