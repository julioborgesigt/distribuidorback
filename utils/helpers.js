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

/**
 * Valida CPF brasileiro (formato e dígitos verificadores)
 * @param {string} cpf - CPF a ser validado (com ou sem máscara)
 * @returns {boolean} True se CPF válido
 */
const isValidCPF = (cpf) => {
  if (!cpf) return false;

  // Remove caracteres não numéricos
  const cleanCPF = cpf.replace(/[^\d]/g, '');

  // CPF deve ter exatamente 11 dígitos
  if (cleanCPF.length !== 11) return false;

  // Rejeita CPFs com todos os dígitos iguais
  if (/^(\d)\1{10}$/.test(cleanCPF)) return false;

  // Validação dos dígitos verificadores
  let sum = 0;
  let remainder;

  // Valida primeiro dígito verificador
  for (let i = 1; i <= 9; i++) {
    sum += parseInt(cleanCPF.substring(i - 1, i)) * (11 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleanCPF.substring(9, 10))) return false;

  sum = 0;
  // Valida segundo dígito verificador
  for (let i = 1; i <= 10; i++) {
    sum += parseInt(cleanCPF.substring(i - 1, i)) * (12 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleanCPF.substring(10, 11))) return false;

  return true;
};

/**
 * Formata CPF para o padrão brasileiro (###.###.###-##)
 * @param {string} cpf - CPF sem formatação
 * @returns {string|null} CPF formatado ou null se inválido
 */
const formatCPF = (cpf) => {
  if (!cpf) return null;

  const cleanCPF = cpf.replace(/[^\d]/g, '');

  if (cleanCPF.length !== 11) return null;

  return cleanCPF.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
};

module.exports = {
  findUserByMatricula,
  parseArrayFilter,
  isValidPassword,
  sanitizeString,
  parseBrazilianDate,
  getRealIP,
  isValidCPF,
  formatCPF,
};
