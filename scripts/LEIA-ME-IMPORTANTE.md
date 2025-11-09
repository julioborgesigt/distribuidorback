# 🚨 ERRO: "Too many keys specified; max 64 keys allowed"

## Problema

O MySQL está reclamando que há muitos índices na tabela `usuarios` ou `processos`. Isso aconteceu porque o Sequelize em modo `alter: true` tentou adicionar o índice UNIQUE várias vezes, criando índices duplicados.

---

## ✅ SOLUÇÃO PASSO A PASSO

### Passo 1: Conectar ao Banco de Dados MySQL

Você pode usar qualquer cliente MySQL (phpMyAdmin, MySQL Workbench, linha de comando, etc.)

**Via linha de comando:**
```bash
mysql -h sao.domcloud.co -u distribuidor -p
# Digite a senha quando solicitado
```

### Passo 2: Selecionar o Banco de Dados

```sql
USE distribuidor_proc;
```

### Passo 3: Verificar Quantos Índices Existem

```sql
-- Ver índices da tabela usuarios
SHOW INDEX FROM usuarios;

-- Ver índices da tabela processos
SHOW INDEX FROM processos;
```

Se você ver MUITOS índices duplicados (usuarios_matricula, usuarios_matricula_2, usuarios_matricula_3, etc.), você precisa limpá-los.

---

## 🔧 LIMPAR ÍNDICES DUPLICADOS

### Opção 1: Script Automatizado (RECOMENDADO)

Execute este script SQL que remove TODOS os índices exceto PRIMARY KEY e recria apenas os necessários:

```sql
-- ===== LIMPEZA DA TABELA USUARIOS =====

-- 1. Ver todos os índices atuais
SELECT DISTINCT INDEX_NAME
FROM INFORMATION_SCHEMA.STATISTICS
WHERE TABLE_SCHEMA = 'distribuidor_proc'
  AND TABLE_NAME = 'usuarios'
  AND INDEX_NAME != 'PRIMARY';

-- 2. Remover TODOS os índices (exceto PRIMARY)
-- Copie e execute cada linha que aparecer no resultado acima
-- Exemplo:
-- ALTER TABLE usuarios DROP INDEX usuarios_matricula;
-- ALTER TABLE usuarios DROP INDEX usuarios_matricula_2;
-- ALTER TABLE usuarios DROP INDEX usuarios_matricula_3;
-- ... e assim por diante

-- 3. Criar APENAS UM índice UNIQUE para matricula
ALTER TABLE usuarios ADD UNIQUE INDEX idx_usuarios_matricula (matricula);

-- ===== LIMPEZA DA TABELA PROCESSOS =====

-- 1. Ver todos os índices atuais
SELECT DISTINCT INDEX_NAME
FROM INFORMATION_SCHEMA.STATISTICS
WHERE TABLE_SCHEMA = 'distribuidor_proc'
  AND TABLE_NAME = 'processos'
  AND INDEX_NAME != 'PRIMARY';

-- 2. Remover TODOS os índices (exceto PRIMARY e FK)
-- Copie e execute cada linha, mas MANTENHA os índices que começam com 'FK' ou 'userId'
-- Exemplo:
-- ALTER TABLE processos DROP INDEX processos_numero_processo;
-- ALTER TABLE processos DROP INDEX processos_numero_processo_2;
-- ... e assim por diante

-- 3. Criar APENAS UM índice UNIQUE para numero_processo
ALTER TABLE processos ADD UNIQUE INDEX idx_processos_numero_processo (numero_processo);
```

### Opção 2: Script em Lote (Mais Rápido)

Se tiver MUITOS índices, você pode gerar e executar um script em lote:

```sql
-- Gerar comandos DROP para usuarios (copie o resultado e execute)
SELECT CONCAT('ALTER TABLE usuarios DROP INDEX ', INDEX_NAME, ';') AS comando
FROM INFORMATION_SCHEMA.STATISTICS
WHERE TABLE_SCHEMA = 'distribuidor_proc'
  AND TABLE_NAME = 'usuarios'
  AND INDEX_NAME != 'PRIMARY';

-- Gerar comandos DROP para processos (copie o resultado e execute)
SELECT CONCAT('ALTER TABLE processos DROP INDEX ', INDEX_NAME, ';') AS comando
FROM INFORMATION_SCHEMA.STATISTICS
WHERE TABLE_SCHEMA = 'distribuidor_proc'
  AND TABLE_NAME = 'processos'
  AND INDEX_NAME != 'PRIMARY'
  AND INDEX_NAME NOT LIKE 'FK%'
  AND INDEX_NAME NOT LIKE '%userId%';
```

Copie todos os comandos gerados e execute-os de uma vez.

### Opção 3: Recriar as Tabelas (CUIDADO: APAGA DADOS!)

**⚠️ ATENÇÃO: Isso vai APAGAR TODOS OS DADOS!**

Use apenas se você tiver backup ou se o banco estiver vazio:

```sql
-- BACKUP PRIMEIRO!
CREATE TABLE usuarios_backup AS SELECT * FROM usuarios;
CREATE TABLE processos_backup AS SELECT * FROM processos;

-- Recriar tabelas
DROP TABLE processos;
DROP TABLE usuarios;

-- As tabelas serão recriadas automaticamente pelo Sequelize na próxima inicialização
```

---

## ▶️ DEPOIS DE LIMPAR OS ÍNDICES

### Passo 4: Iniciar o Servidor

```bash
# Certifique-se de que NODE_ENV está configurado
set NODE_ENV=development  # Windows
# ou
export NODE_ENV=development  # Linux/Mac

node server.js
```

### Passo 5: Verificar que Funcionou

```sql
-- Verificar quantos índices cada tabela tem (deve ser poucos)
SELECT
    TABLE_NAME,
    COUNT(DISTINCT INDEX_NAME) as total_indices
FROM
    INFORMATION_SCHEMA.STATISTICS
WHERE
    TABLE_SCHEMA = 'distribuidor_proc'
    AND TABLE_NAME IN ('usuarios', 'processos')
GROUP BY
    TABLE_NAME;

-- Resultado esperado:
-- usuarios: 2 índices (PRIMARY + idx_usuarios_matricula)
-- processos: 3 ou 4 índices (PRIMARY + FK + idx_processos_numero_processo)
```

---

## 🔒 PREVENIR O PROBLEMA NO FUTURO

### 1. **NUNCA** use `alter: true` em produção

No arquivo `server.js`, a configuração já está correta:

```javascript
const syncOptions = process.env.NODE_ENV === 'production'
  ? { } // Em produção, apenas valida as models
  : { alter: true }; // Em desenvolvimento, permite alterações
```

Certifique-se de que `NODE_ENV=production` em produção.

### 2. Use Migrations do Sequelize

Para mudanças no banco de dados, use migrations em vez de `alter: true`:

```bash
npm install --save-dev sequelize-cli

# Inicializar
npx sequelize-cli init

# Criar migration
npx sequelize-cli migration:generate --name add-unique-indexes

# Executar migrations
npx sequelize-cli db:migrate
```

### 3. Remova `unique: true` dos Models (já feito)

Os models `user.js` e `process.js` já foram atualizados para NÃO criar índices automaticamente. Os índices devem ser criados manualmente via SQL.

---

## 📞 Precisa de Ajuda?

Se os comandos acima não funcionarem, forneça:

1. Resultado de `SHOW INDEX FROM usuarios;`
2. Resultado de `SHOW INDEX FROM processos;`
3. Mensagem de erro completa

---

## ✅ RESUMO RÁPIDO

```sql
-- 1. Conectar ao banco
mysql -h sao.domcloud.co -u distribuidor -p

-- 2. Selecionar banco
USE distribuidor_proc;

-- 3. Ver índices
SHOW INDEX FROM usuarios;

-- 4. Remover índices duplicados (substitua 'nome_do_indice' pelos reais)
ALTER TABLE usuarios DROP INDEX usuarios_matricula;
ALTER TABLE usuarios DROP INDEX usuarios_matricula_2;
-- ... repetir para todos os índices exceto PRIMARY

-- 5. Criar apenas UM índice UNIQUE
ALTER TABLE usuarios ADD UNIQUE INDEX idx_usuarios_matricula (matricula);

-- 6. Repetir para processos
SHOW INDEX FROM processos;
ALTER TABLE processos DROP INDEX processos_numero_processo;
-- ... etc
ALTER TABLE processos ADD UNIQUE INDEX idx_processos_numero_processo (numero_processo);

-- 7. Verificar
SELECT TABLE_NAME, COUNT(DISTINCT INDEX_NAME) as total
FROM INFORMATION_SCHEMA.STATISTICS
WHERE TABLE_SCHEMA = 'distribuidor_proc'
GROUP BY TABLE_NAME;

-- 8. Iniciar servidor
-- node server.js
```

---

**Data:** 2025-11-09
**Status:** Correção disponível
**Prioridade:** ALTA
