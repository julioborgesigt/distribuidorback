// Middleware de proteção CSRF e validações de origem
// NOTA: Como esta API usa JWT em headers (Authorization: Bearer token),
// a proteção CSRF tradicional com cookies não é necessária.
// Navegadores não enviam headers customizados automaticamente em requisições cross-site,
// o que já fornece proteção contra CSRF.
//
// Este middleware adiciona camadas extras de segurança:
// 1. Validação de Origin/Referer para endpoints críticos
// 2. Verificação de header customizado para APIs
// 3. Rate limiting já implementado em operações sensíveis

const logger = require('../utils/logger');
const { getRealIP } = require('../utils/helpers');

/**
 * Valida o header X-Requested-With para garantir que é uma requisição AJAX
 * Isso adiciona uma camada extra de proteção mesmo com JWT
 */
const validateAjaxHeader = (req, res, next) => {
  // Permite requisições sem validação para rotas públicas
  if (req.path === '/health' || req.path === '/' || req.path.startsWith('/api-docs')) {
    return next();
  }

  const requestedWith = req.headers['x-requested-with'];

  // Em produção, pode-se exigir o header XMLHttpRequest
  // Por ora, apenas logamos se não estiver presente
  if (!requestedWith) {
    logger.debug('Requisição sem header X-Requested-With', {
      path: req.path,
      method: req.method,
      ip: getRealIP(req),
      origin: req.headers.origin || 'não especificado'
    });
  }

  next();
};

/**
 * Valida Origin/Referer para operações críticas
 * Útil como defesa em profundidade
 */
const validateOriginForCriticalOps = (req, res, next) => {
  // Lista de operações críticas que requerem validação extra
  const criticalPaths = [
    '/api/admin/delete-matricula',
    '/api/admin/bulk-delete',
    '/api/admin/reset-password'
  ];

  // Verifica se é uma operação crítica
  const isCritical = criticalPaths.some(path => req.path === path);

  if (!isCritical) {
    return next();
  }

  const origin = req.headers.origin || req.headers.referer;
  const allowedOrigins = [
    'https://distribuidorvue.onrender.com',
    'http://localhost:8080',
    'http://localhost:3000',
    process.env.FRONTEND_URL,
    process.env.FRONTEND_URL_2,
    process.env.FRONTEND_URL_3
  ].filter(Boolean);

  // Se não há origin/referer, permite mas loga
  if (!origin) {
    logger.warn('Operação crítica sem Origin/Referer', {
      path: req.path,
      method: req.method,
      ip: getRealIP(req),
      userId: req.userId
    });
    return next();
  }

  // Valida se o origin está na lista de permitidos
  const isAllowed = allowedOrigins.some(allowed => {
    try {
      const originUrl = new URL(origin);
      const allowedUrl = new URL(allowed);
      return originUrl.origin === allowedUrl.origin;
    } catch {
      return origin.includes(allowed);
    }
  });

  if (!isAllowed) {
    logger.logSecurityEvent('Operação crítica de origem não permitida bloqueada', {
      path: req.path,
      method: req.method,
      origin: origin,
      ip: getRealIP(req),
      userId: req.userId
    });

    return res.status(403).json({
      error: 'Origem não permitida para esta operação'
    });
  }

  next();
};

/**
 * Middleware que adiciona headers de segurança relacionados a CSRF
 */
const addSecurityHeaders = (req, res, next) => {
  // Previne que a página seja embutida em iframes (Clickjacking)
  res.setHeader('X-Frame-Options', 'DENY');

  // Previne MIME type sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');

  // Ativa proteção XSS do navegador
  res.setHeader('X-XSS-Protection', '1; mode=block');

  next();
};

module.exports = {
  validateAjaxHeader,
  validateOriginForCriticalOps,
  addSecurityHeaders
};
