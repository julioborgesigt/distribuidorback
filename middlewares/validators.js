// /middlewares/validators.js
// Validadores de entrada para proteger contra XSS e dados inválidos
const { body, param, query, validationResult } = require('express-validator');

// Middleware para verificar erros de validação
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Dados de entrada inválidos',
      details: errors.array()
    });
  }
  next();
};

// Validadores para Login
const validateLogin = [
  body('matricula')
    .trim()
    .notEmpty().withMessage('Matrícula é obrigatória')
    .isLength({ min: 1, max: 20 }).withMessage('Matrícula deve ter entre 1 e 20 caracteres')
    .matches(/^[a-zA-Z0-9_-]+$/).withMessage('Matrícula contém caracteres inválidos'),

  body('senha')
    .notEmpty().withMessage('Senha é obrigatória')
    .isLength({ min: 1, max: 100 }).withMessage('Senha inválida'),

  body('loginType')
    .notEmpty().withMessage('Tipo de login é obrigatório')
    .isIn(['admin_super', 'admin_padrao']).withMessage('Tipo de login inválido'),

  handleValidationErrors
];

// Validadores para Primeiro Login
const validateFirstLogin = [
  body('userId')
    .notEmpty().withMessage('ID do usuário é obrigatório')
    .isInt({ min: 1 }).withMessage('ID do usuário inválido'),

  body('novaSenha')
    .notEmpty().withMessage('Nova senha é obrigatória')
    .isLength({ min: 8, max: 100 }).withMessage('Senha deve ter entre 8 e 100 caracteres')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).withMessage('Senha deve conter pelo menos uma letra maiúscula, uma minúscula e um número. Símbolos são opcionais mas recomendados'),

  body('loginType')
    .notEmpty().withMessage('Tipo de login é obrigatório')
    .isIn(['admin_super', 'admin_padrao']).withMessage('Tipo de login inválido'),

  handleValidationErrors
];

// Validadores para Pré-cadastro de Usuário
const validatePreCadastro = [
  body('matricula')
    .trim()
    .notEmpty().withMessage('Matrícula é obrigatória')
    .isLength({ min: 1, max: 20 }).withMessage('Matrícula deve ter entre 1 e 20 caracteres')
    .matches(/^[a-zA-Z0-9_-]+$/).withMessage('Matrícula contém caracteres inválidos'),

  body('nome')
    .trim()
    .notEmpty().withMessage('Nome é obrigatório')
    .isLength({ min: 1, max: 100 }).withMessage('Nome deve ter entre 1 e 100 caracteres')
    .matches(/^[a-zA-ZÀ-ÿ\s'-]+$/).withMessage('Nome contém caracteres inválidos'),

  body('senha')
    .notEmpty().withMessage('Senha é obrigatória')
    .isLength({ min: 8, max: 100 }).withMessage('Senha deve ter entre 8 e 100 caracteres'),

  body('tipoCadastro')
    .notEmpty().withMessage('Tipo de cadastro é obrigatório')
    .isIn(['admin_padrao', 'admin_super']).withMessage('Tipo de cadastro inválido'),

  body('updateIfExists')
    .optional()
    .isBoolean().withMessage('updateIfExists deve ser booleano'),

  handleValidationErrors
];

// Validadores para Reset de Senha
const validateResetPassword = [
  body('matricula')
    .trim()
    .notEmpty().withMessage('Matrícula é obrigatória')
    .isLength({ min: 1, max: 20 }).withMessage('Matrícula deve ter entre 1 e 20 caracteres')
    .matches(/^[a-zA-Z0-9_-]+$/).withMessage('Matrícula contém caracteres inválidos'),

  handleValidationErrors
];

// Validadores para Atribuição Manual
const validateManualAssign = [
  body('numeroProcesso')
    .trim()
    .notEmpty().withMessage('Número do processo é obrigatório')
    .isLength({ min: 1, max: 50 }).withMessage('Número do processo inválido'),

  body('matricula')
    .trim()
    .notEmpty().withMessage('Matrícula é obrigatória')
    .isLength({ min: 1, max: 20 }).withMessage('Matrícula inválida'),

  handleValidationErrors
];

// Validadores para Atualização de Observações
const validateUpdateObservacoes = [
  param('id')
    .isInt({ min: 1 }).withMessage('ID do processo inválido'),

  body('observacoes')
    .optional()
    .isLength({ max: 100 }).withMessage('Observação deve ter no máximo 100 caracteres')
    .trim(),

  handleValidationErrors
];

// Validadores para Bulk Operations
const validateBulkOperation = [
  body('processIds')
    .isArray({ min: 1 }).withMessage('Selecione pelo menos um processo')
    .custom((value) => {
      if (!value.every(id => Number.isInteger(id) && id > 0)) {
        throw new Error('IDs de processos inválidos');
      }
      return true;
    }),

  handleValidationErrors
];

// Validadores para Bulk Assign
const validateBulkAssign = [
  body('processIds')
    .isArray({ min: 1 }).withMessage('Selecione pelo menos um processo')
    .custom((value) => {
      if (!value.every(id => Number.isInteger(id) && id > 0)) {
        throw new Error('IDs de processos inválidos');
      }
      return true;
    }),

  body('matricula')
    .trim()
    .notEmpty().withMessage('Matrícula é obrigatória')
    .isLength({ min: 1, max: 20 }).withMessage('Matrícula inválida'),

  handleValidationErrors
];

// Validadores para Delete Matrícula
const validateDeleteMatricula = [
  body('matricula')
    .trim()
    .notEmpty().withMessage('Matrícula é obrigatória')
    .isLength({ min: 1, max: 20 }).withMessage('Matrícula inválida'),

  handleValidationErrors
];

// Validadores para Update Intim
const validateUpdateIntim = [
  body('processId')
    .notEmpty().withMessage('ID do processo é obrigatório')
    .isInt({ min: 1 }).withMessage('ID do processo inválido'),

  body('reiteracoes')
    .notEmpty().withMessage('Número de reiterações é obrigatório')
    .isInt({ min: 0, max: 999 }).withMessage('Número de reiterações inválido'),

  handleValidationErrors
];

module.exports = {
  validateLogin,
  validateFirstLogin,
  validatePreCadastro,
  validateResetPassword,
  validateManualAssign,
  validateUpdateObservacoes,
  validateBulkOperation,
  validateBulkAssign,
  validateDeleteMatricula,
  validateUpdateIntim
};
