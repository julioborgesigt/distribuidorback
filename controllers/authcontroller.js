// /controllers/authController.js (Apenas Admin)
const { User } = require('../models');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

exports.login = async (req, res) => {
  console.log("login: Iniciando login, corpo da requisição:", req.body);
  const { matricula, senha, loginType } = req.body;

  // --- 1. VALIDAÇÃO DO TIPO DE LOGIN (NOVO) ---
  // Exige que o loginType seja especificado como admin
  if (!loginType || (loginType !== 'admin_super' && loginType !== 'admin_padrao')) {
    return res.status(400).json({ error: 'Tipo de login (loginType) é obrigatório e deve ser admin_super ou admin_padrao.' });
  }

  try {
    const user = await User.findOne({ where: { matricula } });
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    
    // --- 2. VALIDAÇÃO DE PERMISSÃO (MODIFICADO) ---
    // Verifica se o usuário TEM a permissão que ele ESTÁ PEDINDO
    let effectiveLoginType = null;

    if (loginType === 'admin_super' && user.admin_super) {
        effectiveLoginType = 'admin_super';
    } else if (loginType === 'admin_padrao' && (user.admin_padrao || user.admin_super)) {
        // Um admin_super pode logar como admin_padrao
        effectiveLoginType = 'admin_padrao';
    }

    // Se, após as verificações, ele não for um admin válido, rejeita.
    if (!effectiveLoginType) {
        return res.status(403).json({ error: 'Acesso negado. O usuário não possui as permissões de administrador solicitadas.' });
    }
    // --- Fim da validação de permissão ---

    // Verificação de senha (assíncrona para não bloquear o event loop)
    const senhaValida = await bcryptjs.compare(senha, user.senha);
    if (!senhaValida) {
      return res.status(401).json({ error: 'Senha incorreta' });
    }
    
    // Lógica de primeiro login
    if (user.senha_padrao) {
      console.log("login: Este é seu primeiro login.");
      return res.json({ firstLogin: true, userId: user.id, loginType: effectiveLoginType });
    } else {
      console.log("login: Este não é seu primeiro login. Gerando token...");
      const token = jwt.sign({ id: user.id, loginType: effectiveLoginType }, JWT_SECRET, { expiresIn: '2h' });
      
      let loginUser = {
        id: user.id,
        matricula: user.matricula,
        nome: user.nome,
        admin_padrao: user.admin_padrao,
        admin_super: user.admin_super
      };
      
      // Ajusta o objeto 'user' de acordo com o loginType EFETIVO
      // A lógica para 'usuario' foi REMOVIDA
      if (effectiveLoginType === 'admin_padrao') {
        loginUser.admin_super = false;
      }

      return res.json({ token, user: loginUser });
    }
  } catch (error) {
    console.error("login: Erro interno:", error);
    return res.status(500).json({ error: 'Erro interno' });
  }
};


exports.firstLogin = async (req, res) => {
  const { userId, novaSenha, loginType } = req.body; 

  // --- VALIDAÇÃO DO TIPO DE LOGIN (NOVO) ---
  if (!loginType || (loginType !== 'admin_super' && loginType !== 'admin_padrao')) {
    return res.status(400).json({ error: 'Tipo de login (loginType) inválido.' });
  }

  try {
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    user.senha = await bcryptjs.hash(novaSenha, 10);
    user.senha_padrao = false;
    await user.save();
    
    // O loginType enviado já é o 'effectiveLoginType'
    const token = jwt.sign({ id: user.id, loginType: loginType }, JWT_SECRET, { expiresIn: '2h' });
    
    let loginUser = { 
      id: user.id, 
      matricula: user.matricula, 
      nome: user.nome,
      admin_padrao: user.admin_padrao, 
      admin_super: user.admin_super 
    };

    // Ajusta o objeto 'user' - A lógica para 'usuario' foi REMOVIDA
    if (loginType === 'admin_padrao') {
      loginUser.admin_super = false;
    }

    return res.json({ token, user: loginUser });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erro interno' });
  }
};