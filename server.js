// server.js (Apenas Admin)
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { sequelize } = require('./models');
const adminRoutes = require('./routes/admin');
const authRoutes = require('./routes/auth');
const logger = require('./utils/logger');
const {
  errorHandler,
  notFoundHandler,
  httpLogger,
  validateJSON
} = require('./middlewares/errorHandler');
const { sanitizeInput } = require('./middlewares/sanitizer');
// const userRoutes = require('./routes/user'); // REMOVIDO

// Validação de Variáveis de Ambiente Obrigatórias
const requiredEnvVars = ['DB_HOST', 'DB_USER', 'DB_PASS', 'DB_NAME', 'JWT_SECRET'];
const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
if (missingVars.length > 0) {
  logger.error(`Variáveis de ambiente obrigatórias não definidas: ${missingVars.join(', ')}`);
  process.exit(1);
}

const app = express();

// Configuração de Segurança - Helmet
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
    },
  },
}));

// Configuração de CORS Segura
// Lista de origens permitidas
const allowedOrigins = [
  'https://distribuidorvue.onrender.com',
  'http://localhost:8080',
  'http://localhost:3000',
  'http://127.0.0.1:8080',
  process.env.FRONTEND_URL,
  process.env.FRONTEND_URL_2,
  process.env.FRONTEND_URL_3
].filter(Boolean);

// Log das origens permitidas na inicialização
logger.info('Origens CORS permitidas:', { origins: allowedOrigins });

app.use(cors({
  origin: function (origin, callback) {
    // Log de debugging para ver qual origem está tentando acessar
    logger.debug('CORS - Requisição de origem:', {
      origin: origin || 'sem origin',
      allowed: allowedOrigins
    });

    // Permite requisições sem origin (Postman, curl, apps mobile, etc.)
    if (!origin) {
      logger.debug('CORS - Requisição sem origin permitida');
      return callback(null, true);
    }

    // Verifica se a origem está na lista de permitidas
    if (allowedOrigins.includes(origin)) {
      logger.debug('CORS - Origem permitida:', { origin });
      return callback(null, true);
    }

    // Origem não permitida
    logger.warn('CORS - Origem bloqueada:', {
      origin,
      allowedOrigins
    });

    // Retornar erro detalhado
    const error = new Error(`Origem não permitida pelo CORS: ${origin}`);
    error.statusCode = 403;
    callback(error);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  maxAge: 600 // Cache da preflight request por 10 minutos
}));

const PORT = process.env.PORT || 3000;

// Middleware de logging HTTP
app.use(httpLogger);

// Parsers de JSON e URL-encoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware para validar JSON
app.use(validateJSON);

// Middleware de sanitização XSS
app.use(sanitizeInput);

// --- 1. ROTAS DE API ---
// Todas as suas rotas de API (agora apenas admin e auth)
app.use('/api/admin', adminRoutes);
app.use('/api/auth', authRoutes);
// app.use('/api/user', userRoutes); // REMOVIDO

// --- 2. ROTA RAIZ ---
// Adiciona uma rota GET simples para a raiz do servidor
app.get('/', (req, res) => {
  res.send('Seu back está rodando');
});

// --- HEALTHCHECK ENDPOINT ---
app.get('/health', async (req, res) => {
  try {
    await sequelize.authenticate();
    res.status(200).json({
      status: 'ok',
      database: 'connected',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    logger.error('Healthcheck falhou - Database disconnected', { error: error.message });
    res.status(503).json({
      status: 'error',
      database: 'disconnected',
      timestamp: new Date().toISOString()
    });
  }
});

// --- MIDDLEWARE DE ERRO ---
// Deve vir DEPOIS de todas as rotas

// 404 - Rota não encontrada
app.use(notFoundHandler);

// Tratamento de erros global
app.use(errorHandler);

// --- 3. INICIAR SERVIDOR ---
// SEGURANÇA: Não usar 'alter: true' em produção para evitar perda de dados
const syncOptions = process.env.NODE_ENV === 'production'
  ? { } // Em produção, apenas valida as models
  : { alter: true }; // Em desenvolvimento, permite alterações

sequelize.sync(syncOptions)
  .then(async () => {
    logger.info('Banco de dados sincronizado com sucesso');

    // Inicia o servidor
    app.listen(PORT, () => {
      logger.info(`Servidor API rodando na porta ${PORT}`);
      logger.info(`Ambiente: ${process.env.NODE_ENV || 'development'}`);
      logger.info(`Logs salvos em: ./logs/`);
    });
  })
  .catch(err => {
    logger.error('Erro ao sincronizar o banco de dados', {
      error: err.message,
      stack: err.stack
    });
    process.exit(1);
  });

// Tratamento de erros não capturados
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection', {
    reason,
    promise
  });
});

process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception', {
    error: error.message,
    stack: error.stack
  });
  process.exit(1);
});