// /controllers/adminController.js (Limpo)

// const path = require('path'); // REMOVIDO
const fs = require('fs');
const fsPromises = require('fs').promises;
const csvParser = require('csv-parser');
const { sequelize, User, Process } = require('../models');
const { Op, literal } = require('sequelize');
const iconv = require('iconv-lite');
const bcryptjs = require('bcryptjs');
const logger = require('../utils/logger');
const { getRealIP, isValidPassword } = require('../utils/helpers');
// Função que enviava página HTML (REMOVIDA)
// exports.getAdminPage = (req, res) => {
//   res.sendFile(path.join(__dirname, '../public', 'admin.html'));
// };

// Upload e importação de CSV (VERSÃO CORRIGIDA)
exports.uploadCSV = (req, res) => {
  if (!req.file) {
    return res.status(400).send('Nenhum arquivo foi enviado.');
  }

  const filePath = req.file.path;
  const results = [];
  
  // Função para converter data do formato "dd/mm/yyyy" para "yyyy-mm-dd"
  const parseDate = (dateStr) => {
    if (!dateStr) return null;
    const parts = dateStr.split('/');
    if (parts.length !== 3) return null;
    const [day, month, year] = parts;
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  };
  
  const normalizeHeader = (header) => {
    let norm = header.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    // Correção: Usando a sequência de escape Unicode \uFFFD, que representa o caractere problemático.
    // Isso evita erros de formatação.
    norm = norm.replace(/\uFFFD/g, 'u');
    return norm.trim();
  };

  fs.createReadStream(filePath)
    .pipe(iconv.decodeStream('latin1'))
    .pipe(iconv.encodeStream('utf8'))
    .pipe(csvParser({ 
      separator: ';', 
      mapHeaders: ({ header }) => normalizeHeader(header)
    }))
    .on('data', (data) => {
        const numeroProcesso = data['Numero do processo'] ? data['Numero do processo'].trim() : '';
        if (numeroProcesso !== '') {
            results.push({
                numero_processo: numeroProcesso,
                prazo_processual: data['Prazo processual'] ? data['Prazo processual'].trim() : '',
                classe_principal: data['Classe principal'] ? data['Classe principal'].trim() : '',
                assunto_principal: data['Assunto principal'] ? data['Assunto principal'].trim() : '',
                tarjas: data['Tarjas'] ? data['Tarjas'].trim() : '',
                data_intimacao: parseDate(data['Data da intimacao'])
            });
        }
    })
    .on('end', async () => {
      try {
        // =================================================================
        // NOVO BLOCO LÓGICO: FILTRAR PELO REGISTRO MAIS RECENTE
        // =================================================================
        const latestProcessesMap = new Map();

        for (const currentRow of results) {
          const numeroProcesso = currentRow.numero_processo;
          
          if (!latestProcessesMap.has(numeroProcesso)) {
            // Se o processo ainda não está no mapa, adiciona
            latestProcessesMap.set(numeroProcesso, currentRow);
          } else {
            // Se já existe, compara as datas de intimação
            const existingRow = latestProcessesMap.get(numeroProcesso);
            const existingDate = new Date(existingRow.data_intimacao);
            const currentDate = new Date(currentRow.data_intimacao);

            // Se a data do registro atual for mais recente, substitui o antigo
            if (currentDate > existingDate) {
              latestProcessesMap.set(numeroProcesso, currentRow);
            }
          }
        }
        // =================================================================
        // FIM DO NOVO BLOCO LÓGICO
        // =================================================================
        
        // Agora, o loop principal usará apenas os dados filtrados
        for (let row of latestProcessesMap.values()) {
          const existing = await Process.findOne({ where: { numero_processo: row.numero_processo } });
          
          if (existing) {
            const updateData = {};
            if (row.prazo_processual !== existing.prazo_processual) {
              updateData.prazo_processual = row.prazo_processual;
            }
            if (row.classe_principal !== existing.classe_principal) {
              updateData.classe_principal = row.classe_principal;
            }
            if (row.assunto_principal !== existing.assunto_principal) {
              updateData.assunto_principal = row.assunto_principal;
            }
            if (row.tarjas !== existing.tarjas) {
              updateData.tarjas = row.tarjas;
            }
            if (row.data_intimacao !== existing.data_intimacao) {
              const newDate = new Date(row.data_intimacao);
              const storedDate = new Date(existing.data_intimacao);
              if (newDate > storedDate) {
                updateData.data_intimacao = row.data_intimacao;
                updateData.cumprido = false;
                updateData.reiteracoes = (existing.cumprido === false ? (existing.reiteracoes || 0) + 1 : 1);
              }
            }
            if (Object.keys(updateData).length > 0) {
              await existing.update(updateData);
            }
          } else {
            await Process.create(row);
          }
        }

        await fsPromises.unlink(filePath);
        logger.info('CSV importado com sucesso', {
          totalRows: latestProcessesMap.size,
          userId: req.userId
        });
        res.send('CSV importado com sucesso. Registros mais recentes foram processados.');

      } catch (error) {
        logger.error('Erro ao salvar dados do CSV', {
          error: error.message,
          stack: error.stack,
          userId: req.userId,
          ip: getRealIP(req)
        });
        res.status(500).send('Erro ao salvar dados do CSV.');
      }
    })
    .on('error', (error) => {
      logger.error('Erro ao ler o arquivo CSV', {
        error: error.message,
        stack: error.stack,
        userId: req.userId,
        ip: getRealIP(req)
      });
      res.status(500).send('Erro ao ler o arquivo CSV.');
    });
};

// Função para converter filtros de query (que podem ser string ou array) para array
const parseArrayFilter = (val) => {
  if (!val) return null;
  return Array.isArray(val) ? val : [val];
};

// NOVO HELPER: Constrói a cláusula WHERE para os stats (ignora 'cumprido')
const buildStatsWhereClause = (req) => {
  const { search, classe, assunto, tarjas, userId, prazo } = req.query;
  const { loginType, userId: reqUserId } = req;

  const where = {};

  // --- Filtros Padrão (copiado de listProcesses) ---
  if (search) {
    where.numero_processo = { [Op.like]: `%${search}%` };
  }
  const classeFilter = parseArrayFilter(classe);
  if (classeFilter) {
    where.classe_principal = { [Op.in]: classeFilter };
  }
  const assuntoFilter = parseArrayFilter(assunto);
  if (assuntoFilter) {
    where.assunto_principal = { [Op.in]: assuntoFilter };
  }
  const tarjasFilter = parseArrayFilter(tarjas);
  if (tarjasFilter) {
    where.tarjas = { [Op.in]: tarjasFilter };
  }

  // --- Lógica de Segurança e Filtro de Usuário (copiado de listProcesses) ---
  const userIdFilter = parseArrayFilter(userId);
  const shouldIncludeNA = (req.query.includeNA === 'true');

  if (loginType !== 'admin_super') {
    where.userId = reqUserId;
  } else {
    let userWhereClause = null;
    if (userIdFilter && userIdFilter.length > 0) {
      userWhereClause = { [Op.in]: userIdFilter };
    }
    if (shouldIncludeNA) {
      where.userId = userWhereClause ? { [Op.or]: [userWhereClause, null] } : null;
    } else if (userWhereClause) {
      where.userId = userWhereClause;
    }
  }

  // --- Filtro de Prazo (copiado de listProcesses) ---
  if (prazo) {
    const prazoQuery = `DATE_ADD(data_intimacao, INTERVAL CAST(prazo_processual AS UNSIGNED) DAY)`;
    where.data_intimacao = { [Op.not]: null };
    where[Op.and] = (where[Op.and] || []);
    if (prazo === 'vencido') {
      where[Op.and].push(literal(`${prazoQuery} < CURDATE()`));
    } else if (prazo === 'a_vencer') {
      where[Op.and].push(literal(`${prazoQuery} >= CURDATE()`));
    }
  }

  return where;
};


// Lista processos com paginação, filtros e ordenação do lado do servidor
exports.listProcesses = async (req, res) => {
  try {
    // 1. EXTRAIR PARÂMETROS DA QUERY (VINDOS DO VUETIFY)
    const {
      page = 1,
      itemsPerPage = 10, // O v-data-table-server envia -1 para "Todos",
      sortBy = '[]',
      search,      // Busca por Nª do Processo
      classe,      // Filtro de array
      assunto,     // Filtro de array
      tarjas,      // Filtro de array
      userId,      // Filtro de array (só para admin_super)
      prazo,       // Filtro ('vencido' ou 'a_vencer')
      cumprido,     // Filtro (true, false, ou null)
      dataInicio,
      dataFim
    } = req.query;

    // 2. PREPARAR OPÇÕES BÁSICAS DE PAGINAÇÃO
    const limit = parseInt(itemsPerPage, 10);
    const isAll = limit === -1;
    const offset = (parseInt(page, 10) - 1) * limit;

    let options = {
      where: {},
      include: [{
        model: User,
        attributes: ['id', 'nome'] // Inclui o nome do usuário associado
      }],
      offset: isAll ? undefined : offset,
      limit: isAll ? undefined : limit,
      order: []
    };

    // 3. FILTRO DE SEGURANÇA (O MAIS IMPORTANTE)
    // Se o usuário não for 'admin_super', ele SÓ pode ver os processos dele.
    if (req.loginType !== 'admin_super') {
      options.where.userId = req.userId;
    }

    // 4. CONSTRUIR FILTROS DINÂMICOS (WHERE)

    // Filtro de Busca (pelo Nº do Processo)
    if (search) {
      options.where.numero_processo = { [Op.like]: `%${search}%` };
    }

    // Filtro de Status 'cumprido' (true, false, ou null para "Todos")
    if (cumprido && cumprido !== 'null') {
      options.where.cumprido = (cumprido === 'true');
    }

    // ✅ INÍCIO DO NOVO BLOCO DE FILTRO DE DATA
    // Adiciona o filtro de 'cumpridoDate'
    // Isso funciona mesmo se 'cumprido' não for 'true', 
    // resultando em 0 processos (o que está correto).
    if (dataInicio && dataFim) {
      // Filtra entre duas datas
      options.where.cumpridoDate = { [Op.between]: [dataInicio, dataFim] };
    } else if (dataInicio) {
      // Filtra a partir de uma data
      options.where.cumpridoDate = { [Op.gte]: dataInicio };
    } else if (dataFim) {
      // Filtra até uma data
      options.where.cumpridoDate = { [Op.lte]: dataFim };
    }
    // ✅ FIM DO NOVO BLOCO

    // Filtros de Array (classe, assunto, tarjas)
    const classeFilter = parseArrayFilter(classe);
    if (classeFilter) {
      options.where.classe_principal = { [Op.in]: classeFilter };
    }

    const assuntoFilter = parseArrayFilter(assunto);
    if (assuntoFilter) {
      options.where.assunto_principal = { [Op.in]: assuntoFilter };
    }

    const tarjasFilter = parseArrayFilter(tarjas);
    if (tarjasFilter) {
      options.where.tarjas = { [Op.in]: tarjasFilter };
    }

    // Filtro de 'userId' (Admin Super pode filtrar por usuários específicos)
    // Filtro de 'userId' (Admin Super pode filtrar por usuários específicos)
    // 1. Lê os novos parâmetros da query
    // 3. FILTROS DE SEGURANÇA E USUÁRIO (CORRIGIDO)
    const userIdFilter = parseArrayFilter(userId); 
    const shouldIncludeNA = (req.query.includeNA === 'true');

    if (req.loginType !== 'admin_super') {
      // É um admin_padrao. Ele SÓ pode ver os seus.
      // A lógica de 'Não Atribuído' ou filtro de outros usuários é ignorada.
      options.where.userId = req.userId;

    } else {
      // É um admin_super. Ele tem controle total dos filtros.
      let userWhereClause = null;

      if (userIdFilter && userIdFilter.length > 0) {
        userWhereClause = { [Op.in]: userIdFilter };
      }

      if (shouldIncludeNA) {
        if (userWhereClause) {
          // Filtro: (userId IN [1, 5] OR userId IS NULL)
          options.where.userId = {
            [Op.or]: [ userWhereClause, null ]
          };
        } else {
          // Filtro: (userId IS NULL)
          options.where.userId = null;
        }
      } else if (userWhereClause) {
        // Filtro: (userId IN [1, 5])
        options.where.userId = userWhereClause;
      }
      // Se nenhum filtro de usuário for aplicado, não adiciona 'where.userId'
    }

    // Filtro de Prazo ('vencido' ou 'a_vencer')
    if (prazo) {
      // Cria a query SQL literal para calcular a data de vencimento
      // (Assume que 'prazo_processual' é um NÚMERO em string, ex: "10")
      const prazoQuery = `DATE_ADD(data_intimacao, INTERVAL CAST(prazo_processual AS UNSIGNED) DAY)`;
      
      // Ignora processos sem data de intimação
      options.where.data_intimacao = { [Op.not]: null };
      
      // Inicializa 'Op.and' se não existir
      options.where[Op.and] = (options.where[Op.and] || []); 

      if (prazo === 'vencido') {
        // Vencido = Data de Vencimento < Hoje
        options.where[Op.and].push(literal(`${prazoQuery} < CURDATE()`));
      } else if (prazo === 'a_vencer') {
        // A Vencer = Data de Vencimento >= Hoje
        options.where[Op.and].push(literal(`${prazoQuery} >= CURDATE()`));
      }
    }

    // 5. CONSTRUIR ORDENAÇÃO DINÂMICA (ORDER BY)
    const sortConfig = JSON.parse(sortBy);
    if (sortConfig.length > 0) {
      options.order = sortConfig.map(s => {
        // Se a chave for 'user', ordena pela tabela 'User' associada
        if (s.key === 'user') {
          return [User, 'nome', s.order];
        }
        // Se a chave for 'prazoRestanteNum' (coluna virtual), ordena pelo cálculo
        if (s.key === 'prazoRestanteNum') {
          const prazoQuery = `DATE_ADD(data_intimacao, INTERVAL CAST(prazo_processual AS UNSIGNED) DAY)`;
          return [literal(prazoQuery), s.order];
        }
        // Ordenação padrão
        return [s.key, s.order];
      });
    } else {
      // Ordenação padrão se nenhuma for fornecida
      options.order = [['data_intimacao', 'DESC']];
    }

    // 6. EXECUTAR A CONSULTA E RETORNAR
    // Usa findAndCountAll para pegar as linhas da página ATUAL e o TOTAL de linhas
    const { count, rows } = await Process.findAndCountAll(options);

    res.json({
      items: rows,
      totalItems: count
    });

  } catch (error) {
    logger.error('Erro ao buscar processos com paginação', {
      error: error.message,
      stack: error.stack,
      userId: req.userId,
      ip: getRealIP(req)
    });
    res.status(500).json({ error: 'Erro interno do servidor', details: error.message });
  }
};

// Atribuição automática de processos
exports.assignProcesses = async (req, res) => {
  // Conforme descrição: "o sistema irá procurar cada processo na base de dados
  // e atribuir ao usuário que já tenha sido atribuído aquele processo alguma vez."
  // Na prática, seria necessário ter um histórico de atribuições. Como não temos,
  // deixamos a lógica de exemplo:
  res.send('Atribuição automática simulada (lógica não implementada).');
};

// Atribuição manual de um processo
exports.manualAssignProcess = async (req, res) => {
  const { numeroProcesso, matricula } = req.body;
  logger.info('Atribuição manual de processo', {
    numeroProcesso,
    matricula,
    userId: req.userId,
    ip: getRealIP(req)
  });

  try {
    const user = await User.findOne({ where: { matricula } });
    if (!user) {
      logger.warn('Usuário não encontrado para atribuição', {
        matricula,
        userId: req.userId
      });
      return res.status(404).send('Usuário não encontrado.');
    }

    // Remover espaços e padronizar, se necessário
    const numero = numeroProcesso.trim();

    const process = await Process.findOne({ where: { numero_processo: numero } });
    if (!process) {
      logger.warn('Processo não encontrado para atribuição', {
        numeroProcesso: numero,
        userId: req.userId
      });
      return res.status(404).send('Processo não encontrado.');
    }

    process.userId = user.id;
    await process.save();

    logger.info('Processo atribuído com sucesso', {
      processId: process.id,
      numeroProcesso: process.numero_processo,
      assignedTo: user.id,
      assignedBy: req.userId
    });
    res.send('Processo atribuído com sucesso.');
  } catch (error) {
    logger.error('Erro ao atribuir processo', {
      error: error.message,
      stack: error.stack,
      userId: req.userId,
      ip: getRealIP(req)
    });
    res.status(500).send('Erro ao atribuir processo.');
  }
};

// Pré-cadastro de usuário
exports.preCadastro = async (req, res) => {
  const { matricula, nome, senha, tipoCadastro, updateIfExists } = req.body;

  if (!matricula || !nome || !senha || !tipoCadastro) {
    return res.status(400).send('Campos obrigatórios ausentes.');
  }

  // ✅ VALIDAÇÃO DE FORÇA DA SENHA
  if (!isValidPassword(senha)) {
    logger.warn('Tentativa de cadastro com senha fraca', {
      matricula,
      userId: req.userId,
      ip: getRealIP(req)
    });
    return res.status(400).json({
      error: 'Senha deve ter pelo menos 8 caracteres, uma letra maiúscula, uma minúscula e um número'
    });
  }

  // Define as flags conforme o valor de tipoCadastro
  let admin_padrao = false;
  let admin_super = false;
  if (tipoCadastro === 'admin_padrao') {
    admin_padrao = true;
  } else if (tipoCadastro === 'admin_super') {
    admin_padrao = true;
    admin_super = true;
  }

  try {
    // CORREÇÃO: Criptografa a senha ANTES de qualquer ação (assíncrono)
    const senhaHasheada = await bcryptjs.hash(senha, 10);

    // Verifica se já existe um usuário com a mesma matrícula
    const existingUser = await User.findOne({ where: { matricula } });
    if (existingUser) {
      if (updateIfExists) {
        // Atualiza o usuário existente
        existingUser.nome = nome;
        // Para que o usuário realize o primeiro login, definimos a senha para o hash de "12345678"
        // e marcamos senha_padrao como verdadeiro
        existingUser.senha = await bcryptjs.hash('12345678', 10); // <-- CORRIGIDO
        existingUser.senha_padrao = true;
        existingUser.admin_padrao = admin_padrao;
        existingUser.admin_super = admin_super;
        await existingUser.save();
        return res.send('Usuário atualizado com sucesso. Senha: 12345678');
      } else {
        return res.status(409).json({
          error: 'Usuário já cadastrado.',
          updatePrompt: 'Deseja atualizar o usuário existente? A senha será: 12345678'
        });
      }
    }

    // Se não existir, cria o usuário com a senha já criptografada
    await User.create({
      matricula,
      nome,
      senha: senhaHasheada, // <-- CORRIGIDO
      admin_padrao,
      admin_super
    });
    logger.info('Pré-cadastro realizado com sucesso', {
      matricula,
      tipoCadastro,
      createdBy: req.userId
    });
    res.send('Pré-cadastro realizado com sucesso.');
  } catch (error) {
    logger.error('Erro ao realizar pré-cadastro', {
      error: error.message,
      stack: error.stack,
      matricula,
      userId: req.userId,
      ip: getRealIP(req)
    });
    res.status(500).send('Erro ao realizar pré-cadastro.');
  }
};

// Reset de senha
exports.resetPassword = async (req, res) => {
  const { matricula } = req.body;

  if (!matricula) {
    return res.status(400).send('Matrícula obrigatória.');
  }

  try {
    const user = await User.findOne({ where: { matricula } });
    if (!user) {
      return res.status(404).send('Usuário não encontrado.');
    }

    // CORREÇÃO: Define a senha para o HASH de "12345678" (assíncrono)
    user.senha = await bcryptjs.hash('12345678', 10);
    user.senha_padrao = 1;  // Marca como senha padrão após reset
    await user.save();

    logger.info('Senha resetada com sucesso', {
      matricula,
      userId: user.id,
      resetBy: req.userId,
      ip: getRealIP(req)
    });
    res.send('Senha resetada com sucesso para "12345678".');
  } catch (error) {
    logger.error('Erro ao resetar senha', {
      error: error.message,
      stack: error.stack,
      matricula,
      userId: req.userId,
      ip: getRealIP(req)
    });
    res.status(500).send('Erro ao resetar senha.');
  }
};

// No seu controller (adminController.js)
exports.deleteMatricula = async (req, res) => {
  const { matricula } = req.body;
  if (!matricula) {
    return res.status(400).json({ error: 'Matrícula obrigatória.' });
  }
  try {
    const user = await User.findOne({ where: { matricula } });
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    // --- ✅ INÍCIO DA NOVA VALIDAÇÃO ---
    // 1. Contar quantos processos estão atribuídos a este usuário
    const count = await Process.count({
      where: { userId: user.id }
    });
    logger.info('Verificando processos atribuídos para exclusão de usuário', {
      matricula,
      userId: user.id,
      processCount: count
    });
    // 2. Se a contagem for maior que zero, bloquear a exclusão
    if (count > 0) {
      logger.warn('Tentativa de exclusão de usuário com processos atribuídos', {
        matricula,
        userId: user.id,
        processCount: count,
        requestedBy: req.userId
      });
      // 409 Conflict é o status HTTP correto para esta situação
      return res.status(409).json({
        error: `Este usuário não pode ser excluído pois ainda possui ${count} processo(s) atribuído(s).`
      });
    }
    // --- FIM DA NOVA VALIDAÇÃO ---

    // 3. Se a contagem for 0, prosseguir com a exclusão
    await user.destroy();
    logger.info('Usuário deletado com sucesso', {
      matricula,
      deletedBy: req.userId,
      ip: getRealIP(req)
    });
    res.status(200).json({ message: 'Usuário deletado com sucesso.' });

  } catch (error) {
    logger.error('Erro ao deletar usuário', {
      error: error.message,
      stack: error.stack,
      matricula,
      userId: req.userId,
      ip: getRealIP(req)
    });
    // Adiciona um 'catch' genérico para erros de constraint
    if (error.name === 'SequelizeForeignKeyConstraintError') {
         return res.status(409).json({ error: 'Este usuário não pode ser excluído pois está referenciado em outros registros.' });
    }
    res.status(500).json({ error: 'Erro interno ao deletar usuário.' });
  }
};

// Atribuição em Massa: atualiza o campo userId para os processos selecionados
exports.bulkAssign = async (req, res) => {
  try {
    const { processIds, matricula } = req.body;
    // Procura o usuário destino pela matrícula
    const user = await User.findOne({ where: { matricula } });
    if (!user) {
      return res.status(404).send("Usuário destino não encontrado.");
    }
    // Atualiza os processos cujo id esteja no array processIds
    await Process.update({ userId: user.id }, {
      where: {
        id: processIds
      }
    });
    logger.info('Atribuição em massa realizada', {
      processCount: processIds.length,
      assignedTo: user.id,
      matricula,
      assignedBy: req.userId,
      ip: getRealIP(req)
    });
    res.send("Atribuição em massa realizada com sucesso.");
  } catch (error) {
    logger.error('Erro ao realizar atribuição em massa', {
      error: error.message,
      stack: error.stack,
      userId: req.userId,
      ip: getRealIP(req)
    });
    res.status(500).send("Erro ao realizar atribuição em massa.");
  }
};

// Exclusão em Massa: remove os processos selecionados do banco de dados
exports.bulkDelete = async (req, res) => {
  try {
    const { processIds } = req.body;
    await Process.destroy({
      where: {
        id: processIds
      }
    });
    logger.info('Exclusão em massa realizada', {
      processCount: processIds.length,
      deletedBy: req.userId,
      ip: getRealIP(req)
    });
    res.send("Exclusão em massa realizada com sucesso.");
  } catch (error) {
    logger.error('Erro ao realizar exclusão em massa', {
      error: error.message,
      stack: error.stack,
      userId: req.userId,
      ip: getRealIP(req)
    });
    res.status(500).send("Erro ao realizar exclusão em massa.");
  }
};

// Marcar como Cumprido em Massa: atualiza os processos selecionados para cumprido e zera o contador de reiteracoes
exports.bulkCumprido = async (req, res) => {
  try {
    const { processIds } = req.body;
    await Process.update({ cumprido: true, reiteracoes: 0 }, {
      where: {
        id: processIds
      }
    });
    logger.info('Processos marcados como cumpridos em massa', {
      processCount: processIds.length,
      markedBy: req.userId,
      ip: getRealIP(req)
    });
    res.send("Processos marcados como cumpridos com sucesso.");
  } catch (error) {
    logger.error('Erro ao atualizar status em massa', {
      error: error.message,
      stack: error.stack,
      userId: req.userId,
      ip: getRealIP(req)
    });
    res.status(500).send("Erro ao atualizar status em massa.");
  }
};

// Atualiza o número de reiterações de uma intimação
exports.updateIntim = async (req, res) => {
  const { processId, reiteracoes } = req.body;
  try {
    const process = await Process.findByPk(processId);
    if (!process) {
      return res.status(404).send('Processo não encontrado.');
    }
    process.reiteracoes = reiteracoes;
    await process.save();
    logger.info('Número de reiterações atualizado', {
      processId,
      reiteracoes,
      updatedBy: req.userId
    });
    res.send('Número de intim atualizado com sucesso.');
  } catch (error) {
    logger.error('Erro ao atualizar número de intim', {
      error: error.message,
      stack: error.stack,
      processId,
      userId: req.userId,
      ip: getRealIP(req)
    });
    res.status(500).send('Erro ao atualizar número de intim.');
  }
};

// Lista usuários (apenas matrícula e nome) - COM PAGINAÇÃO
exports.listUsers = async (req, res) => {
  try {
    // ✅ PAGINAÇÃO ADICIONADA
    const { limit = 1000, offset = 0 } = req.query;

    const users = await User.findAll({
      attributes: ['id', 'matricula', 'nome'],
      limit: parseInt(limit, 10),
      offset: parseInt(offset, 10),
      order: [['nome', 'ASC']]
    });

    logger.info('Lista de usuários consultada', {
      count: users.length,
      requestedBy: req.userId
    });
    res.json(users);
  } catch (error) {
    logger.error('Erro ao buscar usuários', {
      error: error.message,
      stack: error.stack,
      userId: req.userId,
      ip: getRealIP(req)
    });
    res.status(500).send('Erro ao buscar usuários.');
  }
};


exports.updateObservacoes = async (req, res) => {
  try {
    const { id } = req.params;
    const { observacoes } = req.body;

    // Encontra o processo pelo ID
    const processo = await Process.findByPk(id);

    if (!processo) {
      return res.status(404).json({ error: 'Processo não encontrado' });
    }

    // Atualiza o campo observacoes
    processo.observacoes = observacoes || ''; // Garante que não seja null
    
    // Salva a mudança no banco de dados
    await processo.save();

    // Retorna o processo atualizado
    res.status(200).json(processo);

  } catch (error) {
    logger.error('Erro ao salvar observação', {
      error: error.message,
      stack: error.stack,
      processId: req.params.id,
      userId: req.userId,
      ip: getRealIP(req)
    });
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

// 2. Marca como cumprido (PATCH /api/admin/processes/:id/cumprir)
exports.markAsCumprido = async (req, res) => {
  try {
    const { id } = req.params;
    const processo = await Process.findByPk(id);

    if (!processo) {
      return res.status(404).json({ error: 'Processo não encontrado' });
    }

    // Atualiza os campos
    processo.cumprido = true;
    processo.cumpridoDate = new Date(); // Define a data de hoje

    // Salva a mudança no banco de dados
    await processo.save();

    // IMPORTANTE: Recarrega o processo com o "User"
    // O frontend precisa do processo completo de volta
    const processoAtualizado = await Process.findByPk(id, {
      include: [{ model: User, attributes: ['nome'] }] // Ajuste 'include' conforme sua rota 'listProcesses'
    });

    res.status(200).json(processoAtualizado);

  } catch (error) {
    logger.error('Erro ao marcar como cumprido', {
      error: error.message,
      stack: error.stack,
      processId: req.params.id,
      userId: req.userId,
      ip: getRealIP(req)
    });
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

// 3. Desmarca como cumprido (PATCH /api/admin/processes/:id/desfazer-cumprir)
exports.unmarkAsCumprido = async (req, res) => {
  try {
    const { id } = req.params;
    const processo = await Process.findByPk(id);

    if (!processo) {
      return res.status(404).json({ error: 'Processo não encontrado' });
    }

    // Define os campos de volta para o padrão "não cumprido"
    processo.cumprido = false;
    processo.cumpridoDate = null; // Remove a data de cumprimento

    // Salva a mudança no banco de dados
    await processo.save();

    // Recarrega o processo com o "User" para enviar de volta ao frontend
    const processoAtualizado = await Process.findByPk(id, {
      include: [{ model: User, attributes: ['nome'] }]
    });

    res.status(200).json(processoAtualizado);

  } catch (error) {
    logger.error('Erro ao desmarcar como cumprido', {
      error: error.message,
      stack: error.stack,
      processId: req.params.id,
      userId: req.userId,
      ip: getRealIP(req)
    });
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

// NOVA FUNÇÃO: Retorna a contagem de processos não atribuídos
exports.getUnassignedCount = async (req, res) => {
  try {
    // Conta apenas processos onde o userId (chave estrangeira) é NULL
    const count = await Process.count({
      where: { 
        userId: null,
        cumprido: false // <-- ✅ CORREÇÃO ADICIONADA
      }
    });
    
    // Retorna a contagem
    res.status(200).json({ count });

  } catch (error) {
    logger.error('Erro ao contar processos não atribuídos', {
      error: error.message,
      stack: error.stack,
      userId: req.userId,
      ip: getRealIP(req)
    });
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};


// NOVO ENDPOINT: Calcula todas as estatísticas do dashboard no BDD
exports.getDashboardStats = async (req, res) => {
  try {
    // 1. Constrói a cláusula WHERE base (reaproveita todos os filtros da tela)
    const baseWhere = buildStatsWhereClause(req);
    
    // 2. Cria WHEREs específicos para 'pendentes' e 'cumpridos'
    const pendingWhere = { ...baseWhere, cumprido: false };
    
    // Data limite para "últimos 30 dias"
    const dataLimite = new Date();
    dataLimite.setDate(dataLimite.getDate() - 30);

    // ✅ ADICIONE A LEITURA DAS DATAS AQUI
    const { dataInicio, dataFim } = req.query;


    const cumpridoWhere = { 
      ...baseWhere, 
      cumprido: true,
    };

    // ✅ INÍCIO DO NOVO BLOCO DE FILTRO DE DATA
    // Adiciona a lógica de data no 'cumpridoWhere'
    if (dataInicio && dataFim) {
      cumpridoWhere.cumpridoDate = { [Op.between]: [dataInicio, dataFim] };
    } else if (dataInicio) {
      cumpridoWhere.cumpridoDate = { [Op.gte]: dataInicio };
    } else if (dataFim) {
      cumpridoWhere.cumpridoDate = { [Op.lte]: dataFim };
    } else {
      // Comportamento padrão (se nenhuma data for enviada):
      // O gráfico de CUMPRIDOS mostra os últimos 30 dias.
      cumpridoWhere.cumpridoDate = { [Op.gte]: dataLimite };
    }
    // ✅ FIM DO NOVO BLOCO
    
    // --- 3. Define as consultas de "Prazos" (para o StatsGrid) ---
    // (Estas consultas são complexas e usam SQL literal)
    const prazoQuery = `DATE_ADD(data_intimacao, INTERVAL CAST(prazo_processual AS UNSIGNED) DAY)`;
    const vencidoWhere = { ...pendingWhere, data_intimacao: { [Op.not]: null }, [Op.and]: literal(`${prazoQuery} < CURDATE()`) };
    const p10dWhere = { ...pendingWhere, data_intimacao: { [Op.not]: null }, [Op.and]: literal(`${prazoQuery} BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 10 DAY)`) };
    const p30dWhere = { ...pendingWhere, data_intimacao: { [Op.not]: null }, [Op.and]: literal(`${prazoQuery} BETWEEN DATE_ADD(CURDATE(), INTERVAL 11 DAY) AND DATE_ADD(CURDATE(), INTERVAL 30 DAY)`) };

    // --- 4. Define as consultas de "Assunto" (para o StatsGrid) ---
    const assuntosChave = ['Homicídio', 'Roubo', 'Furto', 'Estelionato', 'Tráfico'];
    const assuntoQueries = assuntosChave.map(assunto => 
      Process.count({ where: { ...pendingWhere, assunto_principal: { [Op.like]: `%${assunto}%` } } })
    );

    // --- 5. Executa todas as consultas em PARALELO ---
    const [
      totalPendentes,
      byUser,
      byPrazo_vencidos,
      byPrazo_p10d,
      byPrazo_p30d,
      cumpridos30d,
      ...assuntoCounts // O restante dos resultados de 'assuntoQueries'
    ] = await Promise.all([
      // Query 1: Total de pendentes
      Process.count({ where: pendingWhere }),
      
      // Query 2: Pendentes por Usuário (StatsGrid)
      Process.findAll({
        where: pendingWhere,
        group: ['userId', 'User.id', 'User.nome'],
        attributes: ['userId', [sequelize.fn('COUNT', 'id'), 'count']],
        include: [{ model: User, attributes: ['nome'] }],
        order: [[sequelize.fn('COUNT', 'id'), 'DESC']],
        limit: 11 // Limita aos 11 maiores
      }),
      
      // Query 3: Prazos (vencidos, p10d, p30d)
      Process.count({ where: vencidoWhere }),
      Process.count({ where: p10dWhere }),
      Process.count({ where: p30dWhere }),
      
      // Query 4: Cumpridos por Usuário (CumpridosChart)
      Process.findAll({
        where: cumpridoWhere,
        group: ['userId', 'User.id', 'User.nome'],
        attributes: ['userId', [sequelize.fn('COUNT', 'id'), 'count']],
        include: [{ model: User, attributes: ['nome'] }],
        order: [[sequelize.fn('COUNT', 'id'), 'DESC']]
      }),
      
      // Queries 5...N: Contagem por Assunto
      ...assuntoQueries
    ]);

    // --- 6. Formata os resultados para o frontend ---
    
    // Mapeia 'byUser'
    const byUserFormatted = byUser.map(item => ({
      nome: item.User ? item.User.nome : 'N.A.',
      count: item.get('count') // .get('count') é necessário para 'group by'
    }));
    
    // Mapeia 'cumpridos30d'
    const cumpridos30dFormatted = cumpridos30d.map(item => ({
      nome: item.User ? item.User.nome : 'N.A.',
      count: item.get('count')
    }));

    // Mapeia 'byAssunto'
    const byAssuntoFormatted = assuntosChave.map((assunto, index) => ({
      nome: assunto,
      count: assuntoCounts[index]
    }));

    // --- 7. Envia o JSON final ---
    res.json({
      totalPendentes,
      byUser: byUserFormatted,
      byPrazo: {
        vencidos: byPrazo_vencidos,
        p10d: byPrazo_p10d,
        p30d: byPrazo_p30d
      },
      byAssunto: byAssuntoFormatted,
      cumpridos30d: cumpridos30dFormatted
    });

  } catch (error) {
    logger.error('Erro ao buscar estatísticas do dashboard', {
      error: error.message,
      stack: error.stack,
      userId: req.userId,
      ip: getRealIP(req)
    });
    res.status(500).json({ error: 'Erro interno do servidor', details: error.message });
  }
};