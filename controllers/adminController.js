// /controllers/adminController.js (Limpo)

// const path = require('path'); // REMOVIDO
const fs = require('fs');
const csvParser = require('csv-parser');
const { User, Process } = require('../models');
const iconv = require('iconv-lite');
const bcryptjs = require('bcryptjs');
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

        fs.unlinkSync(filePath);
        res.send('CSV importado com sucesso. Registros mais recentes foram processados.');

      } catch (error) {
        console.error(error);
        res.status(500).send('Erro ao salvar dados do CSV.');
      }
    })
    .on('error', (error) => {
      console.error(error);
      res.status(500).send('Erro ao ler o arquivo CSV.');
    });
};

// Lista todos os processos em formato JSON
exports.listProcesses = async (req, res) => {
  try {
    console.log("listProcesses: loginType =", req.loginType);
    let processes;
    if (req.loginType === 'admin_super') {
      // Se o login foi feito como admin_super, lista todos os processos
      processes = await Process.findAll({ include: User });
    } else {
      // Para admin_padrao (ou outro), lista apenas os processos atribuídos ao usuário logado
      processes = await Process.findAll({ 
        where: { userId: req.userId },
        include: User 
      });
    }
    res.json(processes);
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro ao buscar processos.');
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
  console.log("Dados recebidos:", req.body);

  try {
    const user = await User.findOne({ where: { matricula } });
    if (!user) {
      console.log("Usuário não encontrado para a matrícula:", matricula);
      return res.status(404).send('Usuário não encontrado.');
    }

    // Remover espaços e padronizar, se necessário
    const numero = numeroProcesso.trim();

    const process = await Process.findOne({ where: { numero_processo: numero } });
    if (!process) {
      console.log("Processo não encontrado para o número:", numero);
      return res.status(404).send('Processo não encontrado.');
    }

    process.userId = user.id;
    await process.save();

    console.log("Processo atualizado:", process);
    res.send('Processo atribuído com sucesso.');
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro ao atribuir processo.');
  }
};

// Pré-cadastro de usuário
exports.preCadastro = async (req, res) => {
  const { matricula, nome, senha, tipoCadastro, updateIfExists } = req.body;

  if (!matricula || !nome || !senha || !tipoCadastro) {
    return res.status(400).send('Campos obrigatórios ausentes.');
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
    // CORREÇÃO: Criptografa a senha ANTES de qualquer ação
    const senhaHasheada = bcryptjs.hashSync(senha, 10);

    // Verifica se já existe um usuário com a mesma matrícula
    const existingUser = await User.findOne({ where: { matricula } });
    if (existingUser) {
      if (updateIfExists) {
        // Atualiza o usuário existente
        existingUser.nome = nome;
        // Para que o usuário realize o primeiro login, definimos a senha para o hash de "12345678"
        // e marcamos senha_padrao como verdadeiro
        existingUser.senha = bcryptjs.hashSync('12345678', 10); // <-- CORRIGIDO
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
    res.send('Pré-cadastro realizado com sucesso.');
  } catch (error) {
    console.error(error);
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

    // CORREÇÃO: Define a senha para o HASH de "12345678"
    user.senha = bcryptjs.hashSync('12345678', 10); 
    user.senha_padrao = 1;  // Marca como senha padrão após reset
    await user.save();

    res.send('Senha resetada com sucesso para "12345678".');
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro ao resetar senha.');
  }
};

// No seu controller (adminController.js)
exports.deleteMatricula = async (req, res) => {
  const { matricula } = req.body;
  if (!matricula) {
    return res.status(400).send('Matrícula obrigatória.');
  }
  try {
    const user = await User.findOne({ where: { matricula } });
    if (!user) {
      return res.status(404).send('Usuário não encontrado.');
    }
    await user.destroy();
    res.send('Usuário deletado com sucesso.');
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro ao deletar usuário.');
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
    res.send("Atribuição em massa realizada com sucesso.");
  } catch (error) {
    console.error(error);
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
    res.send("Exclusão em massa realizada com sucesso.");
  } catch (error) {
    console.error(error);
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
    res.send("Processos marcados como cumpridos com sucesso.");
  } catch (error) {
    console.error(error);
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
    res.send('Número de intim atualizado com sucesso.');
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro ao atualizar número de intim.');
  }
};

// Lista usuários (apenas matrícula e nome)
exports.listUsers = async (req, res) => {
  try {
    const users = await User.findAll({ attributes: ['matricula', 'nome'] });
    res.json(users);
  } catch (error) {
    console.error(error);
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
    console.error('Erro ao salvar observação:', error);
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
    console.error('Erro ao marcar como cumprido:', error);
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
    console.error('Erro ao desmarcar como cumprido:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};