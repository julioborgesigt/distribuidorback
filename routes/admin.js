// /routes/admin.js (Limpo)
const express = require('express');
const rateLimit = require('express-rate-limit');
const router = express.Router();
const adminController = require('../controllers/adminController');
const autenticarAdmin = require('../middlewares/autenticarAdmin');
const multer = require('multer');
const {
  validatePreCadastro,
  validateResetPassword,
  validateManualAssign,
  validateUpdateObservacoes,
  validateBulkOperation,
  validateBulkAssign,
  validateDeleteMatricula,
  validateUpdateIntim
} = require('../middlewares/validators');

// Configuração Segura de Upload de Arquivos
const upload = multer({
  dest: 'uploads/',
  limits: {
    fileSize: 5 * 1024 * 1024, // Máximo 5MB
    files: 1 // Apenas 1 arquivo por vez
  },
  fileFilter: (req, file, cb) => {
    // Valida MIME type
    const allowedMimeTypes = ['text/csv', 'application/vnd.ms-excel', 'text/plain'];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      return cb(new Error('Apenas arquivos CSV são permitidos'), false);
    }

    // Valida extensão do arquivo
    const fileExtension = file.originalname.split('.').pop().toLowerCase();
    if (fileExtension !== 'csv') {
      return cb(new Error('Extensão de arquivo inválida. Use .csv'), false);
    }

    cb(null, true);
  }
});

// Rate Limiter para Operações em Massa - Proteção contra DoS
const bulkOperationsLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minuto
  max: 10, // Máximo 10 operações em massa por minuto
  message: {
    error: 'Muitas operações em massa. Aguarde 1 minuto antes de tentar novamente.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Aplica o middleware a todas as rotas deste módulo:
router.use(autenticarAdmin);

/**
 * @swagger
 * /api/admin/users:
 *   get:
 *     summary: Lista todos os usuários
 *     description: Retorna lista de usuários com paginação
 *     tags: [Administração - Usuários]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 1000
 *         description: Número máximo de usuários por página
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Deslocamento para paginação
 *     responses:
 *       200:
 *         description: Lista de usuários retornada com sucesso
 */
router.get('/users', adminController.listUsers);

/**
 * @swagger
 * /api/admin/stats/unassigned-count:
 *   get:
 *     summary: Contagem de processos não atribuídos
 *     description: Retorna o número de processos sem usuário atribuído
 *     tags: [Administração - Estatísticas]
 *     responses:
 *       200:
 *         description: Contagem retornada com sucesso
 */
router.get('/stats/unassigned-count', adminController.getUnassignedCount);

/**
 * @swagger
 * /api/admin/stats/dashboard:
 *   get:
 *     summary: Estatísticas do dashboard
 *     description: Retorna estatísticas completas para o painel administrativo
 *     tags: [Administração - Estatísticas]
 *     responses:
 *       200:
 *         description: Estatísticas retornadas com sucesso
 */
router.get('/stats/dashboard', adminController.getDashboardStats);


// Middleware para tratar erros de upload
const handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'Arquivo muito grande. Tamanho máximo: 5MB' });
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({ error: 'Apenas um arquivo por vez é permitido' });
    }
    return res.status(400).json({ error: 'Erro no upload do arquivo', details: err.message });
  } else if (err) {
    return res.status(400).json({ error: err.message });
  }
  next();
};

/**
 * @swagger
 * /api/admin/upload:
 *   post:
 *     summary: Upload de arquivo CSV
 *     description: Importa processos de um arquivo CSV
 *     tags: [Administração - Processos]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               csvFile:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: CSV importado com sucesso
 *       400:
 *         description: Erro no arquivo CSV
 */
router.post('/upload', upload.single('csvFile'), handleUploadError, adminController.uploadCSV);

/**
 * @swagger
 * /api/admin/processes:
 *   get:
 *     summary: Lista processos
 *     description: Retorna lista paginada de processos com filtros e ordenação
 *     tags: [Administração - Processos]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: itemsPerPage
 *         schema:
 *           type: integer
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: cumprido
 *         schema:
 *           type: boolean
 *     responses:
 *       200:
 *         description: Lista de processos retornada com sucesso
 */
router.get('/processes', adminController.listProcesses);

/**
 * @swagger
 * /api/admin/assign:
 *   post:
 *     summary: Atribuição automática de processos
 *     description: Distribui processos automaticamente entre usuários
 *     tags: [Administração - Processos]
 *     responses:
 *       200:
 *         description: Processos atribuídos com sucesso
 */
router.post('/assign', adminController.assignProcesses);

/**
 * @swagger
 * /api/admin/manual-assign:
 *   post:
 *     summary: Atribuição manual de processo
 *     description: Atribui um processo específico a um usuário
 *     tags: [Administração - Processos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               processo:
 *                 type: string
 *               matricula:
 *                 type: string
 *     responses:
 *       200:
 *         description: Processo atribuído com sucesso
 */
router.post('/manual-assign', validateManualAssign, adminController.manualAssignProcess);

/**
 * @swagger
 * /api/admin/pre-cadastro:
 *   post:
 *     summary: Pré-cadastro de usuário
 *     description: Cria ou atualiza um usuário no sistema
 *     tags: [Administração - Usuários]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               matricula:
 *                 type: string
 *               nome:
 *                 type: string
 *               tipoCadastro:
 *                 type: string
 *                 enum: [usuario, admin_padrao, admin_super]
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 */
router.post('/pre-cadastro', validatePreCadastro, adminController.preCadastro);

/**
 * @swagger
 * /api/admin/reset-password:
 *   post:
 *     summary: Reset de senha
 *     description: Redefine a senha de um usuário para o padrão
 *     tags: [Administração - Usuários]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               matricula:
 *                 type: string
 *     responses:
 *       200:
 *         description: Senha resetada com sucesso
 */
router.post('/reset-password', validateResetPassword, adminController.resetPassword);

/**
 * @swagger
 * /api/admin/bulk-assign:
 *   post:
 *     summary: Atribuição em massa
 *     description: Atribui múltiplos processos a um usuário
 *     tags: [Administração - Operações em Massa]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               matricula:
 *                 type: string
 *               processIds:
 *                 type: array
 *                 items:
 *                   type: integer
 *     responses:
 *       200:
 *         description: Processos atribuídos com sucesso
 */
router.post('/bulk-assign', bulkOperationsLimiter, validateBulkAssign, adminController.bulkAssign);

/**
 * @swagger
 * /api/admin/bulk-delete:
 *   post:
 *     summary: Exclusão em massa
 *     description: Remove múltiplos processos do sistema
 *     tags: [Administração - Operações em Massa]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               processIds:
 *                 type: array
 *                 items:
 *                   type: integer
 *     responses:
 *       200:
 *         description: Processos excluídos com sucesso
 */
router.post('/bulk-delete', bulkOperationsLimiter, validateBulkOperation, adminController.bulkDelete);

/**
 * @swagger
 * /api/admin/bulk-cumprido:
 *   post:
 *     summary: Marcar múltiplos processos como cumpridos
 *     description: Marca vários processos como cumpridos em uma operação
 *     tags: [Administração - Operações em Massa]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               processIds:
 *                 type: array
 *                 items:
 *                   type: integer
 *     responses:
 *       200:
 *         description: Processos marcados como cumpridos
 */
router.post('/bulk-cumprido', bulkOperationsLimiter, validateBulkOperation, adminController.bulkCumprido);

/**
 * @swagger
 * /api/admin/update-intim:
 *   post:
 *     summary: Atualizar reiterações de intimação
 *     description: Incrementa o contador de reiterações de um processo
 *     tags: [Administração - Processos]
 *     responses:
 *       200:
 *         description: Reiterações atualizadas com sucesso
 */
router.post('/update-intim', validateUpdateIntim, adminController.updateIntim);

/**
 * @swagger
 * /api/admin/delete-matricula:
 *   post:
 *     summary: Excluir usuário por matrícula
 *     description: Remove um usuário do sistema
 *     tags: [Administração - Usuários]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               matricula:
 *                 type: string
 *     responses:
 *       200:
 *         description: Usuário excluído com sucesso
 */
router.post('/delete-matricula', validateDeleteMatricula, adminController.deleteMatricula);

/**
 * @swagger
 * /api/admin/processes/{id}/observacoes:
 *   put:
 *     summary: Atualizar observações de processo
 *     description: Modifica as observações de um processo específico
 *     tags: [Administração - Processos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               observacoes:
 *                 type: string
 *                 maxLength: 100
 *     responses:
 *       200:
 *         description: Observações atualizadas com sucesso
 */
router.put('/processes/:id/observacoes', validateUpdateObservacoes, adminController.updateObservacoes);

/**
 * @swagger
 * /api/admin/processes/{id}/cumprir:
 *   patch:
 *     summary: Marcar processo como cumprido
 *     description: Define um processo como cumprido
 *     tags: [Administração - Processos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Processo marcado como cumprido
 */
router.patch('/processes/:id/cumprir', adminController.markAsCumprido);

/**
 * @swagger
 * /api/admin/processes/{id}/desfazer-cumprir:
 *   patch:
 *     summary: Desfazer cumprimento de processo
 *     description: Remove a marcação de cumprido de um processo
 *     tags: [Administração - Processos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Cumprimento desfeito com sucesso
 */
router.patch('/processes/:id/desfazer-cumprir', adminController.unmarkAsCumprido);
module.exports = router;