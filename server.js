// server.js (Apenas Admin)
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { sequelize } = require('./models');
const adminRoutes = require('./routes/admin');
const authRoutes = require('./routes/auth');
// const userRoutes = require('./routes/user'); // REMOVIDO

// Validação de Variáveis de Ambiente Obrigatórias
const requiredEnvVars = ['DB_HOST', 'DB_USER', 'DB_PASS', 'DB_NAME', 'JWT_SECRET'];
const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
if (missingVars.length > 0) {
  console.error(`ERRO: Variáveis de ambiente obrigatórias não definidas: ${missingVars.join(', ')}`);
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
const allowedOrigins = [
  'https://distribuidorvue.onrender.com',
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Permite requisições sem origin (mobile apps, Postman, etc.) apenas em desenvolvimento
    if (!origin && process.env.NODE_ENV !== 'production') {
      return callback(null, true);
    }
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Origem não permitida pelo CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
    res.status(503).json({
      status: 'error',
      database: 'disconnected',
      timestamp: new Date().toISOString()
    });
  }
});

// --- 3. INICIAR SERVIDOR ---
// SEGURANÇA: Não usar 'alter: true' em produção para evitar perda de dados
const syncOptions = process.env.NODE_ENV === 'production'
  ? { } // Em produção, apenas valida as models
  : { alter: true }; // Em desenvolvimento, permite alterações

sequelize.sync(syncOptions)
  .then(async () => {
    console.log('Banco de dados sincronizado.');

    // Inicia o servidor
    app.listen(PORT, () => {
      console.log(`Servidor API rodando na porta ${PORT}`);
      console.log(`Ambiente: ${process.env.NODE_ENV || 'development'}`);
    });
  })
  .catch(err => {
    console.error('Erro ao sincronizar o banco de dados:', err);
    process.exit(1);
  });