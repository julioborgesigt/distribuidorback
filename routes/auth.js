// /routes/auth.js (Apenas Admin)
const express = require('express');
const rateLimit = require('express-rate-limit');
const router = express.Router();
const authController = require('../controllers/authcontroller');
const { validateLogin, validateFirstLogin } = require('../middlewares/validators');

// Rate Limiter para Login - Proteção contra Força Bruta
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // Máximo 5 tentativas por IP
  message: {
    error: 'Muitas tentativas de login. Tente novamente em 15 minutos.'
  },
  standardHeaders: true, // Retorna informações de rate limit nos headers
  legacyHeaders: false, // Desabilita headers X-RateLimit-*
});

// Rate Limiter para Primeiro Login (menos restritivo)
const firstLoginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 3, // Máximo 3 tentativas
  message: {
    error: 'Muitas tentativas de troca de senha. Tente novamente em 15 minutos.'
  },
});

// Rota para login (POST) e primeiro acesso
// Ordem: rate limiter -> validação -> controller
router.post('/login', loginLimiter, validateLogin, authController.login);
router.post('/primeiro-login', firstLoginLimiter, validateFirstLogin, authController.firstLogin);

module.exports = router;