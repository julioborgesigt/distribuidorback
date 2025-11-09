// /utils/logger.js
// Configuração de logging estruturado com Winston

const winston = require('winston');
const path = require('path');

// Definir níveis de log personalizados
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// Definir cores para cada nível
const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'blue',
};

winston.addColors(colors);

// Formato de log para desenvolvimento (console)
const devFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.colorize({ all: true }),
  winston.format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message}`
  )
);

// Formato de log para produção (JSON estruturado)
const prodFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

// Determinar nível de log baseado no ambiente
const level = () => {
  const env = process.env.NODE_ENV || 'development';
  const isDevelopment = env === 'development';
  return isDevelopment ? 'debug' : 'info';
};

// Configurar transportes (onde os logs são salvos)
const transports = [
  // Console: sempre ativo
  new winston.transports.Console({
    format: process.env.NODE_ENV === 'production' ? prodFormat : devFormat,
  }),

  // Arquivo de erro: apenas erros
  new winston.transports.File({
    filename: path.join('logs', 'error.log'),
    level: 'error',
    format: prodFormat,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
  }),

  // Arquivo combinado: todos os logs
  new winston.transports.File({
    filename: path.join('logs', 'combined.log'),
    format: prodFormat,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
  }),
];

// Criar logger
const logger = winston.createLogger({
  level: level(),
  levels,
  transports,
  // Não sair do processo em caso de erro
  exitOnError: false,
});

// Adicionar método para logar requisições HTTP
logger.logRequest = (req, res, responseTime) => {
  const { method, url, ip } = req;
  const { statusCode } = res;
  const userId = req.userId || 'anonymous';

  logger.http(`${method} ${url} ${statusCode} ${responseTime}ms - User: ${userId} - IP: ${ip}`);
};

// Adicionar método para logar erros de segurança
logger.logSecurityEvent = (event, details) => {
  logger.warn(`SECURITY: ${event}`, {
    timestamp: new Date().toISOString(),
    ...details
  });
};

// Adicionar método para logar tentativas de autenticação
logger.logAuthAttempt = (success, matricula, ip, reason = null) => {
  const message = success
    ? `Login bem-sucedido: ${matricula}`
    : `Falha no login: ${matricula} - ${reason}`;

  const level = success ? 'info' : 'warn';

  logger.log(level, message, {
    event: 'authentication',
    success,
    matricula,
    ip,
    timestamp: new Date().toISOString()
  });
};

module.exports = logger;
