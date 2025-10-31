// /routes/auth.js (Apenas Admin)
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authcontroller');

// Rota para login (POST) e primeiro acesso
router.post('/login', authController.login);
router.post('/primeiro-login', authController.firstLogin);

module.exports = router;