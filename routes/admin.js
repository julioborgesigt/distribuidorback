// /routes/admin.js (Limpo)
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const autenticarAdmin = require('../middlewares/autenticarAdmin');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

// Aplica o middleware a todas as rotas deste módulo:
router.use(autenticarAdmin);

// Rota para listar usuários
router.get('/users', adminController.listUsers);

// ✅ NOVA ROTA: Retorna contagem para o alerta do dashboard
router.get('/stats/unassigned-count', adminController.getUnassignedCount);

// Rota da página admin (REMOVIDA)
// router.get('/', adminController.getAdminPage); // REMOVIDA

// Rotas da API de Admin
router.post('/upload', upload.single('csvFile'), adminController.uploadCSV);
router.get('/processes', adminController.listProcesses);
router.post('/assign', adminController.assignProcesses);
router.post('/manual-assign', adminController.manualAssignProcess);
router.post('/pre-cadastro', adminController.preCadastro);
router.post('/reset-password', adminController.resetPassword);
router.post('/bulk-assign', adminController.bulkAssign);
router.post('/bulk-delete', adminController.bulkDelete);
router.post('/bulk-cumprido', adminController.bulkCumprido);
router.post('/update-intim', adminController.updateIntim);
router.post('/delete-matricula', adminController.deleteMatricula);



router.put('/processes/:id/observacoes', adminController.updateObservacoes);


router.patch('/processes/:id/cumprir', adminController.markAsCumprido);
router.patch('/processes/:id/desfazer-cumprir', adminController.unmarkAsCumprido);
module.exports = router;