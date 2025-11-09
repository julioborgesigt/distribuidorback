#!/usr/bin/env node

/**
 * Script para adicionar índices de performance ao banco de dados
 * Melhora consultas em campos frequentemente usados
 *
 * USO:
 *   node scripts/add-performance-indexes.js
 *
 * ATENÇÃO:
 *   - Execute este script APÓS limpar índices duplicados
 *   - Pode demorar alguns minutos em tabelas grandes
 */

require('dotenv').config();
const mysql = require('mysql2/promise');

const config = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: 3306
};

// Índices a serem criados
const indexes = [
  // Processos
  {
    table: 'processos',
    name: 'idx_cumprido',
    columns: ['cumprido'],
    description: 'Índice para campo cumprido (usado em quase todas as queries)'
  },
  {
    table: 'processos',
    name: 'idx_data_intimacao',
    columns: ['data_intimacao'],
    description: 'Índice para data_intimacao (usado em filtros de prazo)'
  },
  {
    table: 'processos',
    name: 'idx_cumprido_date',
    columns: ['cumpridoDate'],
    description: 'Índice para cumpridoDate (usado em dashboard)'
  },
  {
    table: 'processos',
    name: 'idx_user_cumprido',
    columns: ['userId', 'cumprido'],
    description: 'Índice composto userId + cumprido (otimiza queries por usuário)'
  },
  {
    table: 'processos',
    name: 'idx_classe_principal',
    columns: ['classe_principal'],
    description: 'Índice para classe_principal (usado em filtros)'
  },
  {
    table: 'processos',
    name: 'idx_assunto_principal',
    columns: ['assunto_principal'],
    description: 'Índice para assunto_principal (usado em filtros)'
  },
  // Usuarios
  {
    table: 'usuarios',
    name: 'idx_nome',
    columns: ['nome'],
    description: 'Índice para nome (usado em ORDER BY)'
  }
];

async function checkIndexExists(connection, tableName, indexName) {
  const [rows] = await connection.query(
    `SHOW INDEX FROM ${tableName} WHERE Key_name = ?`,
    [indexName]
  );
  return rows.length > 0;
}

async function createIndex(connection, index) {
  const exists = await checkIndexExists(connection, index.table, index.name);

  if (exists) {
    console.log(`✓ Índice ${index.name} já existe em ${index.table}`);
    return false;
  }

  const columns = index.columns.join(', ');
  const sql = `CREATE INDEX ${index.name} ON ${index.table}(${columns})`;

  console.log(`→ Criando ${index.name} em ${index.table}...`);
  console.log(`  ${index.description}`);

  await connection.query(sql);
  console.log(`✓ Índice ${index.name} criado com sucesso!`);
  return true;
}

async function main() {
  console.log('═══════════════════════════════════════════════════════');
  console.log('  ADICIONAR ÍNDICES DE PERFORMANCE');
  console.log('═══════════════════════════════════════════════════════\n');

  let connection;

  try {
    // Conectar ao banco
    console.log('→ Conectando ao banco de dados...');
    connection = await mysql.createConnection(config);
    console.log('✓ Conectado com sucesso!\n');

    // Criar índices
    let created = 0;
    let existing = 0;

    for (const index of indexes) {
      const wasCreated = await createIndex(connection, index);
      if (wasCreated) {
        created++;
      } else {
        existing++;
      }
      console.log('');
    }

    // Resumo
    console.log('═══════════════════════════════════════════════════════');
    console.log('  RESUMO');
    console.log('═══════════════════════════════════════════════════════');
    console.log(`Índices criados:   ${created}`);
    console.log(`Já existentes:     ${existing}`);
    console.log(`Total processado:  ${created + existing}`);
    console.log('═══════════════════════════════════════════════════════\n');

    if (created > 0) {
      console.log('✓ Índices de performance adicionados com sucesso!');
      console.log('✓ Consultas ao banco devem estar mais rápidas agora.');
    } else {
      console.log('✓ Todos os índices já existiam. Nada a fazer.');
    }

  } catch (error) {
    console.error('\n✗ ERRO:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n✓ Conexão fechada.\n');
    }
  }
}

// Verificar se as variáveis de ambiente estão definidas
if (!config.host || !config.user || !config.password || !config.database) {
  console.error('✗ ERRO: Variáveis de ambiente não configuradas');
  console.error('Certifique-se de que DB_HOST, DB_USER, DB_PASS e DB_NAME estão definidas no .env');
  process.exit(1);
}

main();
