// /routes/admin.js (Limpo)
const express = require('express');
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

// Aplica o middleware a todas as rotas deste módulo:
router.use(autenticarAdmin);

// Rota para listar usuários
router.get('/users', adminController.listUsers);

// ✅ NOVA ROTA: Retorna contagem para o alerta do dashboard
router.get('/stats/unassigned-count', adminController.getUnassignedCount);

// ✅ NOVA ROTA: Retorna todas as estatísticas do dashboard
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

// Rotas da API de Admin (com validação)
router.post('/upload', upload.single('csvFile'), handleUploadError, adminController.uploadCSV);
router.get('/processes', adminController.listProcesses);
router.post('/assign', adminController.assignProcesses);
router.post('/manual-assign', validateManualAssign, adminController.manualAssignProcess);
router.post('/pre-cadastro', validatePreCadastro, adminController.preCadastro);
router.post('/reset-password', validateResetPassword, adminController.resetPassword);
router.post('/bulk-assign', validateBulkAssign, adminController.bulkAssign);
router.post('/bulk-delete', validateBulkOperation, adminController.bulkDelete);
router.post('/bulk-cumprido', validateBulkOperation, adminController.bulkCumprido);
router.post('/update-intim', validateUpdateIntim, adminController.updateIntim);
router.post('/delete-matricula', validateDeleteMatricula, adminController.deleteMatricula);

router.put('/processes/:id/observacoes', validateUpdateObservacoes, adminController.updateObservacoes);

router.patch('/processes/:id/cumprir', adminController.markAsCumprido);
router.patch('/processes/:id/desfazer-cumprir', adminController.unmarkAsCumprido);
module.exports = router;