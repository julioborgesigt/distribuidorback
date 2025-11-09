-- Script para limpar índices duplicados no MySQL
-- Execute este script ANTES de iniciar o servidor

-- 1. Ver todos os índices da tabela usuarios
SHOW INDEX FROM usuarios;

-- 2. Remover índices duplicados (mantenha apenas PRIMARY e um UNIQUE para matricula)
-- Substitua 'nome_do_indice' pelos nomes reais que aparecerem no SHOW INDEX

-- Exemplo de como remover índices:
-- ALTER TABLE usuarios DROP INDEX usuarios_matricula;
-- ALTER TABLE usuarios DROP INDEX usuarios_matricula_2;
-- ALTER TABLE usuarios DROP INDEX usuarios_matricula_3;
-- etc...

-- 3. Garantir que existe apenas UM índice UNIQUE para matricula
-- Primeiro, verificar se já existe:
SHOW INDEX FROM usuarios WHERE Column_name = 'matricula';

-- Se NÃO existir nenhum índice UNIQUE para matricula, criar um:
-- ALTER TABLE usuarios ADD UNIQUE INDEX idx_matricula_unique (matricula);

-- Se JÁ existir UM índice UNIQUE, não fazer nada

-- 4. Fazer o mesmo para a tabela processos
SHOW INDEX FROM processos;

-- Remover índices duplicados de numero_processo
-- ALTER TABLE processos DROP INDEX processos_numero_processo;
-- ALTER TABLE processos DROP INDEX processos_numero_processo_2;
-- etc...

-- Garantir índice UNIQUE:
SHOW INDEX FROM processos WHERE Column_name = 'numero_processo';
-- ALTER TABLE processos ADD UNIQUE INDEX idx_numero_processo_unique (numero_processo);

-- 5. Verificar resultado final (deve ter poucos índices)
SELECT
    TABLE_NAME,
    COUNT(*) as total_indices
FROM
    INFORMATION_SCHEMA.STATISTICS
WHERE
    TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME IN ('usuarios', 'processos')
GROUP BY
    TABLE_NAME;
