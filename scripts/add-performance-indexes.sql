-- Script para adicionar índices de performance
-- Melhora consultas em campos frequentemente usados em WHERE e ORDER BY
-- Execute este script manualmente no MySQL Workbench ou via CLI

USE distribuidor_proc;

-- ============================================================
-- ÍNDICES NA TABELA processos
-- ============================================================

-- Índice para campo 'cumprido' (usado em quase todas as queries)
CREATE INDEX IF NOT EXISTS idx_cumprido ON processos(cumprido);

-- Índice para campo 'data_intimacao' (usado em filtros de prazo)
CREATE INDEX IF NOT EXISTS idx_data_intimacao ON processos(data_intimacao);

-- Índice para campo 'cumpridoDate' (usado em filtros de dashboard)
CREATE INDEX IF NOT EXISTS idx_cumprido_date ON processos(cumpridoDate);

-- Índice composto para userId + cumprido (otimiza queries por usuário)
CREATE INDEX IF NOT EXISTS idx_user_cumprido ON processos(userId, cumprido);

-- Índice para classe_principal (usado em filtros)
CREATE INDEX IF NOT EXISTS idx_classe_principal ON processos(classe_principal);

-- Índice para assunto_principal (usado em filtros)
CREATE INDEX IF NOT EXISTS idx_assunto_principal ON processos(assunto_principal);

-- ============================================================
-- ÍNDICES NA TABELA usuarios (se necessário)
-- ============================================================

-- Índice para nome (usado em ORDER BY)
CREATE INDEX IF NOT EXISTS idx_nome ON usuarios(nome);

-- ============================================================
-- VERIFICAÇÃO DOS ÍNDICES CRIADOS
-- ============================================================

SHOW INDEX FROM processos;
SHOW INDEX FROM usuarios;

-- ============================================================
-- ESTATÍSTICAS
-- ============================================================

SELECT
    'Índices criados com sucesso!' as Status,
    COUNT(*) as Total_Indices
FROM information_schema.statistics
WHERE table_schema = 'distribuidor_proc'
  AND table_name IN ('processos', 'usuarios');
