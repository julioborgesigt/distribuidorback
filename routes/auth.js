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

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Autenticação de administrador
 *     description: Realiza login de usuário administrador (admin_padrao ou admin_super)
 *     tags: [Autenticação]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Login realizado com sucesso ou primeiro login detectado
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - $ref: '#/components/schemas/LoginResponse'
 *                 - $ref: '#/components/schemas/FirstLoginResponse'
 *       401:
 *         description: Senha incorreta
 *       403:
 *         description: Acesso negado - sem permissão de administrador
 *       404:
 *         description: Usuário não encontrado
 *       429:
 *         description: Muitas tentativas de login
 */
router.post('/login', loginLimiter, validateLogin, authController.login);

/**
 * @swagger
 * /api/auth/primeiro-login:
 *   post:
 *     summary: Troca de senha no primeiro acesso
 *     description: Permite que o usuário altere a senha padrão no primeiro login
 *     tags: [Autenticação]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [userId, novaSenha, loginType]
 *             properties:
 *               userId:
 *                 type: integer
 *                 example: 1
 *               novaSenha:
 *                 type: string
 *                 format: password
 *                 example: NovaSenhaForte123
 *               loginType:
 *                 type: string
 *                 enum: [admin_padrao, admin_super]
 *                 example: admin_super
 *     responses:
 *       200:
 *         description: Senha alterada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *       404:
 *         description: Usuário não encontrado
 *       429:
 *         description: Muitas tentativas de troca de senha
 */
router.post('/primeiro-login', firstLoginLimiter, validateFirstLogin, authController.firstLogin);

module.exports = router;