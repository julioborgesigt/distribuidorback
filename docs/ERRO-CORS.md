# 🚨 ERRO DE CORS EM PRODUÇÃO

## Problema

Erro retornado:
```json
{"error":"Origem não permitida pelo CORS","status":500}
```

---

## ✅ SOLUÇÃO RÁPIDA

### Passo 1: Identificar a URL do Frontend

A URL do seu frontend em produção é:
- **Render:** `https://distribuidorvue.onrender.com`
- **Outro servidor:** Anote a URL completa (ex: `https://seuapp.com`)

### Passo 2: Configurar Variável de Ambiente

**No painel do Render (ou seu servidor):**

1. Vá em **Environment** ou **Variáveis de Ambiente**
2. Adicione ou edite:

```
FRONTEND_URL=https://distribuidorvue.onrender.com
```

**⚠️ IMPORTANTE:** Use a URL EXATA do frontend (sem barra no final)

### Passo 3: Reiniciar o Servidor

Depois de adicionar a variável de ambiente, reinicie o deploy do backend.

---

## 🔍 VERIFICAR QUAL URL ESTÁ SENDO BLOQUEADA

### Opção 1: Ver nos Logs do Servidor

No painel do Render, veja os logs e procure por:

```
CORS - Origem bloqueada: { origin: 'https://...', allowedOrigins: [...] }
```

A origem bloqueada será mostrada ali.

### Opção 2: Ver no Console do Navegador

No frontend, abra o **Console** (F12) e você verá:

```
Access to fetch at 'https://seubackend.com/api/...' from origin 'https://seufrontend.com'
has been blocked by CORS policy
```

A URL depois de `origin` é a que você precisa adicionar.

---

## 🔧 MÚLTIPLAS URLs (Desenvolvimento + Produção)

Se você tem múltiplos ambientes (desenvolvimento, staging, produção), configure:

```env
FRONTEND_URL=https://distribuidorvue.onrender.com
FRONTEND_URL_2=https://staging.distribuidorvue.com
FRONTEND_URL_3=http://localhost:8080
```

Todas essas URLs serão permitidas automaticamente.

---

## 📋 CONFIGURAÇÃO COMPLETA NO RENDER

**Backend (no Render):**

```
# Obrigatórias
DB_HOST=sao.domcloud.co
DB_USER=distribuidor
DB_PASS=SUA_SENHA_AQUI
DB_NAME=distribuidor_proc
JWT_SECRET=SEU_JWT_SECRET_AQUI
NODE_ENV=production
PORT=3000

# URLs permitidas (CORS)
FRONTEND_URL=https://distribuidorvue.onrender.com
FRONTEND_URL_2=http://localhost:8080
```

**Frontend (no Render):**

Certifique-se de que está usando a URL correta do backend:

```javascript
// Exemplo em Vue/Axios
const API_URL = 'https://seu-backend.onrender.com/api'
```

---

## 🐛 TROUBLESHOOTING

### Erro Persiste Depois de Configurar

1. **Verifique se reiniciou o deploy** depois de adicionar a variável
2. **Verifique se a URL está EXATA** (sem http:// se você colocou https://)
3. **Verifique no log do servidor** a mensagem de inicialização:

```
Origens CORS permitidas: { origins: ['https://...', 'http://...'] }
```

### Como Ver os Logs em Tempo Real

**No Render:**
- Vá na aba **Logs**
- Procure por `CORS - Requisição de origem`
- Você verá qual origem está sendo bloqueada

### Erro 403 em vez de 500

Se você está recebendo 403, é porque a origem está sendo bloqueada corretamente. Configure a variável de ambiente.

### Funciona Localmente mas Não em Produção

**Causa:** Localmente você provavelmente tem `NODE_ENV=development`, que é mais permissivo.

**Solução:** Configure as variáveis de ambiente no servidor de produção.

---

## 🔒 SEGURANÇA

### ❌ NÃO FAÇA ISSO:

```javascript
// NUNCA use * em produção
app.use(cors({ origin: '*' }))
```

### ✅ FAÇA ISSO:

Configure apenas as origens que você realmente usa:

```env
FRONTEND_URL=https://distribuidorvue.onrender.com
```

---

## 📞 AINDA COM PROBLEMAS?

Forneça estas informações:

1. **URL do frontend** (onde o erro aparece)
2. **URL do backend** (onde você está fazendo a requisição)
3. **Logs do servidor** (a parte de CORS)
4. **Erro no console do navegador** (F12)

---

## ✅ CHECKLIST

- [ ] Configurei `FRONTEND_URL` no painel do Render
- [ ] Reiniciei o deploy do backend
- [ ] Verifiquei os logs e vi "Origens CORS permitidas"
- [ ] Testei novamente do frontend
- [ ] Funcionou! 🎉

---

**Data:** 2025-11-09
**Status:** Solução disponível
**Prioridade:** ALTA
