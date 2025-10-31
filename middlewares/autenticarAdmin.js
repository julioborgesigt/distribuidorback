// /middlewares/autenticarAdmin.js
const jwt = require('jsonwebtoken');
const { User } = require('../models');

// Corrigido: Lendo o segredo das variáveis de ambiente
const JWT_SECRET = process.env.JWT_SECRET; 

const autenticarAdmin = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  
  if (!authHeader) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  const token = authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Token mal formatado' });
  }

  try {
    // 1. Decodifica o token
    const decoded = jwt.verify(token, JWT_SECRET);

    // 2. Busca o usuário no banco de dados
    const user = await User.findByPk(decoded.id);

    if (!user) {
      return res.status(404).json({ error: 'Usuário do token não encontrado' });
    }

    // 3. VERIFICAÇÃO DE PERMISSÃO (A PARTE CRÍTICA QUE FALTAVA)
    // Se o usuário não for 'admin_padrao' E nem 'admin_super', ele é barrado.
    if (!user.admin_padrao && !user.admin_super) {
      console.warn(`Tentativa de acesso admin falhou: Usuário ${user.matricula} não é admin.`);
      return res.status(403).json({ error: 'Acesso proibido. Requer privilégios de administrador.' });
    }
    
    // 4. Se passou, anexa os dados na requisição para os controllers usarem
    req.user = user;
    req.userId = user.id;
    // Anexa o tipo de login que foi usado (super ou padrao)
    req.loginType = decoded.loginType || 'admin_padrao'; 

    next(); // Permite o acesso à rota de admin

  } catch (err) {
    if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
      return res.status(403).json({ error: 'Token inválido ou expirado' });
    }
    // Erro inesperado
    console.error('Erro no middleware de autenticação admin:', err);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

module.exports = autenticarAdmin;