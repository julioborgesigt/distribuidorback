# 🔒 Guia de Segurança - Sistema de Gerenciamento de Processos

## 📋 Índice
1. [Correções Implementadas](#correções-implementadas)
2. [Configuração Segura](#configuração-segura)
3. [Deploy em Produção](#deploy-em-produção)
4. [Manutenção e Monitoramento](#manutenção-e-monitoramento)

---

## ✅ Correções Implementadas

### 1. Proteção de Credenciais
- ✅ Arquivo `.gitignore` criado
- ✅ `.env.example` criado como template
- ✅ Validação de variáveis de ambiente obrigatórias

**Ação necessária:** Rotacionar todas as credenciais (ver SECURITY_ALERT.md)

### 2. Headers de Segurança (Helmet)
```javascript
// Configurado em server.js
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- Strict-Transport-Security
- Content-Security-Policy
```

### 3. Rate Limiting
```javascript
// Login
- 5 tentativas a cada 15 minutos por IP
- Headers informativos sobre limites

// Primeiro Login
- 3 tentativas a cada 15 minutos por IP
```

### 4. Validação de Inputs (express-validator)
Todos os endpoints críticos validam:
- Tipos de dados
- Comprimento de strings
- Formatos (regex)
- Sanitização automática

### 5. Upload Seguro
```javascript
// Configurações
- Tamanho máximo: 5MB
- Tipos permitidos: CSV apenas
- Validação de MIME type e extensão
```

### 6. CORS Configurado
```javascript
// Apenas origens autorizadas
- Frontend: https://distribuidorvue.onrender.com
- Configurável via FRONTEND_URL no .env
```

### 7. Proteção do Banco de Dados
```javascript
// Sequelize
- alter: true REMOVIDO em produção
- Índices únicos em campos críticos
- Validações no nível do modelo
```

### 8. Performance e Segurança
```javascript
// Bcrypt
- Operações assíncronas (não bloqueia event loop)
- 10 rounds de salt (padrão seguro)
```

---

## 🔧 Configuração Segura

### Passo 1: Configurar Variáveis de Ambiente

```bash
# Copie o template
cp .env.example .env

# Gere um JWT_SECRET forte
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Edite o .env com suas credenciais
nano .env
```

### Passo 2: Variáveis Obrigatórias

```bash
# .env
DB_HOST=seu_host
DB_USER=seu_usuario
DB_PASS=sua_senha_forte
DB_NAME=seu_banco
JWT_SECRET=seu_jwt_secret_64_caracteres
PORT=3000
NODE_ENV=production
FRONTEND_URL=https://seu-frontend.com
```

### Passo 3: Verificar Configuração

```bash
# Verificar sintaxe
npm run check

# Testar conexão com banco
npm run dev
# Acesse: http://localhost:3000/health
```

---

## 🚀 Deploy em Produção

### Checklist Pré-Deploy

- [ ] Todas as credenciais rotacionadas
- [ ] `.env` configurado corretamente
- [ ] NODE_ENV=production definido
- [ ] FRONTEND_URL configurado
- [ ] Banco de dados acessível
- [ ] Porta configurada corretamente

### Deploy no Render/Heroku

```bash
# 1. Configure as variáveis de ambiente no painel
DB_HOST=...
DB_USER=...
DB_PASS=...
DB_NAME=...
JWT_SECRET=...
NODE_ENV=production
FRONTEND_URL=https://seu-frontend.com

# 2. O build será feito automaticamente
# 3. O comando start será: NODE_ENV=production node server.js
```

### Verificação Pós-Deploy

```bash
# Teste o healthcheck
curl https://seu-backend.com/health

# Resposta esperada:
{
  "status": "ok",
  "database": "connected",
  "timestamp": "2025-11-09T..."
}
```

---

## 🔍 Manutenção e Monitoramento

### Logs de Segurança

**Atualmente:** Console.log básico
**Recomendado:** Implementar Winston ou Pino

```javascript
// Exemplo com Winston (futuro)
const winston = require('winston');
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});
```

### Monitoramento de Endpoints

```bash
# Healthcheck
GET /health

# Retorna:
- Status do servidor
- Status do banco de dados
- Timestamp
```

### Atualizações de Segurança

```bash
# Verificar vulnerabilidades
npm audit

# Corrigir automaticamente (se possível)
npm audit fix

# Atualizar dependências
npm update
```

### Rate Limiting - Monitoramento

Headers retornados:
```
RateLimit-Limit: 5
RateLimit-Remaining: 4
RateLimit-Reset: 1699564800
```

---

## 🛡️ Melhores Práticas

### 1. Senhas
- Mínimo 8 caracteres
- Pelo menos 1 maiúscula, 1 minúscula, 1 número
- Validação no cliente e servidor

### 2. JWT Tokens
- Expiração: 2 horas
- Renovar antes do vencimento
- Armazenar apenas no frontend (localStorage ou httpOnly cookies)

### 3. Upload de Arquivos
- Sempre validar no servidor
- Limitar tamanho
- Validar tipo e extensão
- Escanear vírus (futuro)

### 4. Banco de Dados
- Usar sempre Sequelize (proteção contra SQL Injection)
- Evitar `literal()` com inputs do usuário
- Sanitizar todos os inputs

### 5. CORS
- Nunca usar `origin: '*'` em produção
- Listar explicitamente origens permitidas
- Usar credentials apenas quando necessário

---

## 📊 Métricas de Segurança

### Vulnerabilidades Corrigidas
| Severidade | Quantidade | Status |
|------------|------------|--------|
| Crítica    | 5          | ✅ Corrigido |
| Alta       | 4          | ✅ Corrigido |
| Média      | 6          | ✅ Corrigido |
| Baixa      | 5          | ⚠️ Em andamento |

### Tempo de Resposta
- Login: ~200-300ms
- Upload CSV: Depende do tamanho
- Listagem: ~50-100ms (paginado)

---

## 🆘 Troubleshooting

### Problema: "Origem não permitida pelo CORS"
**Solução:** Adicione a origem no array `allowedOrigins` em `server.js` ou configure `FRONTEND_URL` no `.env`

### Problema: "Muitas tentativas de login"
**Solução:** Aguarde 15 minutos ou ajuste o rate limit em `routes/auth.js`

### Problema: "Token inválido ou expirado"
**Solução:** Faça login novamente. Tokens expiram após 2 horas.

### Problema: "Variável de ambiente não definida"
**Solução:** Verifique se todas as variáveis em `.env.example` estão definidas no seu `.env`

### Problema: "Erro ao conectar ao banco de dados"
**Solução:**
1. Verifique credenciais no `.env`
2. Verifique se o host permite conexões externas
3. Verifique firewall e porta (3306)

---

## 📞 Suporte e Recursos

### Documentação Oficial
- [Express Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Node.js Security Checklist](https://github.com/goldbergyoni/nodebestpractices#6-security-best-practices)

### Ferramentas Úteis
- [npm audit](https://docs.npmjs.com/cli/v8/commands/npm-audit)
- [Snyk](https://snyk.io/) - Escaneamento de vulnerabilidades
- [Helmet](https://helmetjs.github.io/) - Headers de segurança
- [OWASP ZAP](https://www.zaproxy.org/) - Teste de segurança

---

**Última Atualização:** 2025-11-09
**Versão:** 2.0.0 (Securizado)
