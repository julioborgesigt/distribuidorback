// Script para limpar índices duplicados automaticamente
// Execute: node scripts/fix-indexes.js

require('dotenv').config();
const mysql = require('mysql2/promise');

async function fixIndexes() {
  console.log('🔧 Iniciando limpeza de índices duplicados...\n');

  // Criar conexão
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
  });

  console.log('✅ Conectado ao banco de dados\n');

  try {
    // ===== TABELA USUARIOS =====
    console.log('📋 Limpando índices da tabela USUARIOS...');

    // 1. Listar todos os índices
    const [usuariosIndexes] = await connection.query(`
      SELECT DISTINCT INDEX_NAME
      FROM INFORMATION_SCHEMA.STATISTICS
      WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'usuarios' AND INDEX_NAME != 'PRIMARY'
    `, [process.env.DB_NAME]);

    console.log(`   Encontrados ${usuariosIndexes.length} índices (exceto PRIMARY)`);

    // 2. Remover todos os índices (exceto PRIMARY)
    for (const index of usuariosIndexes) {
      const indexName = index.INDEX_NAME;
      try {
        await connection.query(`ALTER TABLE usuarios DROP INDEX \`${indexName}\``);
        console.log(`   ✓ Removido: ${indexName}`);
      } catch (error) {
        console.log(`   ⚠ Não foi possível remover ${indexName}: ${error.message}`);
      }
    }

    // 3. Criar apenas UM índice UNIQUE para matricula
    try {
      await connection.query(`ALTER TABLE usuarios ADD UNIQUE INDEX idx_usuarios_matricula (matricula)`);
      console.log('   ✓ Criado índice UNIQUE: idx_usuarios_matricula');
    } catch (error) {
      if (error.code === 'ER_DUP_KEYNAME') {
        console.log('   ⚠ Índice idx_usuarios_matricula já existe');
      } else {
        throw error;
      }
    }

    console.log('✅ Tabela USUARIOS: OK\n');

    // ===== TABELA PROCESSOS =====
    console.log('📋 Limpando índices da tabela PROCESSOS...');

    // 1. Listar todos os índices
    const [processosIndexes] = await connection.query(`
      SELECT DISTINCT INDEX_NAME
      FROM INFORMATION_SCHEMA.STATISTICS
      WHERE TABLE_SCHEMA = ?
        AND TABLE_NAME = 'processos'
        AND INDEX_NAME != 'PRIMARY'
        AND INDEX_NAME NOT LIKE 'FK%'
        AND INDEX_NAME NOT LIKE '%userId%'
    `, [process.env.DB_NAME]);

    console.log(`   Encontrados ${processosIndexes.length} índices (exceto PRIMARY e FK)`);

    // 2. Remover índices (exceto PRIMARY e FK)
    for (const index of processosIndexes) {
      const indexName = index.INDEX_NAME;
      try {
        await connection.query(`ALTER TABLE processos DROP INDEX \`${indexName}\``);
        console.log(`   ✓ Removido: ${indexName}`);
      } catch (error) {
        console.log(`   ⚠ Não foi possível remover ${indexName}: ${error.message}`);
      }
    }

    // 3. Criar apenas UM índice UNIQUE para numero_processo
    try {
      await connection.query(`ALTER TABLE processos ADD UNIQUE INDEX idx_processos_numero_processo (numero_processo)`);
      console.log('   ✓ Criado índice UNIQUE: idx_processos_numero_processo');
    } catch (error) {
      if (error.code === 'ER_DUP_KEYNAME') {
        console.log('   ⚠ Índice idx_processos_numero_processo já existe');
      } else {
        throw error;
      }
    }

    console.log('✅ Tabela PROCESSOS: OK\n');

    // ===== VERIFICAÇÃO FINAL =====
    console.log('📊 Verificação final...');

    const [resultado] = await connection.query(`
      SELECT
        TABLE_NAME,
        COUNT(DISTINCT INDEX_NAME) as total_indices
      FROM
        INFORMATION_SCHEMA.STATISTICS
      WHERE
        TABLE_SCHEMA = ?
        AND TABLE_NAME IN ('usuarios', 'processos')
      GROUP BY
        TABLE_NAME
    `, [process.env.DB_NAME]);

    console.log('\n📈 Quantidade de índices por tabela:');
    resultado.forEach(row => {
      console.log(`   ${row.TABLE_NAME}: ${row.total_indices} índices`);
    });

    console.log('\n✅ CONCLUÍDO! Os índices foram limpos com sucesso.');
    console.log('\n💡 Agora você pode iniciar o servidor normalmente:');
    console.log('   node server.js\n');

  } catch (error) {
    console.error('\n❌ ERRO:', error.message);
    console.error('\nDetalhes:', error);
    process.exit(1);
  } finally {
    await connection.end();
  }
}

// Executar
fixIndexes().catch(error => {
  console.error('❌ Erro fatal:', error);
  process.exit(1);
});
